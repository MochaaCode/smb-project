"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signInAdmin } from "@/actions/authActions";
import { LogIn } from "lucide-react";
import Link from "next/link";

const AdminLoginErrorMessage = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md bg-red-100 p-3 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
      {message}
    </p>
  );
};

export default function LoginPage() {
  return (
    // Tambahkan padding horizontal agar tidak menempel di tepi layar kecil
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      {/* Ubah padding dari p-8 menjadi lebih responsif */}
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8">
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600"
            />
          </div>

          <Suspense fallback={<div />}>
            <AdminLoginErrorMessage />
          </Suspense>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <LogIn className="mr-2 h-5 w-5" /> Sign In
          </button>
        </form>
      </div>
      <div className="mt-4 text-center text-sm">
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
