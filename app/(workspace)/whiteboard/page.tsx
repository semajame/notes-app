"use client"

import {
  ArrowRight,
  Circle,
  Diamond,
  Download,
  Eraser,
  Hand,
  Highlighter,
  ImageDown,
  Loader2,
  Minus,
  MousePointer2,
  Plus,
  Pencil,
  Redo2,
  RotateCcw,
  Save,
  Square,
  StickyNote,
  Trash2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import {
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createClient } from "@/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

type Tool =
  | "select"
  | "hand"
  | "draw"
  | "eraser"
  | "rect"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "text"
  | "sticky"

type Point = { x: number; y: number }
type Bounds = { x: number; y: number; width: number; height: number }

type BoardElement = {
  id: string
  type: Exclude<Tool, "select" | "hand" | "eraser">
  x: number
  y: number
  width: number
  height: number
  points?: Point[]
  text?: string
  stroke: string
  fill: string
  strokeWidth: number
  seed: number
}

type SavedWhiteboard = {
  id: string
  title: string
  updated_at: string
  data?: {
    elements?: BoardElement[]
    appState?: {
      zoom?: number
      pan?: Point
      selectedId?: string | null
      stroke?: string
      fill?: string
      strokeWidth?: number
    }
  }
}

type Draft = BoardElement | null
type DragState =
  | { mode: "pan"; start: Point; origin: Point }
  | {
      mode: "move"
      id: string
      start: Point
      origin: Point
      before: BoardElement[]
    }
  | { mode: "draw"; start: Point }
  | { mode: "freehand"; id: string }
  | null

type ConfirmDialogState = {
  open: boolean
  title: string
  description: string
  actionLabel: string
  actionVariant: "default" | "destructive"
}

type TextDialogState = {
  open: boolean
  type: "text" | "sticky"
  point: Point
  value: string
}

const STORAGE_KEY = "next-app.excalidraw-like-whiteboard"
const BOARD_ID_KEY = "next-app.excalidraw-like-whiteboard-id"
const BOARD_TITLE_KEY = "next-app.excalidraw-like-whiteboard-title"

const TOOLS: {
  id: Tool
  label: string
  icon: React.ElementType
  shortcut: string
}[] = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "1" },
  { id: "hand", label: "Hand", icon: Hand, shortcut: "2" },
  { id: "draw", label: "Draw", icon: Pencil, shortcut: "3" },
  { id: "rect", label: "Rectangle", icon: Square, shortcut: "4" },
  { id: "diamond", label: "Diamond", icon: Diamond, shortcut: "5" },
  { id: "ellipse", label: "Ellipse", icon: Circle, shortcut: "6" },
  { id: "arrow", label: "Arrow", icon: ArrowRight, shortcut: "7" },
  { id: "line", label: "Line", icon: Minus, shortcut: "8" },
  { id: "text", label: "Text", icon: Type, shortcut: "9" },
  { id: "sticky", label: "Sticky note", icon: StickyNote, shortcut: "0" },
  { id: "eraser", label: "Eraser", icon: Eraser, shortcut: "E" },
]

const COLORS = [
  "#1e1e1e",
  "#1971c2",
  "#2f9e44",
  "#f08c00",
  "#e03131",
  "#9c36b5",
]
const FILLS = [
  "transparent",
  "#fff9db",
  "#d0ebff",
  "#d3f9d8",
  "#ffe3e3",
  "#f3d9fa",
]

const makeId = () => Math.random().toString(36).slice(2, 10)
const makeSeed = () => Math.floor(Math.random() * 100000)
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

function normalizeBounds(start: Point, end: Point): Bounds {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
}

function elementBounds(element: BoardElement): Bounds {
  if (element.type !== "draw" || !element.points?.length) return element

  const xs = element.points.map((point) => element.x + point.x)
  const ys = element.points.map((point) => element.y + point.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

function isPointInElement(point: Point, element: BoardElement) {
  const bounds = elementBounds(element)
  const padding = Math.max(10, element.strokeWidth * 2)

  if (element.type === "draw" && element.points) {
    return element.points.some((pathPoint) => {
      const absolute = {
        x: element.x + pathPoint.x,
        y: element.y + pathPoint.y,
      }
      return distance(point, absolute) <= padding
    })
  }

  return (
    point.x >= bounds.x - padding &&
    point.x <= bounds.x + bounds.width + padding &&
    point.y >= bounds.y - padding &&
    point.y <= bounds.y + bounds.height + padding
  )
}

function pathFromPoints(points: Point[] = []) {
  if (!points.length) return ""
  return points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L"
    return `${path} ${command}${point.x.toFixed(1)} ${point.y.toFixed(1)}`
  }, "")
}

function jitter(seed: number, index: number, amount = 2) {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  return (x - Math.floor(x) - 0.5) * amount
}

function roughRectPath(element: BoardElement, pass = 0) {
  const { width, height, seed } = element
  const points = [
    [jitter(seed, pass + 1), jitter(seed, pass + 2)],
    [width + jitter(seed, pass + 3), jitter(seed, pass + 4)],
    [width + jitter(seed, pass + 5), height + jitter(seed, pass + 6)],
    [jitter(seed, pass + 7), height + jitter(seed, pass + 8)],
  ]
  return `M${points[0][0]} ${points[0][1]} L${points[1][0]} ${points[1][1]} L${points[2][0]} ${points[2][1]} L${points[3][0]} ${points[3][1]} Z`
}

function arrowHead(x1: number, y1: number, x2: number, y2: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const size = 16
  const a = {
    x: x2 - size * Math.cos(angle - Math.PI / 6),
    y: y2 - size * Math.sin(angle - Math.PI / 6),
  }
  const b = {
    x: x2 - size * Math.cos(angle + Math.PI / 6),
    y: y2 - size * Math.sin(angle + Math.PI / 6),
  }
  return `M ${a.x} ${a.y} L ${x2} ${y2} L ${b.x} ${b.y}`
}

function ToolButton({
  icon: Icon,
  label,
  shortcut,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  shortcut?: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={[
        "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition",
        active
          ? "border-[#6965db] bg-[#e9e8ff] text-[#3430a3]"
          : "border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
      ].join(" ")}
    >
      <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
      <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] whitespace-nowrap text-neutral-700 opacity-0 shadow-sm transition group-hover:opacity-100">
        {shortcut ? `${label} ${shortcut}` : label}
      </span>
    </button>
  )
}

function renderElement(element: BoardElement, selected: boolean) {
  const common = {
    stroke: element.stroke,
    strokeWidth: element.strokeWidth,
    fill: element.fill,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  return (
    <g key={element.id} transform={`translate(${element.x} ${element.y})`}>
      {element.type === "rect" && (
        <>
          <path d={roughRectPath(element, 0)} {...common} />
          <path
            d={roughRectPath(element, 20)}
            {...common}
            fill="transparent"
            opacity={0.45}
          />
        </>
      )}
      {element.type === "diamond" && (
        <polygon
          points={`${element.width / 2},0 ${element.width},${element.height / 2} ${element.width / 2},${element.height} 0,${element.height / 2}`}
          {...common}
        />
      )}
      {element.type === "ellipse" && (
        <ellipse
          cx={element.width / 2}
          cy={element.height / 2}
          rx={Math.max(1, element.width / 2)}
          ry={Math.max(1, element.height / 2)}
          {...common}
        />
      )}
      {(element.type === "line" || element.type === "arrow") && (
        <>
          <path
            d={`M 0 0 C ${element.width * 0.35} ${jitter(element.seed, 4, 10)}, ${element.width * 0.65} ${element.height + jitter(element.seed, 5, 10)}, ${element.width} ${element.height}`}
            {...common}
            fill="transparent"
          />
          {element.type === "arrow" && (
            <path
              d={arrowHead(0, 0, element.width, element.height)}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </>
      )}
      {element.type === "draw" && (
        <path
          d={pathFromPoints(element.points)}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {element.type === "text" && (
        <foreignObject
          width={Math.max(140, element.width)}
          height={Math.max(48, element.height)}
        >
          <div className="flex h-full items-center text-[24px] leading-tight font-medium whitespace-pre-wrap text-neutral-900">
            {element.text}
          </div>
        </foreignObject>
      )}
      {element.type === "sticky" && (
        <foreignObject
          width={Math.max(170, element.width)}
          height={Math.max(140, element.height)}
        >
          <div
            className="h-full rounded-[3px] border-2 p-4 text-[18px] leading-snug font-medium whitespace-pre-wrap text-neutral-900 shadow-[0_10px_24px_rgb(0_0_0_/_0.10)]"
            style={{
              borderColor: element.stroke,
              backgroundColor: element.fill,
            }}
          >
            {element.text}
          </div>
        </foreignObject>
      )}
      {selected && (
        <rect
          x={-8}
          y={-8}
          width={Math.max(1, elementBounds(element).width) + 16}
          height={Math.max(1, elementBounds(element).height) + 16}
          fill="transparent"
          stroke="#6965db"
          strokeDasharray="6 5"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  )
}

export default function Whiteboard() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<BoardElement[]>(() => {
    if (typeof window === "undefined") return []

    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []

    try {
      return JSON.parse(saved) as BoardElement[]
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  })
  const [boardId, setBoardId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(BOARD_ID_KEY)
  })
  const [boardTitle, setBoardTitle] = useState(() => {
    if (typeof window === "undefined") return "Untitled whiteboard"
    return localStorage.getItem(BOARD_TITLE_KEY) || "Untitled whiteboard"
  })
  const [tool, setTool] = useState<Tool>("select")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stroke, setStroke] = useState(COLORS[0])
  const [fill, setFill] = useState(FILLS[0])
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [draft, setDraft] = useState<Draft>(null)
  const [, setPast] = useState<BoardElement[][]>([])
  const [, setFuture] = useState<BoardElement[][]>([])
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle")
  const [saveMessage, setSaveMessage] = useState("Not saved")
  const [whiteboards, setWhiteboards] = useState<SavedWhiteboard[]>([])
  const [boardsState, setBoardsState] = useState<"idle" | "loading" | "error">(
    "idle"
  )
  const [boardsMessage, setBoardsMessage] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: "",
    description: "",
    actionLabel: "Continue",
    actionVariant: "default",
  })
  const [textDialog, setTextDialog] = useState<TextDialogState>({
    open: false,
    type: "text",
    point: { x: 0, y: 0 },
    value: "",
  })
  const dragRef = useRef<DragState>(null)
  const elementsRef = useRef<BoardElement[]>([])
  const confirmActionRef = useRef<(() => void | Promise<void>) | null>(null)

  useEffect(() => {
    elementsRef.current = elements
  }, [elements])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements))
  }, [elements])

  useEffect(() => {
    localStorage.setItem(BOARD_TITLE_KEY, boardTitle)
  }, [boardTitle])

  const commit = useCallback(
    (next: BoardElement[] | ((current: BoardElement[]) => BoardElement[])) => {
      setElements((current) => {
        const resolved = typeof next === "function" ? next(current) : next
        setPast((history) => [...history.slice(-59), current])
        setFuture([])
        setSaveState("idle")
        setSaveMessage(resolved.length ? "Unsaved changes" : "Ready")
        return resolved
      })
    },
    []
  )

  const loadWhiteboards = useCallback(async () => {
    setBoardsState("loading")
    setBoardsMessage("")

    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setBoardsState("error")
      setBoardsMessage("Sign in to view saved boards")
      return
    }

    const { data, error } = await supabase
      .from("whiteboards")
      .select("id,title,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      setBoardsState("error")
      setBoardsMessage(error.message)
      return
    }

    setWhiteboards(data ?? [])
    setBoardsState("idle")
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadWhiteboards()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [loadWhiteboards])

  const screenToWorld = useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      }
    },
    [pan, zoom]
  )

  const selected = useMemo(
    () => elements.find((element) => element.id === selectedId) ?? null,
    [elements, selectedId]
  )

  const hitTest = useCallback((point: Point) => {
    return (
      [...elementsRef.current]
        .reverse()
        .find((element) => isPointInElement(point, element)) ?? null
    )
  }, [])

  const createElement = useCallback(
    (type: BoardElement["type"], start: Point, end: Point): BoardElement => {
      const bounds = normalizeBounds(start, end)
      const width =
        type === "line" || type === "arrow"
          ? end.x - start.x
          : Math.max(1, bounds.width)
      const height =
        type === "line" || type === "arrow"
          ? end.y - start.y
          : Math.max(1, bounds.height)

      return {
        id: makeId(),
        type,
        x: type === "line" || type === "arrow" ? start.x : bounds.x,
        y: type === "line" || type === "arrow" ? start.y : bounds.y,
        width,
        height,
        stroke,
        fill:
          type === "text" ||
          type === "draw" ||
          type === "line" ||
          type === "arrow"
            ? "transparent"
            : fill,
        strokeWidth,
        seed: makeSeed(),
      }
    },
    [fill, stroke, strokeWidth]
  )

  const createTextElement = useCallback(
    (type: "text" | "sticky", point: Point, value: string) => {
      const element: BoardElement = {
        id: makeId(),
        type,
        x: point.x,
        y: point.y,
        width: type === "sticky" ? 210 : Math.max(160, value.length * 12),
        height: type === "sticky" ? 150 : 56,
        text: value.trim(),
        stroke,
        fill:
          type === "sticky"
            ? fill === "transparent"
              ? "#fff9db"
              : fill
            : "transparent",
        strokeWidth: 2,
        seed: makeSeed(),
      }
      commit((current) => [...current, element])
      setSelectedId(element.id)
      setTool("select")
    },
    [commit, fill, stroke]
  )

  const openTextDialog = (type: "text" | "sticky", point: Point) => {
    setTextDialog({
      open: true,
      type,
      point,
      value: "",
    })
  }

  const closeTextDialog = () => {
    setTextDialog((current) => ({ ...current, open: false, value: "" }))
  }

  const confirmTextDialog = () => {
    const value = textDialog.value.trim()
    if (value) createTextElement(textDialog.type, textDialog.point, value)
    closeTextDialog()
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const point = screenToWorld(event.clientX, event.clientY)
    event.currentTarget.setPointerCapture(event.pointerId)

    if (event.button === 1 || event.altKey || tool === "hand") {
      dragRef.current = {
        mode: "pan",
        start: { x: event.clientX, y: event.clientY },
        origin: pan,
      }
      return
    }

    if (tool === "text" || tool === "sticky") {
      openTextDialog(tool, point)
      return
    }

    if (tool === "select") {
      const hit = hitTest(point)
      setSelectedId(hit?.id ?? null)
      if (hit) {
        dragRef.current = {
          mode: "move",
          id: hit.id,
          start: point,
          origin: { x: hit.x, y: hit.y },
          before: elementsRef.current,
        }
      }
      return
    }

    if (tool === "eraser") {
      const hit = hitTest(point)
      if (hit)
        commit((current) => current.filter((element) => element.id !== hit.id))
      return
    }

    if (tool === "draw") {
      const element: BoardElement = {
        id: makeId(),
        type: "draw",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        points: [{ x: 0, y: 0 }],
        stroke,
        fill: "transparent",
        strokeWidth,
        seed: makeSeed(),
      }
      setDraft(element)
      dragRef.current = { mode: "freehand", id: element.id }
      return
    }

    dragRef.current = { mode: "draw", start: point }
    setDraft(createElement(tool, point, point))
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return

    if (drag.mode === "pan") {
      setPan({
        x: drag.origin.x + event.clientX - drag.start.x,
        y: drag.origin.y + event.clientY - drag.start.y,
      })
      return
    }

    const point = screenToWorld(event.clientX, event.clientY)

    if (drag.mode === "move") {
      const dx = point.x - drag.start.x
      const dy = point.y - drag.start.y
      setElements((current) =>
        current.map((element) =>
          element.id === drag.id
            ? { ...element, x: drag.origin.x + dx, y: drag.origin.y + dy }
            : element
        )
      )
      return
    }

    if (drag.mode === "freehand") {
      setDraft((current) => {
        if (!current || current.type !== "draw") return current
        const points = [
          ...(current.points ?? []),
          { x: point.x - current.x, y: point.y - current.y },
        ]
        const bounds = elementBounds({ ...current, points })
        return {
          ...current,
          points,
          width: bounds.width,
          height: bounds.height,
        }
      })
      return
    }

    if (
      drag.mode === "draw" &&
      tool !== "select" &&
      tool !== "hand" &&
      tool !== "eraser" &&
      tool !== "draw"
    ) {
      setDraft(createElement(tool, drag.start, point))
    }
  }

  const onPointerUp = () => {
    const drag = dragRef.current

    if (drag?.mode === "move") {
      setPast((history) => [...history.slice(-59), drag.before])
      setFuture([])
      setSaveState("idle")
      setSaveMessage("Unsaved changes")
    }

    if ((drag?.mode === "draw" || drag?.mode === "freehand") && draft) {
      if (
        Math.abs(draft.width) > 3 ||
        Math.abs(draft.height) > 3 ||
        (draft.points?.length ?? 0) > 2
      ) {
        commit((current) => [...current, draft])
        setSelectedId(draft.id)
      }
    }

    setDraft(null)
    dragRef.current = null
  }

  const undo = useCallback(() => {
    setPast((history) => {
      if (!history.length) return history
      const previous = history[history.length - 1]
      setFuture((redoStack) => [elementsRef.current, ...redoStack])
      setElements(previous)
      setSelectedId(null)
      return history.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((redoStack) => {
      if (!redoStack.length) return redoStack
      const next = redoStack[0]
      setPast((history) => [...history, elementsRef.current])
      setElements(next)
      setSelectedId(null)
      return redoStack.slice(1)
    })
  }, [])

  const clearBoard = () => {
    if (!elements.length) return
    commit([])
    setSelectedId(null)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const saveBoard = async () => {
    setSaveState("saving")
    setSaveMessage("Saving...")

    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setSaveState("error")
      setSaveMessage("Sign in to save")
      return
    }

    const data = {
      version: 1,
      elements,
      appState: {
        zoom,
        pan,
        selectedId,
        stroke,
        fill,
        strokeWidth,
      },
      savedAt: new Date().toISOString(),
    }

    const title = boardTitle.trim() || "Untitled whiteboard"

    const query = boardId
      ? supabase
          .from("whiteboards")
          .update({ title, data })
          .eq("id", boardId)
          .eq("user_id", user.id)
          .select("id")
          .single()
      : supabase
          .from("whiteboards")
          .insert({ user_id: user.id, title, data })
          .select("id")
          .single()

    const { data: saved, error } = await query

    if (error) {
      setSaveState("error")
      setSaveMessage(error.message)
      return
    }

    setBoardId(saved.id)
    localStorage.setItem(BOARD_ID_KEY, saved.id)
    setSaveState("saved")
    setSaveMessage("Saved")
    setWhiteboards((current) => {
      const next = {
        id: saved.id,
        title,
        updated_at: new Date().toISOString(),
      }
      return [next, ...current.filter((item) => item.id !== saved.id)]
    })
  }

  const updateBoardTitle = (value: string) => {
    setBoardTitle(value)
    setSaveState("idle")
    setSaveMessage("Unsaved changes")
  }

  const requestConfirmation = ({
    title,
    description,
    actionLabel,
    actionVariant = "default",
    onConfirm,
  }: Omit<ConfirmDialogState, "open"> & {
    onConfirm: () => void | Promise<void>
  }) => {
    confirmActionRef.current = onConfirm
    setConfirmDialog({
      open: true,
      title,
      description,
      actionLabel,
      actionVariant,
    })
  }

  const closeConfirmation = () => {
    setConfirmDialog((current) => ({ ...current, open: false }))
    confirmActionRef.current = null
  }

  const confirmPendingAction = () => {
    const action = confirmActionRef.current
    setConfirmDialog((current) => ({ ...current, open: false }))
    confirmActionRef.current = null
    void action?.()
  }

  const openBoard = async (id: string, confirmed = false) => {
    if (saveMessage === "Unsaved changes" && !confirmed) {
      requestConfirmation({
        title: "Open another whiteboard?",
        description:
          "Your current whiteboard has unsaved changes. Opening another board will discard those changes.",
        actionLabel: "Open board",
        actionVariant: "default",
        onConfirm: () => openBoard(id, true),
      })
      return
    }

    setBoardsState("loading")
    setBoardsMessage("")

    const supabase = createClient()
    const { data, error } = await supabase
      .from("whiteboards")
      .select("id,title,updated_at,data")
      .eq("id", id)
      .single()

    if (error || !data) {
      setBoardsState("error")
      setBoardsMessage(error?.message ?? "Whiteboard not found")
      return
    }

    const board = data as SavedWhiteboard
    const appState = board.data?.appState

    setBoardId(board.id)
    setBoardTitle(board.title)
    localStorage.setItem(BOARD_ID_KEY, board.id)
    localStorage.setItem(BOARD_TITLE_KEY, board.title)
    setElements(board.data?.elements ?? [])
    setSelectedId(appState?.selectedId ?? null)
    setZoom(appState?.zoom ?? 1)
    setPan(appState?.pan ?? { x: 0, y: 0 })
    setStroke(appState?.stroke ?? COLORS[0])
    setFill(appState?.fill ?? FILLS[0])
    setStrokeWidth(appState?.strokeWidth ?? 2)
    setPast([])
    setFuture([])
    setSaveState("saved")
    setSaveMessage("Saved")
    setBoardsState("idle")
  }

  const newBoard = (confirmed = false) => {
    if (saveMessage === "Unsaved changes" && !confirmed) {
      requestConfirmation({
        title: "Create a new whiteboard?",
        description:
          "Your current whiteboard has unsaved changes. Creating a new board will discard those changes.",
        actionLabel: "Create new",
        actionVariant: "default",
        onConfirm: () => newBoard(true),
      })
      return
    }

    setBoardId(null)
    localStorage.removeItem(BOARD_ID_KEY)
    localStorage.removeItem(BOARD_TITLE_KEY)
    setBoardTitle("Untitled whiteboard")
    commit([])
    setSelectedId(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSaveState("idle")
    setSaveMessage("Ready")
  }

  const deleteBoard = async () => {
    if (!boardId) {
      newBoard()
      return
    }

    requestConfirmation({
      title: "Delete whiteboard?",
      description: `"${boardTitle.trim() || "Untitled whiteboard"}" will be permanently deleted. This cannot be undone.`,
      actionLabel: "Delete",
      actionVariant: "destructive",
      onConfirm: async () => {
        setSaveState("saving")
        setSaveMessage("Deleting...")

        const supabase = createClient()
        const { error } = await supabase
          .from("whiteboards")
          .delete()
          .eq("id", boardId)

        if (error) {
          setSaveState("error")
          setSaveMessage(error.message)
          return
        }

        setWhiteboards((current) =>
          current.filter((item) => item.id !== boardId)
        )
        setBoardId(null)
        localStorage.removeItem(BOARD_ID_KEY)
        localStorage.removeItem(BOARD_TITLE_KEY)
        setBoardTitle("Untitled whiteboard")
        setElements([])
        setSelectedId(null)
        setPast([])
        setFuture([])
        setZoom(1)
        setPan({ x: 0, y: 0 })
        setSaveState("idle")
        setSaveMessage("Deleted")
      },
    })
  }

  const exportSvg = () => {
    const board = wrapRef.current?.querySelector("svg")
    if (!board) return
    const svg = board.cloneNode(true) as SVGSVGElement
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "whiteboard.svg"
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault()
        redo()
        return
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        commit((current) =>
          current.filter((element) => element.id !== selectedId)
        )
        setSelectedId(null)
        return
      }

      const match = TOOLS.find(
        (item) => item.shortcut.toLowerCase() === event.key.toLowerCase()
      )
      if (match) setTool(match.id)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [commit, redo, selectedId, undo])

  const cursor =
    tool === "hand" ? "grab" : tool === "select" ? "default" : "crosshair"
  const gridSize = 32 * zoom

  return (
    <main className="relative flex h-full min-h-[640px] overflow-hidden bg-[#f8f7f2] text-neutral-950">
      <div
        id="whiteboard-board-area"
        className="relative min-w-0 flex-1 overflow-hidden"
      >
        <div
          ref={wrapRef}
          className="absolute inset-0 touch-none overflow-hidden"
          style={{
            cursor,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.13) 1px, transparent 0)",
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg className="absolute inset-0 h-full w-full">
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {elements.map((element) =>
                renderElement(element, element.id === selectedId)
              )}
              {draft && renderElement(draft, false)}
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute top-4 left-[calc(50%+9rem)] z-20 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-neutral-200 bg-white/95 p-1 shadow-[0_8px_24px_rgb(0_0_0_/_0.12)] backdrop-blur">
        {TOOLS.map((item) => (
          <ToolButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            shortcut={item.shortcut}
            active={tool === item.id}
            onClick={() => setTool(item.id)}
          />
        ))}
      </div>

      <aside
        id="whiteboard-sidebar"
        className="order-first flex h-full w-72 shrink-0 flex-col overflow-y-auto rounded-lg border-r border-neutral-200 bg-white p-4"
      >
        <div className="">
          <div className="text-md mb-3 flex items-center gap-2 font-semibold">
            <SidebarTrigger className="-ms-1" />
            Whiteboard
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">
            Name
          </span>
          <input
            value={boardTitle}
            onChange={(event) => updateBoardTitle(event.target.value)}
            onBlur={() => {
              if (!boardTitle.trim()) updateBoardTitle("Untitled whiteboard")
            }}
            className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-sm font-medium text-neutral-900 transition outline-none focus:border-[#6965db] focus:ring-2 focus:ring-[#e9e8ff]"
            placeholder="Untitled whiteboard"
          />
        </label>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={saveBoard}
            disabled={saveState === "saving"}
            className="mb-3 flex items-center justify-center rounded-md bg-[#6965db] px-3 text-sm font-semibold text-white transition hover:bg-[#5b57c8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {saveState === "saving" ? "Saving" : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => void deleteBoard()}
            className="mb-3 flex items-center justify-center rounded-md border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-medium text-neutral-500">Boards</div>
            <button
              type="button"
              onClick={() => newBoard()}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
              aria-label="New whiteboard"
              title="New whiteboard"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
            {boardsState === "loading" && (
              <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-2 text-xs text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading boards
              </div>
            )}

            {boardsState === "error" && (
              <div className="rounded-md border border-red-200 bg-red-50 px-2 py-2 text-xs text-red-700">
                {boardsMessage}
              </div>
            )}

            {boardsState !== "loading" &&
              boardsState !== "error" &&
              whiteboards.length === 0 && (
                <div className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-2 text-xs text-neutral-500">
                  No saved whiteboards
                </div>
              )}

            {whiteboards.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void openBoard(item.id)}
                className={[
                  "w-full rounded-md border px-2 py-2 text-left transition",
                  boardId === item.id
                    ? "border-[#6965db] bg-[#e9e8ff] text-[#3430a3]"
                    : "border-transparent text-neutral-700 hover:border-neutral-200 hover:bg-neutral-50",
                ].join(" ")}
              >
                <span className="block truncate text-xs font-semibold">
                  {item.title}
                </span>
                <span className="block truncate text-[10px] text-neutral-500">
                  {new Date(item.updated_at).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium text-neutral-500">
              Stroke
            </div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-label={`Stroke ${item}`}
                  onClick={() => setStroke(item)}
                  className={[
                    "h-7 w-7 rounded-md border-2 transition",
                    stroke === item
                      ? "border-[#6965db] ring-2 ring-[#e9e8ff]"
                      : "border-white",
                  ].join(" ")}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-neutral-500">
              Background
            </div>
            <div className="flex flex-wrap gap-2">
              {FILLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-label={`Fill ${item}`}
                  onClick={() => setFill(item)}
                  className={[
                    "h-7 w-7 rounded-md border transition",
                    fill === item
                      ? "border-[#6965db] ring-2 ring-[#e9e8ff]"
                      : "border-neutral-200",
                  ].join(" ")}
                  style={{
                    background:
                      item === "transparent"
                        ? "linear-gradient(135deg, transparent 45%, #ddd 45%, #ddd 55%, transparent 55%)"
                        : item,
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-neutral-500">
              Stroke width
            </div>
            <div className="flex items-center gap-2">
              {[2, 4, 6, 8].map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-label={`Stroke width ${size}`}
                  onClick={() => setStrokeWidth(size)}
                  className={[
                    "flex h-8 flex-1 items-center justify-center rounded-md border",
                    strokeWidth === size
                      ? "border-[#6965db] bg-[#e9e8ff]"
                      : "border-neutral-200 bg-white",
                  ].join(" ")}
                >
                  <span
                    className="rounded-full bg-neutral-900"
                    style={{ width: 18, height: size }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={[
            "mt-5 mb-4 w-full rounded-full border px-4 py-1.5 text-center text-xs",
            saveState === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : saveState === "saved"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-neutral-200 bg-neutral-50 text-neutral-500",
          ].join(" ")}
        >
          {saveMessage}
        </div>
      </aside>

      <div className="absolute right-4 bottom-2 z-20 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/95 p-1 shadow-[0_8px_24px_rgb(0_0_0_/_0.10)] backdrop-blur">
        <ToolButton
          icon={ZoomOut}
          label="Zoom out"
          onClick={() => setZoom((value) => clamp(value / 1.15, 0.2, 4))}
        />
        <button
          type="button"
          onClick={resetView}
          className="h-10 min-w-16 rounded-md px-2 text-sm font-medium text-neutral-600 tabular-nums hover:bg-neutral-100"
        >
          {Math.round(zoom * 100)}%
        </button>
        <ToolButton
          icon={ZoomIn}
          label="Zoom in"
          onClick={() => setZoom((value) => clamp(value * 1.15, 0.2, 4))}
        />
      </div>

      <div className="absolute bottom-2 left-[calc(18rem+1rem)] z-20 flex items-center gap-1 rounded-lg border border-neutral-200 bg-white/95 p-1 shadow-[0_8px_24px_rgb(0_0_0_/_0.10)] backdrop-blur">
        <ToolButton icon={Undo2} label="Undo" active={false} onClick={undo} />
        <ToolButton icon={Redo2} label="Redo" active={false} onClick={redo} />
        <ToolButton
          icon={RotateCcw}
          label="Reset view"
          active={false}
          onClick={resetView}
        />
        <ToolButton
          icon={Download}
          label="Export SVG"
          active={false}
          onClick={exportSvg}
        />
        <ToolButton
          icon={ImageDown}
          label="Export copy"
          active={false}
          onClick={exportSvg}
        />
        <ToolButton
          icon={Trash2}
          label="Clear"
          active={false}
          onClick={clearBoard}
        />
      </div>

      {selected && (
        <div className="pointer-events-none absolute top-4 right-4 z-20 rounded-md border border-[#6965db]/30 bg-white/95 px-3 py-2 text-xs text-neutral-600 shadow-sm">
          {selected.type} selected
        </div>
      )}

      <AlertDialog
        open={textDialog.open}
        onOpenChange={(open) => {
          if (!open) closeTextDialog()
          else setTextDialog((current) => ({ ...current, open }))
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {textDialog.type === "sticky" ? "Sticky note" : "Text"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add the content you want to place on the whiteboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            value={textDialog.value}
            onChange={(event) =>
              setTextDialog((current) => ({
                ...current,
                value: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") confirmTextDialog()
            }}
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition outline-none focus:border-[#6965db] focus:ring-2 focus:ring-[#e9e8ff]"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeTextDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTextDialog}>
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) closeConfirmation()
          else setConfirmDialog((current) => ({ ...current, open }))
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmDialog.actionVariant}
              onClick={confirmPendingAction}
            >
              {confirmDialog.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
