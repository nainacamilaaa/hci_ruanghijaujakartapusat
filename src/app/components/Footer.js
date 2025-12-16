import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#14532D] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* BRAND & INFO */}
          <div>
            <h2 className="text-xl font-bold text-green-400">
              Ruang Hijau Jakarta
            </h2>

            <p className="text-sm text-white/80 mt-4 max-w-sm">
              Menuju Jakarta yang lebih hijau dan berkelanjutan dengan
              pengembangan ruang terbuka hijau berkualitas.
            </p>

            <div className="mt-5 text-sm text-white/70 space-y-1">
              <p>(021) 22-4677</p>
              <p>info@ruanghijaujakarta.id</p>
              <p>Jakarta, Indonesia</p>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="md:text-center">
            <h3 className="font-semibold mb-4">
              Media Sosial
            </h3>

            <div className="flex md:justify-center gap-4">
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <FaInstagram size={14} />
              </a>
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <FaFacebookF size={14} />
              </a>
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <FaTwitter size={14} />
              </a>
              <a className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <FaYoutube size={14} />
              </a>
            </div>

            <p className="mt-4 text-sm text-white/70">
              @ruanghijaujakarta
            </p>
          </div>

          {/* SDGs */}
          <div className="md:text-right">
            <h3 className="font-semibold mb-4">
              SDGs #11
            </h3>

            <p className="text-sm text-white/80 font-medium">
              Kota Berkelanjutan
            </p>

            <p className="text-sm text-white/60 mt-3 max-w-xs md:ml-auto">
              Mendukung pengembangan kota hijau dan berkelanjutan melalui
              penyediaan ruang terbuka hijau.
            </p>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-white/60">
          © 2025 Ruang Hijau Jakarta. Semua hak dilindungi.
        </div>

      </div>
    </footer>
  );
}
