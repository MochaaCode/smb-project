"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PointHistory, ProfileDetails } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { getUserDetailsAction } from "@/actions/profileActions";

export default function ProfileDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [details, setDetails] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const result = await getUserDetailsAction(userId);

      // --- PERBAIKAN UTAMA DI SINI ---
      // Menggunakan 'in' operator untuk type guarding yang aman
      if (result && "error" in result && result.error) {
        setError(result.error);
      } else if (result && "data" in result && result.data) {
        setDetails(result.data as ProfileDetails);
      } else {
        // Fallback jika terjadi hasil yang tidak terduga
        setError("Gagal memuat data dengan format yang tidak dikenali.");
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="ml-4 text-gray-500">Memuat data pengguna...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg">
        <ShieldAlert className="mx-auto mb-2" size={40} />
        <h3 className="font-bold">Terjadi Kesalahan</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (details) {
    return <ProfileDetailView details={details} />;
  }

  return null;
}

// ====================================================================
// Komponen "Anak" / "Presenter" untuk menampilkan UI
// ====================================================================
const ProfileDetailView = ({ details }: { details: ProfileDetails }) => {
  const { profile, pointHistory, orderHistory } = details;

  const PointHistoryItem = ({ item }: { item: PointHistory }) => (
    <div className="flex justify-between items-center py-3 border-b dark:border-gray-700 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">
          {item.reason}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(item.created_at)}
        </p>
      </div>
      <span
        className={`flex items-center font-semibold text-sm ${
          item.amount > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {item.amount > 0 ? (
          <ArrowUpCircle size={16} className="mr-2" />
        ) : (
          <ArrowDownCircle size={16} className="mr-2" />
        )}
        {item.amount > 0 ? `+${item.amount}` : item.amount} Poin
      </span>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
          <User size={32} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {profile.full_name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <History className="mr-2 text-blue-500" />
          Riwayat Poin
        </h2>
        <div className="space-y-2">
          {pointHistory.length > 0 ? (
            pointHistory.map((item) => (
              <PointHistoryItem key={item.id} item={item} />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada riwayat poin.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ShoppingBag className="mr-2 text-green-500" />
          Riwayat Pesanan
        </h2>
        <div className="space-y-2">
          {orderHistory.length > 0 ? (
            orderHistory.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center py-3 border-b dark:border-gray-700 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.products?.[0]?.name || "Produk Dihapus"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    order.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : order.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada riwayat pesanan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
