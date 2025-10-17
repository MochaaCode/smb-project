import { createClient } from "@/lib/supabase/server";
import { Profile, Class } from "@/types";
import ProfilesClient from "@/components/admin/ProfilesClient";

async function getProfilesData() {
  const supabase = await createClient();
  
  const [
      { data: profilesData, error: profilesError },
      { data: classesData, error: classesError }
  ] = await Promise.all([
      supabase.from('profiles').select('*').order('full_name'),
      supabase.from('classes').select('*').order('name')
  ]);
  
  if (profilesError) console.error("Fetch profiles error:", profilesError);
  if (classesError) console.error("Fetch classes error:", classesError);
  
  return {
      profiles: (profilesData as Profile[]) || [],
      classes: (classesData as Class[]) || []
  };
}

export default async function ProfilesPage() {
  const { profiles, classes } = await getProfilesData();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <ProfilesClient profiles={profiles} classes={classes} />
    </div>
  );
}
