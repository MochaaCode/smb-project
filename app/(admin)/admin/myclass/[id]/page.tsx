import { getUserDetailsAction } from "@/actions/profileActions";
import ProfileDetailClient from "@/components/admin/ProfileDetailClient";
import { Loader2, ShieldAlert } from "lucide-react";
import { ProfileDetails } from "@/types";
import { createClient } from "@/lib/supabase/server";

async function getPageData(userId: string) {
  const supabase = await createClient();
  const userDetailsResult = await getUserDetailsAction(userId);

  if (userDetailsResult.error || !userDetailsResult.data) {
    return {
      details: null,
      error: userDetailsResult.error || "Data pengguna tidak ditemukan.",
      filterOptions: { uniqueReasons: [], uniqueProducts: [] },
    };
  }

  const [reasonsResult, productsResult] = await Promise.all([
    supabase.from("point_history").select("reason").eq("user_id", userId),
    supabase
      .from("product_orders")
      .select("products(name)")
      .eq("user_id", userId),
  ]);

  const uniqueReasons = [
    ...new Set(
      reasonsResult.data?.map((item) => item.reason).filter(Boolean) || []
    ),
  ] as string[];
  const uniqueProducts = [
    ...new Set(
      productsResult.data
        ?.map((item: any) => item.products?.name)
        .filter(Boolean) || []
    ),
  ] as string[];

  return {
    details: userDetailsResult.data as unknown as ProfileDetails,
    error: null,
    filterOptions: { uniqueReasons, uniqueProducts },
  };
}

export default async function MyClassProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { details, error, filterOptions } = await getPageData(id);

  const returnHref = "/admin/myclass";

  if (error) {
    return (
      <div className="text-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg">
        <ShieldAlert className="mx-auto mb-2" size={40} />
        <h3 className="font-bold">Terjadi Kesalahan</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="ml-4 text-gray-500">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <ProfileDetailClient
      initialDetails={details}
      filterOptions={filterOptions}
      returnHref={returnHref}
    />
  );
}
