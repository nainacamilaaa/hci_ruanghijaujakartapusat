"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { googleLogin } from "@/app/services/api";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/");
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleGoogleResponse = useCallback(async (response) => {
    setLoading(true);
    setError(null);
    try {
      const { credential } = response;
      const data = await googleLogin(credential);
      login(data.user, data.token);
      router.replace(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [login, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initializeGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 280,
      });
    };

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initializeGoogle();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [handleGoogleResponse]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm text-center">

        <div className="mb-6">
          <span className="text-5xl">🌿</span>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Ruang Hijau</h1>
          <p className="text-xs text-green-400 uppercase tracking-widest mt-1">Jakarta Pusat</p>
        </div>

        <hr className="border-gray-100 mb-6" />

        <h2 className="text-lg font-semibold text-gray-800 mb-1">Selamat Datang</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Masuk untuk menjelajahi taman dan aktivitas hijau di Jakarta Pusat.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="flex justify-center mb-5 min-h-[44px]">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
              Menghubungkan...
            </div>
          ) : (
            <div ref={buttonRef} />
          )}
        </div>

        <p className="text-xs text-gray-400">
          Dengan masuk, Anda menyetujui{" "}
          <a href="#" className="text-green-500 hover:underline">Kebijakan Privasi</a> kami.
        </p>
      </div>
    </main>
  );
}