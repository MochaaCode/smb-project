import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Membangun Generasi Berkarakter dan Penuh Kesadaran
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Di SMB Suvanna Dipa, kami berdedikasi menumbuhkan nilai-nilai luhur
          melalui program inovatif. Dengan target 70 siswa setiap minggu di
          tahun 2025, kami siap menyambut putra-putri Anda untuk berkembang
          bersama kami.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/aktivitas-kami">
            <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              Lihat Aktivitas
            </button>
          </Link>
          <Link href="/tentang-kami">
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg border border-blue-600 hover:bg-gray-100 transition-transform transform hover:scale-105">
              Tentang Kami
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Program Unggulan Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                Sistem Poin Inovatif
              </h3>
              <p className="text-gray-600">
                Siswa termotivasi melalui sistem poin &quot;Metta Miles&quot; &
                &quot;Bodhi Bucks&quot; yang seru dan mendidik.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                Apresiasi Karakter Bulanan
              </h3>
              <p className="text-gray-600">
                Setiap bulan kami memilih &quot;Best Character&quot; seperti
                &apos;Si Paling Mindful&apos; untuk menginspirasi siswa lainnya.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
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
