"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import ParkGrid from "@/app/components/ParkGrid";
import ParkDetailModal from "@/app/components/ParkDetailModal";
import { parkDetails } from "@/app/data/parkDetails";
import { parksData } from "@/app/data/parksData";

// Pisahkan komponen yang menggunakan useSearchParams
function TamanContent() {
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category");

  const categories = ["Semua", "Taman Kota", "Hutan Kota", "Taman Tematik"];

  // ✅ STATE dengan lazy init: langsung baca URL
  const [activeCategory, setActiveCategory] = useState(() => {
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      return categoryFromURL;
    }
    return "Semua";
  });

  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedPark = selectedId
    ? {
        ...parkDetails[selectedId],
        image: parksData.find((p) => p.id === selectedId)?.image,
      }
    : null;

  return (
    <>
      {/* HEADER */}
      <section className="w-full bg-linear-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            Taman di Jakarta Pusat
          </h1>
          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Jelajahi ruang hijau terbaik di Jakarta Pusat, mulai dari taman kota,
            hutan urban, hingga taman tematik untuk rekreasi.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">
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

            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Cari taman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm 
                           focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <ParkGrid
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      {selectedPark && (
        <ParkDetailModal
          park={selectedPark}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

// Komponen utama dengan Suspense boundary
export default function TamanPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-linear-to-b from-[#E8F7EF] via-[#F5FCF9] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat taman...</p>
        </div>
      </div>
    }>
      <TamanContent />
    </Suspense>
  );
}