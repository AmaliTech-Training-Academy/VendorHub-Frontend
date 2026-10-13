import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Truck,
  User,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
// import { VENDOR_PROFILE_ENABLED } from "@/lib/constants";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
  {
    href: "/dashboard/delivery-settings",
    label: "Delivery settings",
    icon: Truck,
  },

  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Brand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 shrink-0 md:gap-3"
    >
      <Image
        src="/logo.png"
        alt="VendorHub logo"
        width={48}
        height={48}
        className="size-[34px] object-contain rounded-full bg-white p-1 md:size-10"
      />
      <span className="font-semibold text-lg md:text-2xl md:font-bold">
        <span className="text-white">Vendor</span>
        <span className="text-orange-400">Hub</span>
      </span>
    </Link>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  // trailingSlash: true (static export) makes usePathname() return "/dashboard/".
  const pathname = usePathname().replace(/\/+$/, "") || "/";

  return (
    // `flex-1 min-h-0 overflow-y-auto` lets the list scroll on short screens
    // instead of pushing "Log out" out of view. The -mx-2/px-2 pair leaves room
    // for the active shadow and the hover slide, which a scroll container
    // would otherwise clip.
    <nav
      aria-label="Dashboard"
      className="-mx-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2 py-1"
    >
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group h-12 w-full shrink-0 justify-start gap-3 rounded-xl px-2.5 text-sm md:text-base",
              "transition-all duration-200 motion-reduce:transition-none",
              // The trailing `!` makes these win over the ghost variant's own
              // hover colours, which otherwise compete with them.
              isActive
                ? "bg-white text-blue-950 shadow-md hover:bg-white! hover:text-blue-950!"
                : "text-white/70 hover:translate-x-1 hover:bg-white/15! hover:text-white! motion-reduce:hover:translate-x-0",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/70 group-hover:bg-orange-500/25 group-hover:text-orange-300",
              )}
            >
              <Icon className="size-4.5 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none" />
            </span>
            <span className="truncate font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="group h-12 w-full shrink-0 justify-start gap-3 rounded-xl px-2.5 text-sm text-white/70 transition-all duration-200 hover:bg-white/15! hover:text-white! motion-reduce:transition-none md:text-base"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-200 group-hover:bg-red-500/20 group-hover:text-red-300">
        <LogOut className="size-4.5" />
      </span>
      <span className="font-semibold">Log out</span>
    </Button>
  );
}
