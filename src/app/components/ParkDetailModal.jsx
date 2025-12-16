"use client";

import {
  FaRunning,
  FaChild,
  FaWifi,
  FaRestroom,
  FaWheelchair,
  FaStar,
  FaMapMarkerAlt,
  FaBus,
  FaSubway,
  FaTimes,
  FaClock,
} from "react-icons/fa";

export default function ParkDetailModal({ park, onClose }) {
  if (!park) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* POPUP */}
      <div className="relative bg-white w-[92%] max-w-6xl rounded-2xl overflow-hidden shadow-2xl">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow"
        >
          <FaTimes />
        </button>

        {/* HEADER IMAGE */}
        <div className="relative h-[320px] w-full">
          <img
            src={park.image}
            alt={park.name}
            className="w-full h-full object-cover"
          />

          {/* CATEGORY TAG */}
          <span className="absolute top-5 left-5 bg-sky-400 text-white text-sm px-4 py-1 rounded-full">
            Taman Kota
          </span>

          {/* ✅ ULASAN — DI DALAM GAMBAR, KANAN BAWAH */}
          <div className="absolute bottom-6 right-6 bg-white rounded-xl px-5 py-4 shadow-lg w-[210px]">
            <p className="font-semibold text-sm mb-1">
              Ulasan Pengunjung
            </p>

            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">4.0</span>
              <div className="flex text-orange-400">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              102 Review
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-10 px-8 py-8">

          {/* LEFT */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-3">
              {park.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {park.description}
            </p>

            {/* FASILITAS */}
            <h3 className="font-semibold mb-3">
              Fasilitas Taman
            </h3>

            <div className="flex gap-3">
              <Facility icon={<FaRunning />} />
              <Facility icon={<FaChild />} />
              <Facility icon={<FaWifi />} />
              <Facility icon={<FaRestroom />} />
              <Facility icon={<FaWheelchair />} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium">
              <FaMapMarkerAlt />
              Rute menuju Taman
            </button>

            <Info title="Alamat">
              {park.address}
            </Info>

            {/* ✅ JAM OPERASIONAL — FIX */}
            <Info title="Jam Operasional">
              <div className="flex items-center gap-2">
                <FaClock />
                {park.openingHours}
              </div>
            </Info>

            <Info title="Transportasi Terdekat">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaSubway /> Stasiun Cikini
                </div>
                <div className="flex items-center gap-2">
                  <FaBus /> Halte Taman Suropati
                </div>
              </div>
            </Info>
          </div>

        </div>
      </div>
    </div>
  );
}

/* === MINI COMPONENT === */

function Facility({ icon }) {
  return (
    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
      {icon}
    </div>
  );
}

function Info({ title, children }) {
  return (
    <div>
      <p className="font-semibold mb-1">{title}</p>
      <div className="text-gray-600 text-sm">
        {children}
      </div>
    </div>
  );
}
