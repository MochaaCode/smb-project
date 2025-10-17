"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddPointsSchema = z.object({
  user_id: z.string().uuid("ID Pengguna tidak valid."),
  amount: z.coerce.number().int().positive("Jumlah poin harus angka positif."),
  reason: z.string().min(1, "Alasan tidak boleh kosong."),
});

export async function addPointsAction(formData: FormData) {
  const validatedFields = AddPointsSchema.safeParse({
    user_id: formData.get("user_id"),
    amount: formData.get("amount"),
    reason: formData.get("reason"),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    // Mengembalikan pesan error pertama yang ditemui
    const firstError = Object.values(errors)[0]?.[0];
    return { error: firstError || "Data yang dikirim tidak valid." };
  }

  const { user_id, amount, reason } = validatedFields.data;
  const supabase = await createClient();

  // Panggil "otak" RPC yang sudah kita buat di database
  const { data, error } = await supabase.rpc("add_points_to_user", {
    target_user_id: user_id,
    amount_to_add: amount,
    reason_text: reason,
  });

  if (error) {
    console.error("RPC Add Points Error:", error);
    return { error: "Gagal menambahkan poin." };
  }

  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${user_id}`);
  revalidatePath("/siswa/riwayat");

  return { success: data };
}
