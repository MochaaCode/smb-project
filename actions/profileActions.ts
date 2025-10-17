"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function inviteUser(formData: FormData) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const class_id = formData.get("class_id") as string;

  if (!fullName || !email || !password || !role) {
    return { error: "Semua field wajib diisi." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: role },
  });

  if (authError) {
    return { error: `Gagal membuat pengguna baru: ${authError.message}` };
  }

  if (role === "siswa" && class_id && user) {
    const { error: profileError } = await (
      await createClient()
    )
      .from("profiles")
      .update({ class_id: parseInt(class_id, 10) })
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
  const supabase = await createClient();
  const profileId = formData.get("id") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const class_id = formData.get("class_id") as string;

  if (!profileId || !fullName || !role) {
    return { error: "Data tidak lengkap." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role: role,
      class_id: role === "siswa" ? parseInt(class_id, 10) : null, // Hanya siswa yang punya kelas
    })
    .eq("id", profileId);

  if (error) {
    console.error("Edit Profile Error:", error);
    return { error: "Gagal memperbarui profil." };
  }

  revalidatePath("/admin/profiles");
  return { success: true };
}

export async function deleteAuthUser(formData: FormData) {
  // Fungsi ini juga harus menggunakan Kunci Master
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = formData.get("id") as string;

  if (!userId) {
    return { error: "ID Pengguna tidak ditemukan." };
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Supabase Delete Error:", error);
    return { error: `Gagal menghapus pengguna: ${error.message}` };
  }

  revalidatePath("/admin/profiles");
  return { success: true };
}

export async function getUserDetailsAction(userId: string) {
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

  const responseData = {
    data: {
      profile: profileData,
      pointHistory: pointHistoryData || [],
      orderHistory: orderHistoryData || [],
    },
  };

  return responseData;
}
