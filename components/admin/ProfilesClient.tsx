"use client";

import { useState, useTransition, useRef } from "react";
import { Profile, Class } from "@/types";
import {
  Trash2,
  UserPlus,
  Gift,
  Edit,
  Loader2,
  UserCog,
  Star,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  inviteUser,
  deleteAuthUser,
  editProfile,
} from "@/actions/profileActions";
import { addPointsAction } from "@/actions/pointActions";
import Link from "next/link";
import toast from "react-hot-toast";

const RoleBadge = ({ role }: { role: Profile["role"] }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700";
  let textColor = "text-gray-800 dark:text-gray-300";

  switch (role) {
    case "admin":
      bgColor = "bg-purple-100 dark:bg-purple-900/30";
      textColor = "text-purple-800 dark:text-purple-300";
      break;
    case "guru":
      bgColor = "bg-blue-100 dark:bg-blue-900/30";
      textColor = "text-blue-800 dark:text-blue-300";
      break;
    case "siswa":
      bgColor = "bg-green-100 dark:bg-green-900/30";
      textColor = "text-green-800 dark:text-green-300";
      break;
  }
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${bgColor} ${textColor}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

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
  const [isPending, startTransition] = useTransition();

  const inviteFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const pointsFormRef = useRef<HTMLFormElement>(null);

  const handleInviteSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Mengundang pengguna...");
      const result = await inviteUser(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else {
        toast.success("Pengguna berhasil diundang!");
        setIsInviteModalOpen(false);
        inviteFormRef.current?.reset();
      }
    });
  };

  const handleEditSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Memperbarui profil...");
      const result = await editProfile(formData);
      toast.dismiss(toastId);
      if (result.error) toast.error(`Gagal: ${result.error}`);
      else {
        toast.success("Profil berhasil diperbarui!");
        setEditingProfile(null);
      }
    });
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menghapus pengguna...");
      const result = await deleteAuthUser(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else {
        toast.success("Pengguna berhasil dihapus.");
        setDeletingProfile(null);
      }
    });
  };

  const handleAddPointsSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const toastId = toast.loading("Menambahkan poin...");
      const result = await addPointsAction(formData);
      toast.dismiss(toastId);
      if (result.error) {
        toast.error(`Gagal: ${result.error}`);
      } else if (result.success) {
        toast.success(result.success ?? "Poin berhasil ditambahkan!");
        setGivingPointsTo(null);
        pointsFormRef.current?.reset();
      }
    });
  };

  const disableButtons = isPending;

  return (
    <>
      <div className="flex justify-between items-center mb-4 sm:mb-6 px-4 pt-4 sm:px-6 sm:pt-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
          Manajemen Pengguna
        </h2>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          disabled={disableButtons}
          className={`flex items-center bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm transition duration-150 ease-in-out ${
            disableButtons ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-disabled={disableButtons}
        >
          {isPending && isInviteModalOpen ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Undang Pengguna</span>
          <span className="sm:hidden">Undang Baru</span>
        </button>
      </div>

      {/* Tampilan Tabel untuk Desktop (md ke atas) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Nama Lengkap</th>
                <th className="px-4 py-3 sm:px-6">Role</th>
                <th className="px-4 py-3 sm:px-6">Poin</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons &&
                    (editingProfile?.id === profile.id ||
                      deletingProfile?.id === profile.id ||
                      givingPointsTo?.id === profile.id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <Link
                      href={`/admin/profiles/${profile.id}`}
                      className="text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {profile.full_name || (
                        <span className="italic text-xs">Nama Belum Diisi</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <RoleBadge role={profile.role} />
                  </td>
                  <td className="px-4 py-4 sm:px-6 font-bold text-yellow-500 dark:text-yellow-400 flex items-center">
                    <Star size={12} className="inline mr-1" /> {profile.points}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                      {profile.role === "siswa" && (
                        <button
                          onClick={() => setGivingPointsTo(profile)}
                          disabled={disableButtons}
                          title="Beri Poin"
                          aria-label={`Beri poin untuk ${profile.full_name}`}
                          className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                            disableButtons
                              ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                              : "dark:text-green-400"
                          }`}
                        >
                          <Gift size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingProfile(profile)}
                        disabled={disableButtons}
                        title="Edit Profil"
                        aria-label={`Edit profil ${profile.full_name}`}
                        className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                          disableButtons
                            ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                            : "dark:text-indigo-400"
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingProfile(profile)}
                        disabled={disableButtons}
                        title="Hapus Pengguna"
                        aria-label={`Hapus pengguna ${profile.full_name}`}
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
              {profiles.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Kartu untuk Mobile (di bawah md) */}
      <div className="md:hidden space-y-3 px-4 pb-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${
              disableButtons &&
              (editingProfile?.id === profile.id ||
                deletingProfile?.id === profile.id ||
                givingPointsTo?.id === profile.id)
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <Link
                href={`/admin/profiles/${profile.id}`}
                className="font-semibold text-base text-indigo-600 hover:underline dark:text-indigo-400 break-words mr-2"
              >
                {profile.full_name || (
                  <span className="italic text-xs">Nama Belum Diisi</span>
                )}
              </Link>
              <div className="flex space-x-1 flex-shrink-0">
                {profile.role === "siswa" && (
                  <button
                    onClick={() => setGivingPointsTo(profile)}
                    disabled={disableButtons}
                    title="Beri Poin"
                    aria-label={`Beri poin untuk ${profile.full_name}`}
                    className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      disableButtons
                        ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : "dark:text-green-400"
                    }`}
                  >
                    <Gift size={16} />
                  </button>
                )}
                <button
                  onClick={() => setEditingProfile(profile)}
                  disabled={disableButtons}
                  title="Edit Profil"
                  aria-label={`Edit profil ${profile.full_name}`}
                  className={`p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    disableButtons
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "dark:text-indigo-400"
                  }`}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeletingProfile(profile)}
                  disabled={disableButtons}
                  title="Hapus Pengguna"
                  aria-label={`Hapus pengguna ${profile.full_name}`}
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
            <div className="text-xs sm:text-sm flex justify-between items-center">
              <RoleBadge role={profile.role} />
              <span className="font-bold text-yellow-500 dark:text-yellow-400 flex items-center">
                <Star size={12} className="inline mr-1" /> {profile.points} Poin
              </span>
            </div>
          </div>
        ))}
        {profiles.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <UserCog size={32} className="mx-auto mb-2 opacity-50" />
            <p>Tidak ada data pengguna.</p>
          </div>
        )}
      </div>

      {/* Modal Undang Pengguna */}
      <Modal
        title="Undang Pengguna Baru"
        icon={<UserPlus size={20} />}
        isOpen={isInviteModalOpen}
        onClose={() => !isPending && setIsInviteModalOpen(false)}
      >
        <form
          ref={inviteFormRef}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleInviteSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="full_name-invite"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              id="full_name-invite"
              name="full_name"
              type="text"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="email-invite"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email-invite"
              name="email"
              type="email"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="password-invite"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password-invite"
              name="password"
              type="password"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="role-invite"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <select
              id="role-invite"
              name="role"
              required
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="class_id-invite"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kelas (opsional, untuk siswa)
            </label>
            <select
              id="class_id-invite"
              name="class_id"
              disabled={isPending}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Tidak ada --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
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
              {isPending ? "Mengundang..." : "Kirim Undangan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Profil */}
      <Modal
        title="Edit Profil Pengguna"
        icon={<Edit size={20} />}
        isOpen={!!editingProfile}
        onClose={() => !isPending && setEditingProfile(null)}
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
          <input type="hidden" name="id" value={editingProfile?.id || ""} />
          <div>
            <label
              htmlFor="full_name-edit"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Lengkap
            </label>
            <input
              id="full_name-edit"
              name="full_name"
              required
              disabled={isPending}
              defaultValue={editingProfile?.full_name || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="role-edit"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <select
              id="role-edit"
              name="role"
              required
              disabled={isPending}
              defaultValue={editingProfile?.role || ""}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="class_id-edit"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kelas (jika siswa)
            </label>
            <select
              id="class_id-edit"
              name="class_id"
              disabled={isPending || editingProfile?.role !== "siswa"}
              defaultValue={editingProfile?.class_id || ""}
              className={`mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 ${
                editingProfile?.role !== "siswa"
                  ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="">-- Tidak ada --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {editingProfile?.role !== "siswa" && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Hanya siswa yang dapat memiliki kelas.
              </p>
            )}
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setEditingProfile(null)}
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

      {/* Modal Hapus Pengguna */}
      <Modal
        title="Hapus Pengguna"
        icon={<Trash2 size={20} className="text-red-500" />}
        isOpen={!!deletingProfile}
        onClose={() => !isPending && setDeletingProfile(null)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleDeleteSubmit(formData);
          }}
        >
          <input type="hidden" name="id" value={deletingProfile?.id || ""} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Anda yakin ingin menghapus{" "}
            <strong className="text-gray-900 dark:text-white">
              {deletingProfile?.full_name}
            </strong>
            ? Tindakan ini akan menghapus akun login pengguna ini secara
            permanen dari sistem otentikasi dan semua data terkait.
          </p>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setDeletingProfile(null)}
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

      {/* Modal Beri Poin */}
      <Modal
        title={`Beri Poin untuk ${givingPointsTo?.full_name}`}
        icon={<Gift size={20} />}
        isOpen={!!givingPointsTo}
        onClose={() => !isPending && setGivingPointsTo(null)}
      >
        <form
          ref={pointsFormRef}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isPending) return;
            const formData = new FormData(e.currentTarget);
            await handleAddPointsSubmit(formData);
          }}
          className="space-y-4"
        >
          <input
            type="hidden"
            name="user_id"
            value={givingPointsTo?.id || ""}
          />
          <div>
            <label
              htmlFor="amount-points"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Jumlah Poin
            </label>
            <input
              id="amount-points"
              name="amount"
              type="number"
              min="1"
              required
              disabled={isPending}
              placeholder="Contoh: 5"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="reason-points"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Keterangan / Alasan
            </label>
            <input
              id="reason-points"
              name="reason"
              type="text"
              required
              disabled={isPending}
              placeholder="Contoh: Jawaban Benar Kelas Dharma"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setGivingPointsTo(null)}
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
              {isPending ? "Menambahkan..." : "Tambahkan Poin"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
