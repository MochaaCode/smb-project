// app/(site)/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signInUser } from "@/actions/authActions";
import { LogIn } from "lucide-react";

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

export default function HomePage() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      {/* Header sudah dipindah ke layout.tsx */}
      <main className="flex items-center justify-center">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              Selamat Datang di Portal Siswa
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 md:text-lg">
              Masuk untuk melihat pengumuman, cek poin kehadiran, dan tukarkan
              dengan hadiah menarik.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
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
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm"
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
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm"
                />
              </div>

              <Suspense fallback={<div />}>
                <LoginErrorMessage />
              </Suspense>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md border bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Lanjutkan
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
