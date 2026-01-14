"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import ActivityGrid from "@/app/components/ActivityGrid";

export default function AktivitasPage() {
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  // 🔹 kategori tetap
  const categories = ["Semua"];

  // ✅ lazy init activeCategory dari URL (jika valid)
  const [activeCategory, setActiveCategory] = useState(() => {
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      return categoryFromURL;
    }
    return "Semua";
  });

  const [loaded, setLoaded] = useState(false);

  // 🔹 trigger loaded setelah render pertama (CSR safe)
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return <div className="w-full min-h-screen bg-white" />;
  }

  return (
    <>
      {/* 🟢 HEADER */}
      <section className="w-full bg-linear-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Event & Aktivitas</h1>

          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Nikmati berbagai kegiatan seru setiap minggu! Mulai dari kelas yoga pagi,
            workshop kreatif, hingga komunitas jogging yang selalu ramai.
            <br /><br />
            Ingin menaruh event atau aktivitas di sini? Hubungi kami di
            <span className="font-medium"> info@ruanghijaujakarta.id</span>.
          </p>

          {/* CATEGORY TABS */}
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

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ActivityGrid activeCategory={activeCategory} />
      </div>
    </>
  );
}
