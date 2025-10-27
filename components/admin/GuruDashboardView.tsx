"use client";

import { Users, BookOpenCheck } from "lucide-react";

type GuruDashboardData = {
  totalStudents: number;
  // Tambahkan data lain jika ada di masa depan, misal: total materi
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex items-center space-x-3 sm:space-x-4">
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

export default function GuruDashboardView({
  data,
}: {
  data: GuruDashboardData;
}) {
  const { totalStudents } = data;

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Guru
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Siswa di Kelas Anda"
          value={totalStudents}
          icon={<Users size={20} className="text-indigo-500" />}
        />
        {/* Tambahkan StatCard lain di sini jika perlu */}
        <StatCard
          title="Materi Dibuat"
          value={0} // Ganti dengan data asli jika ada
          icon={
            <BookOpenCheck size={20} className="text-teal-500" />
          }
        />
      </div>
      <div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Selamat datang! Silakan akses menu &quot;Kelas Saya&quot; atau
          &quot;Manajemen Materi&quot; di sidebar untuk mulai mengelola data
          Anda.
        </p>
      </div>
    </div>
  );
}
