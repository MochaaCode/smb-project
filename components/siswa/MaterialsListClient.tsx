"use client";

import { Material } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type GroupedMaterials = Record<string, Record<string, Material[]>>;

export default function MaterialsListClient({
  groupedMaterials,
}: {
  groupedMaterials: GroupedMaterials;
}) {
  return (
    <div className="space-y-8">
      {Object.keys(groupedMaterials).map((month) => (
        <div key={month}>
          <h2 className="text-2xl font-bold text-indigo-600 border-b-2 border-indigo-200 pb-2 mb-4">
            {month}
          </h2>
          <div className="space-y-6">
            {Object.keys(groupedMaterials[month]).map((week) => (
              <div key={week}>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {week}
                </h3>
                <div className="mt-2 space-y-2">
                  {groupedMaterials[month][week].map((material) => (
                    <Link
                      href={`/siswa/materi/${material.id}`}
                      key={material.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg hover:bg-indigo-50 transition-all"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {material.title}
                      </span>
                      <ChevronRight className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
