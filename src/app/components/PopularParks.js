"use client";

import { MapPin, Star, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";
import ParkDetailModal from "./ParkDetailModal";
import { useReview } from "@/app/context/ReviewContext";
import { fetchParks } from "@/app/services/api";
import { parkDetails } from "@/app/data/parkDetails";

// Skeleton card
function ParkCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#F1F1F1] animate-pulse">
      <div className="w-full h-[170px] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded w-12" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
        <div className="flex justify-between pt-1">
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function PopularParks() {
  const { getAverageRating } = useReview();
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadParks = async () => {
      setLoading(true);
      const data = await fetchParks();
      setParks(data.slice(0, 3));
      setLoading(false);
    };
    loadParks();
  }, []);

  const selectedPark = selectedId
    ? {
      ...parkDetails[selectedId],
      ...parks.find((p) => String(p._id || p.id) === String(selectedId))
    }
    : null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold text-[#1A1A1A] font-poppins">Taman Populer</h2>
          <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto font-poppins">
            Destinasi favorit warga Jakarta untuk bersantai dan beraktivitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ParkCardSkeleton key={i} />)
            : parks.map((park) => {
              const id = park._id || park.id;
              const averageRating = parseFloat(getAverageRating(id));
              const roundedRating = Math.round(averageRating);
              const hasImage = park.image && park.image.trim() !== "";

              return (
                <div key={id} className="bg-white rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#F1F1F1]">
                  <div className="relative w-full h-[170px]">
                    <span className={`absolute top-3 left-3 z-20 px-3 py-1 text-[12px] font-medium rounded-full
                        ${park.category === "Taman Kota" ? "bg-[#E8F1FF] text-[#2476FF]"
                        : park.category === "Hutan Kota" ? "bg-[#E9F7EE] text-[#2E8B57]"
                          : "bg-gray-100 text-gray-600"}`}>
                      {park.category}
                    </span>

                    {averageRating > 0 && (
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-yellow-300/90 px-2 py-1 rounded-full">
                        {[...Array(roundedRating)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-600 fill-yellow-600" />
                        ))}
                      </div>
                    )}

                    {hasImage ? (
                      <img src={park.image} alt={park.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-2">
                        <ImageOff size={32} className="text-green-300" />
                        <span className="text-xs text-green-400">Belum ada foto</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[18px] font-semibold text-[#1A1A1A] font-poppins">{park.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-sm font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4 text-justify font-poppins line-clamp-2">
                      {park.bio || "Tidak ada deskripsi."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[14px] text-[#4B5563]">
                        <MapPin size={15} strokeWidth={2} className="text-[#F1559C]" />
                        <span>{park.location || "—"}</span>
                      </div>
                      <button
                        onClick={() => setSelectedId(id)}
                        className="text-[#1D4ED8] text-[14px] font-medium hover:underline font-poppins"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {selectedPark && (
        <ParkDetailModal park={selectedPark} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}