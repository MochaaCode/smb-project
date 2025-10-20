import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="bg-gray-50">
      {/* Bagian utama hero */}
      <div className="container mx-auto px-4 py-12 text-center md:px-6 md:py-16">
        <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
          Membangun Generasi Berkarakter dan Penuh Kesadaran
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 md:text-lg">
          Di SMB Suvanna Dipa, kami berdedikasi menumbuhkan nilai-nilai luhur
          melalui program inovatif. Dengan target 70 siswa setiap minggu di
          tahun 2025, kami siap menyambut putra-putri Anda untuk berkembang
          bersama kami.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/aktivitas-kami" className="w-full sm:w-auto">
            <button className="w-full transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-blue-700 sm:w-auto">
              Lihat Aktivitas
            </button>
          </Link>
          <Link href="/tentang-kami" className="w-full sm:w-auto">
            <button className="w-full transform rounded-lg border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105 hover:bg-gray-100 sm:w-auto">
              Tentang Kami
            </button>
          </Link>
        </div>
      </div>

      {/* Bagian Program Unggulan */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Program Unggulan Kami
          </h2>
          {/* Grid ini sudah responsif, tidak perlu diubah */}
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">
                Sistem Poin Inovatif
              </h3>
              <p className="text-gray-600">
                Siswa termotivasi melalui sistem poin &quot;Metta Miles&quot; &
                &quot;Bodhi Bucks&quot; yang seru dan mendidik.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">
                Apresiasi Karakter Bulanan
              </h3>
              <p className="text-gray-600">
                Setiap bulan kami memilih &quot;Best Character&quot; seperti
                &apos;Si Paling Mindful&apos; untuk menginspirasi siswa lainnya.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">
                Students&apos; Book Journey
              </h3>
              <p className="text-gray-600">
                Setiap siswa memiliki buku rekam jejak pribadi untuk melihat
                perkembangan mereka dari tahun ke tahun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
