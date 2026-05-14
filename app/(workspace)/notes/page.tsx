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

// ─── Types ────────────────────────────────────────────────────────────────────

type Note = {
  id: string
  title: string
  content: string | null
  created_at?: string
  updated_at?: string
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
    <svg
      viewBox="0 0 220 180"
      fill="none"
      className="mx-auto w-44 text-muted-foreground opacity-40"
      aria-hidden
    >
      <rect x="20" y="130" width="180" height="8" rx="4" fill="currentColor" />
      <rect
        x="40"
        y="138"
        width="10"
        height="30"
        rx="3"
        fill="currentColor"
        opacity=".6"
      />
      <rect
        x="170"
        y="138"
        width="10"
        height="30"
        rx="3"
        fill="currentColor"
        opacity=".6"
      />
      <rect
        x="75"
        y="60"
        width="90"
        height="65"
        rx="6"
        fill="currentColor"
        opacity=".15"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="2"
      />
      <rect
        x="82"
        y="67"
        width="76"
        height="51"
        rx="3"
        fill="currentColor"
        opacity=".08"
      />
      <rect
        x="88"
        y="74"
        width="40"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity=".5"
      />
      <rect
        x="88"
        y="81"
        width="60"
        height="2"
        rx="1"
        fill="currentColor"
        opacity=".3"
      />
      <rect
        x="88"
        y="86"
        width="50"
        height="2"
        rx="1"
        fill="currentColor"
        opacity=".3"
      />
      <rect
        x="88"
        y="91"
        width="55"
        height="2"
        rx="1"
        fill="currentColor"
        opacity=".3"
      />
      <rect
        x="88"
        y="96"
        width="35"
        height="2"
        rx="1"
        fill="currentColor"
        opacity=".3"
      />
      <rect
        x="114"
        y="125"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        opacity=".4"
      />
      <rect
        x="108"
        y="132"
        width="24"
        height="4"
        rx="2"
        fill="currentColor"
        opacity=".3"
      />
      <ellipse
        cx="55"
        cy="108"
        rx="12"
        ry="16"
        fill="currentColor"
        opacity=".1"
      />
      <circle cx="55" cy="88" r="10" fill="currentColor" opacity=".15" />
      <rect
        x="175"
        y="80"
        width="3"
        height="50"
        rx="1.5"
        fill="currentColor"
        opacity=".3"
      />
      <path
        d="M165 80 Q175 70 185 80"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity=".05"
      />
      <circle cx="175" cy="80" r="4" fill="currentColor" opacity=".3" />
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
  // "visible" drives the CSS open state; "closing" triggers the exit animation
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  // tracks the displayed image so we can cross-fade on switch
  const [imgKey, setImgKey] = useState(0)

  const current = images[idx]

  // Mount → trigger enter on next tick so transition plays
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Animated close: start exit, then unmount after transition completes
  const handleClose = useCallback(() => {
    setClosing(true)
    setVisible(false)
    setTimeout(onClose, 280) // matches transition duration below
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        // Backdrop: fade in/out
        backgroundColor: `rgba(0,0,0,${visible && !closing ? 0.8 : 0})`,
        backdropFilter: `blur(${visible && !closing ? 6 : 0}px)`,
        transition: "background-color 280ms ease, backdrop-filter 280ms ease",
      }}
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
        style={{
          // Card: scale + fade in/out
          opacity: visible && !closing ? 1 : 0,
          transform: `scale(${visible && !closing ? 1 : 0.94})`,
          transition:
            "opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 260ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {current.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {formatBytes(current.size)}
            </p>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-1.5">
            <a
              href={current.url}
              download={current.name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image — keyed so it re-mounts and cross-fades on switch */}
        <div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/20 p-4">
          <img
            key={imgKey}
            src={current.url}
            alt={current.name}
            className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-md"
            style={{
              animation:
                "lightbox-img-in 220ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          />
        </div>

        {/* Nav (only if multiple) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1.5 py-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIdx(i)
                    setImgKey((k) => k + 1)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === idx
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Keyframe for image cross-fade */}
      <style>{`
        @keyframes lightbox-img-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
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
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-muted-foreground/60 uppercase">
        <ImageIcon className="h-3 w-3" />
        Images
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border/60"
            style={{
              // Staggered fade-up entrance for each thumbnail
              animation:
                "gallery-thumb-in 320ms cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: `${i * 55}ms`,
            }}
          >
            {img.uploading ? (
              <div className="flex h-full w-full items-center justify-center bg-muted/60">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : img.error ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-destructive/5 text-destructive">
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
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                  <button
                    onClick={() => onOpenLightbox(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-90"
                    aria-label="View full size"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(img.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-red-500/70 active:scale-90"
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

      {/* Keyframe for gallery thumbnail entrance */}
      <style>{`
        @keyframes gallery-thumb-in {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
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
      className={`group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all duration-150 ${
        attachment.error
          ? "border-destructive/40 bg-destructive/5 text-destructive"
          : "border-border/60 bg-muted/40 text-foreground hover:bg-muted/70"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted">
        {attachment.uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : (
          <File className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="max-w-[140px] truncate leading-tight font-medium">
          {attachment.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {attachment.uploading
            ? "Uploading…"
            : attachment.error
              ? "Upload failed"
              : formatBytes(attachment.size)}
        </p>
      </div>

      {!attachment.uploading && !attachment.error && (
        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/50" />
      )}

      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove()
        }}
        className="ml-1 rounded-md p-0.5 text-muted-foreground opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
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

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note
  active: boolean
  compact: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

function NoteCard({ note, active, compact, onClick, onDelete }: NoteCardProps) {
  const tags = extractTags(note.content)

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl px-4 text-left transition-all duration-200 ease-out ${compact ? "py-2" : "py-3.5"} ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "border border-border/60 bg-card hover:bg-muted/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={`line-clamp-1 text-sm leading-snug font-semibold ${active ? "text-primary-foreground" : "text-foreground"}`}
        >
          {note.title || "Untitled"}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {compact && (
            <span
              className={`text-[10px] font-medium ${active ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}
            >
              {timeAgo(note.updated_at ?? note.created_at)}
            </span>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className={`rounded-lg bg-transparent p-1 opacity-0 transition-all duration-150 group-hover:opacity-100 ${
                  active
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                }`}
                aria-label="Delete note"
                size="sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your note and all its attachments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95"
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
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p
            className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}
          >
            {preview(note.content)}
          </p>
          <div className="mt-2">
            <span
              className={`text-[10px] font-medium ${active ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}
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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [compact, setCompact] = useState(false)

  // ── Attachments ────────────────────────────────────────────────────────────
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Lightbox ───────────────────────────────────────────────────────────────
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const imageAttachments = attachments.filter(
    (a) => isImage(a.mime_type) && !a.error
  )
  const fileAttachments = attachments.filter((a) => !isImage(a.mime_type))

  // ── Fetch attachments for a note (rehydrates on note switch / page refresh)
  const fetchAttachments = useCallback(async (noteId: string) => {
    setAttachmentsLoading(true)
    try {
      const res = await fetch(`/api/notes/${noteId}/attachments`)
      if (res.ok) {
        const data = await res.json()
        setAttachments(Array.isArray(data) ? data : [])
      }
    } catch {
      // Non-critical — show empty state silently
    } finally {
      setAttachmentsLoading(false)
    }
  }, [])

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !selectedNote) return

    for (const file of files) {
      const tempId = crypto.randomUUID()
      const objectUrl = URL.createObjectURL(file)

      // Optimistic chip
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

  // ── Remove attachment (optimistic + API) ───────────────────────────────────
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
          {
            method: "DELETE",
          }
        )
      } catch {
        // Best effort
      }
    }
  }

  // ── Notes CRUD ─────────────────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    const res = await fetch("/api/notes")
    if (res.ok) {
      const data = await res.json()
      setNotes(Array.isArray(data) ? data : (data.data ?? data.notes ?? []))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New note",
        content: "",
        user_id: "demo-user",
      }),
    })
    if (res.ok) {
      const created = await res.json()
      await fetchNotes()
      const newNote = created.data ?? created
      if (newNote?.id) {
        setSelectedNote(newNote)
        setTitle(newNote.title ?? "")
        setContent(newNote.content ?? "")
        setAttachments([])
      }
    }
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

  // Fetch attachments whenever we switch notes
  const selectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content ?? "")
    setAttachments([])
    fetchAttachments(note.id)
  }

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase()
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content ?? "").toLowerCase().includes(q)
    )
  })

  const currentTags = extractTags(content)
  const uploadedCount = attachments.filter(
    (a) => !a.error && !a.uploading
  ).length

  return (
    <>
      {/* Lightbox portal */}
      {lightboxIndex !== null && imageAttachments.length > 0 && (
        <Lightbox
          images={imageAttachments}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* ── Left panel ─────────────────────────────────────────────── */}
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-border/60 bg-muted/30">
          <div className="flex items-center justify-between px-5 pt-6 pb-3">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Notes
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCompact((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-95"
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
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-150 ease-out hover:opacity-90 hover:shadow-md active:scale-95"
                aria-label="New note"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <div className="h-full space-y-2 overflow-y-auto px-3 pb-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl bg-muted/60"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))
              ) : filtered.length === 0 ? (
                <p className="pt-8 text-center text-xs text-muted-foreground">
                  {search
                    ? "No notes match your search."
                    : "No notes yet — create one!"}
                </p>
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

        {/* ── Right panel ────────────────────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-hidden bg-card">
          {selectedNote ? (
            <>
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-8 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {timeAgo(
                      selectedNote.updated_at ?? selectedNote.created_at
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {saving && (
                    <span className="animate-pulse text-xs text-muted-foreground">
                      Saving…
                    </span>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your note and all its attachments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteNote(selectedNote.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex flex-1 flex-col overflow-y-auto px-10 py-6">
                {/* Title */}
                <input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note title"
                  className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
                />

                {/* Tags */}
                {currentTags.length > 0 && (
                  <div className="flex items-center gap-2 pt-3">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {currentTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 border-t border-border/60" />

                {/* Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={`Start writing…\n\nTip: use #tags to categorize your notes.`}
                  className="mt-5 min-h-[180px] w-full resize-none bg-transparent text-[15px] leading-[1.85] text-foreground outline-none placeholder:text-muted-foreground/40"
                />

                {/* ── Attachments loading skeleton ── */}
                {attachmentsLoading && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading attachments…
                  </div>
                )}

                {/* ── Image gallery ── */}
                {!attachmentsLoading && (
                  <ImageGallery
                    images={imageAttachments}
                    onRemove={removeAttachment}
                    onOpenLightbox={(i) => setLightboxIndex(i)}
                  />
                )}

                {/* ── File chips ── */}
                {!attachmentsLoading && fileAttachments.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                      <Paperclip className="h-3 w-3" />
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

                {/* ── Bottom toolbar ── */}
                <div className="mt-6 flex items-center gap-1 border-t border-border/40 pt-3">
                  {/* Hidden file input */}
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
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-95"
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
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-95"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Image
                  </button>

                  {uploadedCount > 0 && (
                    <span className="ml-auto text-[10px] text-muted-foreground/50">
                      {uploadedCount} attachment{uploadedCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
              <EmptyIllustration />
              <div>
                <p className="text-xl font-semibold text-foreground">
                  Write down your ideas
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select a note from the list, or create a new one.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {["#ideas", "#to-do's", "#morning"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                onClick={createNote}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 ease-out hover:opacity-90 hover:shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4" />
                New note
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
