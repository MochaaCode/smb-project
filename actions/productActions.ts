"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string, 10);
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!name || isNaN(price) || isNaN(stock)) {
    return { error: "Data produk tidak lengkap atau tidak valid." };
  }
  const { error } = await supabase
    .from("products")
    .insert([{ name, price, stock }]);
  if (error) return { error: "Gagal menambahkan produk." };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function editProduct(formData: FormData) {
  const supabase = await createClient();
  const id = parseInt(formData.get("id") as string, 10);
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string, 10);
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!id || !name || isNaN(price) || isNaN(stock)) {
    return { error: "Data produk tidak lengkap atau tidak valid." };
  }
  const { error } = await supabase
    .from("products")
    .update({ name, price, stock })
    .eq("id", id);
  if (error) return { error: "Gagal mengedit produk." };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const id = parseInt(formData.get("id") as string, 10);

  if (!id) {
    return { error: "ID produk tidak ditemukan." };
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Supabase Delete Product Error:", error.message);
    return { error: "Gagal menghapus produk." };
  }
  revalidatePath("/admin/products");
  return { success: true };
}
