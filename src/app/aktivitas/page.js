"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ActivityGrid from "@/app/components/ActivityGrid";

// Pisahkan komponen yang menggunakan useSearchParams
function AktivitasContent() {
  const searchParams = useSearchParams();

  // ✅ kategori tetap, dibungkus useMemo supaya tidak berubah tiap render
  const categories = useMemo(() => ["Semua"], []);

  // ✅ lazy init activeCategory dari URL hanya di client
  const [activeCategory, setActiveCategory] = useState(() => {
    const categoryFromURL = searchParams.get("category");
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      return categoryFromURL;
    }
    return "Semua";
  });

  return (
    <>
      <section className="w-full bg-linear-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Event & Aktivitas</h1>

          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Nikmati berbagai kegiatan seru setiap minggu! Mulai dari kelas yoga pagi,
            workshop kreatif, hingga komunitas jogging yang selalu ramai.
            <br />
            <br />
            Ingin menaruh event atau aktivitas di sini? Hubungi kami di
            <span className="font-medium"> info@ruanghijaujakarta.id</span>.
          </p>

          <div className="flex flex-wrap gap-3 mt-10 justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeCategory === cat
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ActivityGrid activeCategory={activeCategory} />
      </div>
    </>
  );
}

// Komponen utama dengan Suspense boundary
export default function AktivitasPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    }>
      <AktivitasContent />
    </Suspense>
  );
}