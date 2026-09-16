"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import OnboardingGraphics from "@/components/shared/OnboardingGraphics";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen md:h-screen md:p-4 bg-white flex justify-center items-center">
      <div className="flex w-full md:max-w-7xl h-full md:h-[90vh]  overflow-hidden md:m-auto">
        {/* LEFT SIDE: Onboarding Graphics (Hidden on Mobile) */}
        <OnboardingGraphics />

        {/* RIGHT SIDE: Form Layout Shell */}
        <RegisterForm />
      </div>
    </div>
  );
}
