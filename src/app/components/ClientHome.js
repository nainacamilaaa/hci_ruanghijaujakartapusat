"use client";

import dynamic from "next/dynamic";

// Dynamic import untuk components yang menggunakan client-side features
const PopularParks = dynamic(() => import("@/app/components/PopularParks"), {
  ssr: false,
  loading: () => (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold text-[#1A1A1A] font-poppins">
            Taman Populer
          </h2>
          <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto font-poppins">
            Destinasi favorit warga Jakarta untuk bersantai dan beraktivitas
          </p>
        </div>
        <div className="text-center text-gray-500">
          Loading popular parks...
        </div>
      </div>
    </section>
  ),
});

const ParkCategories = dynamic(() => import("@/app/components/ParkCategories"), {
  ssr: false,
  loading: () => (
    <section className="bg-green-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    </section>
  ),
});

export default function ClientHome() {
  return (
    <>
      <PopularParks />
      <ParkCategories />
    </>
  );
}