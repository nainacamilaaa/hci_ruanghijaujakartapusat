"use client";

import { useState, useMemo } from "react";
import ParkCard from "./ParkCard";
import { parksData } from "@/app/data/parksData";

export default function ParkGrid({ activeCategory, onSelect }) {
  const itemsPerPage = 12;
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (activeCategory === "Semua") return parksData;
    return parksData.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <div className="flex flex-col items-center">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {currentData.map(park => (
          <ParkCard key={park.id} park={park} onSelect={onSelect} />
        ))}
      </div>

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
    </div>
  );
}
