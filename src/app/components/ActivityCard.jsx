"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export default function EventCard({ event, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden border border-[#EAEAEA]">
      <div className="relative w-full h-[170px]">
        <span className="absolute top-3 right-3 z-20 px-3 py-1 text-[12px] bg-black/60 text-white rounded-md font-medium">
          {event.date}
        </span>

        <Image src={event.image} alt={event.title} fill className="object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-[18px] font-semibold mb-2">{event.title}</h3>

        <p className="text-sm text-gray-600 mb-4 text-justify">{event.bio}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 gap-1">
            <MapPin size={15} className="text-green-600" />
            {event.location}
          </div>

          <button
            onClick={() => onSelect(event.id)}
            className="text-blue-700 font-medium hover:underline"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
