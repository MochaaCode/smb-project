"use client";

import { useState, useTransition, useRef } from "react";
import { Product } from "@/types";
import {
  PlusCircle,
  Edit,
  ShoppingBag,
  Package,
  Trash2,
  Loader2,
  Star,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  addProduct,
  editProduct,
  deleteProduct,
} from "@/actions/productActions";
import toast from "react-hot-toast";

const StockBadge = ({ stock }: { stock: number }) => {
  let bgColor = "bg-red-100 dark:bg-red-900/30";
  let textColor = "text-red-800 dark:text-red-300";
  let text = "Out of Stock";

  if (stock > 10) {
    bgColor = "bg-green-100 dark:bg-green-900/30";
    textColor = "text-green-800 dark:text-green-300";
    text = "In Stock";
  } else if (stock > 0) {
    bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
    textColor = "text-yellow-800 dark:text-yellow-300";
    text = "Low Stock";
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor} ${textColor}`}
    >
      {text} ({stock})
    </span>
  );
};

export default function ProductsClient({ products }: { products: Product[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const handleAddSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menambahkan produk...");
      const result = await addProduct(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else {
        toast.success("Produk baru berhasil ditambahkan!");
        setIsAddModalOpen(false);
        addFormRef.current?.reset();
      }
    });
  };

  const handleEditSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Memperbarui produk...");
      const result = await editProduct(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else {
        toast.success("Produk berhasil diperbarui!");
        setEditingProduct(null);
      }
    });
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menghapus produk...");
      const result = await deleteProduct(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else {
        toast.success("Produk berhasil dihapus.");
        setDeletingProduct(null);
      }
    });
  };

  const disableButtons = isPending;

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex-grow"></div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disableButtons}
          className={`flex items-center bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm transition duration-150 ease-in-out ${
            disableButtons ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-disabled={disableButtons}
        >
          {isPending && isAddModalOpen ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Tambah Produk</span>
          <span className="sm:hidden">Produk Baru</span>
        </button>
      </div>

      {/* Tampilan Tabel untuk Desktop (md ke atas) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Nama Produk</th>
                <th className="px-4 py-3 sm:px-6">Harga (Poin)</th>
                <th className="px-4 py-3 sm:px-6">Stok</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons &&
                    (editingProduct?.id === product.id ||
                      deletingProduct?.id === product.id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 sm:px-6 font-semibold text-yellow-600 dark:text-yellow-400 whitespace-nowrap">
                    <Star size={12} className="inline mr-1 -mt-1" />
                    {product.price} Poin
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        disabled={disableButtons}
                        title="Edit Produk"
                        aria-label={`Edit produk ${product.name}`}
                        className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          disableButtons
                            ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                            : "dark:text-indigo-400"
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        disabled={disableButtons}
                        title="Hapus Produk"
                        aria-label={`Hapus produk ${product.name}`}
                        className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
                          disableButtons
                            ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                            : "dark:text-red-500"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Kartu untuk Mobile (di bawah md) */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${
              disableButtons &&
              (editingProduct?.id === product.id ||
                deletingProduct?.id === product.id)
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-base text-gray-900 dark:text-white break-words mr-2">
                {product.name}
              </span>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => setEditingProduct(product)}
                  disabled={disableButtons}
                  title="Edit Produk"
                  aria-label={`Edit produk ${product.name}`}
                  className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    disableButtons
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "dark:text-indigo-400"
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeletingProduct(product)}
                  disabled={disableButtons}
                  title="Hapus Produk"
                  aria-label={`Hapus produk ${product.name}`}
                  className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    disableButtons
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "dark:text-red-500"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400 whitespace-nowrap flex items-center">
                <Star size={12} className="inline mr-1" />
                {product.price} Poin
              </span>
              <StockBadge stock={product.stock} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-50" />
            <p>Tidak ada data produk.</p>
          </div>
        )}
      </div>

      {/* Modal Tambah Produk */}
      <Modal
        title="Tambah Produk Baru"
        icon={<ShoppingBag size={20} />}
        isOpen={isAddModalOpen}
        onClose={() => !isPending && setIsAddModalOpen(false)}
      >
        <form
          ref={addFormRef}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleAddSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name-add-product"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Produk
            </label>
            <input
              id="name-add-product"
              name="name"
              type="text"
              required
              disabled={isPending}
              placeholder="Contoh: Buku Cerita Jataka"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price-add-product"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Harga (Poin)
              </label>
              <input
                id="price-add-product"
                name="price"
                type="number"
                min="1"
                required
                disabled={isPending}
                placeholder="Contoh: 50"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="stock-add-product"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Stok Awal
              </label>
              <input
                id="stock-add-product"
                name="stock"
                type="number"
                min="0"
                required
                disabled={isPending}
                placeholder="Contoh: 10"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isPending}
              className={`px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin -ml-1 mr-2" />
              ) : null}
              {isPending ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Produk */}
      <Modal
        title="Edit Produk"
        icon={<Package size={20} />}
        isOpen={!!editingProduct}
        onClose={() => !isPending && setEditingProduct(null)}
      >
        <form
          ref={editFormRef}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleEditSubmit(formData);
          }}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={editingProduct?.id || ""} />
          <div>
            <label
              htmlFor="name-edit-product"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Produk
            </label>
            <input
              id="name-edit-product"
              name="name"
              type="text"
              required
              disabled={isPending}
              defaultValue={editingProduct?.name || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price-edit-product"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Harga (Poin)
              </label>
              <input
                id="price-edit-product"
                name="price"
                type="number"
                min="1"
                required
                disabled={isPending}
                defaultValue={editingProduct?.price || ""}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="stock-edit-product"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Stok
              </label>
              <input
                id="stock-edit-product"
                name="stock"
                type="number"
                min="0"
                required
                disabled={isPending}
                defaultValue={editingProduct?.stock ?? ""}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              disabled={isPending}
              className={`px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin -ml-1 mr-2" />
              ) : null}
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Hapus Produk */}
      <Modal
        title="Hapus Produk"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingProduct}
        onClose={() => !isPending && setDeletingProduct(null)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleDeleteSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={deletingProduct?.id || ""} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Anda yakin ingin menghapus produk{" "}
            <strong className="text-gray-900 dark:text-white">
              {deletingProduct?.name}
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setDeletingProduct(null)}
              disabled={isPending}
              className={`px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin -ml-1 mr-2" />
              ) : null}
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
