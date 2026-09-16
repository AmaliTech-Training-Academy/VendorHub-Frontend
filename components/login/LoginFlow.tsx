// components/login/LoginFlow.tsx
"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import LoginField from "./LoginField";

import { useUserLogin } from "@/hooks/useUserLogin";
import Image from "next/image";
import Link from "next/link";

export default function LoginFlow() {
  const router = useRouter();
  const { register, onSubmit, errors, isLoading, error } = useUserLogin({
    onSuccess: (role) => {
      toast.success("Welcome back!");
      router.push(role === "vendor" ? "/dashboard" : "/storefront");
    },
    onError: (errorMessage) => {
      toast.error(errorMessage);
    },
  });

  return (
    <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-6 md:p-12  animate-slide-in-right">
      <div className="max-w-md mx-auto w-full">
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
          Ahh, <span className="text-orange-500">Look who is back.</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Sign in to continue</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <LoginField register={register} errors={errors} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all duration-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-sm text-center">
            You don&apos;t have an account?{" "}
            <Link href={"/register"} className="font-semibold text-orange-500">
              register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
