import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/client";
import { create } from "domain";

export async function POST(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  // 📤 upload to storage
  const { error: uploadError } = await supabase.storage
    .from("files")
    .upload(filePath, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // 🔗 public URL
  const { data } = supabase.storage.from("files").getPublicUrl(filePath);

  // 💾 save metadata
  const { data: fileRecord, error } = await supabase
    .from("files")
    .insert([
      {
        user_id: user.id,
        name: file.name,
        file_url: data.publicUrl,
        file_type: file.type,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(fileRecord);
}

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
