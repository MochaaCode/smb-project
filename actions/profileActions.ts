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

export async function inviteUser(formData: FormData) {
  const validatedFields = InviteUserSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    class_id: formData.get("class_id") || undefined,
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak valid." };
  }

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
    return { error: `Gagal membuat pengguna: ${authError.message}` };
  }

  if (user && role === "siswa" && class_id) {
    const { error: profileError } = await (await createClient())
      .from("profiles")
      .update({ class_id: class_id })
      .eq("id", user.id);

    if (profileError) {
      return {
        error: `User dibuat, tapi gagal menempatkan ke kelas: ${profileError.message}`,
      };
    }
  }

  revalidatePath("/admin/profiles");
  return { success: true };
}

export async function editProfile(formData: FormData) {
  const validatedFields = EditProfileSchema.safeParse({
    id: formData.get("id"),
    full_name: formData.get("full_name"),
    role: formData.get("role"),
    class_id: formData.get("class_id") as string,
  });

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return { error: firstError || "Data tidak lengkap." };
  }

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
    console.error("Edit Profile Error:", error);
    return { error: "Gagal memperbarui profil." };
  }

  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${id}`);
  return { success: true };
}

export async function deleteAuthUser(formData: FormData) {
  const DeleteUserSchema = z.object({
    id: z.string().uuid("ID Pengguna tidak valid."),
  });

  const validatedFields = DeleteUserSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return { error: "ID Pengguna tidak ditemukan." };
  }

  const { id } = validatedFields.data;

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error("Supabase Delete Error:", error);
    return { error: `Gagal menghapus pengguna: ${error.message}` };
  }

  revalidatePath("/admin/profiles");
  return { success: true };
}

export async function getUserDetailsAction(userId: string) {
  const UuidSchema = z.string().uuid();
  if (!UuidSchema.safeParse(userId).success) {
    return { error: "Format ID pengguna tidak valid." };
  }

  const supabase = await createClient();
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profileData) {
    return { error: "Profil tidak ditemukan." };
  }

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

  if (pointHistoryError)
    console.error("Fetch point history error:", pointHistoryError);
  if (orderHistoryError)
    console.error("Fetch order history error:", orderHistoryError);

  return {
    data: {
      profile: profileData,
      pointHistory: pointHistoryData || [],
      orderHistory: orderHistoryData || [],
    },
  };
}
