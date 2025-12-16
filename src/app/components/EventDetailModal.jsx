"use client";

import Image from "next/image";
import { X, Calendar, Clock, MapPin, Ticket } from "lucide-react";

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 overflow-hidden relative shadow-xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <div className="grid md:grid-cols-2">

          {/* LEFT IMAGE */}
          <div className="relative w-full h-[420px]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="p-6 md:p-8 flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-tight">
              {event.title}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {event.desc}
            </p>

            <div className="flex flex-col gap-3 mt-4 text-sm text-gray-800">

              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <span>{event.dateRange}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={18} />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <Ticket size={18} />
                <span>{event.price}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-1">Information Event:</p>
              <a
                href={event.link}
                target="_blank"
                className="text-blue-600 hover:underline break-all"
              >
                {event.link}
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
