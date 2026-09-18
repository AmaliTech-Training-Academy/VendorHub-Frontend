"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const footerLinks = [
  { label: "Sign In", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Support Contact", href: "mailto:support@vendorhub.com" },
];

export default function LandingFooter() {
  return (
    // Fits seamlessly into the landing page flow using bg-slate-900
    <footer className="w-full bg-slate-900 border-t border-slate-800 flex justify-center items-center py-12 overflow-hidden">
      <div className="w-11/12 max-w-7xl flex flex-col gap-8">
        {/* Top Section: Branding & Links Row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-8 border-b border-white/5">
          {/* Brand Identity Pillar */}
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="VendorHub logo"
                width={32}
                height={32}
                className="object-contain rounded-full opacity-80"
              />
              <span className="text-lg font-black tracking-tight text-white">
                Vendor<span className="text-orange-500">Hub</span>
              </span>
            </div>
            <p className="text-slate-500 font-light text-xs max-w-xs">
              VendorHub connects office vendors with employees for fast, simple
              ordering , browse vendors, place orders, and track delivery, all
              from one platform.
            </p>
          </div>

          {/* Quick Navigation Links Array */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-sm">
            {footerLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-6 sm:gap-8">
                {index > 0 && (
                  <span className="hidden sm:inline text-slate-800">•</span>
                )}
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors duration-200 font-light"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Copyright & Author Recognition */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-light tracking-wide">
          {/* Copyright Stamp */}
          <div>VendorHub &copy; 2026. All rights reserved.</div>

          {/* Amalitech Team Credit Pillar */}
          <div className="flex items-center gap-1.5 transition-all duration-300 hover:text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse animation-duration-[3s]" />
            <span>by the VendorHub team at</span>
            <Link
              href="https://amalitech.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-400 hover:text-sky-400 hover:underline transition-colors"
            >
              Amalitech
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
