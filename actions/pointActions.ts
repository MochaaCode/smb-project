"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPointsAction(formData: FormData) {
  const supabase = await createClient();

  const targetUserId = formData.get("user_id") as string;
  const amount = parseInt(formData.get("amount") as string, 10);
  const reason = formData.get("reason") as string;

  if (!targetUserId || isNaN(amount) || !reason) {
    return { error: "Data tidak lengkap untuk menambahkan poin." };
  }

  if (amount <= 0) {
    return { error: "Jumlah poin harus lebih dari nol." };
  }

  // Panggil "otak" RPC yang sudah kita buat di database
  const { data, error } = await supabase.rpc("add_points_to_user", {
    target_user_id: targetUserId,
    amount_to_add: amount,
    reason_text: reason,
  });

  if (error) {
    console.error("RPC Add Points Error:", error);
    return { error: "Gagal menambahkan poin." };
  }

  revalidatePath("/admin/profiles");
  revalidatePath("/siswa/riwayat");

  return { success: data };
}
