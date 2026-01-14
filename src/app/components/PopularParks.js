"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import ParkDetailModal from "./ParkDetailModal";
import { useReview } from "@/app/context/ReviewContext";
import { fetchParks } from "@/app/services/api";
import { parkDetails } from "@/app/data/parkDetails";

export default function PopularParks() {
  const { getAverageRating } = useReview();
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch parks dan ambil 3 pertama
  useEffect(() => {
    const loadParks = async () => {
      setLoading(true);
      const data = await fetchParks();
      setParks(data.slice(0, 3));
      setLoading(false);
    };
    loadParks();
  }, []);

  // MERGE DATA API + parkDetails
  const selectedPark = selectedId
    ? {
        ...parks.find((p) => p.id === selectedId),
        ...parkDetails[selectedId],
      }
    : null;

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Loading popular parks...
      </div>
    );
  }

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

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {parks.map((park) => (
            <div
              key={park.id}
              className="bg-white rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#F1F1F1]"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[170px]">
                <span
                  className={`absolute top-3 left-3 z-20 px-3 py-1 text-[12px] font-medium rounded-full
                  ${
                    park.category === "Taman Kota"
                      ? "bg-[#E8F1FF] text-[#2476FF]"
                      : park.category === "Hutan Kota"
                      ? "bg-[#E9F7EE] text-[#2E8B57]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {park.category}
                </span>

                {/* RATING BADGE */}
                {parseFloat(getAverageRating(park.id)) > 0 && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-yellow-300/90 px-2 py-1 rounded-full">
                    {[...Array(Math.round(getAverageRating(park.id)))].map(
                      (_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          className="text-yellow-600"
                        />
                      )
                    )}
                  </div>
                )}

                <Image
                  src={park.image || "/images/park-default.jpg"}
                  alt={park.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                {/* TITLE + RATING */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[18px] font-semibold text-[#1A1A1A] font-poppins">
                    {park.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" size={16} />
                    <span className="text-sm font-semibold text-gray-700">
                      {parseFloat(getAverageRating(park.id)).toFixed(1)}
                    </span>
                  </div>
                </div>

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

                  <button
                    onClick={() => setSelectedId(park.id)}
                    className="text-[#1D4ED8] text-[14px] font-medium hover:underline font-poppins"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedPark && (
        <ParkDetailModal
          park={selectedPark}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
