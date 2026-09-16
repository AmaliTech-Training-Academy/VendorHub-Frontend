"use client";

import Image from "next/image";

export default function OnboardingGraphics({}) {
  return (
    <div className="md:w-1/2 bg-linear-to-br from-orange-50 via-amber-50 to-white h-full hidden md:flex flex-col items-center justify-center gap-8 p-8 border-r border-gray-100">
      <div className="relative w-full max-w-112.5 h-95">
        {/* Circle 1 */}
        <span className="absolute top-0 left-24 w-44 h-44 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-1">
          <Image
            src="/vendor-1.jpg"
            alt="onboarding graphic 1"
            fill
            sizes="(max-width: 768px) 100vw, 176px"
            loading="eager"
            className="object-cover"
            priority
          />
        </span>

        {/* Circle 2 */}
        <span className="absolute bottom-4 left-0 w-56 h-56 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-2">
          <Image
            src="/vendor-3.jpg"
            alt="onboarding graphic 2"
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            loading="eager"
            className="object-cover"
          />
        </span>

        {/* Circle 3 */}
        <span className="absolute right-4 bottom-12 w-48 h-48 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-3">
          <Image
            src="/vendor-2.jpg"
            alt="onboarding graphic 3"
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            loading="eager"
            className="object-cover"
          />
        </span>
      </div>

      <div className="text-center max-w-sm space-y-2">
        <h2 className="text-xl font-bold text-gray-800">
          Welcome to <span className="text-orange-500">VendorHub</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Connecting vendors and teams for faster, easier ordering right from
          your desk.
        </p>
      </div>
    </div>
  );
}
