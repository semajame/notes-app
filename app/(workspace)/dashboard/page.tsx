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
async function getDashboardData(
  supabase: SupabaseClient
): Promise<DashboardData> {
  const [
    { data: notes, error: notesError },
    { data: files, error: filesError },
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false }),
  ])

  return {
    notes: notes ?? [],
    files: files ?? [],
    notesError: notesError?.message ?? null,
    filesError: filesError?.message ?? null,
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
