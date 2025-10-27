"use client";

import { useState, useTransition } from "react";
import { OrderDetails } from "@/types";
import { approveOrderAction, rejectOrderAction } from "@/actions/orderActions";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const StatusBadge = ({ status }: { status: OrderDetails["status"] }) => {
  let bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
  let textColor = "text-yellow-800 dark:text-yellow-300";
  let Icon = Clock;
  let text = "Pending";

  if (status === "approved") {
    bgColor = "bg-green-100 dark:bg-green-900/30";
    textColor = "text-green-800 dark:text-green-300";
    Icon = CheckCircle;
    text = "Approved";
  } else if (status === "rejected") {
    bgColor = "bg-red-100 dark:bg-red-900/30";
    textColor = "text-red-800 dark:text-red-300";
    Icon = XCircle;
    text = "Rejected";
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor} ${textColor}`}
    >
      <Icon size={12} className="mr-1 flex-shrink-0" />
      {text}
    </span>
  );
};

export default function OrdersClient({ orders }: { orders: OrderDetails[] }) {
  const [loadingAction, setLoadingAction] = useState<{
    type: "approve" | "reject";
    id: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApprove = async (orderId: number) => {
    startTransition(async () => {
      setLoadingAction({ type: "approve", id: orderId });
      const toastId = toast.loading("Menyetujui pesanan...");
      const result = await approveOrderAction(orderId);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else toast.success(result.success ?? "Pesanan berhasil disetujui!");
      setLoadingAction(null);
    });
  };

  const handleReject = async (orderId: number) => {
    startTransition(async () => {
      setLoadingAction({ type: "reject", id: orderId });
      const toastId = toast.loading("Menolak pesanan...");
      const result = await rejectOrderAction(orderId);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else toast.success("Pesanan berhasil ditolak.");
      setLoadingAction(null);
    });
  };

  const isButtonLoading = (type: "approve" | "reject", id: number) => {
    return (
      isPending && loadingAction?.type === type && loadingAction?.id === id
    );
  };
  const disableButtons = isPending;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
        Manajemen Pesanan
      </h1>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Tanggal</th>
                <th className="px-4 py-3 sm:px-6">Nama Siswa</th>
                <th className="px-4 py-3 sm:px-6">Produk</th>
                <th className="px-4 py-3 sm:px-6">Harga (Poin)</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons && loadingAction?.id === order.id
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <Link
                      href={`/admin/profiles/${order.user_id}`}
                      className="text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {order.profiles?.full_name || (
                        <span className="italic text-xs">Pengguna Dihapus</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-gray-700 dark:text-gray-300">
                    {order.products?.name || (
                      <span className="italic text-xs">Produk Dihapus</span>
                    )}
                  </td>
                  <td className="px-4 py-4 sm:px-6 font-semibold text-yellow-600 dark:text-yellow-400">
                    {order.products?.price ?? "-"} Poin
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    {order.status === "pending" && (
                      <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          disabled={disableButtons}
                          title="Setujui Pesanan"
                          aria-label={`Setujui pesanan ${order.products?.name} untuk ${order.profiles?.full_name}`}
                          className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                            disableButtons
                              ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                              : "dark:text-green-400"
                          }`}
                        >
                          {isButtonLoading("approve", order.id) ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          disabled={disableButtons}
                          title="Tolak Pesanan"
                          aria-label={`Tolak pesanan ${order.products?.name} untuk ${order.profiles?.full_name}`}
                          className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
                            disableButtons
                              ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                              : "dark:text-red-500"
                          }`}
                        >
                          {isButtonLoading("reject", order.id) ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <XCircle size={18} />
                          )}
                        </button>
                      </div>
                    )}
                    {order.status !== "pending" && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Kartu untuk Mobile (di bawah md) */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3 ${
              disableButtons && loadingAction?.id === order.id
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-base text-gray-900 dark:text-white break-words mr-2">
                {order.products?.name || (
                  <span className="italic text-xs">Produk Dihapus</span>
                )}
              </span>
              {order.status === "pending" && (
                <div className="flex space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(order.id)}
                    disabled={disableButtons}
                    title="Setujui Pesanan"
                    aria-label={`Setujui pesanan ${order.products?.name} untuk ${order.profiles?.full_name}`}
                    className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      disableButtons
                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : "dark:text-green-400"
                    }`}
                  >
                    {isButtonLoading("approve", order.id) ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(order.id)}
                    disabled={disableButtons}
                    title="Tolak Pesanan"
                    aria-label={`Tolak pesanan ${order.products?.name} untuk ${order.profiles?.full_name}`}
                    className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      disableButtons
                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : "dark:text-red-500"
                    }`}
                  >
                    {isButtonLoading("reject", order.id) ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Siswa: </span>
              <Link
                href={`/admin/profiles/${order.user_id}`}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {order.profiles?.full_name || (
                  <span className="italic text-xs">Pengguna Dihapus</span>
                )}
              </Link>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Tanggal:{" "}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {order.products?.price ?? "-"} Poin
              </span>
            </div>

            <div className="text-xs sm:text-sm pt-1">
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                Status:{" "}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-50" />
            <p>Tidak ada data pesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
