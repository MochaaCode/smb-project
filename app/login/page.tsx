"use client"; // <-- JURUS PAMUNGKAS #1: Pindah Medan Perang

import { Suspense } from "react"; // <-- Impor "Kandang"
import { useSearchParams } from "next/navigation"; // <-- Impor "Jimat"
import { signInAdmin } from "@/actions/authActions";
import { LogIn } from "lucide-react";
import Link from "next/link";

// Komponen kecil untuk menampilkan pesan error di dalam "kandang"
const AdminLoginErrorMessage = () => {
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

// Halaman utama sekarang menjadi Client Component yang "bodoh"
export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin / Guru Panel Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masuk untuk mengelola sistem.
          </p>
        </div>

        <form className="space-y-6" action={signInAdmin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
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
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            />
          </div>

          {/* --- "KANDANG" ANTI-MONSTER --- */}
          <Suspense fallback={<div />}>
            <AdminLoginErrorMessage />
          </Suspense>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <LogIn className="w-5 h-5 mr-2" /> Sign In
          </button>
        </form>
      </div>
      <div className="mt-4 text-sm text-center">
        <Link
          href="/"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Kembali ke halaman utama
        </Link>
      </div>
    </div>
  );
}
