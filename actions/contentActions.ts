"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addContent(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!title) return { error: "Judul tidak boleh kosong." };
  const { error } = await supabase.from("content").insert([
    {
      title,
      body,
      status: "published",
      published_at: new Date().toISOString(),
    },
  ]);
  if (error) return { error: "Gagal menambahkan konten." };
  revalidatePath("/admin/content");
  return { success: true };
}

export async function editContent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!id || !title) return { error: "Data tidak lengkap." };
  const { error } = await supabase
    .from("content")
    .update({ title, body })
    .eq("id", id);
  if (error) return { error: "Gagal mengedit konten." };
  revalidatePath("/admin/content");
  return { success: true };
}

export async function deleteContent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  if (!id) return { error: "ID konten tidak ditemukan." };
  const { error } = await supabase.from("content").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus konten." };
  revalidatePath("/admin/content");
  return { success: true };
}
