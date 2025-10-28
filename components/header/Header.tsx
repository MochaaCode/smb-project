// components/header/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/aktivitas-kami", label: "Aktivitas Kami" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          <Link href="/">SMB Suvanna Dipa</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                // Perbaikan: Menyesuaikan warna dark mode untuk konsistensi
                className={`relative font-medium transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:text-blue-600 after:hover:scale-x-100 ${
                  isActive
                    ? "text-blue-600 after:scale-x-100"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* <div className="hidden items-center md:flex">
          <Link href="/login">
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
              Admin/Guru Login
            </button>
          </Link>
        </div> */}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {/* Perbaikan: Menambahkan kelas warna pada tombol */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-gray-800 dark:text-white"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown with Animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "max-h-96 border-t border-gray-200 dark:border-gray-700"
            : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-1 py-3 bg-white dark:bg-gray-800">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full py-2 text-center text-base font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="w-full px-4 pt-3">
            <Link href="/login">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Admin/Guru Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
