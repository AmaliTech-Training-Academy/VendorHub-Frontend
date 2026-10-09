"use client";

import { useRouter } from "next/navigation";

import { useEffect, useSyncExternalStore } from "react";

import { useCurrentUser } from "@/hooks/useApproveVendor";
import { homePathForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/types";

import { VerificationGuardModal } from "./VerificationGuardModal";
import { AppLayoutSkeleton } from "../shared/layout/dashboard/AppLayoutSkeleton";
import { StorefrontLayoutSkeleton } from "../shared/layout/storefront/StorefrontLayoutSkeleton";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

const subscribeNoop = () => () => {};

/**
 * Renders the contextually correct skeleton fallback framework based on user roles
 */
function GuardSkeletonFallback({ role }: { role: UserRole | null }) {
  // If the active profile is verified as a VENDOR, return the Dashboard view structure.
  // Otherwise, default to the Storefront skeleton view structure (for EMPLOYEES or unauthenticated states).
  if (role === "VENDOR") {
    return <AppLayoutSkeleton />;
  }
  return <StorefrontLayoutSkeleton />;
}

function VendorApprovalGate({ children }: { children: React.ReactNode }) {
  const { data: serverUser, isLoading } = useCurrentUser();
  const role = useAuthStore((state) => state.role);

  if (isLoading) {
    return <GuardSkeletonFallback role={role} />;
  }

  if (serverUser && serverUser.verification_status !== "APPROVED") {
    return <VerificationGuardModal status={serverUser.verification_status} />;
  }

  return <>{children}</>;
}

export function AuthGuard({ children, allowedRoles }: Props) {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const accessToken = useAuthStore((state) => state.accessToken);

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

  // Handle Hydration or Redirection States safely with context matching skeletons
  if (!isClient || !isAllowed) {
    return <GuardSkeletonFallback role={role} />;
  }

  if (role === "VENDOR") {
    return <VendorApprovalGate>{children}</VendorApprovalGate>;
  }

  return <>{children}</>;
}
