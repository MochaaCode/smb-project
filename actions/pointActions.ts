// file: actions/pointActions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddPointsSchema = z.object({
  user_id: z.string().uuid("ID Pengguna tidak valid."),
  amount: z.coerce.number().int().positive("Jumlah poin harus angka positif."),
  reason: z.string().min(1, "Alasan tidak boleh kosong."),
});

// =================================================================
// ACTION: Menambahkan Poin ke Pengguna
// =================================================================
export async function addPointsAction(formData: FormData) {
  console.log("--- 🚀 ACTION: addPointsAction ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", rawFormData);

  const validatedFields = AddPointsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data yang dikirim tidak valid." };
  }

  console.log("[2/4] Validasi Zod Berhasil:", validatedFields.data);
  const { user_id, amount, reason } = validatedFields.data;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("add_points_to_user", {
    target_user_id: user_id,
    amount_to_add: amount,
    reason_text: reason,
  });

  if (error) {
    console.error("[❌ GAGAL] RPC add_points_to_user Error:", error);
    return { error: `Gagal menambahkan poin: ${error.message}` };
  }

  console.log("[3/4] RPC berhasil dijalankan, pesan:", data);
  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${user_id}`);
  revalidatePath("/siswa/riwayat");
  console.log("[4/4] ✅ SUKSES: Poin ditambahkan dan path direvalidasi.");
  return { success: data };
}
