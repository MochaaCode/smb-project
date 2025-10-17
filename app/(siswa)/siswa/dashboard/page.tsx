import { createClient } from "@/lib/supabase/server";
import StudentDashboardClient from "@/components/siswa/SiswaDashboardClient";
import { Profile, Content } from "@/types";
import { redirect } from "next/navigation";

// Tipe data yang akan kita kirim ke client component
export type StudentDashboardData = {
  profile: Profile | null;
  recentContent: Content[] | null;
};

// Fungsi "Koki" untuk mengambil data
async function getStudentDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Seharusnya ini tidak terjadi karena ada middleware, tapi sebagai pengaman
    return { profile: null, recentContent: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: recentContent } = await supabase
    .from("content")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  return { profile, recentContent };
}

export default async function StudentDashboardPage() {
  const dashboardData = await getStudentDashboardData();

  // Jika karena suatu alasan profil tidak ditemukan, tendang keluar
  if (!dashboardData.profile) {
    redirect("/?message=Gagal memuat data pengguna. Silakan login kembali.");
  }

  return (
    <StudentDashboardClient
      dashboardData={dashboardData as StudentDashboardData}
    />
  );
}
