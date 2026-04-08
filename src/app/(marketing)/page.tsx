import HeroSection from "@/components/HeroSection";
import SessionGrid from "@/components/SessionGrid";
import CategoryTiles from "@/components/CategoryTiles";
import MarqueeTicker from "@/components/MarqueeTicker";
import HowItWorks from "@/components/HowItWorks";
import ManifestoText from "@/components/ManifestoText";
import FlavorSelector from "@/components/FlavorSelector";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SessionGrid />
      <CategoryTiles />
      <MarqueeTicker />
      <HowItWorks />
      <ManifestoText />
      <FlavorSelector />
    </>
  );
}
