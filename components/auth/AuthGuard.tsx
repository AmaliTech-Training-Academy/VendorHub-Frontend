"use client";

import { useRouter } from "next/navigation";

import { useEffect, useSyncExternalStore } from "react";

import { useCurrentUser } from "@/hooks/useApproveVendor";
import { homePathForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/types";

import { VerificationGuardModal } from "./VerificationGuardModal";
import { Spinner } from "../ui/spinner";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

const subscribeNoop = () => () => {};

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-6 text-orange-500" />
    </div>
  );
}

/**
 * Only vendors go through admin approval, so the server-side verification
 * lookup lives in its own component. It is mounted for vendors alone, which
 * means employees never trigger the request or wait on it.
 */
function VendorApprovalGate({ children }: { children: React.ReactNode }) {
  const { data: serverUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <FullScreenSpinner />;
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

  // Keep showing the spinner during hydration or while redirecting
  if (!isClient || !isAllowed) {
    return <FullScreenSpinner />;
  }

  if (role === "VENDOR") {
    return <VendorApprovalGate>{children}</VendorApprovalGate>;
  }

  return <>{children}</>;
}
