"use client";

import { useState } from "react";
import { Content } from "@/types";
import {
  addContent,
  editContent,
  deleteContent,
} from "@/actions/contentActions";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2, FilePlus, FileText } from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function ContentClient({
  serverContent,
}: {
  serverContent: Content[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);

  const handleAddSubmit = async (formData: FormData) => {
    const result = await addContent(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Konten baru berhasil dibuat!");
      setIsAddModalOpen(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    const result = await editContent(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Konten berhasil diperbarui!");
      setEditingContent(null);
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const result = await deleteContent(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Konten berhasil dihapus.");
      setDeletingContent(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Konten Acara</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <FilePlus className="w-5 h-5 mr-2" />
          Buat Konten Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Judul</th>
              <th className="px-6 py-3">Tanggal Dibuat</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {serverContent.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{item.title}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingContent(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingContent(item)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Buat Konten Baru"
        icon={<FileText size={20} />}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <form action={handleAddSubmit} className="space-y-4">
          <div>
            <label>Judul</label>
            <input
              name="title"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Isi Konten</label>
            <textarea
              name="body"
              rows={8}
              className="mt-1 block w-full border rounded-md p-2"
            ></textarea>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Konten"
        icon={<FileText size={20} />}
        isOpen={!!editingContent}
        onClose={() => setEditingContent(null)}
      >
        <form action={handleEditSubmit} className="space-y-4">
          <input type="hidden" name="id" value={editingContent?.id} />
          <div>
            <label>Judul</label>
            <input
              name="title"
              required
              defaultValue={editingContent?.title}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Isi Konten</label>
            <textarea
              name="body"
              rows={8}
              defaultValue={editingContent?.body || ""}
              className="mt-1 block w-full border rounded-md p-2"
            ></textarea>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setEditingContent(null)}
              className="px-4 py-2 rounded-md bg-gray-200"
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
        title="Hapus Konten"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingContent}
        onClose={() => setDeletingContent(null)}
      >
        <form action={handleDeleteSubmit}>
          <input type="hidden" name="id" value={deletingContent?.id} />
          <p>
            Anda yakin ingin menghapus konten{" "}
            <strong>&quot;{deletingContent?.title}&quot;</strong>?
          </p>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setDeletingContent(null)}
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
