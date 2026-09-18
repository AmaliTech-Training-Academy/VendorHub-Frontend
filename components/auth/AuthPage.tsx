"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import OnboardingGraphics from "@/components/shared/OnboardingGraphics";
import LoginFields from "@/components/auth/LoginFields";
import { RegisterFields } from "@/components/auth/RegisterFields";
import { useUserLogin } from "@/hooks/useUserLogin";
import { useUserRegistration } from "@/hooks/useUserRegistration";
import type { AuthConfig } from "@/types/interfaces";
import type { AuthMode } from "@/types/types";

const authConfig: Record<AuthMode, AuthConfig> = {
  login: {
    images: [
      { src: "/happy.jpg", alt: "Employee at their desk" },
      { src: "/happy-2.jpg", alt: "Employee ordering lunch" },
      { src: "/happy-3.jpg", alt: "Vendor smiling" },
    ],
    onboardingHeading: "Welcome",
    onboardingHighlight: "back",
    onboardingDescription:
      "Sign in to keep ordering, tracking, and managing right where you left off.",
    headingPrefix: "Ahh, ",
    headingHighlight: "Look who is back.",
    description: "Sign in to continue",
    submitLabel: "Sign In",
    loadingLabel: "Signing in...",
    alternatePrompt: "You don't have an account?",
    alternateLabel: "register here",
    alternateHref: "/register",
    panelClassName: "md:bg-white/45",
  },
  register: {
    images: [
      { src: "/vendor-1.jpg", alt: "Vendor preparing food" },
      { src: "/vendor-3.jpg", alt: "Vendor at their stall" },
      { src: "/vendor-2.jpg", alt: "Vendor smiling" },
    ],
    onboardingHeading: "Welcome to",
    onboardingHighlight: "VendorHub",
    onboardingDescription:
      "Connecting vendors and teams for faster, easier ordering right from your desk.",
    headingPrefix: "",
    headingHighlight: "Oya",
    headingSuffix: " let's get you started",
    description: "Create your account to get started",
    submitLabel: "Create Account",
    loadingLabel: "Creating account...",
    alternatePrompt: "You have an account?",
    alternateLabel: "login here",
    alternateHref: "/login",
    panelClassName: "md:bg-white/40",
  },
};

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const config = authConfig[mode];
  const isLogin = mode === "login";

  const loginForm = useUserLogin({
    onSuccess: (role) => {
      toast.success("Welcome back!");
      router.push(role === "vendor" ? "/dashboard" : "/storefront");
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  const registrationForm = useUserRegistration({
    onSuccess: (data) => {
      toast.success("Account created! Redirecting...");
      router.push(data.role === "vendor" ? "/dashboard" : "/storefront");
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  const error = isLogin ? loginForm.error : registrationForm.error;
  const handleSubmit = isLogin
    ? loginForm.handleSubmit
    : registrationForm.handleSubmit;
  const isLoading = isLogin ? loginForm.isLoading : registrationForm.isLoading;

  return (
    <div className="w-full min-h-screen md:h-screen md:p-4 bg-orange-100 flex justify-center items-center">
      <div className="flex w-full md:max-w-7xl h-full md:h-[90vh] overflow-hidden md:m-auto">
        <OnboardingGraphics
          images={config.images}
          heading={config.onboardingHeading}
          highlightedWord={config.onboardingHighlight}
          description={config.onboardingDescription}
        />

        <div
          className={`w-full md:w-1/2 h-full flex flex-col justify-center p-6 md:p-12 animate-slide-in-right ${config.panelClassName}`}
        >
          <div className="max-w-md mx-auto w-full">
            <div className="flex md:hidden items-center gap-2 mb-6">
              <Image
                src="/logo.png"
                alt="VendorHub logo"
                loading="eager"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-blue-900">Vendor</span>
                <span className="text-orange-500">Hub</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">
              {config.headingPrefix}
              <span className="text-orange-500">{config.headingHighlight}</span>
              {config.headingSuffix}
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              {config.description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLogin ? (
                <LoginFields
                  register={loginForm.register}
                  errors={loginForm.errors}
                />
              ) : (
                <RegisterFields
                  register={registrationForm.register}
                  errors={registrationForm.errors}
                  setValue={registrationForm.setValue}
                  watch={registrationForm.watch}
                />
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all duration-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? config.loadingLabel : config.submitLabel}
              </Button>

              <p className="text-sm text-center">
                {config.alternatePrompt}{" "}
                <Link
                  href={config.alternateHref}
                  className="font-semibold text-orange-500"
                >
                  {config.alternateLabel}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
