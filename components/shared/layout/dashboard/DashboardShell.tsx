"use client";


import { useRouter } from "next/navigation";

import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";

import { Brand, LogoutButton, NavLinks } from "./SidebarFeatures";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen md:flex bg-muted/30">
      {/* Sidebar, desktop only */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:sticky md:top-0 md:h-screen bg-blue-950 p-5">
        <div className="px-1 py-2">
          <Brand />
        </div>
        <Separator className="my-5 bg-white/10" />
        <NavLinks />
        <div className="mt-auto">
          <Separator className="my-5 bg-white/10" />
          <LogoutButton onClick={handleLogout} />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Top bar, mobile only */}
        <header className="md:hidden flex items-center justify-between bg-blue-950 px-4 py-3">
          <Brand />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-blue-950 border-none p-5"
            >
              <div className="mt-8 flex h-full flex-col">
                <NavLinks onNavigate={() => { setMobileOpen(false); }} />
                <div className="mt-auto pb-4">
                  <Separator className="my-5 bg-white/10" />
                  <LogoutButton onClick={handleLogout} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="p-4 md:p-8 w-full ">{children}</main>
      </div>
    </div>
  );
}
