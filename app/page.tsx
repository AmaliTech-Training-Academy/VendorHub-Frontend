"use client";

import CTASection from "@/components/landing/CTASection";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingNavbar from "@/components/landing/LandingNavbar";
import PainPointsSection from "@/components/landing/PainPointsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

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
        <CTASection />
        <LandingFooter />
      </main>
    </div>
  );
}
