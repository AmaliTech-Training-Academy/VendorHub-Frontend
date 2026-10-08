"use client";

import { useRouter } from "next/navigation";

import { Clock, ShieldAlert, LogOut } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

interface VerificationGuardModalProps {
  status: string | null;
}

export function VerificationGuardModal({
  status,
}: VerificationGuardModalProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isPending = status === "PENDING" || !status;

  return (
    <AlertDialog open={true}>
      {/* Container matches the warm, smooth card panel styling */}
      <AlertDialogContent className="max-w-md gap-6 border-none bg-[#FFF8EE] p-8 shadow-xl rounded-2xl md:max-w-lg">
        <AlertDialogHeader className="flex flex-col items-center gap-5 text-center">
          {/* Custom Visual Status Ring Elements */}
          {isPending ? (
            <div className="flex size-16 items-center justify-center rounded-full bg-[#FFE6C7] text-[#EA580C]">
              <Clock className="size-8 animate-pulse" />
            </div>
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <ShieldAlert className="size-8" />
            </div>
          )}

          {/* Typography headers utilizing the theme colors from your UI layout */}
          <div className="space-y-3">
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-[#334155]">
              {isPending ? (
                <>
                  Ahh, your profile is{" "}
                  <span className="text-[#FA6A02]">under review</span>.
                </>
              ) : (
                <>
                  Verification <span className="text-red-600">declined</span>.
                </>
              )}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm font-medium leading-relaxed text-[#64748B]">
              {isPending
                ? "Welcome to VendorHub! Our compliance operations team is currently validating your business documents, registration profiles, and shop inventory items. This review timeline typically resolves within 24 hours."
                : "We were unable to successfully match your credentials against our vendor requirements criteria specification. Please check your inbox for an administrative notification outlining next steps."}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Custom Button Matching Your Core Login Action Elements */}
        <AlertDialogFooter className="sm:justify-center mt-2">
          <Button
            onClick={handleLogout}
            className="w-full gap-2 rounded-xl bg-[#FA6A02] text-white py-6 font-semibold shadow-md transition-all duration-200 hover:bg-[#E05E02] hover:shadow-lg active:scale-[0.98] sm:w-64"
          >
            <LogOut className="size-4" />
            Sign out of account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
