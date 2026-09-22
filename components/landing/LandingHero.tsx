"use client";

import Image from "next/image";
import Link from "next/link";

const heroActions = [
  {
    label: "Get Started",
    href: "/register",
    className: "bg-blue-900 text-white shadow-md hover:shadow-xl",
  },
  {
    label: "See how it works",
    href: "#how-it-works",
    className:
      "bg-white border border-gray-200 text-blue-900 shadow-sm hover:shadow-md",
  },
];

export default function LandingHero() {
  return (
    <section className="w-full flex justify-center py-12 md:py-24 overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Increased the gap and maximized space for large viewports */}
      <div className="w-11/12 md:w-10/12 flex flex-col md:flex-row gap-16 md:gap-10 lg:gap-20 justify-between items-center max-w-7xl">
        {/* Left Side: Content Text */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 p-3 animate-slide-in-left text-center md:text-left items-center md:items-start">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl tracking-wide font-semibold text-blue-950 leading-tight">
            Office lunch,{" "}
            <span className="italic font-extrabold text-orange-500">
              sorted
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg tracking-wide font-light text-blue-950/80 max-w-xl">
            VendorHub connects office vendors with the people who order from
            them. No more guessing what&apos;s available, no more queuing to
            find out.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full">
            {heroActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:-translate-y-1 text-center min-w-35 ${action.className}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-137.5 lg:max-w-150 md:w-1/2 h-100 md:h-120 lg:h-145 animate-slide-in-right mt-12 md:mt-0">
          <div className="absolute right-4 top-4 bg-orange-100/60 w-11/12 h-5/6 rounded-3xl transform rotate-3 -z-10 shadow-sm animate-bounce transition-all delay-200 duration-300"></div>

          <div className="absolute top-0 left-0 w-3/4 h-4/5 rounded-3xl shadow-xl border-4 border-white z-10 bg-orange-50 ">
            <div className="relative w-full h-full rounded-[20px] overflow-hidden">
              <Image
                src="/vendor-2.jpg"
                alt="Happy person ordering lunch"
                fill
                sizes="(max-width: 768px) 75vw, 412px"
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-3xl shadow-2xl border-4 border-white z-20 bg-orange-100">
            <div className="relative w-full h-full rounded-[20px] overflow-hidden">
              <Image
                src="/v3.jpg"
                alt="Delicious office vendor meal food"
                fill
                sizes="(max-width: 768px) 60vw, 330px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
