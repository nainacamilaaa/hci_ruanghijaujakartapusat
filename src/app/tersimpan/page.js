"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import ParkCard from "@/app/components/ParkCard";
import ParkDetailModal from "@/app/components/ParkDetailModal";
import { parkDetails } from "@/app/data/parkDetails";
import { useBookmark } from "@/app/hooks/useBookmark";
import { useReview } from "@/app/context/ReviewContext";
import { fetchParks } from "@/app/services/api";

export default function TersimpanPage() {
  const { bookmarks, loading: bookmarkLoading } = useBookmark();
  const { getAverageRating } = useReview();
  const [allParks, setAllParks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [parksLoading, setParksLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchParks();
      setAllParks(data);
      setParksLoading(false);
    };
    load();
  }, []);

  const savedParks = allParks.filter((p) => bookmarks.includes(p.id));

  const selectedPark = selectedId
    ? {
        ...parkDetails[selectedId],
        image: allParks.find((p) => p.id === selectedId)?.image,
      }
    : null;

  const isLoading = bookmarkLoading || parksLoading;

  return (
    <>
      {/* HEADER */}
      <section className="w-full bg-linear-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Bookmark size={32} className="text-green-600 fill-green-600" />
            <h1 className="text-4xl font-bold">Taman Tersimpan</h1>
          </div>
          <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
            Koleksi taman hijau yang kamu simpan di Jakarta Pusat.
          </p>
        </div>
      </section>

      {/* KONTEN */}
      <div className="max-w-7xl mx-auto px-4 pb-12 mt-8">
        {isLoading ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Memuat taman tersimpan...</p>
          </div>
        ) : savedParks.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center mt-20 gap-4 text-gray-400">
            <Bookmark size={56} strokeWidth={1.5} />
            <p className="text-lg font-medium">Belum ada taman yang disimpan</p>
            <p className="text-sm text-center">
              Tekan ikon <Bookmark size={14} className="inline" /> di kartu taman untuk menyimpannya di sini.
            </p>
            <a
              href="/taman"
              className="mt-2 px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition"
            >
              Jelajahi Taman
            </a>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{savedParks.length} taman tersimpan</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedParks.map((park) => (
                <ParkCard
                  key={park.id}
                  park={park}
                  onSelect={(id) => setSelectedId(id)}
                  rating={parseFloat(getAverageRating(park.id))}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedPark && (
        <ParkDetailModal
          park={selectedPark}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}