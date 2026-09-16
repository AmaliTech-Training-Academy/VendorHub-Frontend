"use client";
import { useVendorAuthStore } from "@/store/useVendorAuthStore";
import { RegisterFormData, registerSchema } from "@/types/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RegistrationStepIndicator from "@/components/registration/RegistrationStepIndicator";
import BusinessInfoStep from "./BusinessInfoStep";
import AccountDetailsStep from "./AccountDetailsStep";

export function VendorRegistrationFlow() {
  const [step, setStep] = useState<number>(1);
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

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isStepOneValid = await trigger(["businessName", "ownerName"]);
    if (isStepOneValid) {
      setStep(2);
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
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="w-full max-w-md mx-0 flex-none flex flex-col">
        <RegistrationStepIndicator
          step={step}
          onSelectStep={setStep}
          unlockedSteps={[1, 2]}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mr-auto ml-0 flex flex-col justify-start my-4 space-y-5"
      >
        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {step === 1 && <BusinessInfoStep register={register} errors={errors} />}
        {step === 2 && (
          <AccountDetailsStep register={register} errors={errors} />
        )}

        <div className="flex gap-3 pt-2">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
          )}

          {step === 1 ? (
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
      </form>
    </div>
  );
}
