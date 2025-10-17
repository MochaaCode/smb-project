import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - SMB Suvanna Dipa",
  description:
    "Mengenal lebih dalam tentang filosofi dan program unik di SMB Suvanna Dipa.",
};

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Tentang SMB Suvanna Dipa
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Kami adalah komunitas yang berdedikasi untuk membentuk generasi muda
            yang tidak hanya cerdas, tetapi juga kaya akan nilai-nilai luhur
            seperti Metta (cinta kasih) dan Mindfulness (kesadaran penuh).
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://placehold.co/600x400/a0c4ff/ffffff?text=Anak-Anak+SMB"
              alt="Anak-anak SMB Suvanna Dipa"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Visi & Misi Kami
            </h2>
            <p className="text-gray-700 mb-6">
              Dengan target mencapai 70 siswa per minggu pada tahun 2025, kami
              berkomitmen untuk menciptakan lingkungan belajar yang positif,
              suportif, dan menyenangkan.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full h-6 w-6 text-center mr-4 mt-1">
                  ✔
                </span>
                <span>
                  Mengadopsi teknologi dengan absensi digital dan database
                  online.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full h-6 w-6 text-center mr-4 mt-1">
                  ✔
                </span>
                <span>
                  Meningkatkan rasa memiliki siswa melalui &apos;Students&apos; Book&apos; yang
                  personal.
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
