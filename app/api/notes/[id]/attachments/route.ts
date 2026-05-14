// app/api/notes/[id]/attachments/route.ts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/supabase/server"

const BUCKET = "note-attachments"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storagePath(userId: string, noteId: string, filename: string) {
  // Sanitise filename: strip path traversal characters
  const safe = filename.replace(/[^a-zA-Z0-9._\-() ]/g, "_")
  return `${userId}/${noteId}/${Date.now()}_${safe}`
}

// ─── GET /api/notes/[id]/attachments ─────────────────────────────────────────
// Returns all attachments for a note, with fresh signed URLs.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: noteId } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: rows, error } = await supabase
    .from("note_attachments")
    .select("*")
    .eq("note_id", noteId)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[GET attachments]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate fresh signed URLs (valid 1 hour) for each attachment
  const withUrls = await Promise.all(
    (rows ?? []).map(async (row) => {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(row.storage_path, 60 * 60) // 1 hour

      return { ...row, url: signed?.signedUrl ?? null }
    })
  )

  return NextResponse.json(withUrls)
}

// ─── POST /api/notes/[id]/attachments ────────────────────────────────────────
// Accepts multipart/form-data with a "file" field.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: noteId } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Parse the multipart form
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file")
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // 50 MB guard (matches bucket setting)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 50 MB)" },
      { status: 413 }
    )
  }

  // Verify the note belongs to this user before attaching
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("id")
    .eq("id", noteId)
    .eq("user_id", session.user.id)
    .single()

  if (noteError || !note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const path = storagePath(session.user.id, noteId, file.name)
  const arrayBuffer = await file.arrayBuffer()

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

  if (uploadError) {
    console.error("[POST attachments] storage upload failed:", uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Generate a 1-hour signed URL for the client to use immediately
  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60)

  // Insert metadata row
  const { data: attachment, error: insertError } = await supabase
    .from("note_attachments")
    .insert({
      note_id: noteId,
      user_id: session.user.id,
      name: file.name,
      size: file.size,
      mime_type: file.type || "application/octet-stream",
      storage_path: path,
      url: signed?.signedUrl ?? null,
    })
    .select()
    .single()

  if (insertError) {
    // Best-effort: clean up the uploaded file so storage doesn't orphan
    await supabase.storage.from(BUCKET).remove([path])
    console.error("[POST attachments] DB insert failed:", insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(
    { ...attachment, url: signed?.signedUrl ?? null },
    { status: 201 }
  )
}

// ─── DELETE /api/notes/[id]/attachments?attachmentId=... ─────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: noteId } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const attachmentId = req.nextUrl.searchParams.get("attachmentId")
  if (!attachmentId) {
    return NextResponse.json(
      { error: "attachmentId is required" },
      { status: 400 }
    )
  }

  // Fetch the row first so we have the storage_path and can verify ownership
  const { data: row, error: fetchError } = await supabase
    .from("note_attachments")
    .select("storage_path")
    .eq("id", attachmentId)
    .eq("note_id", noteId)
    .eq("user_id", session.user.id)
    .single()

  if (fetchError || !row) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
  }

  // Delete from storage first
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([row.storage_path])

  if (storageError) {
    console.error("[DELETE attachments] storage remove failed:", storageError)
    // Continue — still remove the DB row so the UI isn't stuck
  }

  // Delete metadata row
  const { error: deleteError } = await supabase
    .from("note_attachments")
    .delete()
    .eq("id", attachmentId)
    .eq("user_id", session.user.id)

  if (deleteError) {
    console.error("[DELETE attachments] DB delete failed:", deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
