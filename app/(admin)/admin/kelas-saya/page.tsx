import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";
import MyClassClient from "@/components/admin/MyClassClient";

async function getMyClassData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { teacherName: null, students: [], className: null };
  }

  const teacherName = user.user_metadata.full_name || "N/A";

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id, name")
    .eq("teacher_id", user.id)
    .single();

  if (classError || !classData) {
    console.log("Guru tidak terdaftar sebagai wali kelas di kelas manapun.");
    return { teacherName, students: [], className: null };
  }

  const { data: studentsData, error: studentsError } = await supabase
    .from("profiles")
    .select("*")
    .eq("class_id", classData.id)
    .order("full_name");

  if (studentsError) {
    console.error("Fetch students error:", studentsError.message);
  }

  return {
    teacherName,
    className: classData.name,
    students: (studentsData as Profile[]) || [],
  };
}

export default async function MyClassPage() {
  const { teacherName, className, students } = await getMyClassData();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Kelas Saya: {className || "Tidak Ditemukan"}
      </h1>
      <p className="text-gray-500 mb-6">Wali Kelas: {teacherName}</p>
      <MyClassClient students={students} />
    </div>
  );
}
