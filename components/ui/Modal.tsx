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
  // Kita gunakan 'return null' di awal agar lebih jelas
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4"
    >
      {/* Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        // Menghapus animasi custom, diganti dengan transisi standar yang lebih aman
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md relative"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-indigo-500">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
