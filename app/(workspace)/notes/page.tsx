"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  Plus,
  Trash2,
  FileText,
  Tag,
  LayoutList,
  AlignJustify,
  Paperclip,
  ImageIcon,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  File,
  ExternalLink,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  FolderPlus,
  Check,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  pageBg: "#FAFAF8",
  sidebarBg: "#F4F2EC",
  cardBg: "#FFFFFF",
  editorBg: "#FFFFFF",
  border: "#E8E6DF",
  borderStrong: "#C8C4BC",
  textPrimary: "#1a1a1a",
  textSecondary: "#777",
  textMuted: "#999",
  textPlaceholder: "#C8C4BC",
  blue: "#5B9FE8",
  blueDark: "#4A8FD8",
  blueBg: "#5B9FE814",
  blueBgHover: "#5B9FE824",
  green: "#4CAF72",
  greenDark: "#2E8B50",
  greenBg: "#4CAF7214",
  gold: "#F5C842",
  goldDark: "#D4A820",
  goldBg: "#F5C84218",
  orange: "#FF9F43",
  orangeDark: "#E8902E",
  orangeBg: "#FF9F4318",
  red: "#FF6B6B",
  redDark: "#FF6060",
  redBg: "#FF6B6B14",
  rowHover: "#F4F2EC",
  mutedHover: "#EDEAE2",
  // Folder accent — a warm olive/sage that fits the off-white palette
  folder: "#7E9E7E",
  folderDark: "#5F7A5F",
  folderBg: "#7E9E7E18",
  folderActive: "#EDF2ED",
} as const

const TAG_COLORS = [
  { bg: "#5B9FE814", text: "#4A8FD8", border: "#5B9FE830" },
  { bg: "#4CAF7214", text: "#2E8B50", border: "#4CAF7230" },
  { bg: "#F5C84218", text: "#D4A820", border: "#F5C84230" },
  { bg: "#FF9F4318", text: "#E8902E", border: "#FF9F4330" },
  { bg: "#FF6B6B14", text: "#FF6060", border: "#FF6B6B30" },
]

function tagColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++)
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FolderType = {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

type Note = {
  id: string
  title: string
  content: string | null
  created_at?: string
  updated_at?: string
  folder_id?: string | null
}

type Attachment = {
  id: string
  name: string
  size: number
  mime_type: string
  url: string
  storage_path?: string
  uploading?: boolean
  error?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr?: string) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just Now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function extractTags(content: string | null): string[] {
  if (!content) return []
  return [
    ...new Set((content.match(/#\w+/g) ?? []).map((t) => t.toLowerCase())),
  ].slice(0, 4)
}

function preview(content: string | null) {
  if (!content) return ""
  return content.replace(/#\w+/g, "").replace(/\s+/g, " ").trim().slice(0, 90)
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(mimeType: string) {
  return mimeType?.startsWith("image/")
}

// ─── Empty State Illustration ─────────────────────────────────────────────────

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="mx-auto w-44" aria-hidden>
      <rect x="20" y="130" width="180" height="8" rx="4" fill={C.border} />
      <rect
        x="40"
        y="138"
        width="10"
        height="30"
        rx="3"
        fill={C.border}
        opacity=".6"
      />
      <rect
        x="170"
        y="138"
        width="10"
        height="30"
        rx="3"
        fill={C.border}
        opacity=".6"
      />
      <rect
        x="75"
        y="60"
        width="90"
        height="65"
        rx="6"
        fill={C.blueBg}
        stroke={C.blue}
        strokeOpacity=".3"
        strokeWidth="2"
      />
      <rect
        x="82"
        y="67"
        width="76"
        height="51"
        rx="3"
        fill={C.blue}
        opacity=".05"
      />
      <rect
        x="88"
        y="74"
        width="40"
        height="3"
        rx="1.5"
        fill={C.blue}
        opacity=".5"
      />
      <rect
        x="88"
        y="81"
        width="60"
        height="2"
        rx="1"
        fill={C.textMuted}
        opacity=".4"
      />
      <rect
        x="88"
        y="86"
        width="50"
        height="2"
        rx="1"
        fill={C.textMuted}
        opacity=".4"
      />
      <rect
        x="88"
        y="91"
        width="55"
        height="2"
        rx="1"
        fill={C.textMuted}
        opacity=".4"
      />
      <rect
        x="88"
        y="96"
        width="35"
        height="2"
        rx="1"
        fill={C.textMuted}
        opacity=".4"
      />
      <rect
        x="114"
        y="125"
        width="12"
        height="8"
        rx="2"
        fill={C.blue}
        opacity=".4"
      />
      <rect
        x="108"
        y="132"
        width="24"
        height="4"
        rx="2"
        fill={C.blue}
        opacity=".25"
      />
      <ellipse cx="55" cy="108" rx="12" ry="16" fill={C.gold} opacity=".15" />
      <circle cx="55" cy="88" r="10" fill={C.gold} opacity=".2" />
      <rect
        x="175"
        y="80"
        width="3"
        height="50"
        rx="1.5"
        fill={C.green}
        opacity=".3"
      />
      <path
        d="M165 80 Q175 70 185 80"
        stroke={C.green}
        strokeOpacity=".3"
        strokeWidth="2"
        fill={C.green}
        fillOpacity=".05"
      />
      <circle cx="175" cy="80" r="4" fill={C.green} opacity=".35" />
    </svg>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: Attachment[]
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [imgKey, setImgKey] = useState(0)
  const current = images[idx]

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleClose = useCallback(() => {
    setClosing(true)
    setVisible(false)
    setTimeout(onClose, 280)
  }, [onClose])

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + images.length) % images.length)
    setImgKey((k) => k + 1)
  }, [images.length])
  const next = useCallback(() => {
    setIdx((i) => (i + 1) % images.length)
    setImgKey((k) => k + 1)
  }, [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleClose, prev, next])

  if (!current) return null
  const open = visible && !closing

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: `rgba(26,26,26,${open ? 0.82 : 0})`,
        backdropFilter: `blur(${open ? 6 : 0}px)`,
        transition: "background-color 280ms ease, backdrop-filter 280ms ease",
      }}
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden shadow-2xl"
        style={{
          background: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: "1.25rem",
          opacity: open ? 1 : 0,
          transform: `scale(${open ? 1 : 0.94})`,
          transition:
            "opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 260ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: C.textPrimary }}
            >
              {current.name}
            </p>
            <p className="text-[11px]" style={{ color: C.textMuted }}>
              {formatBytes(current.size)}
            </p>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-1.5">
            <a
              href={current.url}
              download={current.name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
              style={{ color: C.textSecondary }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  C.blueBg
                ;(e.currentTarget as HTMLAnchorElement).style.color = C.blue
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent"
                ;(e.currentTarget as HTMLAnchorElement).style.color =
                  C.textSecondary
              }}
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
              style={{ color: C.textSecondary }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  C.redBg
                ;(e.currentTarget as HTMLButtonElement).style.color = C.red
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "transparent"
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  C.textSecondary
              }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          className="flex flex-1 items-center justify-center overflow-hidden p-4"
          style={{ background: C.sidebarBg }}
        >
          <img
            key={imgKey}
            src={current.url}
            alt={current.name}
            className="max-h-[70vh] max-w-full rounded-xl object-contain"
            style={{
              boxShadow: "0 8px 32px rgba(26,26,26,0.12)",
              animation:
                "lightbox-img-in 220ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all active:scale-90"
              style={{ background: "rgba(26,26,26,0.45)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,0.65)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,0.45)"
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all active:scale-90"
              style={{ background: "rgba(26,26,26,0.45)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,0.65)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(26,26,26,0.45)"
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div
              className="flex items-center justify-center gap-1.5 py-3"
              style={{ background: C.cardBg }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIdx(i)
                    setImgKey((k) => k + 1)
                  }}
                  className="rounded-full transition-all duration-200"
                  style={{
                    height: "6px",
                    width: i === idx ? "16px" : "6px",
                    background: i === idx ? C.blue : C.border,
                  }}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes lightbox-img-in { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({
  images,
  onRemove,
  onOpenLightbox,
}: {
  images: Attachment[]
  onRemove: (id: string) => void
  onOpenLightbox: (index: number) => void
}) {
  if (images.length === 0) return null
  return (
    <div className="mt-10">
      <p
        className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
        style={{ color: C.textMuted }}
      >
        <ImageIcon className="h-3 w-3" style={{ color: C.blue }} />
        Images
      </p>
      <div className="flex flex-wrap gap-1.5">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="group relative overflow-hidden"
            style={{
              width: "120px",
              height: "120px",
              flexShrink: 0,
              borderRadius: "0.625rem",
              border: `1px solid ${C.border}`,
              animation:
                "gallery-thumb-in 320ms cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: `${i * 55}ms`,
            }}
          >
            {img.uploading ? (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: C.sidebarBg }}
              >
                <Loader2
                  className="h-5 w-5 animate-spin"
                  style={{ color: C.blue }}
                />
              </div>
            ) : img.error ? (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-1"
                style={{ background: C.redBg, color: C.red }}
              >
                <X className="h-4 w-4" />
                <span className="text-[10px]">Failed</span>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                  <button
                    onClick={() => onOpenLightbox(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all active:scale-90"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                    aria-label="View full size"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(img.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all active:scale-90"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,107,107,0.65)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.2)"
                    }}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes gallery-thumb-in { from { opacity: 0; transform: translateY(10px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  )
}

// ─── File Chip ────────────────────────────────────────────────────────────────

function FileChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment
  onRemove: () => void
}) {
  const inner = (
    <div
      className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-150"
      style={{
        border: `1px solid ${attachment.error ? C.red + "55" : C.border}`,
        background: attachment.error ? C.redBg : C.sidebarBg,
        color: attachment.error ? C.red : C.textPrimary,
      }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ border: `1px solid ${C.border}`, background: C.cardBg }}
      >
        {attachment.uploading ? (
          <Loader2
            className="h-3.5 w-3.5 animate-spin"
            style={{ color: C.blue }}
          />
        ) : (
          <File
            className="h-3.5 w-3.5"
            style={{ color: attachment.error ? C.red : C.orange }}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="max-w-[140px] truncate leading-tight font-medium">
          {attachment.name}
        </p>
        <p
          className="text-[10px]"
          style={{ color: attachment.error ? C.red : C.textMuted }}
        >
          {attachment.uploading
            ? "Uploading…"
            : attachment.error
              ? "Upload failed"
              : formatBytes(attachment.size)}
        </p>
      </div>
      {!attachment.uploading && !attachment.error && (
        <ExternalLink
          className="h-3 w-3 shrink-0"
          style={{ color: C.textMuted }}
        />
      )}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove()
        }}
        className="ml-1 rounded-md p-0.5 opacity-0 transition-all duration-150 group-hover:opacity-100"
        style={{ color: C.textMuted }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = C.redBg
          ;(e.currentTarget as HTMLButtonElement).style.color = C.red
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background =
            "transparent"
          ;(e.currentTarget as HTMLButtonElement).style.color = C.textMuted
        }}
        aria-label={`Remove ${attachment.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
  if (!attachment.uploading && !attachment.error && attachment.url) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {inner}
      </a>
    )
  }
  return inner
}

// ─── Folder Row ───────────────────────────────────────────────────────────────

interface FolderRowProps {
  folder: FolderType
  noteCount: number
  isActive: boolean
  isOpen: boolean
  onSelect: () => void
  onToggle: () => void
  onRename: (newName: string) => void
  onDelete: () => void
}

function FolderRow({
  folder,
  noteCount,
  isActive,
  isOpen,
  onSelect,
  onToggle,
  onRename,
  onDelete,
}: FolderRowProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(folder.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(folder.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitEdit = () => {
    const trimmed = editValue.trim()

    if (!trimmed) {
      setEditValue(folder.name)
      setEditing(false)
      return
    }

    if (trimmed !== folder.name) {
      onRename(trimmed)
    }

    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setEditing(false)
      setEditValue(folder.name)
    }
  }

  return (
    <div
      className="group flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-1.5 transition-all duration-150 select-none"
      style={{
        background: isActive ? C.folderActive : "transparent",
        border: isActive ? `1px solid ${C.folder}22` : "1px solid transparent",
      }}
      onClick={onSelect}
    >
      {/* Expand/collapse chevron */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all duration-150"
        style={{ color: C.textMuted }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background =
            C.mutedHover
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background =
            "transparent"
        }}
        aria-label={isOpen ? "Collapse folder" : "Expand folder"}
      >
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200"
          style={{
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            color: isActive ? C.folder : C.textMuted,
          }}
        />
      </button>

      {/* Folder icon */}
      <div className="shrink-0">
        {isOpen ? (
          <FolderOpen
            className="h-3.5 w-3.5"
            style={{ color: isActive ? C.folder : C.textSecondary }}
          />
        ) : (
          <Folder
            className="h-3.5 w-3.5"
            style={{ color: isActive ? C.folder : C.textSecondary }}
          />
        )}
      </div>

      {/* Name / inline edit */}
      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="min-w-0 flex-1 rounded-md bg-white px-1.5 py-0.5 text-xs outline-none"
          style={{
            border: `1px solid ${C.folder}66`,
            color: C.textPrimary,
            fontSize: "12px",
          }}
          autoFocus
        />
      ) : (
        <span
          className="min-w-0 flex-1 truncate text-xs leading-tight font-medium"
          style={{ color: isActive ? C.textPrimary : C.textSecondary }}
          onDoubleClick={startEdit}
        >
          {folder.name}
        </span>
      )}

      {/* Note count badge */}
      {!editing && (
        <span
          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums transition-all duration-150"
          style={{
            background: isActive ? `${C.folder}20` : C.border,
            color: isActive ? C.folderDark : C.textMuted,
            minWidth: "18px",
            textAlign: "center",
          }}
        >
          {noteCount}
        </span>
      )}

      {/* Actions — visible on hover */}
      {!editing && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            onClick={startEdit}
            className="flex h-5 w-5 items-center justify-center rounded-md transition-all duration-150"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                C.blueBg
              ;(e.currentTarget as HTMLButtonElement).style.color = C.blue
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "transparent"
              ;(e.currentTarget as HTMLButtonElement).style.color = C.textMuted
            }}
            aria-label="Rename folder"
            title="Rename"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.5 2.5l2 2L4 14l-2.5.5.5-2.5L11.5 2.5z" />
            </svg>
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex h-5 w-5 items-center justify-center rounded-md transition-all duration-150"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.redBg
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.red
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    "transparent"
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    C.textMuted
                }}
                aria-label="Delete folder"
                title="Delete folder"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle style={{ color: C.textPrimary }}>
                  Delete "{folder.name}"?
                </AlertDialogTitle>
                <AlertDialogDescription style={{ color: C.textSecondary }}>
                  The folder will be deleted. Notes inside it will be moved to
                  All Notes and not deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  style={{ borderColor: C.border, color: C.textSecondary }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.textSecondary,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      C.redBg
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      C.red + "55"
                    ;(e.currentTarget as HTMLButtonElement).style.color = C.red
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      C.border
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      C.textSecondary
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}

function NewFolderInput({
  onCommit,
  onCancel,
}: {
  onCommit: (name: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const commit = () => {
    const trimmed = value.trim()

    if (!trimmed) {
      onCancel()
      return
    }

    onCommit(trimmed)
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
      style={{
        background: C.folderActive,
        border: `1px solid ${C.folder}33`,
      }}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <FolderPlus className="h-3.5 w-3.5" style={{ color: C.folder }} />
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commit()
          }

          if (e.key === "Escape") {
            e.preventDefault()
            onCancel()
          }
        }}
        onBlur={() => {
          if (!value.trim()) {
            onCancel()
          } else {
            commit()
          }
        }}
        placeholder="Folder name..."
        className="min-w-0 flex-1 rounded-md bg-white px-1.5 py-0.5 text-xs outline-none"
        style={{
          border: `1px solid ${C.folder}55`,
          color: C.textPrimary,
          fontSize: "12px",
        }}
      />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
        }}
        onClick={commit}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all"
        style={{
          background: C.folder,
          color: "#fff",
        }}
        aria-label="Create folder"
      >
        <Check className="h-3 w-3" />
      </button>
    </div>
  )
}
// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note
  active: boolean
  compact: boolean
  folderName?: string
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

function NoteCard({
  note,
  active,
  compact,
  folderName,
  onClick,
  onDelete,
}: NoteCardProps) {
  const tags = extractTags(note.content)

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl px-4 text-left transition-all duration-200 ease-out ${compact ? "py-2" : "py-3.5"}`}
      style={{
        background: active ? C.blue : C.cardBg,
        border: active ? `1px solid ${C.blueDark}` : `1px solid ${C.border}`,
        boxShadow: active
          ? `0 4px 16px ${C.blue}30`
          : "0 1px 3px rgba(26,26,26,0.04)",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background = C.rowHover
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background = C.cardBg
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="line-clamp-1 text-sm leading-snug font-semibold"
          style={{ color: active ? "#FFFFFF" : C.textPrimary }}
        >
          {note.title || "Untitled"}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {compact && (
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "rgba(255,255,255,0.55)" : C.textMuted }}
            >
              {timeAgo(note.updated_at ?? note.created_at)}
            </span>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="rounded-lg bg-transparent p-1 opacity-0 transition-all duration-150 group-hover:opacity-100"
                style={{
                  color: active ? "rgba(255,255,255,0.7)" : C.textMuted,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      C.redBg
                    ;(e.currentTarget as HTMLButtonElement).style.color = C.red
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      C.textMuted
                  }
                }}
                aria-label="Delete note"
                size="sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle style={{ color: C.textPrimary }}>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription style={{ color: C.textSecondary }}>
                  This action cannot be undone. This will permanently delete
                  your note and all its attachments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  style={{ borderColor: C.border, color: C.textSecondary }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.textSecondary,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      C.redBg
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      C.red + "55"
                    ;(e.currentTarget as HTMLButtonElement).style.color = C.red
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      C.border
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      C.textSecondary
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {!compact && (
        <>
          {/* Folder badge — shown when in All Notes view */}
          {folderName && (
            <div className="mt-1.5 flex items-center gap-1">
              <Folder
                className="h-2.5 w-2.5 shrink-0"
                style={{ color: active ? "rgba(255,255,255,0.55)" : C.folder }}
              />
              <span
                className="truncate text-[10px] font-medium"
                style={{
                  color: active ? "rgba(255,255,255,0.55)" : C.folderDark,
                }}
              >
                {folderName}
              </span>
            </div>
          )}
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((tag) => {
                const tc = tagColor(tag)
                return (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                    style={{
                      background: active ? "rgba(255,255,255,0.2)" : tc.bg,
                      color: active ? "rgba(255,255,255,0.9)" : tc.text,
                      border: `1px solid ${active ? "rgba(255,255,255,0.15)" : tc.border}`,
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}
          <p
            className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
            style={{
              color: active ? "rgba(255,255,255,0.72)" : C.textSecondary,
            }}
          >
            {preview(note.content)}
          </p>
          <div className="mt-2">
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "rgba(255,255,255,0.5)" : C.textMuted }}
            >
              {timeAgo(note.updated_at ?? note.created_at)}
            </span>
          </div>
        </>
      )}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<FolderType[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [compact, setCompact] = useState(false)

  // Folder UI state
  const [activeFolderId, setActiveFolderId] = useState<string | null | "all">(
    "all"
  )
  const [openFolderIds, setOpenFolderIds] = useState<Set<string>>(new Set())
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [showFolderMenu, setShowFolderMenu] = useState(false)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const imageAttachments = attachments.filter(
    (a) => isImage(a.mime_type) && !a.error
  )
  const fileAttachments = attachments.filter((a) => !isImage(a.mime_type))

  // ── Fetch helpers ──

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/folders")
    if (res.ok) {
      const data = await res.json()

      console.log("Fetched folders:", data)
      setFolders(Array.isArray(data) ? data : (data.data ?? []))
    }
  }, [])

  const fetchNotes = async () => {
    setLoading(true)

    const folderParam =
      activeFolderId && activeFolderId !== "all"
        ? `?folderId=${activeFolderId}`
        : ""

    const res = await fetch(`/api/notes${folderParam}`)
    const data = await res.json()

    console.log("Fetched notes:", data)
    setNotes(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFolders()
    fetchNotes()
  }, [fetchFolders, activeFolderId])

  const fetchAttachments = useCallback(async (noteId: string) => {
    setAttachmentsLoading(true)
    try {
      const res = await fetch(`/api/notes/${noteId}/attachments`)
      if (res.ok) {
        const data = await res.json()
        setAttachments(Array.isArray(data) ? data : [])
      }
    } catch {
    } finally {
      setAttachmentsLoading(false)
    }
  }, [])

  // ── Folder CRUD ──

  const createFolder = async (name: string) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const created = await res.json()
      const folder: FolderType = created.data ?? created
      await fetchFolders()
      if (folder?.id) {
        setActiveFolderId(folder.id)
        setOpenFolderIds((prev) => new Set([...prev, folder.id]))
      }
    }
  }

  const renameFolder = async (id: string, name: string) => {
    if (!id || !name?.trim()) return

    await fetch(`/api/folders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
      }),
    })

    await fetchFolders()
  }

  const deleteFolder = async (id: string) => {
    await fetch(`/api/folders/${id}`, { method: "DELETE" })
    if (activeFolderId === id) setActiveFolderId("all")
    await fetchFolders()
    await fetchNotes()
  }

  const assignNoteToFolder = async (
    noteId: string,
    folderId: string | null
  ) => {
    await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder_id: folderId }),
    })
    setSelectedNote((prev) => (prev ? { ...prev, folder_id: folderId } : prev))

    console.log("Assigned note", noteId, "to folder", folderId)
    await fetchNotes()
  }

  // ── Note CRUD ──

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !selectedNote) return
    for (const file of files) {
      const tempId = crypto.randomUUID()
      const objectUrl = URL.createObjectURL(file)
      setAttachments((prev) => [
        ...prev,
        {
          id: tempId,
          name: file.name,
          size: file.size,
          mime_type: file.type,
          url: objectUrl,
          uploading: true,
        },
      ])
      const form = new FormData()
      form.append("file", file)
      try {
        const res = await fetch(`/api/notes/${selectedNote.id}/attachments`, {
          method: "POST",
          body: form,
        })
        if (res.ok) {
          const saved = await res.json()
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId
                ? { ...saved, url: saved.url ?? objectUrl, uploading: false }
                : a
            )
          )
        } else {
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, uploading: false, error: true } : a
            )
          )
        }
      } catch {
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === tempId ? { ...a, uploading: false, error: true } : a
          )
        )
      }
    }
    e.target.value = ""
  }

  const removeAttachment = async (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target?.url.startsWith("blob:")) URL.revokeObjectURL(target.url)
      return prev.filter((a) => a.id !== id)
    })
    if (selectedNote) {
      try {
        await fetch(
          `/api/notes/${selectedNote.id}/attachments?attachmentId=${id}`,
          { method: "DELETE" }
        )
      } catch {}
    }
  }

  const createNote = async () => {
    const folderId = activeFolderId !== "all" ? activeFolderId : null

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New note",
        content: "",
        folder_id: folderId,
      }),
    })

    const created = await res.json()

    if (!res.ok) {
      console.error(created.error)
      return
    }

    await fetchNotes()

    const newNote = created // ✅ FIXED

    if (newNote?.id) {
      setSelectedNote(newNote)
      setTitle(newNote.title ?? "")
      setContent(newNote.content ?? "")
      setAttachments([])
    }
    console.log("activeFolderId:", activeFolderId)
  }

  const triggerSave = useCallback(
    (id: string, t: string, c: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      setSaving(true)
      saveTimer.current = setTimeout(async () => {
        await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: t, content: c }),
        })
        setSaving(false)
        fetchNotes()
      }, 800)
    },
    [fetchNotes]
  )

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (selectedNote) triggerSave(selectedNote.id, v, content)
  }
  const handleContentChange = (v: string) => {
    setContent(v)
    if (selectedNote) triggerSave(selectedNote.id, title, v)
  }

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setTitle("")
      setContent("")
      setAttachments([])
    }
    fetchNotes()
  }

  const selectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content ?? "")
    setAttachments([])
    fetchAttachments(note.id)
  }

  // ── Derived data ──

  const notesInActiveFolder = notes.filter((n) => {
    if (activeFolderId === "all") return true
    return n.folder_id === activeFolderId
  })

  const filtered = notesInActiveFolder.filter((n) => {
    const q = search.toLowerCase()
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content ?? "").toLowerCase().includes(q)
    )
  })

  const noteCountByFolder = (folderId: string) =>
    notes.filter((n) => n.folder_id === folderId).length
  const getFolderName = (folderId?: string | null) =>
    folders.find((f) => f.id === folderId)?.name

  const currentTags = extractTags(content)
  const uploadedCount = attachments.filter(
    (a) => !a.error && !a.uploading
  ).length

  const toggleFolder = (id: string) => {
    setOpenFolderIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Active folder label ──
  const activeFolderLabel =
    activeFolderId === "all"
      ? "All Notes"
      : (folders.find((f) => f.id === activeFolderId)?.name ?? "Notes")

  return (
    <>
      {lightboxIndex !== null && imageAttachments.length > 0 && (
        <Lightbox
          images={imageAttachments}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div
        className="flex h-screen overflow-hidden rounded-lg"
        style={{ background: C.pageBg }}
      >
        {/* ── Left panel ─────────────────────────────────────────── */}
        <aside
          className="flex h-screen w-72 shrink-0 flex-col"
          style={{
            background: C.sidebarBg,
            borderRight: `1px solid ${C.border}`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-3">
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ color: C.textPrimary }}
            >
              Notes
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCompact((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 active:scale-95"
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.cardBg,
                  color: C.textMuted,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.mutedHover
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    C.textPrimary
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.cardBg
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    C.textMuted
                }}
                aria-label={
                  compact ? "Switch to list view" : "Switch to compact view"
                }
              >
                {compact ? (
                  <AlignJustify className="h-3.5 w-3.5" />
                ) : (
                  <LayoutList className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={createNote}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 active:scale-95"
                style={{
                  background: C.blue,
                  color: "#FFFFFF",
                  boxShadow: `0 2px 8px ${C.blue}40`,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.blueDark
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 4px 12px ${C.blue}55`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.blue
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 2px 8px ${C.blue}40`
                }}
                aria-label="New note"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
            >
              <svg
                width="12"
                height="12"
                fill="none"
                stroke={C.textMuted}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes…"
                className="w-full bg-transparent text-xs outline-none"
                style={{ color: C.textPrimary }}
              />
            </div>
          </div>

          {/* ── Folders section ── */}
          <div className="shrink-0 px-3 pb-2">
            {/* Section header */}
            <div className="mb-1 flex items-center justify-between">
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: C.textMuted }}
              >
                Folders
              </span>
              <button
                onClick={() => setCreatingFolder(true)}
                className="flex h-5 w-5 items-center justify-center rounded-md transition-all duration-150"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.folderBg
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.folder
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    "transparent"
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    C.textMuted
                }}
                aria-label="New folder"
                title="New folder"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* All Notes row */}
            <button
              onClick={() => setActiveFolderId("all")}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-all duration-150"
              style={{
                background:
                  activeFolderId === "all" ? C.folderActive : "transparent",
                border:
                  activeFolderId === "all"
                    ? `1px solid ${C.folder}22`
                    : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (activeFolderId !== "all")
                  (e.currentTarget as HTMLButtonElement).style.background =
                    C.mutedHover
              }}
              onMouseLeave={(e) => {
                if (activeFolderId !== "all")
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent"
              }}
            >
              <Hash
                className="h-3.5 w-3.5 shrink-0"
                style={{
                  color: activeFolderId === "all" ? C.folder : C.textMuted,
                }}
              />
              <span
                className="flex-1 text-xs font-medium"
                style={{
                  color:
                    activeFolderId === "all" ? C.textPrimary : C.textSecondary,
                }}
              >
                All Notes
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
                style={{
                  background:
                    activeFolderId === "all" ? `${C.folder}20` : C.border,
                  color: activeFolderId === "all" ? C.folderDark : C.textMuted,
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {notes.length}
              </span>
            </button>

            {/* Folder rows */}
            <div className="mt-0.5 flex flex-col gap-0.5">
              {folders.map((folder) => (
                <FolderRow
                  key={folder.id}
                  folder={folder}
                  noteCount={noteCountByFolder(folder.id)}
                  isActive={activeFolderId === folder.id}
                  isOpen={openFolderIds.has(folder.id)}
                  onSelect={() => {
                    setActiveFolderId(folder.id)
                    setOpenFolderIds((prev) => new Set([...prev, folder.id]))
                  }}
                  onToggle={() => toggleFolder(folder.id)}
                  onRename={(name) => renameFolder(folder.id, name)}
                  onDelete={() => deleteFolder(folder.id)}
                />
              ))}
            </div>

            {/* New folder input */}
            {creatingFolder && (
              <div className="mt-0.5">
                <NewFolderInput
                  onCommit={(name) => {
                    createFolder(name)
                    setCreatingFolder(false)
                  }}
                  onCancel={() => setCreatingFolder(false)}
                />
              </div>
            )}

            {/* Divider */}
            <div
              className="mt-3 mb-1"
              style={{ borderTop: `1px solid ${C.border}` }}
            />
            {/* Active folder label above note list */}
            <p
              className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: C.textMuted }}
            >
              {activeFolderLabel}
            </p>
          </div>

          {/* Note list */}
          <div className="min-h-0 flex-1">
            <div className="h-full space-y-1.5 overflow-y-auto px-3 pb-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl"
                    style={{
                      background: C.border,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))
              ) : filtered.length === 0 ? (
                <div className="pt-6 text-center">
                  <p className="text-xs" style={{ color: C.textMuted }}>
                    {search
                      ? "No notes match your search."
                      : activeFolderId === "all"
                        ? "No notes yet — create one!"
                        : "No notes in this folder."}
                  </p>
                  {!search && activeFolderId !== "all" && (
                    <button
                      onClick={createNote}
                      className="mx-auto mt-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150"
                      style={{
                        background: C.folderBg,
                        color: C.folderDark,
                        border: `1px solid ${C.folder}33`,
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add note here
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((note, i) => (
                  <div
                    key={note.id}
                    className="animate-in fade-in slide-in-from-bottom-1"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      animationDuration: "250ms",
                      animationFillMode: "both",
                    }}
                  >
                    <NoteCard
                      note={note}
                      active={selectedNote?.id === note.id}
                      compact={compact}
                      folderName={
                        activeFolderId === "all"
                          ? getFolderName(note.folder_id)
                          : undefined
                      }
                      onClick={() => selectNote(note)}
                      onDelete={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* ── Right panel — Editor ────────────────────────────────── */}
        <main
          className="flex flex-1 flex-col overflow-hidden"
          style={{ background: C.editorBg, borderRadius: "0 1rem 1rem 0" }}
        >
          {selectedNote ? (
            <>
              {/* Editor header */}
              <div
                className="flex shrink-0 items-center justify-between px-8 py-4"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" style={{ color: C.blue }} />
                  <span className="rounded-full bg-[#3fb950] px-2 py-0.5 text-xs font-medium text-white">
                    {timeAgo(
                      selectedNote.updated_at ?? selectedNote.created_at
                    )}
                  </span>

                  {/* Folder breadcrumb pill */}
                  <div className="relative">
                    <div
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-150"
                      style={{
                        background: selectedNote.folder_id
                          ? C.folderBg
                          : C.border + "88",
                        color: selectedNote.folder_id
                          ? C.folderDark
                          : C.textMuted,
                        border: `1px solid ${selectedNote.folder_id ? C.folder + "44" : C.border}`,
                      }}
                    >
                      <Folder className="h-3 w-3" />
                      <span>
                        {getFolderName(selectedNote.folder_id) ?? "No folder"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {saving && (
                    <span
                      className="flex animate-pulse items-center gap-1.5 text-xs"
                      style={{ color: C.green }}
                    >
                      <div
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ background: C.green }}
                      />
                      Saving…
                    </span>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150"
                        style={{
                          border: `1px solid ${C.border}`,
                          color: C.textMuted,
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          ;(
                            e.currentTarget as HTMLButtonElement
                          ).style.background = C.redBg
                          ;(
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = C.red + "44"
                          ;(e.currentTarget as HTMLButtonElement).style.color =
                            C.red
                        }}
                        onMouseLeave={(e) => {
                          ;(
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent"
                          ;(
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = C.border
                          ;(e.currentTarget as HTMLButtonElement).style.color =
                            C.textMuted
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      style={{
                        background: C.cardBg,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle style={{ color: C.textPrimary }}>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription
                          style={{ color: C.textSecondary }}
                        >
                          This action cannot be undone. This will permanently
                          delete your note and all its attachments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          style={{
                            borderColor: C.border,
                            color: C.textSecondary,
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteNote(selectedNote.id)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95"
                          style={{
                            border: `1px solid ${C.border}`,
                            color: C.textSecondary,
                            background: "transparent",
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Editor body */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="shrink-0 px-10 pt-6">
                  <input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Note title"
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
                    style={{ color: C.textPrimary }}
                  />
                  {currentTags.length > 0 && (
                    <div className="flex items-center gap-2 pt-3">
                      <Tag className="h-3 w-3" style={{ color: C.textMuted }} />
                      {currentTags.map((tag) => {
                        const tc = tagColor(tag)
                        return (
                          <span
                            key={tag}
                            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{
                              background: tc.bg,
                              color: tc.text,
                              border: `1px solid ${tc.border}`,
                            }}
                          >
                            {tag}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div
                    className="mt-5"
                    style={{ borderTop: `1px solid ${C.border}` }}
                  />
                </div>

                <div className="min-h-0 flex-1 px-10">
                  <textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={`Start writing…\n\nTip: use #tags to categorize your notes.`}
                    className="mt-5 h-full w-full resize-none bg-transparent text-[15px] leading-[1.85] outline-none"
                    style={{ color: C.textPrimary }}
                  />
                </div>

                <div className="shrink-0 px-10 pb-4">
                  {attachmentsLoading && (
                    <div
                      className="mt-4 flex items-center gap-2 text-xs"
                      style={{ color: C.textMuted }}
                    >
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        style={{ color: C.blue }}
                      />
                      Loading attachments…
                    </div>
                  )}
                  {!attachmentsLoading && (
                    <ImageGallery
                      images={imageAttachments}
                      onRemove={removeAttachment}
                      onOpenLightbox={(i) => setLightboxIndex(i)}
                    />
                  )}
                  {!attachmentsLoading && fileAttachments.length > 0 && (
                    <div className="mt-10">
                      <p
                        className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                        style={{ color: C.textMuted }}
                      >
                        <Paperclip
                          className="h-3 w-3"
                          style={{ color: C.orange }}
                        />
                        Files
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {fileAttachments.map((att) => (
                          <FileChip
                            key={att.id}
                            attachment={att}
                            onRemove={() => removeAttachment(att.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className="mt-4 flex items-center gap-1 pt-3"
                    style={{ borderTop: `1px solid ${C.border}` }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = ""
                          fileInputRef.current.click()
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ color: C.textSecondary }}
                      onMouseEnter={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = C.orangeBg
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          C.orange
                      }}
                      onMouseLeave={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent"
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          C.textSecondary
                      }}
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Attach
                    </button>
                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = "image/*"
                          fileInputRef.current.click()
                          setTimeout(() => {
                            if (fileInputRef.current)
                              fileInputRef.current.accept = ""
                          }, 500)
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95"
                      style={{ color: C.textSecondary }}
                      onMouseEnter={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = C.blueBg
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          C.blue
                      }}
                      onMouseLeave={(e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent"
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          C.textSecondary
                      }}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Image
                    </button>
                    {uploadedCount > 0 && (
                      <span
                        className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: C.greenBg, color: C.green }}
                      >
                        {uploadedCount} attachment
                        {uploadedCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
              <EmptyIllustration />
              <div>
                <p
                  className="text-xl font-semibold"
                  style={{ color: C.textPrimary }}
                >
                  Write down your ideas
                </p>
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: C.textSecondary }}
                >
                  Select a note from the list, or create a new one.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {[
                    { tag: "#ideas", ...TAG_COLORS[0] },
                    { tag: "#to-do's", ...TAG_COLORS[2] },
                    { tag: "#morning", ...TAG_COLORS[1] },
                  ].map(({ tag, bg, text, border }) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: bg,
                        color: text,
                        border: `1px solid ${border}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={createNote}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: C.blue,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 16px ${C.blue}40`,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.blueDark
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 6px 20px ${C.blue}55`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background =
                    C.blue
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    `0 4px 16px ${C.blue}40`
                }}
              >
                <Plus className="h-4 w-4" />
                New note
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
