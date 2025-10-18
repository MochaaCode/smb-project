import { createClient } from "@/lib/supabase/server";
import { MaterialWithAuthor } from "@/types";
import MaterialsClient from "@/components/admin/MaterialsClient";

async function getMaterials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select(`*, author:profiles(full_name)`)
    .order("scheduled_for", { ascending: false });

  if (error) {
    console.error("Fetch materials error:", error.message);
    return [];
  }
  return data;
}

export default async function ManajemenMateriPage() {
  const materials: MaterialWithAuthor[] = (await getMaterials()) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Manajemen Materi
      </h1>
      <MaterialsClient serverMaterials={materials} />
    </div>
  );
}
