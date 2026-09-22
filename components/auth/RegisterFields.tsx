"use client";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const selectedRole = watch("role") || "VENDOR";

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label
          id="role-label"
          className="text-xs font-bold uppercase tracking-wider"
        >
          I am a...
        </Label>

        <ToggleGroup
          value={selectedRole ? [selectedRole] : []}
          onValueChange={(value) => {
            const role = value[0] as RegisterFormData["role"] | undefined;
            if (role) setValue("role", role, { shouldValidate: true });
          }}
          aria-labelledby="role-label"
          className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl"
        >
          <ToggleGroupItem
            value="VENDOR"
            className={cn(
              "py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide",
              "aria-pressed:bg-white aria-pressed:text-blue-900 aria-pressed:shadow-sm",
            )}
          >
            VENDOR
          </ToggleGroupItem>

          <ToggleGroupItem
            value="EMPLOYEE"
            className={cn(
              "py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide",
              "aria-pressed:bg-white aria-pressed:text-blue-900 aria-pressed:shadow-sm",
            )}
          >
            EMPLOYEE
          </ToggleGroupItem>
        </ToggleGroup>

        <input type="hidden" {...register("role")} />

        {errors.role?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{String(errors.role.message)}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Fields conditionally rendered based on the selected role */}
      {selectedRole === "VENDOR" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="businessName"
              className="text-xs font-bold uppercase tracking-wider"
            >
              Business Name
            </Label>
            <Input
              {...register("businessName")}
              id="businessName"
              placeholder="Akosua's Kitchen"
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
              className="text-xs font-bold uppercase tracking-wider"
            >
              Owner Name
            </Label>
            <Input
              {...register("ownerName")}
              id="ownerName"
              placeholder="Enter full owner name"
            />
            {errors.ownerName?.message && (
              <Alert variant="destructive" className="px-3 py-2 text-xs">
                <AlertDescription>
                  {String(errors.ownerName.message)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      )}

      {selectedRole === "EMPLOYEE" && (
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="fullName"
            className="text-xs font-bold uppercase tracking-wider"
          >
            Full Name
          </Label>
          <Input
            {...register("fullName")}
            id="fullName"
            placeholder="Enter your full name"
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

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-wider"
        >
          Email Address
        </Label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
        />
        {errors.email?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{String(errors.email.message)}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-wider"
        >
          Password
        </Label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
        />
        {errors.password?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>
              {String(errors.password.message)}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
