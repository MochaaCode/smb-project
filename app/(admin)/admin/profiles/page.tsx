import { createClient } from "@/lib/supabase/server";
import { Profile, Class } from "@/types";
import ProfilesClient from "@/components/admin/ProfilesClient";
import { ITEMS_PER_PAGE } from "@/lib/utils";

async function getProfilesData(currentPage: number) {
  const supabase = await createClient();

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const [
    { data: profilesData, error: profilesError },
    { data: classesData, error: classesError },
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name").range(from, to),
    supabase.from("classes").select("*").order("name"),
  ]);

  if (profilesError) console.error("Fetch profiles error:", profilesError);
  if (classesError) console.error("Fetch classes error:", classesError);

  return {
    profiles: (profilesData as Profile[]) || [],
    classes: (classesData as Class[]) || [],
  };
}

// Komponen Halaman Server
export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  const { profiles, classes } = await getProfilesData(currentPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <ProfilesClient profiles={profiles} classes={classes} />
      {/* Anda bisa menambahkan komponen Paginasi di sini jika diperlukan */}
    </div>
  );
}
