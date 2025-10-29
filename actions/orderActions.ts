// file: actions/orderActions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =================================================================
// ACTION: Menyetujui Pesanan (Admin/Guru)
// =================================================================
export async function approveOrderAction(orderId: number) {
  console.log("--- 🚀 ACTION: approveOrderAction ---");
  console.log("[1/3] Menerima Order ID:", orderId);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("approve_order", {
    order_id_to_approve: orderId,
  });

  if (error || (data && (data as string).startsWith("Error:"))) {
    console.error("[❌ GAGAL] RPC approve_order Error:", error || data);
    return { error: data || "Gagal menyetujui pesanan." };
  }

  console.log("[2/3] RPC approve_order berhasil dijalankan:", data);
  revalidatePath("/admin/orders");
  console.log("[3/3] ✅ SUKSES: Pesanan disetujui dan path direvalidasi.");
  return { success: data };
}

// =================================================================
// ACTION: Menolak Pesanan (Admin/Guru)
// =================================================================
export async function rejectOrderAction(orderId: number) {
  console.log("--- 🚀 ACTION: rejectOrderAction ---");
  console.log("[1/3] Menerima Order ID:", orderId);

  const supabase = await createClient();
  const { error } = await supabase
    .from("product_orders")
    .update({ status: "rejected" })
    .eq("id", orderId);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: "Gagal menolak pesanan." };
  }

  console.log("[2/3] Status pesanan berhasil diupdate menjadi 'rejected'.");
  revalidatePath("/admin/orders");
  console.log("[3/3] ✅ SUKSES: Pesanan ditolak dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Membuat Pesanan Baru (Siswa)
// =================================================================
export async function createOrderAction(productId: number) {
  console.log("--- 🚀 ACTION: createOrderAction ---");
  console.log("[1/7] Menerima Product ID:", productId);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("[❌ GAGAL] Pengguna tidak login.");
    return { error: "Anda harus login untuk membuat pesanan." };
  }
  console.log("[2/7] Pengguna ditemukan, User ID:", user.id);

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
    console.error("[❌ GAGAL] Gagal fetch data profil atau produk.", {
      profileError,
      productError,
    });
    return { error: "Gagal mendapatkan data pengguna atau produk." };
  }
  console.log("[3/7] Data profil dan produk berhasil diambil:", {
    userPoints: profile.points,
    productPrice: product.price,
    productStock: product.stock,
  });

  console.log("[4/7] Melakukan pengecekan stok dan poin...");
  if (product.stock <= 0) {
    console.warn("[❌ GAGAL] Pengecekan gagal: Stok habis.");
    return { error: "Maaf, stok produk ini telah habis." };
  }
  if (profile.points < product.price) {
    console.warn("[❌ GAGAL] Pengecekan gagal: Poin tidak cukup.");
    return {
      error: `Poin Anda tidak mencukupi. Poin Anda: ${profile.points}, Harga: ${product.price}.`,
    };
  }
  console.log("[5/7] Pengecekan berhasil.");

  const { error: insertError } = await supabase
    .from("product_orders")
    .insert({ user_id: user.id, product_id: productId });

  if (insertError) {
    console.error("[❌ GAGAL] Supabase Insert Error:", insertError);
    return { error: "Terjadi kesalahan saat membuat pesanan." };
  }

  console.log("[6/7] Pesanan berhasil dibuat di database.");
  revalidatePath("/admin/orders");
  console.log("[7/7] ✅ SUKSES: Pesanan dibuat dan path direvalidasi.");
  return {
    success: "Pesanan berhasil dibuat dan sedang menunggu persetujuan admin.",
  };
}
