"use client";

import { Star, Quote, Building2, Utensils, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "Our team used to spend 15 minutes every day debating what to order and arguing in group chats. Now we just check the schedule and order right from our desks. Absolute game changer.",
      author: "Sarah K.",
      role: "Operations Lead",
      tag: "Corporate Team",
      icon: <Building2 className="w-3.5 h-3.5 text-sky-400" />,
      // Extra styling flags for bento layout composition variation
      gridSpan: "md:col-span-2 lg:col-span-7",
      accentGlow: "from-sky-500/10 to-transparent",
    },
    {
      quote:
        "As a vendor, guessing how much food to prepare for an office visit was a nightmare. VendorHub lets me lock in orders before I even park my truck.",
      author: "Chef Marcus",
      role: "Owner, StreetEats Catering",
      tag: "Food Vendor",
      icon: <Utensils className="w-3.5 h-3.5 text-orange-400" />,
      gridSpan: "md:col-span-1 lg:col-span-5",
      accentGlow: "from-orange-500/10 to-transparent",
    },
    {
      quote:
        "No more walking down three flights of stairs just to find out my favorite wrap is sold out. Seeing live stock levels saves me so much time every single afternoon.",
      author: "David L.",
      role: "Software Engineer",
      tag: "Employee",
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      gridSpan: "md:col-span-3 lg:col-span-12",
      accentGlow: "from-emerald-500/5 to-transparent",
    },
  ];

  return (
    <section className="w-full bg-slate-900 flex justify-center items-center py-20 md:py-28 overflow-hidden relative border-t border-slate-800">
      <div className="absolute top-1/4 left-1/4 w-112.5 h-112.5 bg-blue-600/4 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-112.5 h-112.5 bg-orange-500/4 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-11/12 max-w-7xl flex flex-col gap-16">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-blue-500/10 to-orange-500/10 border border-white/5 shadow-inner">
            <span className="text-xs font-semibold text-orange-500 tracking-wider uppercase">
              Early Access Reviews
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Loved by local vendors. <br className="hidden sm:inline" />
            Trusted by busy teams.
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-300">
              The honest standard for building-wide office ordering.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 w-full">
          {reviews.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-linear-to-b from-white/3 to-white/1 border border-white/5 p-8 rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/10 flex flex-col justify-between overflow-hidden backdrop-blur-sm ${item.gridSpan}`}
            >
              {/* Internal abstract gradient accent that glows upon hovering */}
              <div
                className={`absolute -right-20 -top-20 w-48 h-48 bg-linear-to-br ${item.accentGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
              />

              {/* Decorative Large Modern Floating Quote Component */}
              <Quote className="absolute right-8 top-8 w-16 h-16 text-white/1.5 group-hover:text-white/3 group-hover:scale-110 transition-all duration-500 transform rotate-180 pointer-events-none" />

              {/* Core Testimonial Quote */}
              <p className="text-base sm:text-lg text-slate-200 font-light tracking-wide leading-relaxed mb-8 max-w-3xl relative z-10 antialiased">
                {item.quote}
              </p>

              {/* Reviewer Profile Identity Footer Area */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Humanizing Avatar Placeholder with initial lettering */}
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center font-bold text-sm text-slate-200 shadow-inner group-hover:from-slate-700 group-hover:to-slate-600 transition-all duration-300">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {item.author}
                    </h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Styled pill badge label marking their role type */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/2 border border-white/5 text-[11px] font-medium text-slate-300 shadow-sm transition-all duration-300 group-hover:bg-white/5">
                  {item.icon}
                  <span>{item.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
