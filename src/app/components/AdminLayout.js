"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Menu, X, LayoutDashboard, Users, TreePine, CalendarDays, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Pengguna", href: "/admin" },
  { icon: TreePine, label: "Taman", href: "/admin/parks" },
  { icon: CalendarDays, label: "Acara", href: "/admin/events" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      ${mobile
        ? "fixed inset-0 z-50 flex"
        : "hidden lg:flex w-60 flex-col fixed top-0 left-0 bottom-0 z-40"
      }
    `}>
      {/* Overlay for mobile */}
      {mobile && (
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      )}

      <div className={`
        relative flex flex-col h-full bg-[#1b4332] text-white
        ${mobile ? "w-60" : "w-full"}
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-sm font-bold leading-tight">Ruang Hijau</p>
              <p className="text-[10px] text-green-400 tracking-widest">Admin Panel</p>
            </div>
          </div>
          {mobile && (
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatar && (
              <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-green-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
      {open && <Sidebar mobile />}

      {/* Main */}
      <div className="lg:ml-60">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#1b4332] text-white">
          <button onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}