// file: actions/classActions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClassSchema = z.object({
  name: z.string().min(1, "Nama kelas tidak boleh kosong."),
  teacher_id: z.string().uuid().nullable().optional(),
});

// =================================================================
// ACTION: Tambah Kelas Baru
// =================================================================
export async function addClass(formData: FormData) {
  console.log("--- 🚀 ACTION: addClass ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const validatedFields = ClassSchema.safeParse({
    name: rawFormData.name,
    teacher_id: rawFormData.teacher_id || null,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { name, teacher_id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("classes")
    .insert({ name, teacher_id: teacher_id || null });

  if (error) {
    console.error("[❌ GAGAL] Supabase Insert Error:", error);
    return { error: `Gagal membuat kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  console.log("[3/3] ✅ SUKSES: Kelas dibuat dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Edit Kelas
// =================================================================
export async function editClass(formData: FormData) {
  console.log("--- 🚀 ACTION: editClass ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const EditSchema = ClassSchema.extend({
    id: z.coerce.number().positive("ID Kelas tidak valid."),
  });

  const validatedFields = EditSchema.safeParse({
    ...rawFormData,
    teacher_id: rawFormData.teacher_id || null,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return { error: "Data yang dikirim tidak valid." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id, name, teacher_id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("classes")
    .update({ name, teacher_id: teacher_id || null })
    .eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: `Gagal mengedit kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  console.log("[3/3] ✅ SUKSES: Kelas diedit dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Hapus Kelas
// =================================================================
export async function deleteClass(formData: FormData) {
  console.log("--- 🚀 ACTION: deleteClass ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const DeleteSchema = z.object({
    id: z.coerce.number().positive("ID Kelas tidak valid."),
  });

  const validatedFields = DeleteSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return { error: "ID Kelas tidak ditemukan." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Delete Error:", error);
    return { error: `Gagal menghapus kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  console.log("[3/3] ✅ SUKSES: Kelas dihapus dan path direvalidasi.");
  return { success: true };
}
