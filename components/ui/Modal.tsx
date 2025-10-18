"use client";

import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
}: ModalProps) {
  return (
    // Backdrop: Area gelap di belakang panel
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "bg-white" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Panel Konten: Meluncur dari kanan */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-full max-w-lg transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/*
          Struktur di dalam panel kita buat flexbox vertikal
          agar body-nya bisa scrollable secara independen dari header.
        */}
        <div className="flex h-full flex-col">
          {/* Header Panel */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {icon && <div className="text-indigo-500">{icon}</div>}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Panel (Scrollable) */}
          <div className="flex-grow overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
