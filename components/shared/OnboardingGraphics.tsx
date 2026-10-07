"use client";

import Image from "next/image";
import Link from "next/link";

import type { OnboardingGraphicsProps } from "@/types/interfaces";

export default function OnboardingGraphics({
  images,
  heading,
  highlightedWord,
  description,
}: OnboardingGraphicsProps) {
  return (
    <div className="md:w-1/2 bg-linear-to-br from-orange-50 via-amber-50 to-white h-full hidden md:flex flex-col items-center justify-center gap-8 p-8 border-r border-gray-100 rounded-tl-4xl space-y-15">
      <Link href="/">
        <div className="flex items-center gap-2 mb-6 animate-slide-in-right">
          <Image
            src="/logo.png"
            alt="VendorHub logo"
            width={70}
            height={70}
            className="object-contain rounded-full"
          />
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-blue-900">Vendor</span>
            <span className="text-orange-500">Hub</span>
          </span>
        </div>
      </Link>

      {/* Sizing classes live on the OUTER (animated) wrapper now,
          so the inner relative div isn't fighting for its own width */}
      <div className="w-full max-w-112.5 animate-slide-in-left">
        <div className="relative h-65">
          {/* Circle 1 */}
          <span className="absolute top-20 left-40 w-32 h-32 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-1">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              sizes="(max-width: 420px) 100vw, 85px"
              loading="eager"
              className="object-cover"
              priority
            />
          </span>

          {/* Circle 2 */}
          <span className="absolute bottom-4 left-20 w-32 h-32 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-2">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              sizes="(max-width: 420px) 100vw, 85px"
              loading="eager"
              className="object-cover"
            />
          </span>

          {/* Circle 3 */}
          <span className="absolute right-20 bottom-5 w-32 h-32 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-3">
            <Image
              src={images[2].src}
              alt={images[2].alt}
              fill
              sizes="(max-width: 420px) 100vw, 85px"
              loading="eager"
              className="object-cover"
            />
          </span>
        </div>
      </div>

      <div className="text-center max-w-sm space-y-2 animate-slide-in-right">
        <h2 className="text-xl font-bold text-gray-800">
          {heading} <span className="text-orange-500">{highlightedWord}</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
