"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContentStatusSchema = z.enum(["draft", "published", "hidden"]);

const ContentSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong."),
  body: z.string().optional(),
  status: ContentStatusSchema,
});

const EditContentSchema = ContentSchema.extend({
  id: z.coerce.number().int().positive("ID Konten tidak valid."),
});

export async function addContent(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = ContentSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body") || undefined,
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data konten tidak valid." };
  }

  const { title, body, status } = validatedFields.data;

  const published_at = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("content").insert([
    {
      title,
      body,
      status,
      published_at,
    },
  ]);

  if (error) {
    console.error("Add Content Error:", error);
    return { error: "Gagal menambahkan konten." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  return { success: "Konten baru berhasil dibuat!" };
}

export async function editContent(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = EditContentSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    body: formData.get("body") || undefined,
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data konten tidak valid." };
  }

  const { id, title, body, status } = validatedFields.data;

  // Tentukan published_at berdasarkan status
  // Hanya set published_at jika status berubah menjadi 'published' dan belum ada sebelumnya
  // Atau biarkan null jika status bukan 'published'
  // Logika ini mungkin perlu disesuaikan tergantung aturan bisnis Anda
  // Untuk simple update:
  const updateData: {
    title: string;
    body?: string;
    status: "draft" | "published" | "hidden";
    published_at?: string | null;
  } = {
    title,
    status,
  };
  if (body) {
    updateData.body = body;
  }
  if (status === "published") {
    updateData.published_at = new Date().toISOString();
  } else {
    updateData.published_at = null;
  }

  const { error } = await supabase
    .from("content")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Edit Content Error:", error);
    return { error: "Gagal mengedit konten." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  return { success: "Konten berhasil diperbarui!" };
}

export async function deleteContent(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const DeleteSchema = z.object({
    id: z.coerce.number().int().positive("ID Konten tidak valid."),
  });
  const validatedFields = DeleteSchema.safeParse({ id });

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.id?.[0] ||
        "ID Konten tidak valid.",
    };
  }

  const validatedId = validatedFields.data.id;

  if (!validatedId) return { error: "ID konten tidak ditemukan." };

  const { error } = await supabase
    .from("content")
    .delete()
    .eq("id", validatedId);

  if (error) {
    console.error("Delete Content Error:", error);
    return { error: "Gagal menghapus konten." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  return { success: "Konten berhasil dihapus." };
}
