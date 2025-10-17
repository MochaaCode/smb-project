import type { Metadata } from "next";

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

const AktivitasPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Aktivitas & Kegiatan
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Berbagai kegiatan kami rancang untuk membangun kebersamaan,
            kreativitas, dan karakter.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Agenda Tahunan Kami
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {annualActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full shadow-sm"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Dokumentasi: Farm Day Outbond
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img
              src="https://placehold.co/600x400/c2f0c2/ffffff?text=Farm+Day+1"
              alt="Farm Day 1"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <img
              src="https://placehold.co/600x400/c2f0c2/ffffff?text=Farm+Day+2"
              alt="Farm Day 2"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <img
              src="https://placehold.co/600x400/c2f0c2/ffffff?text=Farm+Day+3"
              alt="Farm Day 3"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AktivitasPage;
