// file: actions/contentActions.ts

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

// =================================================================
// ACTION: Tambah Konten Baru
// =================================================================
export async function addContent(formData: FormData) {
  console.log("--- 🚀 ACTION: addContent ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", {
    ...rawFormData,
    body: "[DIREDAKSI]",
  });

  const validatedFields = ContentSchema.safeParse({
    title: rawFormData.title,
    body: rawFormData.body || undefined,
    status: rawFormData.status,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data konten tidak valid." };
  }

  console.log("[2/4] Validasi Zod Berhasil:", validatedFields.data);
  const { title, body, status } = validatedFields.data;
  const published_at = status === "published" ? new Date().toISOString() : null;
  console.log(
    `[2.5/4] Status diatur ke '${status}', published_at menjadi: ${published_at}`
  );

  const supabase = await createClient();
  const { error } = await supabase
    .from("content")
    .insert([{ title, body, status, published_at }]);

  if (error) {
    console.error("[❌ GAGAL] Supabase Insert Error:", error);
    return { error: "Gagal menambahkan konten." };
  }

  console.log("[3/4] Konten berhasil ditambahkan ke database.");
  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  console.log("[4/4] ✅ SUKSES: Konten dibuat dan path direvalidasi.");
  return { success: "Konten baru berhasil dibuat!" };
}

// =================================================================
// ACTION: Edit Konten
// =================================================================
export async function editContent(formData: FormData) {
  console.log("--- 🚀 ACTION: editContent ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", {
    ...rawFormData,
    body: "[DIREDAKSI]",
  });

  const supabase = await createClient();

  const validatedFields = EditContentSchema.safeParse({
    ...rawFormData,
    body: rawFormData.body || undefined,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data konten tidak valid." };
  }

  console.log("[2/4] Validasi Zod Berhasil:", validatedFields.data);
  const { id, title, body, status } = validatedFields.data;

  const published_at = status === "published" ? new Date().toISOString() : null;
  const updateData = { title, body, status, published_at };
  console.log(`[2.5/4] Menyiapkan data update:`, updateData);

  const { error } = await supabase
    .from("content")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: "Gagal mengedit konten." };
  }

  console.log("[3/4] Konten berhasil diupdate di database.");
  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  console.log("[4/4] ✅ SUKSES: Konten diedit dan path direvalidasi.");
  return { success: "Konten berhasil diperbarui!" };
}

// =================================================================
// ACTION: Hapus Konten
// =================================================================
export async function deleteContent(formData: FormData) {
  console.log("--- 🚀 ACTION: deleteContent ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const supabase = await createClient();

  const DeleteSchema = z.object({
    id: z.coerce.number().int().positive("ID Konten tidak valid."),
  });
  const validatedFields = DeleteSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return {
      error:
        validatedFields.error.flatten().fieldErrors.id?.[0] ||
        "ID Konten tidak valid.",
    };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id } = validatedFields.data;

  const { error } = await supabase.from("content").delete().eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Delete Error:", error);
    return { error: "Gagal menghapus konten." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/(site)/aktivitas-kami");
  revalidatePath("/siswa/dashboard");
  console.log("[3/3] ✅ SUKSES: Konten dihapus dan path direvalidasi.");
  return { success: "Konten berhasil dihapus." };
}
