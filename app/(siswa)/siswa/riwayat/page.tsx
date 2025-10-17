import { createClient } from "@/lib/supabase/server";
import { OrderDetails, PointHistory } from "@/types";
import HistoryClient from "@/components/siswa/HistoryClient";
import type { SupabaseClient } from "@supabase/supabase-js";

type OrderHistoryQueryData = {
  id: number;
  status: string;
  created_at: string;
  user_id: string;
  products:
    | {
        name: string;
        price: number;
      }[]
    | null;
};

async function getOrderHistory(
  supabase: SupabaseClient,
  userId: string
): Promise<OrderHistoryQueryData[]> {
  const { data, error } = await supabase
    .from("product_orders")
    .select(`id, status, created_at, user_id, products (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("Fetch order history error:", error.message);
  return data || [];
}

async function getPointHistory(
  supabase: SupabaseClient,
  userId: string
): Promise<PointHistory[]> {
  const { data, error } = await supabase
    .from("point_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("Fetch point history error:", error.message);
  return data || [];
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Silakan login untuk melihat riwayat.</p>;
  }

  const [orderHistoryData, pointHistoryData] = await Promise.all([
    getOrderHistory(supabase, user.id),
    getPointHistory(supabase, user.id),
  ]);

  const typedOrderHistory = orderHistoryData.map((order) => ({
    ...order,
    profiles: null,
  })) as OrderDetails[];

  const typedPointHistory = pointHistoryData as PointHistory[];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Riwayat Saya
      </h1>
      <HistoryClient
        orderHistory={typedOrderHistory}
        pointHistory={typedPointHistory}
      />
    </div>
  );
}
