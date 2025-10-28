// file: actions/profileActions.ts

"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Skema untuk mengundang pengguna baru
const InviteUserSchema = z.object({
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  role: z.enum(["admin", "guru", "siswa"], {
    message: "Silakan pilih role yang valid.",
  }),
  class_id: z.coerce.number().optional(),
});

// Skema untuk mengedit profil
const EditProfileSchema = z.object({
  id: z.string().uuid("ID pengguna tidak valid."),
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  role: z.enum(["admin", "guru", "siswa"]),
  class_id: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
});

// =================================================================
// ACTION: Undang Pengguna Baru
// =================================================================
export async function inviteUser(formData: FormData) {
  console.log("--- 🚀 ACTION: inviteUser ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", rawFormData);

  const validatedFields = InviteUserSchema.safeParse({
    ...rawFormData,
    class_id: rawFormData.class_id || undefined,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

  console.log("[2/4] Validasi Zod Berhasil:", validatedFields.data);
  const { full_name, email, password, role, class_id } = validatedFields.data;

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });

  if (authError) {
    console.error("[❌ GAGAL] Supabase Auth Error:", authError.message);
    return { error: `Gagal membuat pengguna: ${authError.message}` };
  }

  console.log("[3/4] Pengguna berhasil dibuat di Auth:", user?.id);

  // Jika siswa, update profilnya dengan class_id
  if (user && role === "siswa" && class_id) {
    console.log(
      `[3.5/4] Role adalah siswa dengan class_id, mencoba update profil...`
    );
    const { error: profileError } = await (await createClient())
      .from("profiles")
      .update({ class_id: class_id })
      .eq("id", user.id);

    if (profileError) {
      console.error(
        "[❌ GAGAL] Gagal update class_id di profil:",
        profileError.message
      );
      return {
        error: `User dibuat, tapi gagal menempatkan ke kelas: ${profileError.message}`,
      };
    }
  }

  revalidatePath("/admin/profiles");
  console.log("[4/4] ✅ SUKSES: Pengguna diundang dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Edit Profil Pengguna
// =================================================================
export async function editProfile(formData: FormData) {
  console.log("--- 🚀 ACTION: editProfile ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", rawFormData);

  // ✅ PERBAIKAN DITERAPKAN DI SINI
  const validatedFields = EditProfileSchema.safeParse({
    ...rawFormData,
    class_id: rawFormData.class_id || undefined,
  });

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak lengkap." };
  }

  console.log("[2/4] Validasi Zod Berhasil:", validatedFields.data);
  const { id, full_name, role, class_id } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: full_name,
      role: role,
      class_id: role === "siswa" ? class_id : null,
    })
    .eq("id", id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Update Error:", error);
    return { error: "Gagal memperbarui profil." };
  }

  console.log("[3/4] Profil berhasil diupdate di database.");
  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${id}`);
  console.log("[4/4] ✅ SUKSES: Profil diupdate dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Hapus Pengguna
// =================================================================
export async function deleteAuthUser(formData: FormData) {
  console.log("--- 🚀 ACTION: deleteAuthUser ---");
  const rawFormData = Object.fromEntries(formData.entries());
  console.log("[1/4] Menerima FormData:", rawFormData);

  const DeleteUserSchema = z.object({
    id: z.string().uuid("ID Pengguna tidak valid."),
  });

  const validatedFields = DeleteUserSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.error(
      "[❌ GAGAL] Validasi Zod Gagal:",
      validatedFields.error.flatten()
    );
    return { error: "ID Pengguna tidak ditemukan." };
  }

  const { id } = validatedFields.data;
  console.log("[2/4] Validasi ID Berhasil:", id);

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error("[❌ GAGAL] Supabase Delete Error:", error);
    return { error: `Gagal menghapus pengguna: ${error.message}` };
  }

  console.log("[3/4] Pengguna berhasil dihapus dari Auth.");
  revalidatePath("/admin/profiles");
  console.log("[4/4] ✅ SUKSES: Pengguna dihapus dan path direvalidasi.");
  return { success: true };
}

// =================================================================
// ACTION: Ambil Detail Pengguna
// =================================================================
export async function getUserDetailsAction(userId: string) {
  console.log("--- 🚀 ACTION: getUserDetailsAction ---");
  console.log("[1/4] Menerima User ID:", userId);

  const UuidSchema = z.string().uuid();
  if (!UuidSchema.safeParse(userId).success) {
    console.error("[❌ GAGAL] Format User ID tidak valid.");
    return { error: "Format ID pengguna tidak valid." };
  }

  const supabase = await createClient();
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profileData) {
    console.error(
      "[❌ GAGAL] Gagal mengambil profil:",
      profileError?.message || "Data profil kosong."
    );
    return { error: "Profil tidak ditemukan." };
  }

  console.log("[2/4] Profil ditemukan:", profileData);

  const [
    { data: pointHistoryData, error: pointHistoryError },
    { data: orderHistoryData, error: orderHistoryError },
  ] = await Promise.all([
    supabase
      .from("point_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("product_orders")
      .select("id, created_at, status, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  console.log("[3/4] Mengambil riwayat poin dan pesanan...");
  if (pointHistoryError)
    console.warn(
      "  -> Peringatan saat ambil riwayat poin:",
      pointHistoryError.message
    );
  if (orderHistoryError)
    console.warn(
      "  -> Peringatan saat ambil riwayat pesanan:",
      orderHistoryError.message
    );

  const finalData = {
    data: {
      profile: profileData,
      pointHistory: pointHistoryData || [],
      orderHistory: orderHistoryData || [],
    },
  };

  console.log("[4/4] ✅ SUKSES: Mengembalikan data gabungan.");
  return finalData;
}
