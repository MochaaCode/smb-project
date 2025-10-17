"use client";

import { StudentDashboardData } from "@/app/(siswa)/siswa/dashboard/page";
import { formatDate } from "@/lib/utils";
import { Star, FileText } from "lucide-react";

export default function StudentDashboardClient({
  dashboardData,
}: {
  dashboardData: StudentDashboardData;
}) {
  const { profile, recentContent } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Bagian Sambutan & Poin */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Selamat Datang Kembali, {profile?.full_name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ini adalah ringkasan aktivitasmu.
        </p>
      </div>

      {/* Kartu Poin */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <Star size={40} />
          <div>
            <p className="text-lg">Total Poin Kamu</p>
            <p className="text-4xl font-bold">{profile?.points}</p>
          </div>
        </div>
      </div>

      {/* Bagian Pengumuman Terbaru */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 text-blue-500" />
          Pengumuman Terbaru
        </h2>
        <div className="space-y-4">
          {recentContent && recentContent.length > 0 ? (
            recentContent.map((item) => (
              <div
                key={item.id}
                className="border-b dark:border-gray-700 pb-4 last:border-b-0"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Diunggah pada: {formatDate(item.created_at)}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {item.body}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Belum ada pengumuman terbaru.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
