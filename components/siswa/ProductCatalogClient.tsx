"use client";

import { useState } from "react";
import { Product } from "@/types";
import { createOrderAction } from "@/actions/orderActions";
import { ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductCatalogClient({
  products,
}: {
  products: Product[];
}) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleOrder = async (productId: number) => {

    setLoadingId(productId);
    const toastId = toast.loading("Memproses pesanan...");
    const result = await createOrderAction(productId);

    toast.dismiss(toastId);

    if (result.error) {
      toast.error(`Gagal: ${result.error}`);
    } else if (result.success) {
      toast.success(`Sukses: ${result.success}`);
    }
    setLoadingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500">{product.name}</span>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">Sisa stok: {product.stock}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center text-yellow-500 font-bold">
                <Star size={16} className="mr-1" />
                {product.price} Poin
              </span>
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={() => handleOrder(product.id)}
                disabled={loadingId === product.id}
                className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                <ShoppingCart size={16} className="mr-2" />
                {loadingId === product.id ? "Memproses..." : "Pesan Sekarang"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
