"use client";

import Link from "next/link";
import { FaRunning, FaTree, FaCamera } from "react-icons/fa";

export default function ParkCategories() {
  const categories = [
    { title: "Taman Kota", desc: "Olahraga & aktivitas luar ruang", slug: "Taman Kota", icon: FaRunning },
    { title: "Hutan Kota", desc: "Hijau & rekreasi alami", slug: "Hutan Kota", icon: FaTree },
    { title: "Taman Tematik", desc: "Unik & fotogenik", slug: "Taman Tematik", icon: FaCamera },
  ];

  return (
    <section className="bg-green-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">Kategori Taman</h2>
          <p className="text-gray-500 mt-3 text-sm">
            Temukan taman sesuai dengan aktivitas dan preferensi Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/taman?category=${encodeURIComponent(cat.slug)}`}
                className="bg-green-100 w-full max-w-sm rounded-2xl p-10 text-center hover:bg-green-200 transition cursor-pointer block"
              >
                <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-green-600 text-white rounded-full">
                  <Icon size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{cat.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}