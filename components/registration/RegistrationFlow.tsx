"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { RegistrationFields } from "./RegistrationFields";

import { useUserRegistration } from "@/hooks/useUserRegistration";
import Link from "next/link";

export default function RegistrationFlow() {
  const router = useRouter();
  const { register, onSubmit, errors, setValue, watch, isLoading, error } =
    useUserRegistration({
      onSuccess: (data) => {
        toast.success("Account created! Redirecting...");
        router.push(data.role === "vendor" ? "/dashboard" : "/storefront");
      },
      onError: (errorMessage) => {
        toast.error(errorMessage);
      },
    });

  return (
    <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-6 md:p-12  md:bg-white/40 animate-slide-in-right ">
      <div className="max-w-md mx-auto w-full h-full md:h-auto">
        {/* Mobile-only logo header */}
        <div className="flex md:hidden  items-center gap-2 mb-6">
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
          <span className="text-orange-500">Oya</span> let&apos;s get you
          started
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Create your account to get started
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <RegistrationFields
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all duration-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-sm text-center">
            You have an account?{" "}
            <Link href={"/login"} className="font-semibold text-orange-500">
              login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
