"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/components/Toast";
import { googleLogin } from "@/app/services/api";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace(isAdmin ? "/admin" : "/");
  }, [isAuthenticated, isAdmin, router]);

  const handleGoogleResponse = useCallback(async (response) => {
    setLoading(true);
    setError(null);
    try {
      const data = await googleLogin(response.credential);
      login(data.user, data.token);
      showToast(`Selamat datang, ${data.user.name}! 👋`, "success");
      router.replace(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [login, router, showToast]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const init = () => {
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
        shape: "pill",
        width: 280,
      });
    };

    const interval = setInterval(() => {
      if (window.google) { clearInterval(interval); init(); }
    }, 100);
    return () => clearInterval(interval);
  }, [handleGoogleResponse]);

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left — ilustrasi */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-16 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <div>
            <p className="text-white font-bold text-lg leading-none">Ruang Hijau</p>
            <p className="text-green-200 text-xs">Jakarta Pusat</p>
          </div>
        </div>

        {/* center text */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Jelajahi Taman<br />Kota Jakarta
          </h2>
          <p className="text-green-100 text-base leading-relaxed max-w-sm">
            Temukan ruang hijau terbaik, nikmati udara segar, dan rasakan ketenangan di tengah kota.
          </p>

          {/* stats */}
          <div className="mt-10 flex gap-8">
            {[["20+", "Taman"], ["50+", "Aktivitas"], ["1K+", "Pengguna"]].map(([num, label]) => (
              <div key={label}>
                <p className="text-white text-2xl font-bold">{num}</p>
                <p className="text-green-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-green-300 text-xs">© 2025 Ruang Hijau Jakarta Pusat</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <span className="text-2xl">🌿</span>
            <p className="font-bold text-green-700">Ruang Hijau Jakarta Pusat</p>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Masuk</h1>
          <p className="text-gray-500 text-sm mb-10">
            Gunakan akun Google kamu untuk melanjutkan.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {/* Google button */}
          <div className="flex flex-col items-center gap-4">
            <div className="min-h-[44px] flex items-center justify-center">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
                  Menghubungkan...
                </div>
              ) : (
                <div ref={buttonRef} />
              )}
            </div>
          </div>

          {/* divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">Aman & terenkripsi</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* feature list */}
          <div className="space-y-3">
            {[
              ["🗺️", "Jelajahi taman & aktivitas"],
              ["🔖", "Simpan taman favorit"],
              ["⭐", "Tulis ulasan taman"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-10">
            Dengan masuk, Anda menyetujui{" "}
            <a href="#" className="text-green-600 hover:underline">Kebijakan Privasi</a> kami.
          </p>
        </div>
      </div>
    </main>
  );
}