// components/ui/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 p-2 border-t dark:border-gray-700">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-white bg-white dark:bg-indigo-600 border rounded-md hover:bg-gray-100 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="mr-1" />
        Sebelumnya
      </button>
      <span className="text-sm text-gray-500 dark:text-white">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-white bg-white dark:bg-indigo-600 border rounded-md hover:bg-gray-100 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Berikutnya
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
}
