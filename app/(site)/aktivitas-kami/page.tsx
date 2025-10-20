import type { Metadata } from "next";
import Image from "next/image";
import AdvancedCarousel from "@/components/ui/AdvancedCarousel";

export const metadata: Metadata = {
  title: "Aktivitas Kami - SMB Suvanna Dipa",
  description:
    "Lihat berbagai kegiatan tahunan dan dokumentasi acara di SMB Suvanna Dipa.",
};

const annualActivities = [
  "Ultah Bersama",
  "Sincia",
  "Anjangsana",
  "Waisak",
  "Fangshen + Outbound",
  "Dhamma Bootcamp",
  "Asadha",
  "Parents Gathering & Graduation",
  "17 Agustus-an",
  "Sanghadana",
  "Family Blessing",
  "ODM",
];

const farmDayImages = [
  "https://placehold.co/600x400/c2f0c2/ffffff?text=Farm+Day+1",
  "https://placehold.co/600x400/99e699/ffffff?text=Farm+Day+2",
  "https://placehold.co/600x400/70db70/ffffff?text=Farm+Day+3",
  "https://placehold.co/600x400/47d147/ffffff?text=Farm+Day+4",
  "https://placehold.co/600x400/248f24/ffffff?text=Farm+Day+5",
];

const AktivitasPage = () => {
  return (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto space-y-16 px-4 sm:px-6 md:space-y-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            Aktivitas & Kegiatan
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 md:text-lg">
            Berbagai kegiatan kami rancang untuk membangun kebersamaan,
            kreativitas, dan karakter.
          </p>
        </div>

        <section>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Agenda Tahunan Kami
          </h2>
          <AdvancedCarousel
            mode="group"
            itemsToShowDesktop={3}
            itemsToShowMobile={2}
          >
            {annualActivities.map((activity, index) => (
              <div
                key={index}
                className="flex h-32 items-center justify-center rounded-lg bg-white p-4 text-center shadow-md ring-1 ring-inset ring-gray-200"
              >
                <span className="text-base font-semibold text-blue-800 sm:text-lg">
                  {activity}
                </span>
              </div>
            ))}
          </AdvancedCarousel>
        </section>

        <section>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Dokumentasi: Farm Day Outbond
          </h2>
          <AdvancedCarousel mode="center-focus">
            {farmDayImages.map((src, index) => (
              <div key={index} className="relative aspect-video w-full">
                <Image
                  src={src}
                  alt={`Farm Day ${index + 1}`}
                  fill
                  unoptimized
                  className="rounded-lg object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </AdvancedCarousel>
        </section>
      </div>
    </div>
  );
};

export default AktivitasPage;
