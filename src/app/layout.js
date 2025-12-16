import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer"; // <--- TAMBAH INI

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ruang Hijau Jakarta - Temukan Taman Terbaik",
  description: "Jelajahi taman-taman indah di Jakarta untuk bersantai dan beraktivitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} antialiased bg-white overflow-x-hidden`}
      >
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="pt-20">
          {children}
        </div>

        {/* FOOTER */}
        <Footer />  
      </body>
    </html>
  );
}
