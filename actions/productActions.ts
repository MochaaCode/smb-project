"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Skema dasar untuk data produk
const ProductSchema = z.object({
  name: z.string().min(1, "Nama produk tidak boleh kosong."),
  price: z.coerce.number().int().positive("Harga harus berupa angka positif."),
  stock: z.coerce
    .number()
    .int()
    .gte(0, "Stok harus berupa angka 0 atau lebih."),
});

export async function addProduct(formData: FormData) {
  const validatedFields = ProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data produk tidak valid." };
  }

  const { name, price, stock } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .insert([{ name, price, stock }]);

  if (error) return { error: "Gagal menambahkan produk." };

  revalidatePath("/admin/products");
  return { success: true };
}

export async function editProduct(formData: FormData) {
  const EditProductSchema = ProductSchema.extend({
    id: z.coerce.number().int().positive("ID Produk tidak valid."),
  });

  const validatedFields = EditProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data produk tidak valid." };
  }

  const { id, name, price, stock } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ name, price, stock })
    .eq("id", id);

  if (error) return { error: "Gagal mengedit produk." };

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(formData: FormData) {
  const DeleteSchema = z.object({
    id: z.coerce.number().int().positive("ID Produk tidak valid."),
  });

  const validatedFields = DeleteSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: "ID produk tidak ditemukan." };
  }

  const { id } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Supabase Delete Product Error:", error.message);
    return { error: "Gagal menghapus produk." };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
