import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { OwnerCTASection } from "@/components/home/OwnerCTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategoriesSection />
      <FeaturedSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <OwnerCTASection />
    </div>
  );
}
