// file: actions/authActions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Skema validasi tunggal untuk semua login
const LoginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

// =================================================================
// ACTION: Sign In (Masuk)
// =================================================================
export async function signIn(formData: FormData) {
  console.log("--- 🚀 ACTION: signIn ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/6] Menerima FormData:", {
    email: rawFormData.email,
    password: "[DIREDAKSI]",
  });

  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const errorMessage = validatedFields.error.issues[0].message;
    return redirect(`/?message=${errorMessage}`);
  }

  console.log("[2/6] Validasi Zod Berhasil.");
  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    console.error(
      "[❌ GAGAL] Supabase Auth Error:",
      authError?.message || "User tidak ditemukan."
    );
    return redirect("/?message=Email atau Password yang Anda masukkan salah.");
  }

  console.log(
    "[3/6] Autentikasi Supabase Berhasil, User ID:",
    authData.user.id
  );

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    console.error(
      "[❌ GAGAL] Gagal mengambil profil:",
      profileError?.message || "Profil tidak ditemukan di database."
    );
    await supabase.auth.signOut(); // Logout paksa jika profil tidak ada
    return redirect("/?message=Gagal login, data pengguna tidak ditemukan.");
  }

  console.log("[4/6] Pengambilan Profil Berhasil, Role:", profile.role);

  let destination = "/";
  switch (profile.role) {
    case "admin":
      destination = "/admin/dashboard";
      break;
    case "guru":
      destination = "/admin/myclass";
      break;
    case "siswa":
      destination = "/siswa/dashboard";
      break;
    default:
      console.warn(
        "[⚠️ PERINGATAN] Role pengguna tidak dikenali:",
        profile.role
      );
      await supabase.auth.signOut();
      return redirect("/?message=Role pengguna tidak dikenali.");
  }

  console.log(`[5/6] Mengarahkan pengguna ke: ${destination}`);
  console.log("[6/6] ✅ SUKSES: Proses sign-in selesai.");
  return redirect(destination);
}

// =================================================================
// ACTION: Sign Out (Keluar)
// =================================================================
export async function signOut() {
  console.log("--- 🚀 ACTION: signOut ---");
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Ini jarang terjadi, tapi baik untuk ditangani
      console.error("[❌ GAGAL] Supabase SignOut Error:", error);
      return redirect("/?message=Gagal logout, silakan coba lagi.");
    }

    console.log("[1/1] ✅ SUKSES: Pengguna berhasil logout.");
  } catch (e: any) {
    console.error(
      "[❌ GAGAL] Terjadi error tak terduga saat logout:",
      e.message
    );
    // Fallback jika createClient atau proses lain gagal
    return redirect("/?message=Terjadi kesalahan pada server.");
  }

  // Redirect di luar blok try...catch untuk memastikan selalu dijalankan
  return redirect("/?message=Anda telah logout.");
}
