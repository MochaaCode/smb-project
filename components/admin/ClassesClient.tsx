"use client";

import { useState } from "react";
import { ClassDetails, Profile } from "@/types"; // Gunakan tipe baru
import { addClass, editClass, deleteClass } from "@/actions/classActions";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function ClassesClient({
  classes,
  teachers,
}: {
  classes: ClassDetails[];
  teachers: Profile[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDetails | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassDetails | null>(null);

  const handleAddSubmit = async (formData: FormData) => {
    const result = await addClass(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kelas baru berhasil dibuat!");
      setIsAddModalOpen(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    const result = await editClass(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Data kelas berhasil diperbarui!");
      setEditingClass(null);
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const result = await deleteClass(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kelas berhasil dihapus.");
      setDeletingClass(null);
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
          Buat Kelas Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Nama Kelas</th>
              <th className="px-6 py-3">Wali Kelas</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 font-medium">{cls.name}</td>
                <td className="px-6 py-4 text-gray-500">
                  {cls.teacher?.full_name || (
                    <span className="italic">Belum ada</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setEditingClass(cls)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingClass(cls)}
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
        title={editingClass ? "Edit Kelas" : "Buat Kelas Baru"}
        icon={<Users size={20} />}
        isOpen={isAddModalOpen || !!editingClass}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClass(null);
        }}
      >
        <form
          action={editingClass ? handleEditSubmit : handleAddSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="id" value={editingClass?.id || ""} />
          <div>
            <label>Nama Kelas</label>
            <input
              name="name"
              required
              defaultValue={editingClass?.name || ""}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Wali Kelas</label>
            <select
              name="teacher_id"
              defaultValue={editingClass?.teacher_id || ""}
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="">-- Tidak ada --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingClass(null);
              }}
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
        title="Hapus Kelas"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingClass}
        onClose={() => setDeletingClass(null)}
      >
        <form action={handleDeleteSubmit}>
          <input type="hidden" name="id" value={deletingClass?.id} />
          <p>
            Anda yakin ingin menghapus kelas{" "}
            <strong>&quot;{deletingClass?.name}&quot;</strong>? Semua siswa di
            kelas ini akan menjadi &quot;tidak punya kelas&quot;.
          </p>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setDeletingClass(null)}
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
