// app/(admin)/admin/profiles/[id]/page.tsx

import { getUserDetailsAction } from "@/actions/profileActions";
import ProfileDetailClient from "@/components/admin/ProfileDetailClient";
import { Loader2, ShieldAlert } from "lucide-react";
import { ProfileDetails } from "@/types";

async function getPageData(userId: string) {
  const userDetailsResult = await getUserDetailsAction(userId);

  if (userDetailsResult.error || !userDetailsResult.data) {
    return {
      details: null,
      error: userDetailsResult.error || "Data pengguna tidak ditemukan.",
      filterOptions: { uniqueReasons: [], uniqueProducts: [] },
    };
  }

  const { pointHistory, orderHistory } = userDetailsResult.data;

  // Optimasi: Ambil data unik dari hasil fetch pertama
  const uniqueReasons = [
    ...new Set(pointHistory.map((item) => item.reason).filter(Boolean)),
  ] as string[];

  const uniqueProducts = [
    ...new Set(
      orderHistory.map((item: any) => item.products?.name).filter(Boolean)
    ),
  ] as string[];

  return {
    details: userDetailsResult.data as unknown as ProfileDetails,
    error: null,
    filterOptions: { uniqueReasons, uniqueProducts },
  };
}

// Komponen Halaman Server untuk Profiles
export default async function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { details, error, filterOptions } = await getPageData(id);

  const returnHref = "/admin/profiles";

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
