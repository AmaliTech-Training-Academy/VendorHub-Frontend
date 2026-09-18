"use client";

import FeatureHighlights from "@/components/landing/FeatureHighlights";
import LandingHero from "@/components/landing/LandingHero";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingNavbar from "@/components/landing/LandingNavbar";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 bg-orange-50 scroll-smooth">
      <LandingNavbar />

      <main className="flex flex-col items-center justify-start  h-auto w-full">
        <LandingHero />
        <PainPointsSection />
        <HowItWorks />
        <FeatureHighlights />
        <TestimonialsSection />
        <FinalCTASection />
        <LandingFooter />
      </main>
    </div>
  );
}
