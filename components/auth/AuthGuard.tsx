"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { homePathForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/types";

import { Spinner } from "../ui/spinner";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

const subscribeNoop = () => () => {};

export function AuthGuard({ children, allowedRoles }: Props) {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const accessToken = useAuthStore((state) => state.accessToken);
  // The auth store reads localStorage on the client, so render the spinner
  // during hydration (false) to match the server output.
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const isAllowed = !!accessToken && !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (!accessToken || !role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(homePathForRole(role));
      return;
    }
  }, [accessToken, role, allowedRoles, router]);

  if (!isClient || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-orange-500" />
      </div>
    );
  }

  return <>{children}</>;
}
