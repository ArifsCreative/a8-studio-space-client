export const dynamic = "force-dynamic";

import HeroSlider from "@/components/hero-slider";
import FeaturedStudios from "@/components/featured-studios";
import StudioCategories from "@/components/studio-categories";
import HowItWorks from "@/components/how-it-works";
import HostCreatorSupport from "@/components/host-creator-support";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSlider />
      <FeaturedStudios />
      <StudioCategories />
      <HowItWorks />
      <HostCreatorSupport />
    </div>
  );
}
