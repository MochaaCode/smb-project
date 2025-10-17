"use client";

import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/actions/authActions";
import { LogOut, LayoutDashboard, ShoppingBag, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const UserHeader = () => {
  const [userName, setUserName] = useState<string | null>("Pengguna");

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    };

    fetchUserData();
  }, []);

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

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
      <UserHeader />
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
            {/* --- LINK BARU DI SINI --- */}
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
