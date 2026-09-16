import LoginFlow from "@/components/login/LoginFlow";
import OnboardingGraphics from "@/components/shared/OnboardingGraphics";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen md:h-screen md:p-4 bg-orange-100 flex justify-center items-center">
      <div className="flex w-full md:max-w-7xl h-full md:h-[90vh]  overflow-hidden md:m-auto">
        {/* LEFT SIDE: Onboarding Graphics (Hidden on Mobile) */}
        <OnboardingGraphics
          images={[
            { src: "/happy.jpg", alt: "Employee at their desk" },
            { src: "/happy-2.jpg", alt: "Employee ordering lunch" },
            { src: "/happy-3.jpg", alt: "Vendor smiling" },
          ]}
          heading="Welcome"
          highlightedWord="back"
          description="Sign in to keep ordering, tracking, and managing  right where you left off."
        />

        {/* RIGHT SIDE: Form Layout Shell */}
        <LoginFlow />
      </div>
    </div>
  );
}
