import Image from "next/image";
import { MapPin } from "lucide-react";


const parks = [
  {
    name: "Taman Monas",
    image: "/icon/tamannmonas.svg",
    location: "Jakarta Pusat",
    rating: "4.8",
    bio: "Ikon Jakarta dengan area hijau luas, joging track, dan spot foto favorit.",
  },
  {
    name: "Taman Suropati",
    image: "/icon/tamannsuropati.svg",
    location: "Jakarta Pusat",
    rating: "4.7",
    bio: "Taman teduh dengan pepohonan besar, cocok untuk santai dan olahraga.",
  },
  {
    name: "Taman Lapangan Banteng",
    image: "/icon/tamanlapanganbanteng.svg",
    location: "Jakarta Pusat",
    rating: "4.6",
    bio: "Taman modern dengan air mancur menari dan area publik yang luas.",
  },
];

export default function PopularParks() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* TITLE */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold text-[#1A1A1A] font-poppins">
            Taman Populer
          </h2>
          <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto font-poppins">
            Destinasi favorit warga Jakarta untuk bersantai dan beraktivitas
          </p>
        </div>

        {/* GRID — persis ParkCard style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {parks.map((park, index) => (
            <div
              key={index}
              className="
                bg-white 
                rounded-3xl 
                shadow-[0_4px_14px_rgba(0,0,0,0.06)] 
                overflow-hidden 
                border border-[#F1F1F1]
              "
            >
              {/* IMAGE */}
              <div className="relative w-full h-[170px]">
                <Image
                  src={park.image}
                  alt={park.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                
                {/* TITLE */}
                <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2 font-poppins">
                  {park.name}
                </h3>

                {/* BIO */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 text-justify font-poppins">
                  {park.bio}
                </p>

                {/* LOCATION + DETAIL */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[14px] text-[#4B5563]">
                    <MapPin
                      size={15}
                      strokeWidth={2}
                      className="text-[#F1559C]"
                    />
                    <span>{park.location}</span>
                  </div>

                  <button className="text-[#1D4ED8] text-[14px] font-medium hover:underline font-poppins">
                    Lihat Detail
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
