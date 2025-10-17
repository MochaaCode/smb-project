import { createClient } from "@/lib/supabase/server";
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import GuruDashboardView from "@/components/admin/GuruDashboardView";
import { redirect } from "next/navigation";

export type UserRoleData = { name: string; value: number };
export type WeeklyActivityData = { day: string; count: number };

// "Koki" untuk Admin
async function getAdminDashboardData(supabase: any) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    { count: totalUsers },
    { count: totalProducts },
    { data: allProfiles },
    { data: recentActivity },
    { data: pendingOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("role"),
    supabase
      .from("product_orders")
      .select("created_at")
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("product_orders").select("id").eq("status", "pending"),
  ]);

  const roleCounts =
    allProfiles?.reduce((acc: any, profile: any) => {
      acc[profile.role] = (acc[profile.role] || 0) + 1;
      return acc;
    }, {}) || {};
  const userRoleDistribution: UserRoleData[] = Object.entries(roleCounts).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
    })
  );

  const activityByDay: Record<string, number> = {};
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayKey = days[date.getDay()];
    activityByDay[dayKey] = 0;
  }
  recentActivity?.forEach((item: any) => {
    const dayKey = days[new Date(item.created_at).getDay()];
    if (dayKey in activityByDay) {
      activityByDay[dayKey]++;
    }
  });
  const weeklyActivity: WeeklyActivityData[] = Object.entries(
    activityByDay
  ).map(([day, count]) => ({ day, count }));

  return {
    totalUsers: totalUsers ?? 0,
    totalProducts: totalProducts ?? 0,
    pendingOrdersCount: pendingOrders?.length ?? 0,
    userRoleDistribution,
    weeklyActivity,
  };
}

// "Koki" untuk Guru
async function getGuruDashboardData(supabase: any, userId: string) {
  const { data: classData } = await supabase
    .from("classes")
    .select("id")
    .eq("teacher_id", userId)
    .single();
  if (!classData) return { totalStudents: 0 };
  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classData.id);
  return { totalStudents: totalStudents ?? 0 };
}

// "Penjaga Gerbang" Utama
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    const adminData = await getAdminDashboardData(supabase);
    return <AdminDashboardView data={adminData} />;
  }

  if (profile?.role === "guru") {
    const guruData = await getGuruDashboardData(supabase, user.id);
    return <GuruDashboardView data={guruData} />;
  }

  return <p>Akses ditolak. Peran tidak valid.</p>;
}
