"use client";

import { usePathname, useRouter } from "next/navigation";

import { useEffect, useSyncExternalStore } from "react";

import { Spinner } from "@/components/ui/spinner";
import { homePathForRole, isAccessTokenExpired } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";

const ENTRY_PATHS = new Set(["/", "/login", "/register"]);

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const isEntryPath = ENTRY_PATHS.has(pathname.replace(/\/+$/, "") || "/");
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (isEntryPath && accessToken && role) {
      if (isAccessTokenExpired(accessToken)) {
        logout();
        return;
      }

      router.replace(homePathForRole(role));
    }
  }, [accessToken, isEntryPath, logout, role, router]);

  if (isEntryPath && isHydrated && accessToken && role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-orange-500" />
      </div>
    );
  }

  return <>{children}</>;
}
