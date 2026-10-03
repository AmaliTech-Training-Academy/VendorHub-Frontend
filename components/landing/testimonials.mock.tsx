import { Building2, Sparkles, Utensils } from "lucide-react";

import type { Testimonial } from "@/types/type";

export const testimonials: Testimonial[] = [
  {
    id: "sarah-k",
    quote:
      "Our team used to spend 15 minutes every day debating what to order and arguing in group chats. Now we just check the schedule and order right from our desks. Absolute game changer.",
    author: "Sarah K.",
    role: "Operations Lead",
    tag: "Corporate Team",
    avatarUrl: "",
    icon: <Building2 className="w-3.5 h-3.5 text-sky-400" />,
    gridSpan: "md:col-span-2 lg:col-span-7",
    accentGlow: "from-sky-500/10 to-transparent",
  },
  {
    id: "chef-marcus",
    quote:
      "As a vendor, guessing how much food to prepare for an office visit was a nightmare. VendorHub lets me lock in orders before I even park my truck.",
    author: "Chef Marcus",
    role: "Owner, StreetEats Catering",
    tag: "Food Vendor",
    avatarUrl: "",
    icon: <Utensils className="w-3.5 h-3.5 text-orange-400" />,
    gridSpan: "md:col-span-1 lg:col-span-5",
    accentGlow: "from-orange-500/10 to-transparent",
  },
  {
    id: "david-l",
    quote:
      "No more walking down three flights of stairs just to find out my favorite wrap is sold out. Seeing live stock levels saves me so much time every single afternoon.",
    author: "David L.",
    role: "Software Engineer",
    tag: "Employee",
    avatarUrl: "",
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
    gridSpan: "md:col-span-3 lg:col-span-12",
    accentGlow: "from-emerald-500/5 to-transparent",
  },
];
