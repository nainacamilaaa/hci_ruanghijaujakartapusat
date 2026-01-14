"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { FaStar } from "react-icons/fa";

export default function ParkCard({ park, onSelect, rating = 0 }) {
  const categoryColors = {
    "Taman Kota": "bg-[#E8F1FF] text-[#2476FF]",
    "Hutan Kota": "bg-[#E9F7EE] text-[#2E8B57]",
    "Taman Tematik": "bg-[#FDE6EE] text-[#E74C8C]",
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#F1F1F1]">
      <div className="relative w-full h-[170px]">
        <span
          className={`absolute top-3 left-3 z-20 px-3 py-1 text-[12px] font-medium rounded-full 
          ${categoryColors[park.category]}`}
        >
          {park.category}
        </span>

        {/* RATING DI KANAN ATAS */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-yellow-300/90 px-2 py-1 rounded-full">
            {[...Array(Math.round(rating))].map((_, i) => (
              <FaStar key={i} size={12} className="text-yellow-600" />
            ))}
          </div>
        )}

        <Image
          src={park.image}
          alt={park.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[18px] font-semibold">{park.name}</h3>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" size={16} />
            <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 text-justify">
          {park.bio}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={15} className="text-pink-500" />
            {park.location}
          </div>

          <button
            onClick={() => onSelect(park.id)}
            className="text-blue-700 font-medium hover:underline"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
