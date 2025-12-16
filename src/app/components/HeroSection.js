import Image from "next/image";
import { FaSearch } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[560px]">
      {/* Background Image */}
      <Image
        src="/icon/bg.hero.svg"
        alt="Taman Jakarta"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">

          {/* TEXT BLOCK */}
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              <div>
                Temukan <span className="text-green-400">Ruang Hijau</span> Terbaik
              </div>
              <div>
                di Pusat Kota Jakarta
              </div>
            </h1>

            <p className="mt-4 text-sm md:text-base text-white/90 leading-relaxed">
              Jelajahi taman-taman indah, nikmati udara segar, dan rasakan
              ketenangan di tengah hiruk pikuk ibu kota.
            </p>

            <button
              className="
                mt-8 inline-flex items-center gap-2
                bg-green-500 hover:bg-green-600
                text-white
                px-6 py-3
                rounded-full
                text-sm font-semibold
                transition
              "
            >
              <FaSearch className="text-sm" />
              Cari Taman
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
