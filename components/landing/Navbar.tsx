"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed!

export default function Navbar() {
  const [scroll, setScroll] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    function trackScroll() {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    }

    window.addEventListener("scroll", trackScroll);
    return () => {
      window.removeEventListener("scroll", trackScroll);
    };
  }, []);

  return (
    // 1. Added explicit backdrop-blur and altered widths.
    // On scroll, it transitions to a solid background so text remains perfectly legible.
    <header
      className={`sticky top-0 sm:top-5 z-50 w-full transition-all duration-300 flex flex-col justify-center px-4 sm:px-6 py-4
        ${
          scroll
            ? "md:w-full bg-white/90 backdrop-blur-md shadow-md sm:top-0 rounded-none"
            : "md:w-10/12 bg-orange-500/5 mt-0 sm:mt-5 rounded-md"
        }`}
    >
      {/* Container for main navbar line */}
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo.png"
            alt="VendorHub logo"
            priority
            width={50}
            height={50}
            className="object-contain rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
          <span className="text-xl sm:text-2xl font-arial font-extrabold tracking-tight">
            <span className="text-blue-900">Vendor</span>
            <span className="text-orange-500">Hub</span>
          </span>
        </div>

        {/* Desktop Navigation Links (Hidden on mobile) */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            <li>
              <Link
                href="#how-it-works"
                className="text-base font-medium text-gray-600 cursor-pointer hover:scale-105 transition-all duration-200 hover:text-blue-900 inline-block"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-base font-medium text-gray-600 cursor-pointer hover:scale-105 transition-all duration-200 hover:text-blue-900 inline-block"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-base font-medium text-gray-600 cursor-pointer hover:scale-105 transition-all duration-200 hover:text-blue-900 inline-block"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Buttons (Hidden on mobile) */}
        <div className="hidden md:flex gap-4 justify-center items-center">
          <Link
            href="/login"
            className="px-5 py-2 rounded-md bg-orange-500 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-md bg-blue-900 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button (Only visible on mobile screens) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-blue-950 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 2. Mobile Dropdown Menu Container */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out 
          ${isOpen ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <nav className="flex flex-col gap-4 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-inner border border-gray-100">
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-blue-900 py-1"
              >
                How it works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-blue-900 py-1"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-blue-900 py-1"
              >
                FAQ
              </Link>
            </li>
          </ul>

          {/* Action buttons inside mobile dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-md bg-amber-500 text-white font-semibold"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-md bg-blue-900 text-white font-semibold"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
