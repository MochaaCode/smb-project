import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - SMB Suvanna Dipa",
  description:
    "Mengenal lebih dalam tentang filosofi dan program unik di SMB Suvanna Dipa.",
};

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 md:py-12">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Tentang SMB Suvanna Dipa
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 dark:text-white md:text-lg">
            Kami adalah komunitas yang berdedikasi untuk membentuk generasi muda
            yang tidak hanya cerdas, tetapi juga kaya akan nilai-nilai luhur
            seperti Metta (cinta kasih) dan Mindfulness (kesadaran penuh).
          </p>
        </div>

        {/* Visi Misi Section */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Gambar akan muncul di atas pada layar kecil */}
          <div className="order-1 md:order-2">
            <img
              src="https://placehold.co/600x400/a0c4ff/ffffff?text=Anak-Anak+SMB"
              alt="Anak-anak SMB Suvanna Dipa"
              className="h-auto w-full rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="order-2 md:order-1">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
              Visi & Misi Kami
            </h2>
            <p className="mb-6 text-gray-700 dark:text-white">
              Dengan target mencapai 70 siswa per minggu pada tahun 2025, kami
              berkomitmen untuk menciptakan lingkungan belajar yang positif,
              suportif, dan menyenangkan.
            </p>
            <ul className="space-y-4 dark:text-white">
              <li className="flex items-start">
                <span className="mt-1 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  ✔
                </span>
                <span>
                  Mengadopsi teknologi dengan absensi digital dan database
                  online.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mt-1 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  ✔
                </span>
                <span>
                  Meningkatkan rasa memiliki siswa melalui &apos;Students&apos;
                  Book&apos; yang personal.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
