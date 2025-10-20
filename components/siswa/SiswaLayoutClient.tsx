"use client";

import { signOut } from "@/actions/authActions";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  History,
  BookOpenText,
  Menu, // Impor ikon menu
  X, // Impor ikon close
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"; // Impor useState

const UserHeader = ({
  userName,
  onMenuClick,
}: {
  userName: string;
  onMenuClick: () => void;
}) => {
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
          <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
            Halo, <strong>{userName}</strong>!
          </span>
          <form action={signOut} className="hidden sm:block">
            <button className="flex items-center text-sm text-red-500 hover:text-red-700">
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </form>
          <button onClick={onMenuClick} className="lg:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </nav>
    </header>
  );
};

const navLinks = [
  { href: "/siswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/siswa/produk", label: "Tukar Poin", icon: ShoppingBag },
  { href: "/siswa/materi", label: "Materi", icon: BookOpenText },
  { href: "/siswa/riwayat", label: "Riwayat", icon: History },
];

export default function StudentClientLayout({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
      <UserHeader userName={userName} onMenuClick={toggleMenu} />

      <div className="container mx-auto px-4 sm:px-6 py-8 w-full flex flex-col lg:flex-row">
        {/* Sidebar untuk Desktop */}
        <aside className="hidden lg:block w-48 flex-shrink-0 mr-8">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <link.icon size={18} className="mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu (Modal) */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleMenu}
          >
            <div
              className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 p-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleMenu}
                className="absolute top-4 right-4 p-2"
              >
                <X size={24} />
              </button>
              <nav className="mt-12 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMenu} // Tutup menu saat link diklik
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors text-lg ${
                      pathname === link.href
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <link.icon size={20} className="mr-4" />
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4">
                  <form action={signOut}>
                    <button className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-100 rounded-lg">
                      <LogOut size={20} className="mr-4" />
                      Logout
                    </button>
                  </form>
                </div>
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 mt-6 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
