"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Store,
  Calendar,
  ClipboardList,
  Search,
  ShoppingBag,
  BellRing,
} from "lucide-react";
import { clsx } from "cn";
import { Button } from "@/components/ui/button";
import type { AudienceTab } from "@/types/types";

const audienceTabs = [
  { id: "employees", label: "Employees" },
  { id: "vendors", label: "Vendors" },
] as const;

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<AudienceTab>("employees");

  const data = {
    vendors: {
      image: "/v2.jpg",
      imageAlt: "Vendor managing office meal orders",
      steps: [
        {
          icon: <Store className="w-6 h-6 text-orange-400" />,
          title: "Set up your storefront",
          desc: "List your available products, clear pricing, and live inventory stock limits.",
        },
        {
          icon: <Calendar className="w-6 h-6 text-orange-400" />,
          title: "Set your delivery schedule",
          desc: "Pick your delivery days, operating times, and set a straightforward flat delivery fee.",
        },
        {
          icon: <ClipboardList className="w-6 h-6 text-orange-400" />,
          title: "Manage orders live",
          desc: "Track operations easily by marking orders as Received, Preparing, or Ready for Collection.",
        },
      ],
    },
    employees: {
      image: "/ve1.jpg",
      imageAlt: "Employee tracking their lunch order",
      steps: [
        {
          icon: <Search className="w-6 h-6 text-sky-400" />,
          title: "Browse vendors",
          desc: "Instantly see exactly which office vendors are delivering to your building and when.",
        },
        {
          icon: <ShoppingBag className="w-6 h-6 text-sky-400" />,
          title: "Add items to cart",
          desc: "Pick your favorite meals, choose your ideal delivery window, and see the exact total cost upfront.",
        },
        {
          icon: <BellRing className="w-6 h-6 text-sky-400" />,
          title: "Track your order",
          desc: "Receive real-time system alerts so you know exactly when it's ready no more guessing.",
        },
      ],
    },
  };

  return (
    <section
      id="how-it-works"
      className="w-full bg-blue-950 flex justify-center items-center py-16 md:py-24 overflow-hidden selection:bg-orange-500 selection:text-white"
    >
      <div className="w-11/12 max-w-7xl flex flex-col gap-12">
        {/* Section Header & Tab Switcher Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-slate-800 pb-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How Vendor<span className="text-orange-500">Hub</span> Works
            </h2>
            <p className="text-slate-400 font-light text-base">
              Simplify office meals in three easy phases.
            </p>
          </div>

          {/* Clean Switcher Buttons */}
          <div className="flex bg-slate-900 p-1 rounded-xl w-full max-w-xs self-start md:self-auto shadow-inner border border-slate-800">
            {audienceTabs.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-1/2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-transparent",
                  {
                    "bg-blue-900 text-white shadow-sm hover:text-white":
                      activeTab === tab.id && tab.id === "employees",
                    "bg-orange-500 text-white shadow-sm hover:text-white":
                      activeTab === tab.id && tab.id === "vendors",
                    "text-slate-400 hover:text-white": activeTab !== tab.id,
                  },
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 2 Column Body Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT COLUMN: Steps List */}
          <div
            key={activeTab}
            className="flex flex-col gap-4 animate-slide-in-left order-2 md:order-1"
          >
            {data[activeTab].steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:translate-x-2 border border-transparent hover:border-white/10"
              >
                <div
                  className={clsx(
                    "w-12 h-12 rounded-xl flex shrink-0 items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-105",
                    {
                      "bg-sky-500/10": activeTab === "employees",
                      "bg-orange-500/10": activeTab === "vendors",
                    },
                  )}
                >
                  {step.icon}
                </div>

                <div className="flex flex-col gap-1 mt-0.5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">
                      0{index + 1}.
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Images Section */}
          <div
            key={`${activeTab}-image`}
            className="w-full flex justify-center md:justify-end order-1 md:order-2 animate-slide-in-right"
          >
            <div className="relative w-full max-w-120 lg:max-w-130 h-87.5 sm:h-112.5 md:h-105 lg:h-125">
              <div
                className={clsx(
                  "absolute -right-4 -bottom-4 w-full h-full rounded-3xl -z-10 border-4 border-dashed transition-colors duration-300",
                  {
                    "border-sky-500/20 bg-sky-500/5": activeTab === "employees",
                    "border-orange-500/20 bg-orange-500/5":
                      activeTab === "vendors",
                  },
                )}
              ></div>

              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <Image
                  src={data[activeTab].image}
                  alt={data[activeTab].imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
