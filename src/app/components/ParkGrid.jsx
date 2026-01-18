"use client";

import { useState, useMemo, useEffect } from "react";
import ParkCard from "./ParkCard";
import { useReview } from "@/app/context/ReviewContext";
import { fetchParks } from "@/app/services/api";

export default function ParkGrid({ activeCategory, searchTerm, onSelect }) { // ➕
  const { getAverageRating } = useReview();
  const [parksData, setParksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;
  const [page, setPage] = useState(0);

  // Fetch parks dari API
  useEffect(() => {
    const loadParks = async () => {
      setLoading(true);
      const data = await fetchParks();
      setParksData(data);
      setLoading(false);
    };
    loadParks();
  }, []);

  const filteredData = useMemo(() => {
    return parksData.filter((p) => {
      const matchCategory =
        activeCategory === "Semua" || p.category === activeCategory;

      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()); // ➕

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm, parksData]); // ➕

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  if (loading) {
    return <div className="text-center text-gray-500">Loading parks...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {currentData.map((park) => (
          <ParkCard
            key={park.id}
            park={park}
            onSelect={onSelect}
            rating={parseFloat(getAverageRating(park.id))}
          />
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

