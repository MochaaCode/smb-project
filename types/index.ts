// ====================================================================
// TIPE ENTITAS INTI (CORE ENTITIES)
// Representasi 1:1 dari tabel di database Supabase kita.
// ====================================================================

/** Mewakili satu baris di tabel 'profiles' */
export interface Profile {
  id: string; // UUID
  full_name: string | null;
  role: "admin" | "guru" | "siswa";
  points: number;
  updated_at: string | null;
  class_id: number | null;
}

/** Mewakili satu baris di tabel 'classes' */
export interface Class {
  id: number;
  name: string;
  teacher_id: string | null; // UUID dari profil guru
  created_at: string;
}

/** Mewakili satu baris di tabel 'products' */
export interface Product {
  id: number;
  created_at: string;
  name: string;
  stock: number;
  price: number;
}

/** Mewakili satu baris di tabel 'content' */
export interface Content {
  id: number;
  title: string;
  body: string | null;
  status: "draft" | "published";
  author_id: string | null; // UUID dari profil pembuat
  created_at: string;
  published_at: string | null;
}

/** Mewakili satu baris di tabel 'product_orders' */
export interface ProductOrder {
  id: number;
  user_id: string; // UUID dari profil siswa
  product_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

/** Mewakili satu baris di tabel 'point_history' */
export interface PointHistory {
  id: number;
  user_id: string; // UUID dari profil siswa
  amount: number;
  reason: string;
  order_id: number | null;
  created_at: string;
}

// Tipe untuk setiap item di riwayat pesanan
export type UserOrderHistoryItem = {
    id: number;
    created_at: string;
    status: string;
    products: {
        name: string;
    }[] | null;
};

// Tipe untuk "nampan" data lengkap yang dikirim dari server ke client
export type ProfileDetails = {
    profile: Profile;
    pointHistory: PointHistory[];
    orderHistory: UserOrderHistoryItem[];
};

// ====================================================================
// TIPE GABUNGAN (COMPOSITE / VIEW TYPES)
// Tipe khusus yang digunakan di UI untuk menampilkan data hasil JOIN.
// ====================================================================

/**
 * Tipe gabungan untuk halaman 'Manajemen Kelas'.
 * Menggabungkan data 'Class' dengan nama wali kelasnya.
 */
export interface ClassDetails extends Class {
  teacher: {
    full_name: string;
  } | null;
}

// menggabungkan data Profile dengan nama kelasnya.
export type StudentWithClass = Profile & {
  classes: {
    name: string;
  } | null;
};

/**
 * Tipe gabungan UNIVERSAL untuk menampilkan detail pesanan.
 * Ini menggantikan 'UserOrderHistoryItem' yang lama.
 * Bisa digunakan di halaman riwayat siswa DAN di halaman detail pengguna admin.
 */
export interface OrderDetails extends ProductOrder {
  profiles: {
    full_name: string;
    points?: number; // Poin bersifat opsional
  } | null;
  products: {
    name: string;
    price?: number; // Harga bersifat opsional
  } | null;
}

// ====================================================================
// TIPE UTILITAS (UTILITY TYPES)
// Tipe-tipe helper untuk hal-hal seperti Server Actions.
// ====================================================================

/** Tipe standar untuk struktur kembalian dari Server Action */
export type ServerActionResponse<T> = {
  data?: T | null;
  success?: boolean | string | null;
  error?: string | null;
};
