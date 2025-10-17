"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Fungsi untuk login Admin & Guru
export async function signInAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !user) {
    return redirect('/login?message=Email atau Password salah.');
  }

  // Cek role setelah login berhasil
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role === 'admin') {
      return redirect('/admin/dashboard');
  }
  if (profile?.role === 'guru') {
      return redirect('/admin/kelas-saya'); // Tujuan utama guru
  }

  // Jika role-nya siswa atau tidak dikenali, tendang keluar
  await supabase.auth.signOut();
  return redirect('/login?message=Anda tidak memiliki akses ke panel ini.');
}

export async function signInUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !user) {
    return redirect(
      "/?message=Login gagal, periksa kembali email dan password Anda."
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return redirect("/?message=Gagal mendapatkan data profil pengguna.");
  }

  // Arahkan berdasarkan role
  if (profile.role === "guru") {
    return redirect("/admin/dashboard");
  }
  if (profile.role === "siswa") {
    return redirect("/siswa/dashboard");
  }

  return redirect("/?message=Role pengguna tidak valid.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}
