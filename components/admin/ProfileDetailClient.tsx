// app/(admin)/admin/profiles/[id]/ProfileDetailClient.tsx
"use client";

import { useState, useMemo } from "react";
import { PointHistory, ProfileDetails, OrderDetails } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeft,
  Search,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 5;

type FilterOptions = {
  uniqueReasons: string[];
  uniqueProducts: string[];
};

type ProfileDetailClientProps = {
  initialDetails: ProfileDetails;
  filterOptions: FilterOptions;
  returnHref: string;
};

// Komponen helper yang sama dari HistoryClient
const StatusIcon = ({ status }: { status: string }) => {
  const baseClasses = "flex items-center text-sm";
  if (status === "approved")
    return (
      <span className={`${baseClasses} text-green-600`}>
        <CheckCircle size={16} className="mr-2" /> Disetujui
      </span>
    );
  if (status === "rejected")
    return (
      <span className={`${baseClasses} text-red-600`}>
        <XCircle size={16} className="mr-2" /> Ditolak
      </span>
    );
  return (
    <span className={`${baseClasses} text-yellow-600`}>
      <Clock size={16} className="mr-2" /> Menunggu
    </span>
  );
};

const PointChange = ({ amount }: { amount: number }) => {
  const isPositive = amount > 0;
  return (
    <span
      className={`flex items-center font-semibold ${
        isPositive ? "text-green-500" : "text-red-500"
      }`}
    >
      {isPositive ? (
        <ArrowUpCircle size={16} className="mr-2" />
      ) : (
        <ArrowDownCircle size={16} className="mr-2" />
      )}
      {isPositive ? `+${amount}` : amount} Poin
    </span>
  );
};

export default function ProfileDetailClient({
  initialDetails,
  filterOptions,
  returnHref,
}: ProfileDetailClientProps) {
  const { profile, pointHistory, orderHistory } = initialDetails;
  const [activeTab, setActiveTab] = useState<"points" | "orders">("points");

  // State untuk Riwayat Poin
  const [pointSearch, setPointSearch] = useState("");
  const [pointDateFilter, setPointDateFilter] = useState("");
  const [pointPage, setPointPage] = useState(1);

  // State untuk Riwayat Pesanan
  const [orderSearch, setOrderSearch] = useState("");
  const [orderDateFilter, setOrderDateFilter] = useState("");
  const [orderPage, setOrderPage] = useState(1);

  // Memoized & Filtered Data untuk Riwayat Poin
  const filteredPointHistory = useMemo(() => {
    return pointHistory
      .filter((item) => {
        const matchesSearch = pointSearch
          ? item.reason.toLowerCase().includes(pointSearch.toLowerCase())
          : true;
        const matchesDate = pointDateFilter
          ? item.created_at.startsWith(pointDateFilter)
          : true;
        return matchesSearch && matchesDate;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [pointHistory, pointSearch, pointDateFilter]);

  // Memoized & Filtered Data untuk Riwayat Pesanan
  const filteredOrderHistory = useMemo(() => {
    return orderHistory
      .filter((order) => {
        const productName = order.products?.name || "";
        const matchesSearch = orderSearch
          ? productName.toLowerCase().includes(orderSearch.toLowerCase())
          : true;
        const matchesDate = orderDateFilter
          ? order.created_at.startsWith(orderDateFilter)
          : true;
        return matchesSearch && matchesDate;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [orderHistory, orderSearch, orderDateFilter]);

  // Paginasi untuk Riwayat Poin
  const pointTotalPages = Math.ceil(
    filteredPointHistory.length / ITEMS_PER_PAGE
  );
  const currentPointData = filteredPointHistory.slice(
    (pointPage - 1) * ITEMS_PER_PAGE,
    pointPage * ITEMS_PER_PAGE
  );

  // Paginasi untuk Riwayat Pesanan
  const orderTotalPages = Math.ceil(
    filteredOrderHistory.length / ITEMS_PER_PAGE
  );
  const currentOrderData = filteredOrderHistory.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href={returnHref}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
            <User size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              {profile.full_name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-right bg-indigo-600 dark:indigo-600 px-4 py-2 rounded-md">
          <p className="text-xs text-white dark:text-white">Total Poin</p>
          <p className="text-2xl font-bold text-yellow-300 dark:text-white">{profile.points}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2 p-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("points")}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "points"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <History size={16} className="mr-2" />
              Riwayat Poin ({filteredPointHistory.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "orders"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ShoppingBag size={16} className="mr-2" />
              Riwayat Pesanan ({filteredOrderHistory.length})
            </button>
          </nav>
        </div>

        {/* --- KONTEN TAB --- */}
        {activeTab === "points" && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white"
                  size={18}
                />
                <select
                  value={pointSearch}
                  onChange={(e) => setPointSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Semua Alasan</option>
                  {filterOptions.uniqueReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white"
                  size={18}
                />
                <input
                  type="date"
                  value={pointDateFilter}
                  onChange={(e) => setPointDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Keterangan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPointData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item.reason}
                      </td>
                      <td className="px-6 py-4">
                        <PointChange amount={item.amount} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPointHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <History size={40} className="mx-auto mb-2" />
                <p>Tidak ada data riwayat poin yang cocok.</p>
              </div>
            )}
            {pointTotalPages > 1 && (
              <Pagination
                currentPage={pointPage}
                totalPages={pointTotalPages}
                onPageChange={setPointPage}
              />
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white"
                  size={18}
                />
                <select
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Semua Produk</option>
                  {filterOptions.uniqueProducts.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white"
                  size={18}
                />
                <input
                  type="date"
                  value={orderDateFilter}
                  onChange={(e) => setOrderDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-white">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Tanggal Pesan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nama Produk
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentOrderData.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {order.products?.name || "Produk Dihapus"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusIcon status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrderHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package size={40} className="mx-auto mb-2" />
                <p>Tidak ada data riwayat pesanan yang cocok.</p>
              </div>
            )}
            {orderTotalPages > 1 && (
              <Pagination
                currentPage={orderPage}
                totalPages={orderTotalPages}
                onPageChange={setOrderPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
