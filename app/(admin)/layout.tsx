import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"; // Impor komponen client kita

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Logika otentikasi aman, berjalan di server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "guru"].includes(profile.role)) {
    return redirect("/login?message=Akses ditolak.");
  }

  // Melewatkan data 'role' dan 'children' ke Client Component
  return (
    <AdminLayoutClient role={profile.role as "admin" | "guru"}>
      {children}
    </AdminLayoutClient>
  );
}
