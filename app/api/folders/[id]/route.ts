import { NextResponse } from "next/server"
import { createClient } from "@/supabase/server"

// GET single note
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  // Get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
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

// DELETE note
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  // Get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get attachment paths before deleting
  const { data: attachments } = await supabase
    .from("note_attachments")
    .select("storage_path")
    .eq("note_id", params.id)
    .eq("user_id", user.id)

  // Delete note
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Cleanup storage
  const paths = attachments?.map((a) => a.storage_path).filter(Boolean) ?? []

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("attachments")
      .remove(paths)

    if (storageError) {
      console.warn("Storage cleanup error:", storageError.message)
    }
  }

  return new NextResponse(null, { status: 204 })
}
