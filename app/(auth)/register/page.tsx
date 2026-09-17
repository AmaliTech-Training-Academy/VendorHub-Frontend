"use client";

import RegistrationFlow from "@/components/registration/RegistrationFlow";

import OnboardingGraphics from "@/components/shared/OnboardingGraphics";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen md:h-screen md:p-4 bg-orange-100 flex justify-center items-center">
      <div className="flex w-full md:max-w-7xl h-full md:h-[90vh]  overflow-hidden md:m-auto">
        {/* LEFT SIDE: Onboarding Graphics (Hidden on Mobile) */}
        <OnboardingGraphics
          images={[
            { src: "/vendor-1.jpg", alt: "Vendor preparing food" },
            { src: "/vendor-3.jpg", alt: "Vendor at their stall" },
            { src: "/vendor-2.jpg", alt: "Vendor smiling" },
          ]}
          heading="Welcome to"
          highlightedWord="VendorHub"
          description="Connecting vendors and teams for faster, easier ordering right from your desk."
        />

        {/* RIGHT SIDE: Form Layout Shell */}
        <RegistrationFlow />
      </div>
    </div>
  );
}
