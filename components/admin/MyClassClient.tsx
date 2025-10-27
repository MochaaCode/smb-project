"use client";

import { useState, useTransition, useRef } from "react";
import { Profile } from "@/types";
import { Gift, Loader2, Star, UserRoundX } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { addPointsAction } from "@/actions/pointActions";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyClassClient({ students }: { students: Profile[] }) {
  const [givingPointsTo, setGivingPointsTo] = useState<Profile | null>(null);
  const [isPending, startTransition] = useTransition();
  const pointsFormRef = useRef<HTMLFormElement>(null);

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
      {/* Tampilan Tabel untuk Desktop (md ke atas) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 sm:px-6">Nama Siswa</th>
                <th className="px-4 py-3 sm:px-6">Poin Saat Ini</th>
                <th className="px-4 py-3 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    disableButtons && givingPointsTo?.id === student.id
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <Link
                      href={`/admin/myclass/${student.id}`}
                      className="text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {student.full_name || (
                        <span className="italic text-xs">Nama Belum Diisi</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-4 sm:px-6 font-bold text-yellow-500 dark:text-yellow-400 flex items-center">
                    <Star size={12} className="inline mr-1" /> {student.points}
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-center">
                    <button
                      onClick={() => setGivingPointsTo(student)}
                      disabled={disableButtons}
                      title="Beri Poin"
                      aria-label={`Beri poin untuk ${student.full_name}`}
                      className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                        disableButtons
                          ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                          : "dark:text-green-400"
                      }`}
                    >
                      <Gift size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Belum ada siswa di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Kartu untuk Mobile (di bawah md) */}
      <div className="md:hidden space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${
              disableButtons && givingPointsTo?.id === student.id
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <Link
                href={`/admin/profiles/${student.id}`}
                className="font-semibold text-base text-indigo-600 hover:underline dark:text-indigo-400 break-words mr-2"
              >
                {student.full_name || (
                  <span className="italic text-xs">Nama Belum Diisi</span>
                )}
              </Link>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setGivingPointsTo(student)}
                  disabled={disableButtons}
                  title="Beri Poin"
                  aria-label={`Beri poin untuk ${student.full_name}`}
                  className={`p-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    disableButtons
                      ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                      : "dark:text-green-400"
                  }`}
                >
                  <Gift size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Poin: </span>
              <span className="font-bold text-yellow-500 dark:text-yellow-400 flex items-center">
                <Star size={12} className="inline mr-1" /> {student.points}
              </span>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <UserRoundX size={32} className="mx-auto mb-2 opacity-50" />
            <p>Belum ada siswa di kelas ini.</p>
          </div>
        )}
      </div>

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
              htmlFor="amount-points-myclass"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Jumlah Poin
            </label>
            <input
              id="amount-points-myclass"
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
              htmlFor="reason-points-myclass"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Keterangan / Alasan
            </label>
            <input
              id="reason-points-myclass"
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
