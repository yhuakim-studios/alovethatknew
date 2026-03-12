import Hero from "@/components/wedding/Hero";
import LoveStory from "@/components/wedding/LoveStory";
import WeddingDetails from "@/components/wedding/WeddingDetails";
import FamilySection from "@/components/wedding/FamilySection";
import Countdown from "@/components/wedding/Countdown";
import GallerySection from "@/components/wedding/GallerySection";
import GiftSection from "@/components/wedding/GiftSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import Footer from "@/components/wedding/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <LoveStory />
      <WeddingDetails />
      <FamilySection />
      <Countdown />
      <GallerySection />
      <GiftSection />
      <RSVPSection />
      <Footer />
    </div>
  );
};

export default Index;
