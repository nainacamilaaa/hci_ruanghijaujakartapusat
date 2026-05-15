"use client";

import { useState } from "react";
import { MapPin, Bookmark, ImageOff } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useBookmark } from "@/app/hooks/useBookmark";

// Skeleton card untuk loading state
export function ParkCardSkeleton() {
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

export default function ParkCard({ park, onSelect, rating = 0 }) {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const bookmarked = isBookmarked(park._id || park.id);
  const [imgError, setImgError] = useState(false);

  const categoryColors = {
    "Taman Kota":   "bg-[#E8F1FF] text-[#2476FF]",
    "Hutan Kota":   "bg-[#E9F7EE] text-[#2E8B57]",
    "Taman Tematik":"bg-[#FDE6EE] text-[#E74C8C]",
  };

  const hasImage = park.image && !imgError;

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#F1F1F1] hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full h-[170px]">
        {/* category badge */}
        <span className={`absolute top-3 left-3 z-20 px-3 py-1 text-[12px] font-medium rounded-full ${categoryColors[park.category] || "bg-gray-100 text-gray-600"}`}>
          {park.category}
        </span>

        {/* rating badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-yellow-300/90 px-2 py-1 rounded-full">
            {[...Array(Math.round(rating))].map((_, i) => (
              <FaStar key={i} size={12} className="text-yellow-600" />
            ))}
          </div>
        )}

        {/* gambar atau placeholder */}
        {hasImage ? (
          <img
            src={park.image}
            alt={park.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-2">
            <ImageOff size={32} className="text-green-300" />
            <span className="text-xs text-green-400">Belum ada foto</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[18px] font-semibold truncate pr-2">{park.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <FaStar className="text-yellow-400" size={14} />
            <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 text-justify line-clamp-2">
          {park.bio || "Tidak ada deskripsi."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
            <MapPin size={15} className="text-pink-500 flex-shrink-0" />
            <span className="truncate">{park.location || "—"}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-2">
            <button
              onClick={() => toggleBookmark(park._id || park.id)}
              title={bookmarked ? "Hapus bookmark" : "Simpan taman"}
            >
              <Bookmark
                size={20}
                className={bookmarked
                  ? "fill-green-600 text-green-600"
                  : "text-gray-400 hover:text-green-600 transition-colors"}
              />
            </button>
            <button
              onClick={() => onSelect(park._id || park.id)}
              className="text-blue-700 font-medium hover:underline text-sm"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}