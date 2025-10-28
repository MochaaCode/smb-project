// app/(site)/page.tsx
"use client";

import { Suspense, useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/actions/authActions";
import { LogIn, Users, Star, Award } from "lucide-react";
import Link from "next/link";
import styles from "./HomePage.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const LoginErrorMessage = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  if (!message) return null;
  return (
    <p className="rounded-md bg-red-100 p-3 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
      {message}
    </p>
  );
};

type AnimatedDivProps = {
  children: ReactNode;
  animationClass: string;
};

const AnimatedDiv = ({ children, animationClass }: AnimatedDivProps) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`${styles.scrollAnimate} ${animationClass} ${
        isVisible ? styles.visible : ""
      }`}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateHero(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Gunakan warna dasar di sini jika perlu, atau biarkan layout utama yang menangani
    <div className="w-full">
      {/* Section 1: Hero & Login */}
      <section
        // Hapus kelas parallax, tambahkan bg dan padding
        className="bg-gray-50 dark:bg-gray-900 flex min-h-[calc(100vh-68px)] items-center justify-center overflow-x-hidden py-12"
      >
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-6">
          <div
            className={`${styles.scrollAnimate} ${styles.fadeInLeft} ${
              animateHero ? styles.visible : "opacity-0"
            } text-center md:text-left`}
          >
            {/* Sesuaikan warna teks untuk kontras */}
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
              Selamat Datang di Portal Siswa
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300">
              Masuk untuk melihat pengumuman, cek poin, dan tukarkan hadiah.
            </p>
          </div>
          <div
            className={`${styles.scrollAnimate} ${styles.fadeInRight} ${
              animateHero ? styles.visible : "opacity-0"
            } mx-auto w-full max-w-md`}
          >
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
              {" "}
              {/* Latar belakang form tetap */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Masuk Siswa
                </h3>
              </div>
              <form className="space-y-6" action={signIn}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@anda.com"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <Suspense fallback={<div />}>
                  <LoginErrorMessage />
                </Suspense>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Lanjutkan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Tentang Kami */}
      <section
        // Hapus kelas parallax, tambahkan bg dan padding
        className="bg-white dark:bg-gray-800 py-16"
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv animationClass={styles.fadeInUp}>
            {/* Sesuaikan warna teks */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mengenal SMB Suvanna Dipa
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
              Kami adalah komunitas yang berdedikasi membentuk generasi muda
              yang cerdas dan berkarakter, berlandaskan nilai Metta (cinta
              kasih) dan Mindfulness (kesadaran penuh).
            </p>
            <Link href="/tentang-kami">
              <button className="rounded-lg border border-indigo-600 px-6 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-500 dark:hover:bg-indigo-900/20">
                Selengkapnya Tentang Kami
              </button>
            </Link>
          </AnimatedDiv>
        </div>
      </section>

      {/* Section 3: Program Unggulan */}
      <section
        // Hapus kelas parallax, tambahkan bg dan padding
        className="bg-gray-100 dark:bg-gray-900 py-16"
      >
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv animationClass={styles.zoomIn}>
            {/* Sesuaikan warna teks */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Program Unggulan Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ganti bg card menjadi solid */}
              <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <Star className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Sistem Poin Inovatif
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Motivasi belajar melalui "Metta Miles" & "Bodhi Bucks".
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <Award className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Apresiasi Karakter
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Penghargaan bulanan "Best Character" untuk inspirasi.
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <Users className="mx-auto h-10 w-10 text-green-500 mb-3" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Students' Book
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Rekam jejak personal perkembangan setiap siswa.
                </p>
              </div>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Section 4: Call to Action */}
      <section
        // Hapus kelas parallax, tambahkan bg dan padding
        className="bg-indigo-700 py-16 text-white" // Latar belakang ini sudah cocok
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv animationClass={styles.fadeIn}>
            <h2 className="text-3xl font-bold mb-4">
              Bergabunglah Dengan Komunitas Kami!
            </h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              {" "}
              {/* Sedikit transparansi */}
              Lihat aktivitas seru yang telah kami lakukan dan jadilah bagian
              dari perjalanan inspiratif di SMB Suvanna Dipa.
            </p>
            <Link href="/aktivitas-kami">
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 transition-transform hover:scale-105">
                Lihat Aktivitas Kami
              </button>
            </Link>
          </AnimatedDiv>
        </div>
      </section>
    </div>
  );
}
