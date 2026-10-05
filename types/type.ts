import type { ReactNode } from "react";

export type AudienceTab = "employees" | "vendors";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  tag: string;
  avatarUrl: string;
  icon: ReactNode;
  gridSpan: string;
  accentGlow: string;
};
