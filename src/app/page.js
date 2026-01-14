import HeroSection from "@/app/components/HeroSection";
import ClientHome from "@/app/components/ClientHome";
import Facilities from "@/app/components/Facilities";

export default function Home() {
  return (
    <>
      {/* HERO – FULL WIDTH */}
      <HeroSection />

      {/* MAIN CONTENT */}
      <main className="w-full bg-white">
        <ClientHome />
        <Facilities />
      </main>
    </>
  );
}