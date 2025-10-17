import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import ProductCatalogClient from "@/components/siswa/ProductCatalogClient";

// Fungsi "Koki" untuk mengambil semua produk yang tersedia
async function getAvailableProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    // Hanya tampilkan produk yang stoknya lebih dari 0
    .gt("stock", 0)
    .order("name");

  if (error) {
    console.error("Fetch available products error:", error);
    return [];
  }
  return data;
}

export default async function ProductCatalogPage() {
  const products: Product[] = (await getAvailableProducts()) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Katalog Penukaran Poin
      </h1>
      <ProductCatalogClient products={products} />
    </div>
  );
}
