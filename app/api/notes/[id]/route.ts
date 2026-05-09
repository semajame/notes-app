import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

// GET single note
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// UPDATE note
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const body = await req.json();

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: body.title,
      content: body.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE note
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const { error } = await supabase.from("notes").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
