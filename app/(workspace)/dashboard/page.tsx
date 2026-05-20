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
import { SupabaseClient } from "@supabase/supabase-js"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Note {
  id: string
  title: string
  content?: string
  created_at: string
  updated_at?: string
}

interface Folder {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

interface Whiteboard {
  id: string
  title: string
  created_at: string
  updated_at?: string
}

interface DashboardData {
  notes: Note[]
  folders: Folder[]
  whiteboards: Whiteboard[]

  notesError: string | null
  foldersError: string | null
  whiteboardsError: string | null
}

// ─── Data Fetching ─────────────────────────────────────────────────────────────
async function getDashboardData(
  supabase: SupabaseClient
): Promise<DashboardData> {
  const [
    { data: notes, error: notesError },
    { data: folders, error: foldersError },
    { data: whiteboards, error: whiteboardsError },
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("whiteboards")
      .select("id,title,created_at,updated_at")
      .order("updated_at", { ascending: false }),
  ])

  return {
    notes: notes ?? [],
    folders: folders ?? [],
    whiteboards: whiteboards ?? [],
    notesError: notesError?.message ?? null,
    foldersError: foldersError?.message ?? null,
    whiteboardsError: whiteboardsError?.message ?? null,
  }
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

  const dashboardData = await getDashboardData(supabase)

  console.log("Rendering Dashboard with data:", dashboardData)

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
