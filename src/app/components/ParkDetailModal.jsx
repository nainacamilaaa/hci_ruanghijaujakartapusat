"use client";

import { useState, useEffect } from "react";
import { useReview } from "@/app/context/ReviewContext";
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
  const { addReview, getReviews, getAverageRating, loadReviews } = useReview();
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews saat modal dibuka
  useEffect(() => {
    if (park?.id) {
      loadReviews(park.id);
    }
  }, [park?.id, loadReviews]);

  const reviews = getReviews(park.id);
  const currentAverageRating = getAverageRating(park.id);

  if (!park) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.comment.trim()) {
      setIsSubmitting(true);
      const success = await addReview(park.id, formData.name, formData.rating, formData.comment);
      if (success) {
        setFormData({ name: "", rating: 5, comment: "" });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* POPUP */}
      <div className="relative bg-white w-[92%] max-w-6xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow"
        >
          <FaTimes />
        </button>

        {/* HEADER IMAGE */}
        <div className="relative h-80 w-full">
          <image
            src={park.image}
            alt={park.name}
            className="w-full h-full object-cover"
          />
          {/* CATEGORY TAG */}
          <span className="absolute top-5 left-5 bg-sky-400 text-white text-sm px-4 py-1 rounded-full">
            {park.category}
          </span>

          {/* RATING DI DALAM GAMBAR */}
          <div className="absolute bottom-6 right-6">
            <div className="flex items-center gap-1 text-yellow-300 drop-shadow-lg">
              {[...Array(Math.round(currentAverageRating))].map((_, i) => (
                <FaStar key={`header-rating-${park.id}-${i}`} size={20} />
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-10 px-8 py-8 overflow-y-auto flex-1">

          {/* LEFT */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-3">{park.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6 text-justify">{park.description}</p>

            {/* FASILITAS */}
            <h3 className="font-semibold mb-3">Fasilitas Taman</h3>
            <div className="flex gap-3 mb-8">
              <Facility key="facility-running" icon={<FaRunning />} />
              <Facility key="facility-child" icon={<FaChild />} />
              <Facility key="facility-wifi" icon={<FaWifi />} />
              <Facility key="facility-restroom" icon={<FaRestroom />} />
              <Facility key="facility-wheelchair" icon={<FaWheelchair />} />
            </div>

            {/* ULASAN */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-bold mb-6">Ulasan & Rating Pengunjung</h3>

              {/* FORM */}
              <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-5 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nama Anda</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`rating-button-${star}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-2xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Ulasan Anda</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Bagikan pengalaman Anda..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </form>

              {/* DAFTAR ULASAN */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada ulasan. Jadilah yang pertama!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-sm">{review.name}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={`review-${review.id}-star-${i}`} size={14} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* Tombol Rute */}
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.address)}`,
                  "_blank"
                )
              }
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <FaMapMarkerAlt />
              Rute menuju Taman
            </button>

            <Info title="Alamat">{park.address}</Info>

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

/* MINI COMPONENT */
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
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  );
}