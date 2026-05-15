"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useBookmark } from "@/app/hooks/useBookmark";
import { User, Mail, Shield, Bookmark, LogOut, Calendar } from "lucide-react";
import { useToast } from "@/app/components/Toast";

export default function ProfilPage() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { bookmarks } = useBookmark();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    showToast("Berhasil keluar. Sampai jumpa! 👋", "info");
    router.push("/");
  };

  if (loading || !user) return null;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center gap-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <User size={36} className="text-green-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
            <p className="text-gray-500 text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full
                ${isAdmin ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600"}`}>
                <Shield size={11} />
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Informasi Akun</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nama Lengkap</p>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{user.role || "user"}</p>
              </div>
            </div>

            {joinDate && (
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bergabung</p>
                  <p className="text-sm font-medium text-gray-800">{joinDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Aktivitas</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-green-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Bookmark size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookmarks.length}</p>
                <p className="text-xs text-gray-500">Taman Tersimpan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium"
        >
          <LogOut size={16} />
          Keluar dari Akun
        </button>

      </div>
    </main>
  );
}