"use client";

import { useState, useMemo, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { fetchEvents } from "@/app/services/api";
import eventDetails from "@/app/data/eventDetails";
import Image from "next/image";


export default function ActivityGrid({ activeCategory }) {
  const itemsPerPage = 12;
  const [page, setPage] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events dari API
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchEvents();
      setEventData(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  // ======================
  // 🔥 FILTER + SORT
  // ======================
  const filteredData = useMemo(() => {
    let data = [...eventData];

    if (activeCategory === "Terbaru") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (activeCategory === "Terlama") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return data;
  }, [activeCategory, eventData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  if (loading) {
    return <div className="text-center text-gray-500">Loading events...</div>;
  }

  // ======================
  // 🔥 EVENT CARD (UI TIDAK DIUBAH)
  // ======================
  const EventCard = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative">
      <span className="absolute top-3 right-3 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
        {item.displayDate || item.date}
      </span>

      <div className="w-full h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 mt-3">
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
          {item.category}
        </span>
      </div>

      <div className="px-4 pb-5 mt-3">
        <h3 className="font-semibold text-lg text-gray-900 leading-snug">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mt-2 line-clamp-3 text-justify">
          {item.desc}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiMapPin className="text-green-600" />
            {item.location}
          </div>

          {/* 🔥 HANYA GANTI BEHAVIOR, UI SAMA */}
          <button
            onClick={() => setSelectedEventId(item.id)}
            className="text-green-600 text-sm font-semibold hover:underline"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {currentData.map((item) => (
          <EventCard key={item.id} item={item} />
        ))}
      </div>

      {/* PAGINATION DOTS */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-3 h-3 rounded-full ${
                page === i ? "bg-gray-900 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* ======================
          🔥 MODAL DETAIL EVENT
          ====================== */}
      {selectedEventId && eventDetails[selectedEventId] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 overflow-hidden relative">

            <button
              onClick={() => setSelectedEventId(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2">
              <div className="w-full h-[420px]">
                <Image
                  src={eventDetails[selectedEventId].image}
                  alt={eventDetails[selectedEventId].title}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">
                  {eventDetails[selectedEventId].title}
                </h2>

                <p className="text-gray-600 mb-6">
                  {eventDetails[selectedEventId].desc}
                </p>

                <div className="space-y-3 text-sm">
                  <div>📅 {eventDetails[selectedEventId].dateRange}</div>
                  <div>⏰ {eventDetails[selectedEventId].time}</div>
                  <div>📍 {eventDetails[selectedEventId].location}</div>
                  <div>🎟 {eventDetails[selectedEventId].price}</div>
                </div>

                <div className="mt-6 text-sm">
                  <p className="font-medium">Information Event:</p>
                  <a
                    href={eventDetails[selectedEventId].link}
                    target="_blank"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {eventDetails[selectedEventId].link}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
