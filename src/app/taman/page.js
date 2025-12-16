"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import ParkGrid from "@/app/components/ParkGrid";
import ParkDetailModal from "@/app/components/ParkDetailModal";
import { parkDetails } from "@/app/data/parkDetails";
import { parksData } from "@/app/data/parksData";

export default function TamanPage() {
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  // ✅ STATE LAMA (TIDAK DIUBAH)
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedId, setSelectedId] = useState(null);

  // ✅ TAMBAHAN (ANTI HYDRATION)
  const [loaded, setLoaded] = useState(false);

  const categories = ["Semua", "Taman Kota", "Hutan Kota", "Taman Tematik"];

  // ✅ mount aman
  useEffect(() => {
    setLoaded(true);
  }, []);

  // ✅ baca category dari URL (DITAMBAHKAN)
  useEffect(() => {
    if (!loaded) return;
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      setActiveCategory(categoryFromURL);
    }
  }, [loaded, categoryFromURL]);

  // ✅ LOGIC LAMA (TIDAK DIUBAH)
  const selectedPark = selectedId
    ? {
        ...parkDetails[selectedId],
        image: parksData.find((p) => p.id === selectedId)?.image,
      }
    : null;

  // ✅ cegah hydration error
  if (!loaded) {
    return <div className="w-full min-h-screen bg-white" />;
  }

  return (
    <>
      {/* ✅ HEADER + FILTER (LAMA, UTUH) */}
      <section className="w-full bg-gradient-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">

          <h1 className="text-4xl font-bold text-center">
            Taman di Jakarta Pusat
          </h1>

          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Jelajahi ruang hijau terbaik di Jakarta Pusat, mulai dari taman kota,
            hutan urban, hingga taman tematik untuk rekreasi.
          </p>

          {/* CATEGORY + SEARCH */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap gap-3">
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

            {/* SEARCH UI */}
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Cari taman..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm 
                           focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ GRID (LAMA, TIDAK DISENTUH) */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ParkGrid
          activeCategory={activeCategory}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      {/* ✅ MODAL (LAMA, TIDAK DISENTUH) */}
      {selectedPark && (
        <ParkDetailModal
          park={selectedPark}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
