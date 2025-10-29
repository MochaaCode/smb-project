"use client";

import {
  Users,
  BookOpenCheck,
  PlusCircle,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

// Perbarui tipe data untuk menerima info tambahan
type GuruDashboardData = {
  totalStudents: number;
  totalMaterials: number; // Tambahan data baru
  latestMaterials: { id: number; title: string; class_name: string | null }[]; // Daftar materi terbaru
};

// Kartu Statistik (sedikit disempurnakan)
const StatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
    <div className={`p-3 rounded-full flex-shrink-0 ${iconBgColor}`}>
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

// Tombol Aksi Cepat
const ActionButton = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
  >
    <div className="mb-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
      {icon}
    </div>
    <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
      {title}
    </p>
  </Link>
);

export default function GuruDashboardView({
  data,
}: {
  data: GuruDashboardData;
}) {
  const { totalStudents, totalMaterials, latestMaterials = [] } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Selamat Datang Kembali!
        </h1>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
          Berikut adalah ringkasan aktivitas kelas Anda.
        </p>
      </div>

      {/* Bagian Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <StatCard
          title="Total Siswa di Kelas Anda"
          value={totalStudents}
          icon={<Users size={22} className="text-indigo-500" />}
          iconBgColor="bg-indigo-100 dark:bg-indigo-500/20"
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Total Materi Dibuat"
          value={totalMaterials}
          icon={<BookOpenCheck size={22} className="text-teal-500" />}
          iconBgColor="bg-teal-100 dark:bg-teal-500/20"
          iconColor="text-teal-500"
        />
        {/* Bisa ditambahkan kartu lain, misal "Tugas Belum Dinilai" */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Aksi Cepat & Materi Terbaru */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bagian Aksi Cepat */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Akses Cepat
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ActionButton
                title="Lihat Kelas Saya"
                href="/admin/myclass"
                icon={
                  <Users
                    size={24}
                    className="text-gray-600 dark:text-gray-300"
                  />
                }
              />
              <ActionButton
                title="Lihat Semua Materi"
                href="/admin/manajemen-materi"
                icon={
                  <ClipboardList
                    size={24}
                    className="text-gray-600 dark:text-gray-300"
                  />
                }
              />
            </div>
          </div>

          {/* Bagian Materi Terbaru */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Materi Terbaru
            </h2>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {latestMaterials.length > 0 ? (
                  latestMaterials.map((materi) => (
                    <li
                      key={materi.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {materi.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Kelas: {materi.class_name || "Tidak spesifik"}
                        </p>
                      </div>
                      <Link href={`/admin/manajemen-materi?edit=${materi.id}`}>
                        <ArrowRight
                          size={18}
                          className="text-gray-400 hover:text-indigo-500"
                        />
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    Belum ada materi yang Anda buat.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengumuman atau Info Penting */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Tips & Pengumuman
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-500/30">
            <h3 className="font-bold text-blue-800 dark:text-blue-200">
              Kelola Poin Siswa Secara Efektif
            </h3>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              Anda bisa memberikan poin kepada siswa langsung dari menu "Kelas
              Saya". Poin ini bisa digunakan siswa untuk menukar hadiah di menu
              "Tukar Poin".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
