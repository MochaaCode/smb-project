"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Skema validasi untuk login
const LoginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

// Fungsi untuk login Admin & Guru
export async function signInAdmin(formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // Jika validasi gagal, kembali ke halaman login dengan pesan error
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0].message;
    return redirect(`/login?message=${errorMessage}`);
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !user) {
    return redirect("/login?message=Email atau Password salah.");
  }

  // Cek role setelah login berhasil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return redirect("/admin/dashboard");
  }
  if (profile?.role === "guru") {
    return redirect("/admin/kelas-saya"); // Tujuan utama guru
  }

  // Jika role-nya siswa atau tidak dikenali, tendang keluar
  await supabase.auth.signOut();
  return redirect("/login?message=Anda tidak memiliki akses ke panel ini.");
}

// Fungsi untuk login Siswa
export async function signInUser(formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0].message;
    return redirect(`/?message=${errorMessage}`);
  }

  const { email, password } = validatedFields.data;
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
    await supabase.auth.signOut();
    return redirect("/?message=Gagal mendapatkan data profil pengguna.");
  }

  // Arahkan berdasarkan role
  if (profile.role === "admin" || profile.role === "guru") {
    await supabase.auth.signOut();
    return redirect(
      "/?message=Akun admin/guru harus login melalui panel admin."
    );
  }
  if (profile.role === "siswa") {
    return redirect("/siswa/dashboard");
  }

  await supabase.auth.signOut();
  return redirect("/?message=Role pengguna tidak valid.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}
