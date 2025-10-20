"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Menu, X } from "lucide-react";

type AdminLayoutClientProps = {
  role: "admin" | "guru";
  children: React.ReactNode;
};

export default function AdminLayoutClient({
  role,
  children,
}: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar untuk Desktop */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Latar belakang gelap saat sidebar mobile terbuka */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>
      )}

      {/* Sidebar untuk Mobile/Tablet (Slide-in) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar role={role} />
      </div>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header dengan Tombol Hamburger */}
        <header className="flex lg:hidden items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
          <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
          <button onClick={toggleSidebar} className="p-2 z-50">
            {/* --- INI BAGIAN YANG DIPERBAIKI --- */}
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
