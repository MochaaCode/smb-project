"use client";

import { useState } from "react";
import { OrderDetails } from "@/types";
import { approveOrderAction, rejectOrderAction } from "@/actions/orderActions";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
  if (status === "approved")
    return (
      <span className={`${baseClasses} text-green-800 bg-green-100`}>
        Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className={`${baseClasses} text-red-800 bg-red-100`}>Rejected</span>
    );
  return (
    <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>
      Pending
    </span>
  );
};

export default function OrdersClient({ orders }: { orders: OrderDetails[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleApprove = async (orderId: number) => {
    setLoadingId(orderId);
    const result = await approveOrderAction(orderId);
    if (result.error) toast.error(result.error);
    else toast.success("Pesanan berhasil disetujui!");
    setLoadingId(null);
  };

  const handleReject = async (orderId: number) => {
    setLoadingId(orderId);
    const result = await rejectOrderAction(orderId);
    if (result.error) toast.error(result.error);
    else toast.success("Pesanan berhasil ditolak.");
    setLoadingId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Manajemen Pesanan (Waiting List)
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Nama Siswa</th>
              <th className="px-6 py-3">Produk Dipesan</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                {/* --- PERBAIKAN CARA AKSES DATA --- */}
                <td className="px-6 py-4 font-medium">
                  {order.profiles?.full_name || "Pengguna Dihapus"}
                </td>
                <td className="px-6 py-4">
                  {order.products?.name || "Produk Dihapus"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  {order.status === "pending" && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={loadingId === order.id}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={loadingId === order.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
