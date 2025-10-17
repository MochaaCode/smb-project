"use client";

import { useState } from "react";
import { OrderDetails, PointHistory } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  ShoppingBag,
} from "lucide-react";

// Tipe untuk props yang diterima dari Server Component
type HistoryProps = {
  orderHistory: OrderDetails[];
  pointHistory: PointHistory[];
};

// Komponen kecil untuk menampilkan ikon status yang lebih visual
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

// Komponen BARU untuk menampilkan perubahan poin (positif/negatif)
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

export default function HistoryClient({
  orderHistory,
  pointHistory,
}: HistoryProps) {
  const [activeTab, setActiveTab] = useState("pesanan"); // State untuk mengontrol tab aktif

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Navigasi Tab */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2 p-2" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("pesanan")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "pesanan"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ShoppingBag size={16} className="mr-2" />
            Riwayat Pesanan
          </button>
          <button
            onClick={() => setActiveTab("poin")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "poin"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <History size={16} className="mr-2" />
            Riwayat Poin
          </button>
        </nav>
      </div>

      {/* Konten Tab */}
      <div className="p-4">
        {/* Tampilkan Riwayat Pesanan jika tab 'pesanan' aktif */}
        {activeTab === "pesanan" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Tanggal Pesan
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Produk
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Harga
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orderHistory.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.products?.name || "Produk Dihapus"}
                    </td>
                    <td className="px-6 py-4 text-yellow-500 font-semibold">
                      {order.products?.price || "N/A"} Poin
                    </td>
                    <td className="px-6 py-4">
                      <StatusIcon status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orderHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package size={40} className="mx-auto mb-2" />
                <p>Anda belum pernah membuat pesanan.</p>
              </div>
            )}
          </div>
        )}

        {/* Tampilkan Riwayat Poin jika tab 'poin' aktif */}
        {activeTab === "poin" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left ...">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ...">
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
              <tbody className="divide-y divide-gray-200 ...">
                {pointHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 ...">
                    <td className="px-6 py-4">
                      {formatDate(entry.created_at)}
                    </td>
                    <td className="px-6 py-4">{entry.reason}</td>
                    <td className="px-6 py-4">
                      <PointChange amount={entry.amount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pointHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <History size={40} className="mx-auto mb-2" />
                <p>Belum ada riwayat poin yang tercatat.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
