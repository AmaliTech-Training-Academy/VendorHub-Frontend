"use client";
import { useVendorAuthStore } from "@/store/useVendorAuthStore";
import { RegisterFormData, registerSchema } from "@/types/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterForm() {
  const [steps, setSteps] = useState<number>(1);
  const router = useRouter();
  const { register: registerVendor, isLoading, error } = useVendorAuthStore();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Validate ONLY step 1's fields before allowing "Continue".
  // preventDefault() is a safeguard so this button can never accidentally
  // trigger the form's onSubmit, even if type="button" gets dropped somehow.
  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isStepOneValid = await trigger(["businessName", "ownerName"]);
    if (isStepOneValid) {
      setSteps(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerVendor(data);
    if (success) {
      toast.success("Account created successfully! Redirecting...");
      router.push("/login");
    } else {
      toast.error(
        useVendorAuthStore.getState().error ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-6 md:p-12 overflow-y-auto bg-white">
      <div className="w-full mt-4 md:mt-0">
        {/* Mobile Only Logo Header */}
        <div className="md:hidden mb-6 flex justify-start">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          <span className="text-orange-500">Oya</span> let&apos;s get you
          onboarded
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Register your business in just 2 simple steps
        </p>

        <div className="flex gap-4 w-full mt-6">
          <button
            type="button"
            onClick={() => setSteps(1)}
            className={`pb-2 border-b-2 text-sm font-semibold transition-all duration-200 text-left flex-1 ${
              steps === 1
                ? "border-orange-500 text-orange-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            01. Business Info
          </button>
          <button
            type="button"
            onClick={() => setSteps(2)}
            className={`pb-2 border-b-2 text-sm font-semibold transition-all duration-200 text-left flex-1 ${
              steps === 2
                ? "border-orange-500 text-orange-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            02. Account Details
          </button>
        </div>
      </div>

      {/* Form Fields Section — everything the user interacts with lives INSIDE this form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex-1 flex flex-col justify-center max-w-md mx-auto my-6 space-y-5"
      >
        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* STEP 1: BUSINESS REGISTRATION INPUTS */}
        {steps === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Business Name
              </label>
              <input
                {...register("businessName")}
                type="text"
                placeholder="Enter your business name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
              {errors.businessName?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.businessName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Owner Name
              </label>
              <input
                {...register("ownerName")}
                type="text"
                placeholder="Enter full owner name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
              {errors.ownerName?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.ownerName.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: USER ACCOUNT DETAILS INPUTS */}
        {steps === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@business.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
              {errors.email?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
              {errors.password?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Divider Line */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Authorization Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-150 active:scale-[0.99]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.73 8.91 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.6z"
            />
            <path
              fill="#FBBC05"
              d="M5.36 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.5 7.23C.54 9.16 0 11.31 0 13.5s.54 4.34 1.5 6.27l3.86-3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.35 1.11-4.26 1.11-3.09 0-5.73-2.69-6.64-5.46L1.5 15.86C3.4 19.71 7.35 23 12 23z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Bottom Form Actions */}
        <div className="flex gap-3 pt-2">
          {steps === 2 && (
            <button
              type="button"
              onClick={() => setSteps(1)}
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
          )}

          {steps === 1 ? (
            <button
              type="button"
              onClick={handleContinue}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all duration-100 text-center text-sm"
            >
              Continue to Account
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all duration-100 text-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Complete Registration"}
            </button>
          )}
        </div>

        {/* Navigation back to Sign In */}
        <p className="text-center text-xs text-gray-500 pt-2 font-medium">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-orange-500 font-bold hover:underline ml-1"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
