"use client";

import { useState, useEffect } from "react";
import { useReview } from "@/app/context/ReviewContext";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/components/Toast";
import {
  FaRunning, FaChild, FaWifi, FaRestroom, FaWheelchair,
  FaStar, FaMapMarkerAlt, FaBus, FaSubway, FaTimes, FaClock, FaTrash,
} from "react-icons/fa";
import { ImageOff } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ParkDetailModal({ park, onClose }) {
  const { addReview, getReviews, getAverageRating, loadReviews } = useReview();
  const { user, isAuthenticated, isAdmin, token } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const parkId = park?._id || park?.id;
  console.log('park object:', park);
  console.log('parkId:', parkId);
  useEffect(() => {
    if (parkId) loadReviews(parkId);
  }, [parkId]);

  const reviews = getReviews(parkId);
  const currentAverageRating = getAverageRating(parkId);
  const hasImage = park?.image && park.image.trim() !== "";

  if (!park) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) return;
    setIsSubmitting(true);
    const name = user?.name || "Anonim";
    const success = await addReview(parkId, name, formData.rating, formData.comment);
    if (success) {
      setFormData({ rating: 5, comment: "" });
      showToast("Ulasan berhasil dikirim!", "success");
    } else {
      showToast("Gagal mengirim ulasan.", "error");
    }
    setIsSubmitting(false);
  };

  const handleDeleteReview = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      const res = await fetch(`${API}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      await loadReviews(parkId, true);
      showToast("Ulasan dihapus.", "info");
    } catch {
      showToast("Gagal menghapus ulasan.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-[92%] max-w-6xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow">
          <FaTimes />
        </button>

        {/* Header image */}
        <div className="relative h-80 w-full flex-shrink-0">
          {hasImage ? (
            <img src={park.image} alt={park.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-2">
              <ImageOff size={48} className="text-green-300" />
              <span className="text-sm text-green-400">Belum ada foto</span>
            </div>
          )}
          <span className="absolute top-5 left-5 bg-sky-400 text-white text-sm px-4 py-1 rounded-full">
            {park.category}
          </span>
          {currentAverageRating > 0 && (
            <div className="absolute bottom-6 right-6 flex items-center gap-1 text-yellow-300 drop-shadow-lg">
              {[...Array(Math.round(currentAverageRating))].map((_, i) => (
                <FaStar key={i} size={20} />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-10 px-8 py-8 overflow-y-auto flex-1">

          {/* Left */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-3">{park.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6 text-justify">{park.description || park.bio}</p>

            <h3 className="font-semibold mb-3">Fasilitas Taman</h3>
            <div className="flex gap-3 mb-8">
              {[FaRunning, FaChild, FaWifi, FaRestroom, FaWheelchair].map((Icon, i) => (
                <div key={i} className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                  <Icon />
                </div>
              ))}
            </div>

            {/* Review section */}
            <div className="mt-8 border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Ulasan & Rating Pengunjung</h3>
                {currentAverageRating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-gray-800">{Number(currentAverageRating).toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({reviews.length} ulasan)</span>
                  </div>
                )}
              </div>

              {/* Form — hanya jika login */}
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    {user?.avatar && (
                      <img src={user.avatar} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button"
                          onClick={() => setFormData(f => ({ ...f, rating: star }))}
                          className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"}`}>
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Ulasan Anda</label>
                    <textarea
                      value={formData.comment}
                      onChange={e => setFormData(f => ({ ...f, comment: e.target.value }))}
                      placeholder="Bagikan pengalaman Anda..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 resize-none text-sm"
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting || !formData.comment.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium text-sm transition disabled:opacity-50">
                    {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-center">
                  <p className="text-sm text-gray-500 mb-3">Masuk untuk menulis ulasan</p>
                  <a href="/login" className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition">
                    Masuk
                  </a>
                </div>
              )}

              {/* Daftar ulasan */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm">Belum ada ulasan. Jadilah yang pertama!</p>
                ) : reviews.map((review, index) => (
                  <div key={review._id || review.id || index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <div className="flex text-yellow-400 mt-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} size={12} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteReview(review._id || review.id)}
                            disabled={deletingId === (review._id || review.id)}
                            className="text-red-400 hover:text-red-600 transition disabled:opacity-40"
                            title="Hapus ulasan"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.address || park.location)}`, "_blank")}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition"
            >
              <FaMapMarkerAlt /> Rute menuju Taman
            </button>

            {(park.address || park.location) && <Info title="Alamat">{park.address || park.location}</Info>}
            {park.openingHours && (
              <Info title="Jam Operasional">
                <div className="flex items-center gap-2"><FaClock />{park.openingHours}</div>
              </Info>
            )}
            <Info title="Transportasi Terdekat">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><FaSubway /> Stasiun Cikini</div>
                <div className="flex items-center gap-2"><FaBus /> Halte Taman Suropati</div>
              </div>
            </Info>
          </div>

        </div>
      </div>
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