"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Plus, Trash2, Search, FileText, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ─── Types ────────────────────────────────────────────────────────────────────

type Note = {
  id: string
  title: string
  content: string | null
  created_at?: string
  updated_at?: string
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

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note
  active: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

function NoteCard({ note, active, onClick, onDelete }: NoteCardProps) {
  const tags = extractTags(note.content)

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ease-out ${
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "border border-border/60 bg-card hover:bg-muted/40"
      } `}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`line-clamp-1 text-sm leading-snug font-semibold ${active ? "text-primary-foreground" : "text-foreground"}`}
        >
          {note.title || "Untitled"}
        </p>
        <button
          onClick={onDelete}
          className={`-mt-0.5 shrink-0 rounded-lg p-1 opacity-0 transition-all duration-150 group-hover:opacity-100 ${
            active
              ? "text-primary-foreground/70 hover:bg-primary-foreground/20"
              : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          } `}
          aria-label="Delete note"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${
                active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
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
    }
    fetchNotes()
  }

  const selectNote = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content ?? "")
  }

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase()
    return (
      n.title.toLowerCase().includes(q) ||
      (n.content ?? "").toLowerCase().includes(q)
    )
  })

  const currentTags = extractTags(content)

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ─────────────────────────────────────────────── */}
      <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-border/60 bg-muted/30">
        <div className="flex items-center justify-between px-5 pt-6 pb-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Notes
          </h1>

          <Button
            onClick={createNote}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-150 ease-out hover:opacity-90 hover:shadow-md active:scale-95"
            aria-label="New note"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        </div>

        <div className="px-4 pb-3">
          <div className="my-5 flex items-center gap-2 rounded-xl shadow-sm">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Scrollable area */}
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
            <div className="flex items-center justify-between border-b border-border/60 px-8 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {timeAgo(selectedNote.updated_at ?? selectedNote.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {saving && (
                  <span className="animate-pulse text-xs text-muted-foreground">
                    Saving…
                  </span>
                )}
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            <div className="px-10 pt-8">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note title"
                className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
              />
            </div>

            {currentTags.length > 0 && (
              <div className="flex items-center gap-2 px-10 pt-3">
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

            <div className="mx-10 mt-5 border-t border-border/60" />

            <div className="flex-1 overflow-y-auto px-10 py-5">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`Start writing…\n\nTip: use #tags to categorize your notes.`}
                className="h-full min-h-[400px] w-full resize-none bg-transparent text-[15px] leading-[1.85] text-foreground outline-none placeholder:text-muted-foreground/40"
              />
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
  )
}
