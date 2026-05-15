"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";

/**
 * ImageUploader — komponen upload gambar via backend ke Cloudinary
 *
 * Props:
 * - folder: "parks" | "events" (default: "general")
 * - onUpload: callback(url) dipanggil setelah upload sukses
 * - currentImage: URL gambar saat ini (untuk preview awal)
 */
export default function ImageUploader({ folder = "general", onUpload, currentImage }) {
  const { token } = useAuth();
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi sisi client
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }

    setError(null);

    // Preview lokal sebelum upload
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload ke backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload?folder=${folder}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Jangan set Content-Type — biarkan browser set boundary multipart
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload gagal.");

      setPreview(data.url);
      onUpload(data.url); // kirim URL ke parent
    } catch (err) {
      setError(err.message);
      setPreview(currentImage || null); // rollback preview
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(""); // kosongkan URL di parent
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {/* Area klik / drag */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${uploading ? "opacity-60 cursor-wait" : "hover:border-green-500"}
          ${preview ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50"}
        `}
        style={{ minHeight: "180px" }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
            {/* Overlay saat uploading */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                <div className="flex flex-col items-center gap-2 text-white">
                  <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm font-medium">Mengupload...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            {uploading ? (
              <>
                <svg className="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm">Mengupload...</span>
              </>
            ) : (
              <>
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4-4a3 3 0 014 0l4 4m-4-4v8M8 8a4 4 0 118 0" />
                </svg>
                <span className="text-sm font-medium">Klik untuk upload gambar</span>
                <span className="text-xs">JPG, PNG, WEBP — maks. 5MB</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tombol hapus gambar */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
        >
          Hapus gambar
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Input tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}