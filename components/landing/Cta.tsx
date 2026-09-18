"use client";

import Link from "next/link";
import { ArrowRight, Utensils, Sparkles, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  return (
    // Fits perfectly into your layout flow using bg-slate-900
    <section className="w-full bg-orange-200 flex justify-center items-center py-24 md:py-32 overflow-hidden border-t border-slate-800 relative">
      {/* Human-designed organic ambient light spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/10 to-orange-500/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse [animation-duration:8s]" />

      {/* Decorative Floating UI Badge elements to break rigid alignments */}
      <div className="absolute left-[8%] top-[25%] hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-orange-500 border border-white/5 shadow-2xl backdrop-blur-md transform -rotate-6 animate-bounce [animation-duration:5s]">
        <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center text-orange-400">
          <Utensils className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-white tracking-wide">
          For Vendors
        </span>
      </div>

      <div className="absolute right-[8%] bottom-[25%] hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-blue-900 border border-white/5 shadow-2xl backdrop-blur-md transform rotate-6 animate-bounce [animation-duration:6s]">
        <div className="w-8 h-8 rounded-lg bg-white/40 flex items-center justify-center text-blue-900">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-white tracking-wide">
          For Employees
        </span>
      </div>

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
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-950 hover:from-orange-500 hover:to-orange-600 text-white font-bold tracking-wide shadow-xl shadow-blue-950/50 hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 text-base"
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
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Setup in 60 seconds</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>No contract required</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
