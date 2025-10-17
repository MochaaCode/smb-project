"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signInUser } from "@/actions/authActions";
import { LogIn } from "lucide-react";
import Link from "next/link";

const LoginErrorMessage = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-center text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-md">
      {message}
    </p>
  );
};

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="absolute top-0 left-0 w-full p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sekolah Keren
          </h1>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            Admin / Guru Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Selamat Datang di Portal Siswa
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Masuk untuk melihat pengumuman, cek poin kehadiran, dan tukarkan
              dengan hadiah menarik.
            </p>
          </div>

          <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Masuk Siswa
              </h3>
            </div>
            <form className="space-y-6" action={signInUser}>
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
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
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
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              <Suspense fallback={<div />}>
                <LoginErrorMessage />
              </Suspense>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Lanjutkan
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
