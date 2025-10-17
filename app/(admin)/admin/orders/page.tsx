import { createClient } from "@/lib/supabase/server";
import { OrderDetails } from "@/types";
import OrdersClient from "@/components/admin/OrdersClient";

async function getOrders() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("product_orders")
      .select(
        `
        *,
        profiles (*),
        products (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch orders error:", error.message);
      return [];
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Unexpected error fetching orders:", e.message);
    }
    return [];
  }
}

export default async function OrdersPage() {
  const orders: OrderDetails[] = (await getOrders()) || [];
  return <OrdersClient orders={orders} />;
}
