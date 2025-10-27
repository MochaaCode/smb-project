"use client";

import { useState } from "react";
import { ClassDetails, Profile } from "@/types";
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
    const toastId = toast.loading("Menambahkan kelas...");
    const result = await addClass(formData);
    toast.dismiss(toastId);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kelas baru berhasil dibuat!");
      setIsAddModalOpen(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    const toastId = toast.loading("Memperbarui kelas...");
    const result = await editClass(formData);
    toast.dismiss(toastId);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Data kelas berhasil diperbarui!");
      setEditingClass(null);
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const toastId = toast.loading("Menghapus kelas...");
    const result = await deleteClass(formData);
    toast.dismiss(toastId);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kelas berhasil dihapus.");
      setDeletingClass(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex-grow"></div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm transition duration-150 ease-in-out"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Buat Kelas Baru</span>
          <span className="sm:hidden">Kelas Baru</span>
        </button>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Nama Kelas</th>
                <th className="px-4 py-3 sm:px-6">Wali Kelas</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {cls.name}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400">
                    {cls.teacher?.full_name || (
                      <span className="italic">Belum ada</span>
                    )}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => setEditingClass(cls)}
                        title="Edit Kelas"
                        aria-label={`Edit kelas ${cls.name}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingClass(cls)}
                        title="Hapus Kelas"
                        aria-label={`Hapus kelas ${cls.name}`}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data kelas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-gray-900 dark:text-white truncate mr-2">
                {cls.name}
              </span>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => setEditingClass(cls)}
                  title="Edit Kelas"
                  aria-label={`Edit kelas ${cls.name}`}
                  className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeletingClass(cls)}
                  title="Hapus Kelas"
                  aria-label={`Hapus kelas ${cls.name}`}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Wali Kelas:{" "}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {cls.teacher?.full_name || (
                  <span className="italic">Belum ada</span>
                )}
              </span>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada data kelas.
          </p>
        )}
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
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            if (editingClass) {
              await handleEditSubmit(formData);
            } else {
              await handleAddSubmit(formData);
            }
          }}
          className="space-y-4"
        >
          {editingClass && (
            <input type="hidden" name="id" value={editingClass.id} />
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Kelas
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={editingClass?.name || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Contoh: Kelas 1A"
            />
          </div>

          <div>
            <label
              htmlFor="teacher_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Wali Kelas
            </label>
            <select
              id="teacher_id"
              name="teacher_id"
              defaultValue={editingClass?.teacher_id || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Tidak ada --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingClass(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              {editingClass ? "Simpan Perubahan" : "Simpan"}
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleDeleteSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={deletingClass?.id || ""} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Anda yakin ingin menghapus kelas{" "}
            <strong className="text-gray-900 dark:text-white">
              &quot;{deletingClass?.name}&quot;
            </strong>
            ? Semua siswa di kelas ini akan menjadi &quot;tidak punya
            kelas&quot;. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setDeletingClass(null)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Ya, Hapus
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
