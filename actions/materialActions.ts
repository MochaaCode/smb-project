// file: actions/materialActions.ts

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
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MaterialSchema = z.object({
  title: z.string().min(3, "Judul materi minimal 3 karakter."),
  content: z.string().optional(),
  status: z.enum(["visible", "hidden"]),
  scheduled_for: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid.",
    }),
  class_id: z.coerce.number().positive("Anda harus memilih kelas."),
  attachment: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Ukuran file maksimal 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      "Format file tidak didukung."
    ),
});

const EditMaterialSchema = MaterialSchema.extend({
  id: z.coerce.number().positive("ID Materi tidak valid."),
});

// =================================================================
// ACTION: Buat Materi Baru
// =================================================================
export async function createMaterial(formData: FormData) {
  console.log("--- 🚀 ACTION: createMaterial ---");
  const rawFormData = Object.fromEntries(formData.entries());
  const attachmentFile = rawFormData.attachment as File;
  console.log("[1/5] Menerima FormData:", {
    ...rawFormData,
    content: "[DIREDAKSI]",
    attachment: attachmentFile?.name,
  });

  const validatedFields = MaterialSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  console.log("[2/5] Validasi Zod Berhasil:", {
    ...validatedFields.data,
    attachment: validatedFields.data.attachment?.name,
  });
  const { title, content, status, scheduled_for, class_id, attachment } =
    validatedFields.data;

  const supabase = await createClient();
  const { data: materialData, error: insertError } = await supabase
    .from("materials")
    .insert([{ title, content, status, scheduled_for, class_id }])
    .select("id")
    .single();

  if (insertError) {
    console.error("[❌ GAGAL] Supabase Insert Error:", insertError);
    return { error: "Gagal membuat entri materi." };
  }

  console.log("[3/5] Entri materi berhasil dibuat, ID:", materialData.id);
  const materialId = materialData.id;

  if (attachment && attachment.size > 0) {
    console.log("[4/5] File lampiran ditemukan, memulai proses upload...");
    const cleanName = attachment.name.replace(/[^a-zA-Z0-9 ._-]/g, "");
    const fileExt = cleanName.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${materialId}/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("material-attachments")
      .upload(filePath, attachment);

    if (uploadError) {
      console.error("[❌ GAGAL] Supabase Storage Upload Error:", uploadError);
      return { error: "Gagal mengunggah file lampiran." };
    }
    console.log("  -> File berhasil diunggah ke path:", filePath);

    const { error: updateError } = await supabase
      .from("materials")
      .update({ attachments: [{ path: filePath, name: attachment.name }] })
      .eq("id", materialId);

    if (updateError) {
      console.error("[❌ GAGAL] Gagal update path lampiran:", updateError);
      return { error: "Gagal menautkan file ke materi." };
    }
    console.log("  -> Path lampiran berhasil ditautkan ke materi.");
  } else {
    console.log("[4/5] Tidak ada file lampiran untuk diunggah.");
  }

  revalidatePath("/admin/manajemen-materi");
  console.log("[5/5] ✅ SUKSES: Materi dibuat dan path direvalidasi.");
  return { success: "Materi berhasil dibuat!" };
}

// =================================================================
// ACTION: Edit Materi
// =================================================================
export async function editMaterial(formData: FormData) {
  console.log("--- 🚀 ACTION: editMaterial ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", {
    ...rawFormData,
    content: "[DIREDAKSI]",
  });

  const supabase = await createClient();
  const validatedFields = EditMaterialSchema.safeParse({
    ...rawFormData,
    attachment: undefined, // Hapus attachment dari validasi utama
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id, title, content, status, scheduled_for, class_id } =
    validatedFields.data;

  const { error } = await supabase
    .from("materials")
    .update({ title, content, status, scheduled_for, class_id })
    .eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: "Gagal memperbarui materi." };
  }

  revalidatePath("/admin/manajemen-materi");
  revalidatePath(`/siswa/materi/${id}`);
  console.log("[3/3] ✅ SUKSES: Materi diupdate dan path direvalidasi.");
  return { success: "Materi berhasil diperbarui!" };
}

// =================================================================
// ACTION: Hapus Materi
// =================================================================
export async function deleteMaterial(formData: FormData) {
  console.log("--- 🚀 ACTION: deleteMaterial ---");
  const id = formData.get("id");
  console.log("[1/5] Menerima ID materi untuk dihapus:", id);

  if (!id) return { error: "ID Materi tidak ditemukan." };

  const supabase = await createClient();
  const { data: material, error: fetchError } = await supabase
    .from("materials")
    .select("attachments")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("[❌ GAGAL] Gagal fetch materi sebelum hapus:", fetchError);
    return { error: "Gagal mendapatkan data materi sebelum menghapus." };
  }
  console.log("[2/5] Data materi ditemukan:", material);

  if (material?.attachments && material.attachments.length > 0) {
    console.log("[3/5] Lampiran ditemukan, mencoba menghapus dari Storage...");
    const filePaths = material.attachments.map((file: any) => file.path);
    const { error: storageError } = await supabase.storage
      .from("material-attachments")
      .remove(filePaths);

    if (storageError) {
      // Jangan hentikan proses, cukup catat errornya saja.
      console.warn(
        "[⚠️ PERINGATAN] Gagal hapus file di Storage:",
        storageError
      );
    } else {
      console.log("  -> File dari Storage berhasil dihapus.");
    }
  } else {
    console.log("[3/5] Tidak ada lampiran untuk dihapus dari Storage.");
  }

  const { error: deleteError } = await supabase
    .from("materials")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("[❌ GAGAL] Gagal hapus materi dari database:", deleteError);
    return { error: "Gagal menghapus materi dari database." };
  }
  console.log("[4/5] Materi berhasil dihapus dari database.");

  revalidatePath("/admin/manajemen-materi");
  console.log("[5/5] ✅ SUKSES: Materi dihapus dan path direvalidasi.");
  return { success: "Materi berhasil dihapus." };
}
