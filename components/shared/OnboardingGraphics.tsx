"use client";

import Image from "next/image";

interface GraphicImage {
  src: string;
  alt: string;
}

interface OnboardingGraphicsProps {
  images: [GraphicImage, GraphicImage, GraphicImage];
  heading: string;
  highlightedWord: string;
  description: string;
}

export default function OnboardingGraphics({
  images,
  heading,
  highlightedWord,
  description,
}: OnboardingGraphicsProps) {
  return (
    <div className="md:w-1/2 bg-linear-to-br from-orange-50 via-amber-50 to-white h-full hidden md:flex flex-col items-center justify-center gap-8 p-8 border-r border-gray-100  rounded-tl-4xl space-y-15">
      <div className="flex   items-center gap-2 mb-6 animate-slide-in-right ">
        <Image
          src="/logo.png"
          alt="VendorHub logo"
          width={70}
          height={70}
          className="object-contain rounded-full "
        />
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-blue-900">Vendor</span>
          <span className="text-orange-500">Hub</span>
        </span>
      </div>
      <div className="relative w-full max-w-112.5 h-95 animate-slide-in-left">
        {/* Circle 1 */}
        <span className="absolute top-0 left-24 w-44 h-44 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-1">
          <Image
            src={images[0].src}
            alt={images[0].alt}
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
            src={images[1].src}
            alt={images[1].alt}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            loading="eager"
            className="object-cover"
          />
        </span>

        {/* Circle 3 */}
        <span className="absolute right-4 bottom-12 w-48 h-48 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden animate-float-3">
          <Image
            src={images[2].src}
            alt={images[2].alt}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            loading="eager"
            className="object-cover"
          />
        </span>
      </div>

      <div className="text-center max-w-sm space-y-2 animate-slide-in-right overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800">
          {heading} <span className="text-orange-500">{highlightedWord}</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
