"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
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
    <div className="flex h-screen max-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gray-800 text-white transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          <Sidebar role={role} />
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white lg:hidden"
          aria-label="Tutup menu"
        >
          <X size={24} />
        </button>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex lg:hidden items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
          <h1
            id="sidebar-title"
            className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            Admin Panel
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2"
            aria-label="Buka menu"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
