import { NextResponse } from "next/server"
import { createClient } from "@/supabase/server"

// GET all notes
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// CREATE note
export async function POST(req: Request) {
  const supabase = await createClient()

  // get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const title = body.title?.trim() || "Untitled"
  const content = body.content || ""
  const folder_id = body.folder_id ?? null

  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        title,
        content,
        user_id: user.id, // secure (server-controlled)
        folder_id, // ✅ added
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
