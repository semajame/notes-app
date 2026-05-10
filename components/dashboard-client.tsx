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

interface FileItem {
  id: string
  name: string
  size?: number
  type?: string
  created_at: string
  updated_at?: string
}

interface Props {
  notes: Note[]
  files: FileItem[]
  notesError: string | null
  filesError: string | null
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

  // Build last 6 months
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

function totalSize(files: FileItem[]) {
  const bytes = files.reduce((sum, f) => sum + (f.size ?? 0), 0)
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }
  return `${val.toFixed(1)} ${units[i]}`
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
}

function StatCard({ label, value, sub, positive, icon }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm transition-shadow duration-200 ease-out hover:shadow-md">
      {/* subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-muted/20" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {sub && (
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                positive === true
                  ? "text-emerald-500"
                  : positive === false
                    ? "text-rose-500"
                    : "text-muted-foreground"
              }`}
            >
              {positive === true && <TrendingUp className="h-3 w-3" />}
              {positive === false && <TrendingDown className="h-3 w-3" />}
              {sub}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-150 group-hover:bg-primary/15">
          {icon}
        </div>
      </div>
    </div>
  )
}

interface ErrorBannerProps {
  message: string
}
function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
      ⚠ {message}
    </div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">
        {payload[0].value} {payload[0].name}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardClient({
  notes,
  files,
  notesError,
  filesError,
}: Props) {
  const notesByMonth = useMemo(() => groupByMonth(notes), [notes])
  const filesByDay = useMemo(() => groupByDay(files), [files])
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

  const recentFiles = useMemo(
    () =>
      [...files]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 8),
    [files]
  )

  // Week-over-week change for notes (this week vs previous)
  const notesThisWeek = useMemo(() => createdThisWeek(notes), [notes])
  const notesToday = useMemo(() => createdToday(notes), [notes])
  const filesToday = useMemo(() => createdToday(files), [files])
  const storage = useMemo(() => totalSize(files), [files])

  // Last updated timestamps
  const lastNoteTime = useMemo(() => {
    if (!notes.length) return null
    return notes.reduce((latest, n) =>
      new Date(n.updated_at ?? n.created_at) >
      new Date(latest.updated_at ?? latest.created_at)
        ? n
        : latest
    )
  }, [notes])

  const lastFileTime = useMemo(() => {
    if (!files.length) return null
    return files.reduce((latest, f) =>
      new Date(f.updated_at ?? f.created_at) >
      new Date(latest.updated_at ?? latest.created_at)
        ? f
        : latest
    )
  }, [files])

  return (
    <div className="space-y-6">
      {/* ── Error banners ──────────────────────────────────────────── */}
      {notesError && <ErrorBanner message={notesError} />}
      {filesError && <ErrorBanner message={filesError} />}

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        style={{ animationFillMode: "both" }}
      >
        {[
          {
            label: "Total Notes",
            value: notes.length.toLocaleString(),
            sub: `${notesToday} created today`,
            positive: notesToday > 0 ? true : null,
            icon: <FileText className="h-5 w-5" />,
          },
          {
            label: "Total Files",
            value: files.length.toLocaleString(),
            sub: `${filesToday} uploaded today`,
            positive: filesToday > 0 ? true : null,
            icon: <FolderOpen className="h-5 w-5" />,
          },
          {
            label: "This Week",
            value: notesThisWeek,
            sub: "notes created",
            positive: notesThisWeek > 0 ? true : null,
            icon: <TrendingUp className="h-5 w-5" />,
          },
          {
            label: "Storage Used",
            value: storage,
            sub: `across ${files.length} files`,
            positive: null,
            icon: <HardDrive className="h-5 w-5" />,
          },
        ].map((card, i) => (
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

      {/* ── Charts row ──────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Notes by month — bar */}
        <div
          className="animate-in rounded-2xl border border-border/60 bg-card p-5 shadow-sm fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: "240ms",
            animationDuration: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-sm font-semibold text-foreground">Notes Created</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 6 months</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={notesByMonth} barSize={18}>
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                />
                <Bar
                  dataKey="count"
                  name="notes"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {lastNoteTime && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              updated{" "}
              {formatRelative(
                lastNoteTime.updated_at ?? lastNoteTime.created_at
              )}
            </p>
          )}
        </div>

        {/* Files by day — line */}
        <div
          className="animate-in rounded-2xl border border-border/60 bg-card p-5 shadow-sm fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: "300ms",
            animationDuration: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-sm font-semibold text-foreground">File Uploads</p>
          <p className="mt-0.5 text-xs text-muted-foreground">By day of week</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filesByDay}>
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="files"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {lastFileTime && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              updated{" "}
              {formatRelative(
                lastFileTime.updated_at ?? lastFileTime.created_at
              )}
            </p>
          )}
        </div>

        {/* Notes activity by day — line */}
        <div
          className="animate-in rounded-2xl border border-border/60 bg-card p-5 shadow-sm fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: "360ms",
            animationDuration: "300ms",
            animationFillMode: "both",
          }}
        >
          <p className="text-sm font-semibold text-foreground">Note Activity</p>
          <p className="mt-0.5 text-xs text-muted-foreground">By day of week</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={notesByDay}>
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Just Updated
          </p>
        </div>
      </div>

      {/* ── Recent activity tables ───────────────────────────────────── */}
      <div
        className="grid animate-in gap-4 fade-in slide-in-from-bottom-2 lg:grid-cols-2"
        style={{
          animationDelay: "420ms",
          animationDuration: "300ms",
          animationFillMode: "both",
        }}
      >
        {/* Recent Notes */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Recent Notes
              </p>
              <p className="text-xs text-muted-foreground">Latest activity</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {notes.length}
            </span>
          </div>

          {notesError ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              Failed to load notes.
            </p>
          ) : recentNotes.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              No notes yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {recentNotes.map((note, i) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors duration-150 hover:bg-muted/30"
                  style={{ animationDelay: `${420 + i * 40}ms` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="truncate text-sm font-medium text-foreground">
                      {note.title || "Untitled"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(note.updated_at ?? note.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Files */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Recent Files
              </p>
              <p className="text-xs text-muted-foreground">Latest uploads</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {files.length}
            </span>
          </div>

          {filesError ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              Failed to load files.
            </p>
          ) : recentFiles.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              No files yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {recentFiles.map((file, i) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors duration-150 hover:bg-muted/30"
                  style={{ animationDelay: `${420 + i * 40}ms` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FolderOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name || "Unnamed file"}
                      </p>
                      {file.size != null && (
                        <p className="text-xs text-muted-foreground">
                          {totalSize([file])}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(file.updated_at ?? file.created_at)}
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
