"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Action untuk membuat kelas baru
export async function addClass(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const teacher_id = formData.get("teacher_id") as string;

  if (!name) {
    return { error: "Nama kelas tidak boleh kosong." };
  }

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

// Action untuk mengedit kelas (misal, ganti wali kelas)
export async function editClass(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const teacher_id = formData.get("teacher_id") as string;

  if (!id || !name) {
    return { error: "Data tidak lengkap." };
  }

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
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return { error: "ID Kelas tidak ditemukan." };

  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) {
    console.error("Delete Class Error:", error);
    return { error: `Gagal menghapus kelas: ${error.message}` };
  }

  revalidatePath("/admin/classes");
  return { success: true };
}
