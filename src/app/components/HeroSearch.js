"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/taman?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-0 w-full max-w-lg">
      <div className="flex items-center flex-1 bg-white rounded-l-2xl shadow-lg px-4 py-3.5 gap-3">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari taman, lokasi, atau kategori..."
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-semibold px-6 py-3.5 rounded-r-2xl shadow-lg transition-all duration-150"
      >
        Cari
      </button>
    </form>
  );
}