import { redirect } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

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

interface DashboardData {
  notes: Note[]
  files: FileItem[]
  notesError: string | null
  filesError: string | null
}

// ─── Data Fetching ─────────────────────────────────────────────────────────────

async function getDashboardData(): Promise<DashboardData> {
  // Use absolute URL for server-side fetch. Adjust base URL via env if needed.
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")

  const [notesRes, filesRes] = await Promise.allSettled([
    fetch(`${base}/api/notes`, { cache: "no-store" }),
    fetch(`${base}/api/files`, { cache: "no-store" }),
  ])

  let notes: Note[] = []
  let files: FileItem[] = []
  let notesError: string | null = null
  let filesError: string | null = null

  if (notesRes.status === "fulfilled" && notesRes.value.ok) {
    try {
      const json = await notesRes.value.json()
      // Support both { data: [] } and [] shapes
      notes = Array.isArray(json) ? json : (json.data ?? json.notes ?? [])
    } catch {
      notesError = "Failed to parse notes response"
    }
  } else {
    notesError =
      notesRes.status === "rejected"
        ? "Failed to reach /api/notes"
        : `Notes API error ${notesRes.value.status}`
  }

  if (filesRes.status === "fulfilled" && filesRes.value.ok) {
    try {
      const json = await filesRes.value.json()
      files = Array.isArray(json) ? json : (json.data ?? json.files ?? [])
    } catch {
      filesError = "Failed to parse files response"
    }
  } else {
    filesError =
      filesRes.status === "rejected"
        ? "Failed to reach /api/files"
        : `Files API error ${filesRes.value.status}`
  }

  console.log("Dashboard Data:", { notes, files, notesError, filesError })

  return { notes, files, notesError, filesError }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    redirect("/login")
  }

  const dashboardData = await getDashboardData()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator
            orientation="vertical"
            className="me-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Overview</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardClient {...dashboardData} />
      </div>
    </>
  )
}
