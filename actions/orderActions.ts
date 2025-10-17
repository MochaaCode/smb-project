"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(orderId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("approve_order", {
    order_id_to_approve: orderId,
  });

  if (error || (data && (data as string).startsWith("Error:"))) {
    console.error("RPC Error:", error || data);
    return { error: data || "Gagal menyetujui pesanan." };
  }
  revalidatePath("/admin/orders");
  return { success: data };
}

export async function rejectOrderAction(orderId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_orders")
    .update({ status: "rejected" })
    .eq("id", orderId);

  if (error) {
    console.error("Reject Error:", error);
    return { error: "Gagal menolak pesanan." };
  }
  revalidatePath("/admin/orders");
  return { success: true };
}

// --- FUNGSI BARU UNTUK SISWA MEMBUAT PESANAN ---
export async function createOrderAction(productId: number) {
  const supabase = await createClient();

  // 1. Dapatkan data pengguna yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Anda harus login untuk membuat pesanan." };
  }

  // 2. Ambil data profil (untuk poin) dan data produk (untuk harga & stok)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("price, stock")
    .eq("id", productId)
    .single();

  if (profileError || productError || !profile || !product) {
    return { error: "Gagal mendapatkan data pengguna atau produk." };
  }

  // 3. Logika Pengecekan
  if (product.stock <= 0) {
    return { error: "Maaf, stok produk ini telah habis." };
  }
  if (profile.points < product.price) {
    return {
      error: `Poin Anda tidak mencukupi. Poin Anda: ${profile.points}, Harga: ${product.price}.`,
    };
  }

  // 4. Jika semua lolos, buat pesanan baru
  const { error: insertError } = await supabase
    .from("product_orders")
    .insert({ user_id: user.id, product_id: productId });

  if (insertError) {
    console.error("Create Order Error:", insertError);
    return { error: "Terjadi kesalahan saat membuat pesanan." };
  }

  // Revalidate halaman pesanan admin agar pesanan baru muncul di sana
  revalidatePath("/admin/orders");
  return {
    success: "Pesanan berhasil dibuat dan sedang menunggu persetujuan admin.",
  };
}
