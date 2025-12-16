import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
      {/* PERLEBAR CONTAINER */}
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
          <div className="hidden md:flex items-center gap-12">
            <NavItem href="/" label="Beranda" color="#15803D" />
            <NavItem href="/taman" label="Taman" color="#374151" />
            <NavItem href="/aktivitas" label="Aktivitas" color="#374151" />
            <NavItem href="/tentang" label="Tentang" color="#374151" />
          </div>

        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, label, color }) => (
  <Link
    href={href}
    className="text-sm font-medium transition-colors duration-200"
    style={{ color }}
  >
    {label}
  </Link>
);

export default Navbar;
