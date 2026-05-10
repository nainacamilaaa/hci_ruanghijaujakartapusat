"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, LogOut, User, ChevronDown } from "lucide-react";
import { useBookmark } from "@/app/hooks/useBookmark";
import { useAuth } from "@/app/context/AuthContext";

const Navbar = () => {
  const { bookmarks } = useBookmark();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-11 h-11">
              <Image
                src="/icon/Group34.svg"
                alt="Logo Ruang Hijau"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-semibold text-[#15803D]">
                Ruang Hijau Jakarta Pusat
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Jelajahi Taman Kota</p>
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem href="/" label="Beranda" />
            <NavItem href="/taman" label="Taman" />
            <NavItem href="/aktivitas" label="Aktivitas" />
            <NavItem href="/tentang" label="Tentang" />

            {/* Bookmark */}
            <Link href="/tersimpan" className="relative">
              <Bookmark size={22} className="text-gray-600 hover:text-[#15803D] transition-colors" />
              <span
                suppressHydrationWarning
                className={`absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-opacity ${
                  bookmarks.length > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {bookmarks.length > 9 ? "9+" : bookmarks.length || ""}
              </span>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={16} className="text-green-700" />
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        🛠️ Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={14} />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
              >
                <User size={14} />
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors duration-200"
      style={{ color: isActive ? "#15803D" : "#374151" }}
    >
      {label}
    </Link>
  );
};

export default Navbar;