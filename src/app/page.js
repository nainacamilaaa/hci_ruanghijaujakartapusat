import HeroSection from "@/app/components/HeroSection";
import PopularParks from "@/app/components/PopularParks";
import ParkCategories from "@/app/components/ParkCategories";
import Facilities from "@/app/components/Facilities";

export default function Home() {
  return (
    <>
      {/* HERO – FULL WIDTH */}
      <HeroSection />

      {/* MAIN CONTENT */}
      <main className="w-full bg-white">
        <PopularParks />
        <ParkCategories />
        <Facilities />
      </main>
    </>
  );
}
