import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import ProductsClient from "@/components/admin/ProductsClient";

async function getProducts() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase fetch products error:", error.message);
      return [];
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Unexpected error fetching products:", e.message);
    }
    return [];
  }
}

export default async function ProductsPage() {
  const products: Product[] = (await getProducts()) || [];
  return <ProductsClient products={products} />;
}
