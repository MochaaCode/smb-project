import { createClient } from "@/lib/supabase/server";
import { Class, MaterialWithAuthor } from "@/types";
import MaterialsClient from "@/components/admin/MaterialsClient";

async function getPageData() {
  const supabase = await createClient();

  const [materialsResult, classesResult] = await Promise.all([
    supabase
      .from("materials")
      .select(`*, author:profiles(full_name), class:classes(name)`)
      .order("scheduled_for", { ascending: false }),
    supabase.from("classes").select("*").order("name"),
  ]);

  if (materialsResult.error) {
    console.error("Fetch materials error:", materialsResult.error.message);
  }
  if (classesResult.error) {
    console.error("Fetch classes error:", classesResult.error.message);
  }

  return {
    materials: (materialsResult.data as MaterialWithAuthor[]) || [],
    classes: (classesResult.data as Class[]) || [],
  };
}

export default async function ManajemenMateriPage() {
  const { materials, classes } = await getPageData();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Manajemen Materi
      </h1>
      <MaterialsClient serverMaterials={materials} classes={classes} />
    </div>
  );
}
