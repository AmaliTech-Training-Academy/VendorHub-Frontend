"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";

const storyPoints = [
  {
    before: "You walk to the vendor's table, only to find out they're ",
    emphasis: "sold out",
    after: " of what you wanted.",
  },
  {
    before: "You don't know the ",
    emphasis: "total cost",
    after: " until you're already standing at the counter.",
  },
  {
    before: "You're never quite sure ",
    emphasis: "what day",
    after: " they're actually coming to your office.",
  },
];

export default function PainPointsSection() {
  return (
    // Added py-16 to give the section breathing room
    <section
      className="w-full bg-white flex justify-center items-center py-16 md:py-24 overflow-hidden"
      id="story"
    >
      <div className="w-11/12 max-w-7xl flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between">
        <div className="relative w-full max-w-112.5 lg:max-w-125 h-87.5 md:h-125  rounded-2xl overflow-hidden  animate-slide-in-left transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src="/e1.jpg"
            alt="Delicious office vendor meal food"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority
            className="object-fit transition-transform duration-700 hover:scale-110"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 animate-slide-in-right">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-blue-950">
            Sound familiar?
          </h2>

          <ul className="flex flex-col gap-4">
            {storyPoints.map((point) => (
              <li
                key={point.emphasis}
                className="group flex items-start gap-3 text-base sm:text-lg text-gray-700 font-light leading-relaxed p-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-2"
              >
                <span className="text-orange-500 mt-1 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-600">
                  <CircleCheck className="w-6 h-6 fill-orange-50" />
                </span>
                <span>
                  {point.before}
                  <strong className="font-semibold text-blue-950">
                    {point.emphasis}
                  </strong>
                  {point.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
