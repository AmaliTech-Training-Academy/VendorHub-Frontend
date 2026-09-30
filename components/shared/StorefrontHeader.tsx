"use client";

import Image from "next/image";

import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PageHeaderSlide {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
  badgeIcon: LucideIcon;
  backgroundImage: string;
}

export function PageHeader({
  slides,
}: {
  slides: [PageHeaderSlide, ...PageHeaderSlide[]];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    if (
      slides.length < 2 ||
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => {
        return (index + 1) % slides.length;
      });
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, slides.length]);

  function showPrevious() {
    setActiveIndex((index) => {
      return (index - 1 + slides.length) % slides.length;
    });
  }

  function showNext() {
    setActiveIndex((index) => {
      return (index + 1) % slides.length;
    });
  }

  const Icon = activeSlide.icon;
  const BadgeIcon = activeSlide.badgeIcon;

  function pauseAutoplay() {
    setIsPaused(true);
  }

  function resumeAutoplay() {
    setIsPaused(false);
  }

  function showSlide(index: number) {
    setActiveIndex(index);
  }

  return (
    <section
      aria-label="VendorHub highlights"
      aria-roledescription="carousel"
      className="relative isolate min-h-68 overflow-hidden rounded-lg bg-slate-950 text-white sm:min-h-76"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocusCapture={pauseAutoplay}
      onBlurCapture={resumeAutoplay}
    >
      <Image
        key={activeSlide.backgroundImage}
        src={activeSlide.backgroundImage}
        alt=""
        fill
        priority={activeIndex === 0}
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="object-cover animate-in fade-in duration-700 motion-reduce:animate-none"
        loading="eager"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/75 to-slate-950/25"
      />
      <div className="relative flex min-h-68 flex-col justify-between gap-8 p-6 sm:min-h-76 sm:p-8">
        <div
          key={activeIndex}
          aria-live="polite"
          aria-atomic="true"
          className="flex max-w-3xl flex-col gap-4 animate-in slide-in-from-right-5 fade-in duration-700 motion-reduce:animate-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
            <Icon aria-hidden="true" className="size-4" />
            <span>{activeSlide.eyebrow}</span>
          </div>
          <h1 className="max-w-2xl text-3xl leading-tight font-semibold text-white sm:text-4xl">
            {activeSlide.title}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            {activeSlide.description}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <BadgeIcon aria-hidden="true" className="size-4 text-orange-300" />
            <span>{activeSlide.badgeText}</span>
          </div>

          <div className="flex items-center gap-1" aria-label="Slide controls">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/15 hover:text-white"
              aria-label="Previous highlight"
              onClick={showPrevious}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            {slides.map((slide, index) => (
              <Button
                key={slide.title}
                type="button"
                variant="ghost"
                size="icon-xs"
                className={cn(
                  "size-5 text-white/60 hover:bg-white/10 hover:text-white",
                  index === activeIndex && "text-orange-300",
                )}
                aria-label={`Show highlight ${String(index + 1)}: ${slide.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => {
                  showSlide(index);
                }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full bg-current",
                    index === activeIndex && "size-2.5",
                  )}
                />
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/15 hover:text-white"
              aria-label="Next highlight"
              onClick={showNext}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
