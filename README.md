# Portal Siswa SMB Suvanna Dipa

<div align="center">
  <img src="https://placehold.co/800x400/a0c4ff/ffffff?text=Portal+Siswa+SMB" alt="Hero Image Portal Siswa" style="border-radius: 8px;"/>
</div>

<p align="center">
  <strong>Sebuah platform digital modern untuk manajemen siswa, poin, dan aktivitas sekolah.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
</p>

## 🚀 Tentang Proyek Ini

**Portal Siswa SMB Suvanna Dipa** adalah sebuah aplikasi web lengkap yang dirancang untuk merevolusi cara sekolah berinteraksi dengan siswa dan guru. Aplikasi ini menyediakan tiga portal utama dengan fungsionalitas yang terpisah namun terintegrasi: halaman publik, dasbor siswa, dan panel admin/guru yang komprehensif.

Proyek ini dibangun dengan arsitektur modern yang mengutamakan kecepatan, keamanan, dan pengalaman pengguna yang luar biasa.

## ✨ Keunggulan & Fitur Utama

-   **Arsitektur Modern dengan Next.js App Router**: Menggunakan fitur terbaru dari Next.js seperti *Server Components*, *Server Actions*, dan *Route Groups* untuk performa optimal dan pemisahan logika yang rapi.
-   **Backend *Serverless* dengan Supabase**: Seluruh backend, mulai dari database PostgreSQL, otentikasi, hingga penyimpanan file, dikelola oleh Supabase, memberikan skalabilitas tinggi dengan biaya efisien.
-   ***Real-time & Secure***: Otentikasi dan manajemen sesi ditangani dengan aman menggunakan Supabase Auth (termasuk *Row Level Security*) dan *middleware* di Next.js.
-   **Tiga Portal Terintegrasi**:
    1.  **Portal Publik (`/app/(site)`):** Halaman informasi umum seperti Beranda, Tentang Kami, dan Aktivitas.
    2.  **Portal Siswa (`/app/(siswa)`):** Dasbor personal untuk siswa melihat poin, menukar hadiah, melihat materi, dan riwayat aktivitas.
    3.  **Portal Admin & Guru (`/app/(admin)`):** Panel kontrol untuk mengelola seluruh data sistem, mulai dari pengguna, kelas, produk, pesanan, hingga konten.
-   **Pemisahan Logika yang Jelas**: Server-side logic ditempatkan di dalam *Server Components* dan **Next.js Server Actions** (`/actions`), membuat kode lebih aman dan terorganisir.
-   **Manajemen Tipe Data Terpusat**: Semua bentuk data dan *interface* didefinisikan secara terpusat di `/types/index.ts` untuk konsistensi di seluruh aplikasi.
-   **UI Modern & Responsif**: Dibangun dengan **Tailwind CSS**, memastikan tampilan yang konsisten dan adaptif di berbagai perangkat.

## 🛠️ Arsitektur & Teknologi

Proyek ini mengadopsi pendekatan *full-stack* TypeScript dengan teknologi pilihan:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
-   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: Komponen React kustom dengan *headless approach*.
-   **Validasi Data**: [Zod](https://zod.dev/) untuk validasi skema di Server Actions.
-   **Linting & Formatting**: ESLint
-   **Deployment**: Siap di-deploy di [Vercel](https://vercel.com).

## 🏁 Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat

-   Node.js (v18.18.0 atau lebih baru)
-   Sebuah akun dan proyek di [Supabase](https://supabase.com/).

### 2. Kloning Repository

```bash
git clone [https://github.com/mochaacode/smb-project.git](https://github.com/mochaacode/smb-project.git)
cd smb-project
```

### 3. Instalasi Depedensi
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 4. Konfigurasi Lingkungan (Environment)
Proyek ini membutuhkan koneksi ke Supabase.
1. Buat file baru bernama (`.env.local`) di root direktori proyek.
2. Salin dan tempel konten di bawah ini ke dalam file tersebut:
```Bash
NEXT_PUBLIC_SUPABASE_URL="ALAMAT_URL_PROYEK_SUPABASE_ANDA"
NEXT_PUBLIC_SUPABASE_ANON_KEY="ANON_KEY_PROYEK_SUPABASE_ANDA"
SUPABASE_SERVICE_ROLE_KEY="SERVICE_ROLE_KEY_PROYEK_SUPABASE_ANDA"
```
3. Ganti nilai variabel dengan kredensial dari proyek Supabase Anda. Anda bisa menemukannya di Project Settings > API.

`NEXT_PUBLIC_SUPABASE_URL` : URL proyek Supabase Anda.  
`NEXT_PUBLIC_SUPABASE_ANON_KEY` : Kunci anon (public) proyek Anda.  
`SUPABASE_SERVICE_ROLE_KEY` : Kunci service_role (secret) proyek Anda. Diperlukan untuk Server Actions yang membutuhkan hak akses admin.

### 5. Menjalankan Server Development
```Bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📂 Struktur Direktori

Berikut adalah penjelasan mengenai struktur direktori utama dalam proyek ini untuk membantu Anda bernavigasi:  
```Bash
smb-project/  
├── .github/               # Konfigurasi GitHub, termasuk cron job untuk menjaga Supabase tetap aktif.  
├── actions/               # Kumpulan Next.js Server Actions, "otak" dari semua operasi backend.  
│   ├── authActions.ts     # Logika untuk login (admin, guru, siswa) dan logout.  
│   ├── classActions.ts    # CRUD untuk data kelas.  
│   ├── materialActions.ts # CRUD untuk materi pelajaran, termasuk upload file ke Supabase Storage.  
│   └── ...                # Actions lainnya untuk produk, poin, profil, dll.  
├── app/                   # Direktori utama Next.js App Router.  
│   ├── (admin)/           # Route group untuk portal Admin & Guru.  
│   │   └── admin/         # URL base /admin, berisi halaman-halaman manajemen.  
│   ├── (siswa)/           # Route group untuk portal Siswa.  
│   │   └── siswa/         # URL base /siswa, berisi dasbor dan fitur-fitur siswa.  
│   ├── (site)/            # Route group untuk halaman publik.  
│   │   └── page.tsx       # Halaman utama (Homepage) dan halaman publik lainnya.  
│   ├── api/               # Route Handlers untuk kebutuhan spesifik seperti download file.  
│   ├── layout.tsx         # Layout utama aplikasi.  
│   └── login/             # Halaman login khusus untuk admin/guru.  
├── components/            # Kumpulan komponen React yang dapat digunakan kembali.  
│   ├── admin/             # Komponen spesifik untuk panel admin (e.g., Sidebar, Charts).  
│   ├── siswa/             # Komponen spesifik untuk portal siswa (e.g., Katalog Produk).  
│   └── ui/                # Komponen UI generik (e.g., Modal, Button, Input).  
├── lib/                   # Berisi fungsi-fungsi utilitas dan konfigurasi.  
│   └── supabase/          # Konfigurasi client dan server Supabase.  
├── public/                # Aset statis (gambar, ikon, dll).  
├── types/                 # Definisi tipe data TypeScript.  
│   └── index.ts           # File tunggal yang mendefinisikan semua interface dan tipe data.  
└── middleware.ts          # Middleware untuk proteksi route (otentikasi dan otorisasi).  
```
