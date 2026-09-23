"use client";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Store, User, Check } from "lucide-react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { RegisterFormData } from "@/schemas/registerSchema";
import { RegisterFormValues } from "@/types/types";

type Props = {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  setValue: UseFormSetValue<RegisterFormValues>;
  watch: UseFormWatch<RegisterFormValues>;
};

export function RegisterFields({ register, errors, setValue, watch }: Props) {
  const selectedRole = watch("role");

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div className="flex flex-col gap-3">
        <div>
          <Label
            id="role-label"
            className="text-sm font-semibold text-slate-900"
          >
            I am a...
          </Label>

          <p className="mt-1 text-xs text-slate-500">
            Select an account type to continue.
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={selectedRole ?? ""}
          onValueChange={(value) => {
            if (value) {
              const role = value as RegisterFormData["role"];

              setValue("role", role, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          aria-labelledby="role-label"
          className="grid w-full grid-cols-2 gap-3"
        >
          {/* Vendor */}
          <ToggleGroupItem
            value="VENDOR"
            aria-label="Register as a vendor"
            className={cn(
              "group relative flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white p-4 text-sm font-semibold transition-all duration-200",
              "border-slate-200 text-slate-600",
              "hover:border-orange-300 hover:bg-orange-50/40 hover:text-orange-600",
              "data-[state=on]:border-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
              "data-[state=on]:shadow-lg data-[state=on]:shadow-orange-500/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-colors",
                selectedRole === "VENDOR"
                  ? "bg-white/20 text-white"
                  : "bg-orange-50 text-orange-500",
              )}
            >
              <Store className="size-5" strokeWidth={2.3} />
            </div>

            <span>Vendor</span>

            {selectedRole === "VENDOR" && (
              <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white text-orange-500">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            )}
          </ToggleGroupItem>

          {/* Employee */}
          <ToggleGroupItem
            value="EMPLOYEE"
            aria-label="Register as an employee"
            className={cn(
              "group relative flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white p-4 text-sm font-semibold transition-all duration-200",
              "border-slate-200 text-slate-600",
              "hover:border-orange-300 hover:bg-orange-50/40 hover:text-orange-600",
              "data-[state=on]:border-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
              "data-[state=on]:shadow-lg data-[state=on]:shadow-orange-500/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-colors",
                selectedRole === "EMPLOYEE"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <User className="size-5" strokeWidth={2.3} />
            </div>

            <span>Employee</span>

            {selectedRole === "EMPLOYEE" && (
              <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white text-orange-500">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            )}
          </ToggleGroupItem>
        </ToggleGroup>

        <input type="hidden" {...register("role")} />

        {errors.role?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{String(errors.role.message)}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* 
        Don't show ANY fields until a role has been selected.
      */}
      {!selectedRole && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-center">
          <p className="text-xs text-slate-500">
            Choose an account type above to continue.
          </p>
        </div>
      )}

      {/* Fields only appear after selecting a role */}
      {selectedRole && (
        <div className="space-y-5">
          {/* Vendor Fields */}
          {selectedRole === "VENDOR" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="businessName"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Business Name
                </Label>

                <Input
                  {...register("businessName")}
                  id="businessName"
                  placeholder="Akosua's Kitchen"
                  className={cn(
                    "h-11 rounded-xl",
                    errors.businessName &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />

                {errors.businessName?.message && (
                  <Alert variant="destructive" className="px-3 py-2 text-xs">
                    <AlertDescription>
                      {String(errors.businessName.message)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="ownerName"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Owner Name
                </Label>

                <Input
                  {...register("ownerName")}
                  id="ownerName"
                  placeholder="Enter full owner name"
                  className={cn(
                    "h-11 rounded-xl",
                    errors.ownerName &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />

                {errors.ownerName?.message && (
                  <Alert variant="destructive" className="px-3 py-2 text-xs">
                    <AlertDescription>
                      {String(errors.ownerName.message)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Employee Fields */}
          {selectedRole === "EMPLOYEE" && (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="fullName"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Full Name
              </Label>

              <Input
                {...register("fullName")}
                id="fullName"
                placeholder="Enter your full name"
                className={cn(
                  "h-11 rounded-xl",
                  errors.fullName &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />

              {errors.fullName?.message && (
                <Alert variant="destructive" className="px-3 py-2 text-xs">
                  <AlertDescription>
                    {String(errors.fullName.message)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Account details
              </p>

              <p className="mt-1 text-xs text-slate-500">
                These details will be used to access your account.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Email Address
              </Label>

              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={cn(
                  "h-11 rounded-xl",
                  errors.email && "border-red-500 focus-visible:ring-red-500",
                )}
              />

              {errors.email?.message && (
                <Alert variant="destructive" className="px-3 py-2 text-xs">
                  <AlertDescription>
                    {String(errors.email.message)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Password
              </Label>

              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className={cn(
                  "h-11 rounded-xl",
                  errors.password &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />

              {errors.password?.message && (
                <Alert variant="destructive" className="px-3 py-2 text-xs">
                  <AlertDescription>
                    {String(errors.password.message)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
