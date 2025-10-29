// file: actions/productActions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Nama produk tidak boleh kosong."),
  price: z.coerce.number().int().positive("Harga harus berupa angka positif."),
  stock: z.coerce
    .number()
    .int()
    .gte(0, "Stok harus berupa angka 0 atau lebih."),
});

// =================================================================
// ACTION: Tambah Produk Baru
// =================================================================
export async function addProduct(formData: FormData) {
  console.log("--- 🚀 ACTION: addProduct ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const validatedFields = ProductSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data produk tidak valid." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { name, price, stock } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .insert([{ name, price, stock }]);

  if (error) {
    console.error("[❌ GAGAL] Supabase Insert Error:", error);
    return { error: "Gagal menambahkan produk." };
  }

  revalidatePath("/admin/products");
  console.log("[3/3] ✅ SUKSES: Produk dibuat dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Edit Produk
// =================================================================
export async function editProduct(formData: FormData) {
  console.log("--- 🚀 ACTION: editProduct ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const EditProductSchema = ProductSchema.extend({
    id: z.coerce.number().int().positive("ID Produk tidak valid."),
  });

  const validatedFields = EditProductSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data produk tidak valid." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id, name, price, stock } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ name, price, stock })
    .eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: "Gagal mengedit produk." };
  }

  revalidatePath("/admin/products");
  console.log("[3/3] ✅ SUKSES: Produk diedit dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Hapus Produk
// =================================================================
export async function deleteProduct(formData: FormData) {
  console.log("--- 🚀 ACTION: deleteProduct ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/3] Menerima FormData:", rawFormData);

  const DeleteSchema = z.object({
    id: z.coerce.number().int().positive("ID Produk tidak valid."),
  });

  const validatedFields = DeleteSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return { error: "ID produk tidak ditemukan." };
  }

  console.log("[2/3] Validasi Zod Berhasil:", validatedFields.data);
  const { id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Delete Error:", error.message);
    return { error: "Gagal menghapus produk." };
  }

  revalidatePath("/admin/products");
  console.log("[3/3] ✅ SUKSES: Produk dihapus dan path direvalidasi.");
  return { success: true };
}
