"use client";

import { useState, useEffect, useTransition } from "react";
import { Content } from "@/types";
import {
  addContent,
  editContent,
  deleteContent,
} from "@/actions/contentActions";
import { formatDate } from "@/lib/utils";
import {
  Edit,
  Trash2,
  FilePlus,
  FileText,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import TiptapEditor from "@/components/ui/RichTextEditor";

const StatusBadge = ({ status }: { status: Content["status"] }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let Icon = FileText;

  switch (status) {
    case "published":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      Icon = Eye;
      break;
    case "draft":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      Icon = Edit;
      break;
    case "hidden":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      Icon = EyeOff;
      break;
  }

  return (
    <span
      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ContentClient({
  serverContent,
}: {
  serverContent: Content[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editorBody, setEditorBody] = useState("");

  useEffect(() => {
    if (editingContent) {
      setEditorBody(editingContent.body || "");
    } else {
      setEditorBody("");
    }
  }, [editingContent]);

  const handleAddSubmit = async (formData: FormData) => {
    formData.set("body", editorBody); // Set body dari state editor
    startTransition(async () => {
      const toastId = toast.loading("Menambahkan konten...");
      const result = await addContent(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success ?? "Konten berhasil dibuat!");
        setIsAddModalOpen(false);
        setEditorBody(""); // Reset state
      }
    });
  };

  const handleEditSubmit = async (formData: FormData) => {
    // Jika editorBody punya isi (artinya diedit), gunakan itu.
    // Jika tidak, berarti pengguna tidak menyentuh editor, jadi kirim konten asli.
    const finalBody = editorBody || editingContent?.body || "";
    formData.set("body", finalBody);

    startTransition(async () => {
      const toastId = toast.loading("Memperbarui konten...");
      const result = await editContent(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success ?? "Konten berhasil diperbarui!");
        setEditingContent(null);
        // editorBody akan di-reset oleh useEffect
      }
    });
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menghapus konten...");
      const result = await deleteContent(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success ?? "Konten berhasil dihapus.");
        setDeletingContent(null);
      }
    });
  };

  const disableButtons = isPending;

  return (
    <>
      {/* ... SISA JSX KOMPONEN (TIDAK ADA PERUBAHAN DARI KODE YANG KAMU KIRIM) ... */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex-grow"></div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disableButtons}
          className={`flex items-center bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm transition duration-150 ease-in-out ${
            disableButtons ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending && isAddModalOpen ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <FilePlus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Buat Konten Baru</span>
          <span className="sm:hidden">Konten Baru</span>
        </button>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Judul</th>
                <th className="px-4 py-3 sm:px-6">Tanggal Dibuat</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {serverContent.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons &&
                    (editingContent?.id === item.id ||
                      deletingContent?.id === item.id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setEditingContent(item)}
                        disabled={disableButtons}
                        title="Edit Konten"
                        aria-label={`Edit konten ${item.title}`}
                        className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          disableButtons ? "cursor-not-allowed" : ""
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingContent(item)}
                        disabled={disableButtons}
                        title="Hapus Konten"
                        aria-label={`Hapus konten ${item.title}`}
                        className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
                          disableButtons ? "cursor-not-allowed" : ""
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {serverContent.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data konten.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {serverContent.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${
              disableButtons &&
              (editingContent?.id === item.id ||
                deletingContent?.id === item.id)
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-base text-gray-900 dark:text-white break-words mr-2">
                {item.title}
              </span>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => setEditingContent(item)}
                  disabled={disableButtons}
                  title="Edit Konten"
                  aria-label={`Edit konten ${item.title}`}
                  className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    disableButtons ? "cursor-not-allowed" : ""
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeletingContent(item)}
                  disabled={disableButtons}
                  title="Hapus Konten"
                  aria-label={`Hapus konten ${item.title}`}
                  className={`p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    disableButtons ? "cursor-not-allowed" : ""
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Dibuat: </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {formatDate(item.created_at)}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                Status:{" "}
              </span>
              <StatusBadge status={item.status} />
            </div>
          </div>
        ))}
        {serverContent.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada data konten.
          </p>
        )}
      </div>

      {/* Modal Tambah */}
      <Modal
        title="Buat Konten Baru"
        icon={<FileText size={20} />}
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!isPending) {
            setIsAddModalOpen(false);
            setEditorBody("");
          }
        }}
      >
        <form
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
              htmlFor="title-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Judul
            </label>
            <input
              id="title-add"
              name="title"
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Judul pengumuman atau acara"
              disabled={isPending}
            />
          </div>
          <div>
            <label
              htmlFor="body-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Isi Konten
            </label>
            <TiptapEditor
              content={editorBody}
              onChange={(newContent) => setEditorBody(newContent)}
              placeholder="Detail pengumuman atau deskripsi acara..."
            />
          </div>
          <div>
            <label
              htmlFor="status-add"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status-add"
              name="status"
              defaultValue="published"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
              <option value="draft">Draft</option>
            </select>
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
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              ) : null}
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Konten"
        icon={<FileText size={20} />}
        isOpen={!!editingContent}
        onClose={() => {
          if (!isPending) {
            setEditingContent(null);
          }
        }}
      >
        {editingContent && (
          <form
            key={editingContent.id}
            onSubmit={async (e) => {
              e.preventDefault();
              if (isPending) return;
              const formData = new FormData(e.currentTarget);
              await handleEditSubmit(formData);
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" value={editingContent.id} />
            <div>
              <label
                htmlFor="title-edit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Judul
              </label>
              <input
                id="title-edit"
                name="title"
                required
                defaultValue={editingContent.title}
                disabled={isPending}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="body-edit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Isi Konten
              </label>
              <TiptapEditor
                content={editorBody} // Dikelola oleh useEffect
                onChange={(newContent) => {
                  setEditorBody(newContent);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="status-edit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <select
                id="status-edit"
                name="status"
                required
                disabled={isPending}
                defaultValue={editingContent.status || "published"}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <button
                type="button"
                onClick={() => setEditingContent(null)}
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
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                ) : null}
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ... Modal Hapus ... */}
      <Modal
        title="Hapus Konten"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingContent}
        onClose={() => !isPending && setDeletingContent(null)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleDeleteSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={deletingContent?.id || ""} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Anda yakin ingin menghapus konten{" "}
            <strong className="text-gray-900 dark:text-white">
              &quot;{deletingContent?.title}&quot;
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setDeletingContent(null)}
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
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              ) : null}
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
