"use client";

import Link from "next/link";
import { ArrowRight, Utensils, Sparkles, ShieldCheck } from "lucide-react";

const ctaBadges = [
  {
    label: "For Vendors",
    icon: Utensils,
    position: "left-[8%] top-[25%]",
    color: "bg-orange-500 text-orange-400 transform -rotate-6",
    animationDuration: "[animation-duration:5s]",
  },
  {
    label: "For Employees",
    icon: Sparkles,
    position: "right-[8%] bottom-[25%]",
    color: "bg-blue-900 text-blue-900 transform rotate-6",
    animationDuration: "[animation-duration:6s]",
  },
];

const trustPoints = [
  "Setup in 60 seconds",
  "No contract required",
  "Cancel anytime",
];

export default function CTASection() {
  return (
    // Fits perfectly into your layout flow using bg-slate-900
    <section className="w-full bg-orange-200 flex justify-center items-center py-24 md:py-32 overflow-hidden border-t border-slate-800 relative">
      {/* Human-designed organic ambient light spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-linear-to-tr from-blue-600/10 to-orange-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse animation-duration-[8s]" />

      {/* Decorative Floating UI Badge elements to break rigid alignments */}
      {ctaBadges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className={`absolute ${badge.position} hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md animate-bounce ${badge.color} ${badge.animationDuration}`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wide">
              {badge.label}
            </span>
          </div>
        );
      })}

      <div className="w-11/12 max-w-4xl flex flex-col items-center text-center gap-8 relative z-10">
        {/* Core Content Messaging Stack */}
        <div className="flex flex-col gap-4 max-w-2xl animate-slide-in-up">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-blue-950 leading-tight">
            Ready to simplify lunch?
          </h2>
          <p className="text-blue-900 font-light text-base sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re running a stall or just hungry at 12, VendorHub
            makes it easy.
          </p>
        </div>

        {/* Central Premium Action Portal */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md animate-slide-in-up [animation-delay:150ms] mt-2">
          <Link
            href="/register"
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-blue-900 to-blue-950 hover:from-orange-500 hover:to-orange-600 text-white font-bold tracking-wide shadow-xl shadow-blue-950/50 hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 text-base"
          >
            Create your account
            {/* Arrow icon slides outward smoothly on hover */}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Quick secondary sign-in anchor link */}
          <p className="text-sm text-blue-900 font-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-500 font-medium hover:text-white underline underline-offset-4 transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>

        {/* Trust verification sub-footer layer */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-white/5 w-full max-w-2xl text-blue-950 font-light text-xs tracking-wider uppercase">
          {trustPoints.map((point, index) => (
            <div key={point} className="flex items-center gap-6">
              {index > 0 && (
                <span className="hidden sm:inline text-slate-700">•</span>
              )}
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>{point}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
