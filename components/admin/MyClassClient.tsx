"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { Gift } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { addPointsAction } from "@/actions/pointActions";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyClassClient({ students }: { students: Profile[] }) {
  const [givingPointsTo, setGivingPointsTo] = useState<Profile | null>(null);

  const handleAddPointsSubmit = async (formData: FormData) => {
    const result = await addPointsAction(formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success as string);
      setGivingPointsTo(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Nama Siswa</th>
              <th className="px-6 py-3">Poin Saat Ini</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/admin/profiles/${student.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {student.full_name}
                  </Link>
                </td>
                <td className="px-6 py-4 font-bold text-yellow-500">
                  {student.points}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setGivingPointsTo(student)}
                    title="Beri Poin"
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                  >
                    <Gift size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Belum ada siswa di kelas ini.
          </p>
        )}
      </div>

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
            <label>Keterangan</label>
            <input
              name="reason"
              type="text"
              required
              placeholder="Contoh: Jawaban Benar"
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
