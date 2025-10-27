"use client";

import { useState, useTransition, useRef } from "react";
import { Class, MaterialWithAuthor } from "@/types";
import {
  createMaterial,
  editMaterial,
  deleteMaterial,
} from "@/actions/materialActions";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpenText,
  Loader2,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

const StatusBadge = ({ status }: { status: MaterialWithAuthor["status"] }) => {
  const isVisible = status === "visible";
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
        isVisible
          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
      }`}
    >
      {isVisible ? (
        <Eye size={12} className="mr-1 flex-shrink-0" />
      ) : (
        <EyeOff size={12} className="mr-1 flex-shrink-0" />
      )}
      {isVisible ? "Visible" : "Hidden"}
    </span>
  );
};

export default function MaterialsClient({
  serverMaterials,
  classes,
}: {
  serverMaterials: MaterialWithAuthor[];
  classes: Class[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<MaterialWithAuthor | null>(null);
  const [deletingMaterial, setDeletingMaterial] =
    useState<MaterialWithAuthor | null>(null);
  const [isPending, startTransition] = useTransition();

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const handleAddSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menambahkan materi...");
      const result = await createMaterial(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else {
        toast.success(result.success ?? "Materi berhasil dibuat!");
        setIsAddModalOpen(false);
        addFormRef.current?.reset();
      }
    });
  };

  const handleEditSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Memperbarui materi...");
      const result = await editMaterial(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else {
        toast.success(result.success ?? "Materi berhasil diperbarui!");
        setEditingMaterial(null);
      }
    });
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menghapus materi...");
      const result = await deleteMaterial(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else {
        toast.success(result.success ?? "Materi berhasil dihapus.");
        setDeletingMaterial(null);
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
          <span className="hidden sm:inline">Buat Materi Baru</span>
          <span className="sm:hidden">Materi Baru</span>
        </button>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Judul Materi</th>
                <th className="px-4 py-3 sm:px-6">Kelas</th>
                <th className="px-4 py-3 sm:px-6">Untuk Tanggal</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {serverMaterials.map((material) => (
                <tr
                  key={material.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons &&
                    (editingMaterial?.id === material.id ||
                      deletingMaterial?.id === material.id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                    {material.title}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400">
                    {material.class?.name || (
                      <span className="italic text-xs">Semua Kelas</span>
                    )}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(material.scheduled_for)}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={material.status} />
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setEditingMaterial(material)}
                        disabled={disableButtons}
                        title="Edit Materi"
                        aria-label={`Edit materi ${material.title}`}
                        className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          disableButtons
                            ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                            : "dark:text-indigo-400"
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingMaterial(material)}
                        disabled={disableButtons}
                        title="Hapus Materi"
                        aria-label={`Hapus materi ${material.title}`}
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
              {serverMaterials.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data materi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {serverMaterials.map((material) => (
          <div
            key={material.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${
              disableButtons &&
              (editingMaterial?.id === material.id ||
                deletingMaterial?.id === material.id)
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-base text-gray-900 dark:text-white break-words mr-2">
                {material.title}
              </span>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => setEditingMaterial(material)}
                  disabled={disableButtons}
                  title="Edit Materi"
                  aria-label={`Edit materi ${material.title}`}
                  className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    disableButtons
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "dark:text-indigo-400"
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeletingMaterial(material)}
                  disabled={disableButtons}
                  title="Hapus Materi"
                  aria-label={`Hapus materi ${material.title}`}
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
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Kelas: </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {material.class?.name || (
                  <span className="italic text-xs">Semua Kelas</span>
                )}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Tanggal:{" "}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {formatDate(material.scheduled_for)}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                Status:{" "}
              </span>
              <StatusBadge status={material.status} />
            </div>
          </div>
        ))}
        {serverMaterials.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada data materi.
          </p>
        )}
      </div>

      {/* Modal Tambah Materi */}
      <Modal
        title="Buat Materi Baru"
        icon={<BookOpenText size={20} />}
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
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="title-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Judul Materi
            </label>
            <input
              id="title-add"
              name="title"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="content-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Isi Materi (Opsional)
            </label>
            <textarea
              id="content-add"
              name="content"
              rows={5}
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="class_id-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Untuk Kelas
            </label>
            <select
              id="class_id-add"
              name="class_id"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="scheduled_for-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Jadwalkan Untuk Tanggal
            </label>
            <input
              id="scheduled_for-add"
              name="scheduled_for"
              type="date"
              required
              disabled={isPending}
              defaultValue={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="status-add-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status-add-material"
              name="status"
              required
              disabled={isPending}
              defaultValue="hidden"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="hidden">Hidden (Sembunyikan)</option>
              <option value="visible">Visible (Tampilkan)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="attachment-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Lampiran (PDF/Gambar/Dok, Max 5MB)
            </label>
            <input
              id="attachment-add"
              name="attachment"
              type="file"
              disabled={isPending}
              accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx"
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 dark:file:bg-indigo-900/40 file:text-indigo-700 dark:file:text-indigo-300
                         hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/60
                         cursor-pointer file:cursor-pointer"
            />
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
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Materi */}
      <Modal
        title="Edit Materi"
        icon={<BookOpenText size={20} />}
        isOpen={!!editingMaterial}
        onClose={() => !isPending && setEditingMaterial(null)}
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
          <input type="hidden" name="id" value={editingMaterial?.id || ""} />
          <div>
            <label
              htmlFor="title-edit-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Judul Materi
            </label>
            <input
              id="title-edit-material"
              name="title"
              required
              disabled={isPending}
              defaultValue={editingMaterial?.title || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="content-edit-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Isi Materi (Opsional)
            </label>
            <textarea
              id="content-edit-material"
              name="content"
              rows={5}
              disabled={isPending}
              defaultValue={editingMaterial?.content || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="class_id-edit-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Untuk Kelas
            </label>
            <select
              id="class_id-edit-material"
              name="class_id"
              required
              disabled={isPending}
              defaultValue={editingMaterial?.class_id || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Pilih Kelas --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="scheduled_for-edit-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Jadwalkan Untuk Tanggal
            </label>
            <input
              id="scheduled_for-edit-material"
              name="scheduled_for"
              type="date"
              required
              disabled={isPending}
              defaultValue={editingMaterial?.scheduled_for.split("T")[0] || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="status-edit-material"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status-edit-material"
              name="status"
              required
              disabled={isPending}
              defaultValue={editingMaterial?.status || "hidden"}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="hidden">Hidden (Sembunyikan)</option>
              <option value="visible">Visible (Tampilkan)</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
            Catatan: Mengganti lampiran tidak didukung pada mode edit. Silakan
            hapus dan buat ulang materi jika perlu.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setEditingMaterial(null)}
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

      {/* Modal Hapus Materi */}
      <Modal
        title="Hapus Materi"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingMaterial}
        onClose={() => !isPending && setDeletingMaterial(null)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleDeleteSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={deletingMaterial?.id || ""} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Anda yakin ingin menghapus materi{" "}
            <strong className="text-gray-900 dark:text-white">
              &quot;{deletingMaterial?.title}&quot;
            </strong>{" "}
            secara permanen? Tindakan ini juga akan menghapus file lampiran
            terkait dan tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setDeletingMaterial(null)}
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
