"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/types";
import { Spinner } from "../ui/spinner";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export function AuthGuard({ children, allowedRoles }: Props) {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!accessToken || !role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(role === "VENDOR" ? "/dashboard/products" : "/storefront");
      return;
    }

    setChecked(true);
  }, [accessToken, role, allowedRoles, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-orange-500" />
      </div>
    );
  }

  return <>{children}</>;
}
