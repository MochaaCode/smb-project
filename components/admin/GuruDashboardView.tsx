"use client";

import { Users } from "lucide-react";

type GuruDashboardData = {
  totalStudents: number;
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
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Guru
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Siswa di Kelas Anda"
          value={totalStudents}
          icon={<Users className="text-indigo-500" />}
        />
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          Selamat datang! Silakan akses menu &quot;Kelas Saya&quot; di sidebar untuk mulai
          mengelola siswa Anda.
        </p>
      </div>
    </div>
  );
}
