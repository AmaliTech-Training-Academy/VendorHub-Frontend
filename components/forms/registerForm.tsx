"use client";

import Image from "next/image";
import { VendorRegistrationFlow } from "../registration/VendorRegistrationFlow";

export default function RegisterForm() {
  return (
    <div className="w-full md:w-1/2 h-full flex flex-col gap-5 p-2 md:p-12 overflow-y-auto bg-white">
      <div className="w-full max-w-md mx-0 mt-4 md:mt-0">
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
      </div>

      {/* Form Fields Section — everything the user interacts with lives INSIDE this form */}

      <VendorRegistrationFlow />
    </div>
  );
}
