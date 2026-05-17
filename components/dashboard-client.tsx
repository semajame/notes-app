"use client"

import { useMemo } from "react"
import {
  FileText,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  HardDrive,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Note {
  id: string
  title: string
  content?: string
  created_at: string
  updated_at?: string
}

interface Props {
  notes: Note[]
  folders: {
    id: string
    name: string
    created_at?: string
    updated_at?: string
  }[]

  notesError: string | null
  foldersError: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function groupByMonth(items: { created_at: string }[]) {
  const counts: Record<string, number> = {}
  items.forEach((item) => {
    const d = new Date(item.created_at)
    if (isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${d.getMonth()}`
    counts[key] = (counts[key] ?? 0) + 1
  })
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    return { label: MONTHS[d.getMonth()], count: counts[key] ?? 0 }
  })
}

function groupByDay(items: { created_at: string }[]) {
  const counts: Record<number, number> = {}
  items.forEach((item) => {
    const d = new Date(item.created_at)
    if (isNaN(d.getTime())) return
    counts[d.getDay()] = (counts[d.getDay()] ?? 0) + 1
  })
  return DAYS.map((label, i) => ({ label, count: counts[i] ?? 0 }))
}

function createdToday(items: { created_at: string }[]) {
  const now = new Date()
  return items.filter((item) => {
    const d = new Date(item.created_at)
    return (
      !isNaN(d.getTime()) &&
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }).length
}

function createdThisWeek(items: { created_at: string }[]) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return items.filter((item) => {
    const d = new Date(item.created_at)
    return !isNaN(d.getTime()) && d >= weekAgo
  }).length
}

function formatRelative(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "unknown"
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  positive?: boolean | null
  icon: React.ReactNode
  accent: string
  accentBg: string
}

function StatCard({
  label,
  value,
  sub,
  positive,
  icon,
  accent,
  accentBg,
}: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl px-5 py-4 transition-shadow duration-200 ease-out hover:shadow-md"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E6DF",
        boxShadow: "0 1px 3px rgba(26,26,26,0.06)",
      }}
    >
      {/* subtle tint overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(135deg, transparent 60%, #F4F2EC44)",
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#999" }}
          >
            {label}
          </p>
          <p
            className="mt-1.5 truncate text-2xl font-semibold tracking-tight"
            style={{ color: "#1a1a1a" }}
          >
            {value}
          </p>
          {sub && (
            <p
              className="mt-1 flex items-center gap-1 text-xs font-medium"
              style={{
                color:
                  positive === true
                    ? "#4CAF72"
                    : positive === false
                      ? "#FF6B6B"
                      : "#888",
              }}
            >
              {positive === true && <TrendingUp className="h-3 w-3" />}
              {positive === false && <TrendingDown className="h-3 w-3" />}
              {sub}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150"
          style={{ background: accentBg, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: "#FFF0F0",
        border: "1px solid #FF6B6B44",
        color: "#FF6060",
      }}
    >
      ⚠ {message}
    </div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E6DF",
        boxShadow: "0 4px 12px rgba(26,26,26,0.10)",
        color: "#1a1a1a",
      }}
    >
      <p style={{ color: "#888" }} className="font-medium">
        {label}
      </p>
      <p className="mt-0.5 font-semibold" style={{ color: "#1a1a1a" }}>
        {payload[0].value} {payload[0].name}
      </p>
    </div>
  )
}

// ─── Shared chart axis style ──────────────────────────────────────────────────

const axisTickStyle = { fontSize: 11, fill: "#999" }

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardClient({
  notes,
  folders,

  notesError,
  foldersError,
}: Props) {
  const notesByMonth = useMemo(() => groupByMonth(notes), [notes])

  const notesByDay = useMemo(() => groupByDay(notes), [notes])

  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 8),
    [notes]
  )

  const notesThisWeek = useMemo(() => createdThisWeek(notes), [notes])
  const notesToday = useMemo(() => createdToday(notes), [notes])

  const recentFolders = useMemo(
    () =>
      [...folders]
        .sort(
          (a, b) =>
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
        )
        .slice(0, 8),
    [folders]
  )

  const lastNoteTime = useMemo(() => {
    if (!notes.length) return null
    return notes.reduce((latest, n) =>
      new Date(n.updated_at ?? n.created_at) >
      new Date(latest.updated_at ?? latest.created_at)
        ? n
        : latest
    )
  }, [notes])

  // Stat card accent colors from the landing palette
  const statCards = [
    {
      label: "Total Notes",
      value: notes.length.toLocaleString(),
      sub: `${notesToday} created today`,
      positive: notesToday > 0 ? true : null,
      icon: <FileText className="h-5 w-5" />,
      accent: "#5B9FE8",
      accentBg: "#5B9FE820",
    },

    {
      label: "Total Folders",
      value: folders.length.toLocaleString(),
      sub: "folders created",
      positive: folders.length > 0 ? true : null,
      icon: <FolderOpen className="h-5 w-5" />,
      accent: "#FF9F43",
      accentBg: "#FF9F4314",
    },

    {
      label: "This Week",
      value: notesThisWeek,
      sub: "notes created",
      positive: notesThisWeek > 0 ? true : null,
      icon: <TrendingUp className="h-5 w-5" />,
      accent: "#F5C842",
      accentBg: "#F5C84220",
    },
  ]

  // Shared card style
  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E8E6DF",
    boxShadow: "0 1px 3px rgba(26,26,26,0.06)",
    borderRadius: "1rem",
  }

  return (
    <div className="space-y-6" style={{ background: "#FAFAF8" }}>
      {/* ── Error banners ─────────────────────────────────────── */}
      {notesError && <ErrorBanner message={notesError} />}
      {foldersError && <ErrorBanner message={foldersError} />}

      {/* ── Stat cards ────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDelay: `${i * 60}ms`,
              animationDuration: "300ms",
              animationFillMode: "both",
            }}
          >
            <StatCard {...card} />
          </div>
        ))}
      </div>

      {/* ── Charts row ────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Notes by month — bar */}
        <div
          className="animate-in p-5 fade-in slide-in-from-bottom-2"
          style={{
            ...cardStyle,
            animationDelay: "240ms",
            animationDuration: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
            Notes Created
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "#888" }}>
            Last 6 months
          </p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={notesByMonth} barSize={18}>
                <CartesianGrid
                  vertical={false}
                  stroke="#E8E6DF"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#F4F2EC" }}
                />
                <Bar
                  dataKey="count"
                  name="notes"
                  radius={[4, 4, 0, 0]}
                  fill="#5B9FE8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {lastNoteTime && (
            <p
              className="mt-3 flex items-center gap-1.5 text-xs"
              style={{ color: "#999" }}
            >
              <Clock className="h-3 w-3" />
              updated{" "}
              {formatRelative(
                lastNoteTime.updated_at ?? lastNoteTime.created_at
              )}
            </p>
          )}
        </div>

        {/* Notes activity by day — line */}
        <div
          className="animate-in p-5 fade-in slide-in-from-bottom-2"
          style={{
            ...cardStyle,
            animationDelay: "360ms",
            animationDuration: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
            Note Activity
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "#888" }}>
            By day of week
          </p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={notesByDay}>
                <CartesianGrid
                  stroke="#E8E6DF"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="notes"
                  stroke="#FF9F43"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#FF9F43", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#E8902E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p
            className="mt-3 flex items-center gap-1.5 text-xs"
            style={{ color: "#999" }}
          >
            <Clock className="h-3 w-3" />
            Just Updated
          </p>
        </div>
      </div>

      {/* ── Recent activity tables ─────────────────────────────── */}
      <div
        className="grid animate-in gap-4 fade-in slide-in-from-bottom-2 lg:grid-cols-2"
        style={{
          animationDelay: "420ms",
          animationDuration: "300ms",
          animationFillMode: "both",
        }}
      >
        {/* Recent Notes */}
        <div style={cardStyle}>
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid #E8E6DF" }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Recent Notes
              </p>
              <p className="text-xs" style={{ color: "#888" }}>
                Latest activity
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: "#5B9FE820", color: "#5B9FE8" }}
            >
              {notes.length}
            </span>
          </div>

          {notesError ? (
            <p className="px-5 py-4 text-sm" style={{ color: "#888" }}>
              Failed to load notes.
            </p>
          ) : recentNotes.length === 0 ? (
            <p className="px-5 py-4 text-sm" style={{ color: "#888" }}>
              No notes yet.
            </p>
          ) : (
            <ul>
              {recentNotes.map((note, i) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors duration-150"
                  style={{
                    borderBottom:
                      i < recentNotes.length - 1 ? "1px solid #E8E6DF" : "none",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLLIElement).style.background =
                      "#F4F2EC"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLLIElement).style.background =
                      "transparent"
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "#5B9FE820" }}
                    >
                      <FileText
                        className="h-3.5 w-3.5"
                        style={{ color: "#5B9FE8" }}
                      />
                    </div>
                    <p
                      className="truncate text-sm font-medium"
                      style={{ color: "#1a1a1a" }}
                    >
                      {note.title || "Untitled"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs" style={{ color: "#999" }}>
                    {formatRelative(note.updated_at ?? note.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Folders */}
        <div style={cardStyle}>
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid #E8E6DF" }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Recent Folders
              </p>
              <p className="text-xs" style={{ color: "#888" }}>
                Most recently created
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: "#5B9FE820", color: "#5B9FE8" }}
            >
              {folders.length}
            </span>
          </div>

          {foldersError ? (
            <p className="px-5 py-4 text-sm" style={{ color: "#888" }}>
              Failed to load folders.
            </p>
          ) : recentFolders.length === 0 ? (
            <p className="px-5 py-4 text-sm" style={{ color: "#888" }}>
              No folders yet.
            </p>
          ) : (
            <ul>
              {recentFolders.map((folder, i) => (
                <li
                  key={folder.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors duration-150"
                  style={{
                    borderBottom:
                      i < recentFolders.length - 1
                        ? "1px solid #E8E6DF"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLLIElement).style.background =
                      "#F4F2EC"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLLIElement).style.background =
                      "transparent"
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "#FF9F4314" }}
                    >
                      <FolderOpen
                        className="h-3.5 w-3.5"
                        style={{ color: "#E8902E" }}
                      />
                    </div>
                    <p
                      className="truncate text-sm font-medium"
                      style={{ color: "#1a1a1a" }}
                    >
                      {folder.name || "Untitled Folder"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs" style={{ color: "#999" }}>
                    {folder.created_at
                      ? formatRelative(folder.created_at)
                      : "unknown"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
