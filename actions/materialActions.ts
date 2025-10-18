"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

// Skema untuk membuat materi (Create)
const MaterialSchema = z.object({
  title: z.string().min(3, "Judul materi minimal 3 karakter."),
  content: z.string().optional(),
  status: z.enum(["visible", "hidden"]),
  scheduled_for: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid.",
  }),
  class_id: z.coerce.number().positive("Anda harus memilih kelas."),
  attachment: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // Maksimal 5MB
      "Ukuran file maksimal 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "Format file tidak didukung. Harap unggah gambar atau dokumen."
    ),
});

// Skema untuk mengedit materi (Update), sama seperti Create tapi ada ID
const EditMaterialSchema = MaterialSchema.extend({
  id: z.coerce.number().positive("ID Materi tidak valid."),
});

export async function createMaterial(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = MaterialSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status"),
    scheduled_for: formData.get("scheduled_for"),
    class_id: formData.get("class_id"),
    attachment: formData.get("attachment"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  const { title, content, status, scheduled_for, class_id, attachment } =
    validatedFields.data;

  const { data: materialData, error: insertError } = await supabase
    .from("materials")
    .insert([{ title, content, status, scheduled_for, class_id }])
    .select("id")
    .single();

  if (insertError) {
    console.error("Create Material Error:", insertError);
    return { error: "Gagal membuat entri materi." };
  }

  const materialId = materialData.id;

  if (attachment && attachment.size > 0) {
    const cleanName = attachment.name.replace(/[^a-zA-Z0-9 ._-]/g, "");
    const fileExt = cleanName.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${materialId}/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("material-attachments")
      .upload(filePath, attachment);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return { error: "Gagal mengunggah file lampiran." };
    }

    const { error: updateError } = await supabase
      .from("materials")
      .update({ attachments: [{ path: filePath, name: attachment.name }] })
      .eq("id", materialId);

    if (updateError) {
      console.error("Update Path Error:", updateError);
      return { error: "Gagal menautkan file ke materi." };
    }
  }

  revalidatePath("/admin/manajemen-materi");
  return { success: "Materi berhasil dibuat!" };
}

// =================================================================
// FUNGSI BARU: EDIT MATERI
// =================================================================
export async function editMaterial(formData: FormData) {
  // Logika edit sedikit lebih kompleks karena harus menangani file lama
  // Untuk saat ini, kita buat fungsi update data teksnya dulu.
  // Logika hapus file lama bisa ditambahkan jika diperlukan.

  const supabase = await createClient();

  const validatedFields = EditMaterialSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status"),
    scheduled_for: formData.get("scheduled_for"),
    class_id: formData.get("class_id"),
    // attachment: formData.get("attachment"), // Kita tangani file secara terpisah
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  const { id, title, content, status, scheduled_for, class_id } =
    validatedFields.data;

  const { error } = await supabase
    .from("materials")
    .update({ title, content, status, scheduled_for, class_id })
    .eq("id", id);

  if (error) {
    console.error("Edit Material Error:", error);
    return { error: "Gagal memperbarui materi." };
  }

  revalidatePath("/admin/manajemen-materi");
  revalidatePath(`/siswa/materi/${id}`); // Revalidate halaman detail siswa juga
  return { success: "Materi berhasil diperbarui!" };
}

// =================================================================
// FUNGSI BARU: HAPUS MATERI
// =================================================================
export async function deleteMaterial(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id");

  if (!id) {
    return { error: "ID Materi tidak ditemukan." };
  }

  // 1. Ambil data materi untuk mendapatkan path file lampiran (jika ada)
  const { data: material, error: fetchError } = await supabase
    .from("materials")
    .select("attachments")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Fetch before delete error:", fetchError);
    return { error: "Gagal mendapatkan data materi sebelum menghapus." };
  }

  // 2. Hapus file dari Supabase Storage jika ada
  if (material?.attachments && material.attachments.length > 0) {
    const filePaths = material.attachments.map((file: any) => file.path);
    const { error: storageError } = await supabase.storage
      .from("material-attachments")
      .remove(filePaths);

    if (storageError) {
      console.error("Storage Delete Error:", storageError);
    }
  }

  // 3. Hapus data materi dari tabel database
  const { error: deleteError } = await supabase
    .from("materials")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Delete Material Error:", deleteError);
    return { error: "Gagal menghapus materi dari database." };
  }

  revalidatePath("/admin/manajemen-materi");
  return { success: "Materi berhasil dihapus." };
}
