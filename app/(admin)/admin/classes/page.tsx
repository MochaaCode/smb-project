import { createClient } from "@/lib/supabase/server";
import { ClassDetails, Profile } from "@/types";
import ClassesClient from "@/components/admin/ClassesClient";

async function getClassesData() {
  const supabase = await createClient();

  const [
    { data: classesData, error: classesError },
    { data: teachersData, error: teachersError },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select("*, teacher:profiles!classes_teacher_id_fkey(full_name)")
      .order("name"),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "guru")
      .order("full_name"),
  ]);

  if (classesError) console.error("Fetch classes error:", classesError.message); // Tampilkan message-nya
  if (teachersError) console.error("Fetch teachers error:", teachersError);

  return {
    classes: (classesData as ClassDetails[]) || [],
    teachers: (teachersData as Profile[]) || [],
  };
}

export default async function ClassesPage() {
  const { classes, teachers } = await getClassesData();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Manajemen Kelas
      </h1>
      <ClassesClient classes={classes} teachers={teachers} />
    </div>
  );
}
