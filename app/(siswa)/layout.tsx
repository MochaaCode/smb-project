// app/(siswa)/layout.tsx

import { createClient } from "@/lib/supabase/server";
import StudentClientLayout from "@/components/siswa/SiswaLayoutClient";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "Pengguna";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      userName = profile.full_name;
    }
  }

  return (
    <StudentClientLayout userName={userName}>{children}</StudentClientLayout>
  );
}
