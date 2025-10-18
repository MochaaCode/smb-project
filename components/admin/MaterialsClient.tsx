"use client";

import { useState } from "react";
import { MaterialWithAuthor } from "@/types";
import { createMaterial } from "@/actions/materialActions";
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  const isVisible = status === "visible";
  return (
    <span
      className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
        isVisible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {isVisible ? (
        <Eye size={12} className="mr-1" />
      ) : (
        <EyeOff size={12} className="mr-1" />
      )}
      {isVisible ? "Visible" : "Hidden"}
    </span>
  );
};

export default function MaterialsClient({
  serverMaterials,
}: {
  serverMaterials: MaterialWithAuthor[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const toastId = toast.loading("Menambahkan materi...");

    const result = await createMaterial(formData);

    toast.dismiss(toastId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success as string);
      setIsAddModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Buat Materi Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Judul Materi</th>
              <th className="px-6 py-3">Untuk Tanggal</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {serverMaterials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 font-medium">{material.title}</td>
                <td className="px-6 py-4">
                  {formatDate(material.scheduled_for)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={material.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-full">
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
        title="Buat Materi Baru"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <form
          onSubmit={handleAddSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label>Judul Materi</label>
            <input
              name="title"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Isi Materi (Opsional)</label>
            <textarea
              name="content"
              rows={5}
              className="mt-1 block w-full border rounded-md p-2"
            ></textarea>
          </div>
          <div>
            <label>Jadwalkan Untuk Tanggal</label>
            <input
              name="scheduled_for"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Status</label>
            <select
              name="status"
              required
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="hidden">Hidden (Sembunyikan)</option>
              <option value="visible">Visible (Tampilkan)</option>
            </select>
          </div>
          <div>
            <label>Lampiran (PDF/Gambar, Max 5MB)</label>
            <input
              name="attachment"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
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
    </>
  );
}
