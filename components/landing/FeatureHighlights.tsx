"use client";

import { Clock, DollarSign, Layers, Zap } from "lucide-react";

export default function FeatureHighlights() {
  // Feature cards data definition
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-sky-400" />,
      title: "Real-time order status",
      desc: "Vendors update their progress instantly, letting you track your meal straight to delivery.",
      badgeColor: "bg-sky-500/10",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-amber-400" />,
      title: "Transparent pricing",
      desc: "Item costs and flat delivery fees are explicitly shown before you confirm your order.",
      badgeColor: "bg-amber-500/10",
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: "No app-hopping",
      desc: "One single platform handles every food and beverage vendor operating inside your building.",
      badgeColor: "bg-emerald-500/10",
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      title: "Built for busy people",
      desc: "Order your daily office lunch in under a minute without ever leaving your workspace desk.",
      badgeColor: "bg-orange-500/10",
    },
  ];

  return (
    <section
      id="feature"
      className="w-full bg-blue-950 flex justify-center items-center py-16 md:py-24 overflow-hidden"
    >
      <div className="w-11/12 max-w-7xl flex flex-col gap-12">
        {/* Component Headers */}
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-sm font-semibold tracking-wider text-orange-400 uppercase">
            Product Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for better office dining
          </h2>
          <p className="text-slate-400 font-light text-base">
            Everything you need to eliminate lines, hidden fees, and workplace
            lunch confusion.
          </p>
        </div>

        {/* 
          2-Column to 4-Column Responsive Grid:
          - 1 column on mobile phones (grid-cols-1)
          - 2 columns on tablets/small laptops (sm:grid-cols-2)
          - 4 columns on desktop monitors (lg:grid-cols-4)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((item, index) => (
            <div
              key={index}
              // Translucent hover container that responds smoothly to movement
              className="group relative bg-white/2 border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:-translate-y-2 hover:shadow-xl hover:border-white/10 flex flex-col gap-4"
            >
              {/* Highlight Background Pulse (Adds subtle glowing effect on card hover) */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon Holder Frame */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.badgeColor}`}
              >
                {item.icon}
              </div>

              {/* Text Blocks */}
              <div className="flex flex-col gap-2 relative z-10">
                <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-orange-400 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
