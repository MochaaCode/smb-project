"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClassSchema = z.object({
  name: z.string().min(1, "Nama kelas tidak boleh kosong."),
  // UUID bersifat opsional, bisa string kosong atau UUID
  teacher_id: z.string().uuid().nullable().optional(),
});

// Action untuk membuat kelas baru
export async function addClass(formData: FormData) {
  const validatedFields = ClassSchema.safeParse({
    name: formData.get("name"),
    teacher_id: formData.get("teacher_id") || null,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  const { name, teacher_id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("classes")
    .insert({ name, teacher_id: teacher_id || null });

  if (error) {
    console.error("Add Class Error:", error);
    return { error: `Gagal membuat kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  return { success: true };
}

// Action untuk mengedit kelas
export async function editClass(formData: FormData) {
  const EditSchema = ClassSchema.extend({
    id: z.coerce.number().positive("ID Kelas tidak valid."),
  });

  const validatedFields = EditSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    teacher_id: formData.get("teacher_id") || null,
  });

  if (!validatedFields.success) {
    return { error: "Data yang dikirim tidak valid." };
  }

  const { id, name, teacher_id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("classes")
    .update({ name, teacher_id: teacher_id || null })
    .eq("id", id);

  if (error) {
    console.error("Edit Class Error:", error);
    return { error: `Gagal mengedit kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  return { success: true };
}

// Action untuk menghapus kelas
export async function deleteClass(formData: FormData) {
  const DeleteSchema = z.object({
    id: z.coerce.number().positive("ID Kelas tidak valid."),
  });

  const validatedFields = DeleteSchema.safeParse({ id: formData.get("id") });

  if (!validatedFields.success) {
    return { error: "ID Kelas tidak ditemukan." };
  }

  const { id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) {
    console.error("Delete Class Error:", error);
    return { error: `Gagal menghapus kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  return { success: true };
}
