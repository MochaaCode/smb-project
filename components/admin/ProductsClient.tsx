"use client";

import { useState } from "react";
import { Product } from "@/types";
import { PlusCircle, Edit, ShoppingBag, Package, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  addProduct,
  editProduct,
  deleteProduct,
} from "@/actions/productActions";
import toast from "react-hot-toast";

const StockBadge = ({ stock }: { stock: number }) => {
  if (stock > 10) {
    return (
      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
        In Stock
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
        Low Stock
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
      Out of Stock
    </span>
  );
};

export default function ProductsClient({ products }: { products: Product[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleAddSubmit = async (formData: FormData) => {
    const result = await addProduct(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Produk baru berhasil ditambahkan!");
      setIsAddModalOpen(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    const result = await editProduct(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Produk berhasil diperbarui!");
      setEditingProduct(null);
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const result = await deleteProduct(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Produk berhasil dihapus.");
      setDeletingProduct(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manajemen Produk
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Nama Produk
                </th>
                <th scope="col" className="px-6 py-4">
                  Harga (Poin)
                </th>
                <th scope="col" className="px-6 py-4">
                  Stok
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-bold text-yellow-500">
                    {product.price} Poin
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span>{product.stock} pcs</span>
                      <StockBadge stock={product.stock} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-indigo-500 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Tambah Produk Baru"
        icon={<ShoppingBag size={20} />}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <form action={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Produk
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Buku Cerita Jataka"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Harga (Poin)
              </label>
              <input
                name="price"
                type="number"
                required
                placeholder="Contoh: 50"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Stok Awal
              </label>
              <input
                name="stock"
                type="number"
                required
                placeholder="Contoh: 10"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Produk"
        icon={<Package size={20} />}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      >
        <form action={handleEditSubmit} className="space-y-4">
          <input type="hidden" name="id" value={editingProduct?.id || ""} />
          <div>
            <label className="text-sm font-medium">Nama Produk</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={editingProduct?.name || ""}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Harga (Poin)</label>
              <input
                name="price"
                type="number"
                required
                defaultValue={editingProduct?.price || ""}
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Stok</label>
              <input
                name="stock"
                type="number"
                required
                defaultValue={editingProduct?.stock || ""}
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Hapus Produk"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
      >
        <form action={handleDeleteSubmit}>
          <input type="hidden" name="id" value={deletingProduct?.id} />
          <p>
            Anda yakin ingin menghapus produk{" "}
            <strong>{deletingProduct?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setDeletingProduct(null)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Ya, Hapus
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
