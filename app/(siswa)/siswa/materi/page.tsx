// app/(siswa)/siswa/materi/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Material } from "@/types";
import MaterialsListClient from "@/components/siswa/MaterialsListClient";

// Fungsi "Koki" untuk mengambil dan mengelompokkan materi
async function getGroupedMaterials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("status", "visible")
    .order("scheduled_for", { ascending: false });

  if (error) return {};

  // Logika untuk mengelompokkan per bulan dan minggu
  const grouped = data.reduce((acc, material) => {
    const date = new Date(material.scheduled_for);
    const month = date.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });
    const day = date.getDate();
    const week = `Minggu ke-${Math.ceil(day / 7)}`;

    if (!acc[month]) acc[month] = {};
    if (!acc[month][week]) acc[month][week] = [];

    acc[month][week].push(material);
    return acc;
  }, {} as Record<string, Record<string, Material[]>>);

  return grouped;
}

export default async function MateriPage() {
  const groupedMaterials = await getGroupedMaterials();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Daftar Materi
      </h1>
      <MaterialsListClient groupedMaterials={groupedMaterials} />
    </div>
  );
}
