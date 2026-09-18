"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";

export default function ShortStory() {
  return (
    // Added py-16 to give the section breathing room
    <section
      className="w-full bg-white flex justify-center items-center py-16 md:py-24 overflow-hidden"
      id="story"
    >
      <div className="w-11/12 max-w-7xl flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between">
        <div className="relative w-full max-w-[450px] lg:max-w-[500px] h-[350px] md:h-[500px] border-8 border-orange-100 rounded-2xl overflow-hidden shadow-xl animate-slide-in-left transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src="/vendor-3.jpg"
            alt="Delicious office vendor meal food"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority
            className="object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 animate-slide-in-right">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-blue-950">
            Sound familiar?
          </h2>

          <ul className="flex flex-col gap-4">
            <li className="group flex items-start gap-3 text-base sm:text-lg text-gray-700 font-light leading-relaxed p-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-2">
              <span className="text-orange-500 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-600">
                <CircleCheck className="w-6 h-6 fill-orange-50" />
              </span>
              <span>
                You walk to the vendor&apos;s table, only to find out
                they&apos;re{" "}
                <strong className="font-semibold text-blue-950">
                  sold out
                </strong>{" "}
                of what you wanted.
              </span>
            </li>

            {/* List Item 2 */}
            <li className="group flex items-start gap-3 text-base sm:text-lg text-gray-700 font-light leading-relaxed p-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-2">
              <span className="text-orange-500 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-600">
                <CircleCheck className="w-6 h-6 fill-orange-50" />
              </span>
              <span>
                You don&apos;t know the{" "}
                <strong className="font-semibold text-blue-950">
                  total cost
                </strong>{" "}
                until you&apos;re already standing at the counter.
              </span>
            </li>

            {/* List Item 3 */}
            <li className="group flex items-start gap-3 text-base sm:text-lg text-gray-700 font-light leading-relaxed p-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-2">
              <span className="text-orange-500 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-600">
                <CircleCheck className="w-6 h-6 fill-orange-50" />
              </span>
              <span>
                You&apos;re never quite sure{" "}
                <strong className="font-semibold text-blue-950">
                  what day
                </strong>{" "}
                they&apos;re actually coming to your office.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
