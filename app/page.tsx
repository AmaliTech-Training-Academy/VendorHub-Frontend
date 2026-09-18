"use client";

import FeatureHighlights from "@/components/landing/Feature";
import HeroSection from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/How";
import Navbar from "@/components/landing/Navbar";
import SocialProofCTA from "@/components/landing/SocialProof";
import ShortStory from "@/components/landing/ShortStory";
import Image from "next/image";
import FinalCTA from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 bg-orange-50 scroll-smooth">
      <Navbar />

      <main className="flex flex-col items-center justify-start  h-auto w-full">
        <HeroSection />
        <ShortStory />
        <HowItWorks />
        <FeatureHighlights />
        <SocialProofCTA />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
