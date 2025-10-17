"use client";

import { useState } from "react";
import { Profile, Class } from "@/types";
import { Trash2, UserPlus, Gift, Edit } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  inviteUser,
  deleteAuthUser,
  editProfile,
} from "@/actions/profileActions";
import { addPointsAction } from "@/actions/pointActions";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilesClient({
  profiles,
  classes,
}: {
  profiles: Profile[];
  classes: Class[];
}) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null);
  const [givingPointsTo, setGivingPointsTo] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const handleInviteSubmit = async (formData: FormData) => {
    const result = await inviteUser(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pengguna berhasil diundang!");
      setIsInviteModalOpen(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    const result = await editProfile(formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Profil berhasil diperbarui!");
      setEditingProfile(null);
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const result = await deleteAuthUser(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pengguna berhasil dihapus.");
      setDeletingProfile(null);
    }
  };

  const handleAddPointsSubmit = async (formData: FormData) => {
    const result = await addPointsAction(formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
      setGivingPointsTo(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Undang Pengguna
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Nama Lengkap</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Poin</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b">
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/admin/profiles/${profile.id}`}
                    className="text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    {profile.full_name}
                  </Link>
                </td>
                <td className="px-6 py-4">{profile.role}</td>
                <td className="px-6 py-4 font-bold text-yellow-500">
                  {profile.points}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    {profile.role === "siswa" && (
                      <button
                        onClick={() => setGivingPointsTo(profile)}
                        title="Beri Poin"
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                      >
                        <Gift size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingProfile(profile)}
                      title="Edit Profil"
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingProfile(profile)}
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
        title="Undang Pengguna Baru"
        icon={<UserPlus size={20} />}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      >
        <form action={handleInviteSubmit} className="space-y-4">
          <div>
            <label>Nama Lengkap</label>
            <input
              name="full_name"
              type="text"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              required
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label>Kelas (opsional, untuk siswa)</label>
            <select
              name="class_id"
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="">-- Tidak ada --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Kirim Undangan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Profil Pengguna"
        icon={<Edit size={20} />}
        isOpen={!!editingProfile}
        onClose={() => setEditingProfile(null)}
      >
        <form action={handleEditSubmit} className="space-y-4">
          <input type="hidden" name="id" value={editingProfile?.id} />
          <div>
            <label>Nama Lengkap</label>
            <input
              name="full_name"
              required
              defaultValue={editingProfile?.full_name || ""}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              required
              defaultValue={editingProfile?.role}
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label>Kelas (jika siswa)</label>
            <select
              name="class_id"
              defaultValue={editingProfile?.class_id || ""}
              className="mt-1 block w-full border rounded-md p-2 bg-white"
            >
              <option value="">-- Tidak ada --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setEditingProfile(null)}
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
        title="Hapus Pengguna"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingProfile}
        onClose={() => setDeletingProfile(null)}
      >
        <form action={handleDeleteSubmit}>
          <input type="hidden" name="id" value={deletingProfile?.id} />
          <p>
            Anda yakin ingin menghapus{" "}
            <strong>{deletingProfile?.full_name}</strong>? Tindakan ini akan
            menghapus akun login dan semua data terkait secara permanen.
          </p>
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={() => setDeletingProfile(null)}
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

      <Modal
        title={`Beri Poin untuk ${givingPointsTo?.full_name}`}
        icon={<Gift size={20} />}
        isOpen={!!givingPointsTo}
        onClose={() => setGivingPointsTo(null)}
      >
        <form action={handleAddPointsSubmit} className="space-y-4">
          <input type="hidden" name="user_id" value={givingPointsTo?.id} />
          <div>
            <label>Jumlah Poin</label>
            <input
              name="amount"
              type="number"
              required
              placeholder="Contoh: 5"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Keterangan / Alasan</label>
            <input
              name="reason"
              type="text"
              required
              placeholder="Contoh: Jawaban Benar Kelas Dharma"
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setGivingPointsTo(null)}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Tambahkan Poin
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
