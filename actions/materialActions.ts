"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
      (file) => !file || file.size <= 20 * 1024 * 1024,
      "Ukuran file maksimal 20MB."
    ),
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
    const fileExt = attachment.name.split(".").pop();
    const filePath = `${materialId}/attachment.${fileExt}`; // e.g., '12/attachment.pdf'

    const { error: uploadError } = await supabase.storage
      .from("material-attachments")
      .upload(filePath, attachment, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return { error: "Gagal mengunggah file lampiran." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("material-attachments")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("materials")
      .update({ attachments: [{ url: publicUrl, name: attachment.name }] })
      .eq("id", materialId);

    if (updateError) {
      console.error("Update URL Error:", updateError);
      return { error: "Gagal menautkan file ke materi." };
    }
  }

  revalidatePath("/admin/manajemen-materi");
  return { success: "Materi berhasil dibuat!" };
}

// Tambahkan fungsi update dan delete jika diperlukan nanti
