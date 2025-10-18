"use client";

import { signOut } from "@/actions/authActions";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  History,
  BookOpenText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserHeader = ({ userName }: { userName: string }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md w-full">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/siswa/dashboard"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          Portal Siswa
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">
            Halo, <strong>{userName}</strong>!
          </span>
          <form action={signOut}>
            <button className="flex items-center text-sm text-red-500 hover:text-red-700">
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default function StudentClientLayout({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
      <UserHeader userName={userName} />

      <div className="container mx-auto px-6 py-8 w-full flex">
        <aside className="w-48 flex-shrink-0 mr-8">
          <nav className="space-y-2">
            <Link
              href="/siswa/dashboard"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === "/siswa/dashboard"
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </Link>
            <Link
              href="/siswa/produk"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === "/siswa/produk"
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ShoppingBag size={18} className="mr-3" />
              Tukar Poin
            </Link>
            <Link
              href="/siswa/materi"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === "/siswa/materi"
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpenText size={18} className="mr-3" />
              Materi
            </Link>
            <Link
              href="/siswa/riwayat"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === "/siswa/riwayat"
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <History size={18} className="mr-3" />
              Riwayat
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
