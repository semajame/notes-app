import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@/supabase/server"

// GET single note
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

// UPDATE note
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // ✅ FIX: unwrap params
  const { id } = await params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!id) {
    return NextResponse.json({ error: "Missing folder id" }, { status: 400 })
  }

  const body = await req.json()
  const { name } = body

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Folder name is required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("folders")
    .update({
      name: name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Folder update error:", error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE folder
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 1. Move notes out of folder (IMPORTANT)
  const { error: updateError } = await supabase
    .from("notes")
    .update({ folder_id: null })
    .eq("folder_id", id)
    .eq("user_id", user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // 2. Delete folder
  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
