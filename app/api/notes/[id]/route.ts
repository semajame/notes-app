import { NextResponse } from "next/server"
import { createClient } from "@/supabase/server"

// GET single note
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const id = await params.then((p) => p.id)

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// UPDATE note
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: body.title,
      content: body.content,
      folder_id: "folder_id" in body ? body.folder_id : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE note
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase.from("notes").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
