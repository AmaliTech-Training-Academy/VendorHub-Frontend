"use client";

import { Store, User, Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/types";
import type { RegisterFormValues } from "@/types/types";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  setValue: UseFormSetValue<RegisterFormValues>;
  watch: UseFormWatch<RegisterFormValues>;
};

type FieldsProps = Pick<Props, "register" | "errors">;

const INPUT_CLASS =
  "h-11 rounded-xl border-slate-200 bg-white focus-visible:border-orange-500 focus-visible:ring-orange-500/20";
const LABEL_CLASS = "text-xs font-bold uppercase tracking-wider text-slate-600";
const GROUP_CLASS =
  "mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2";

function FieldErrorAlert({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <Alert variant="destructive" className="px-3 py-2 text-xs">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function RoleOption({
  value,
  label,
  icon: Icon,
  selected,
  idleIconClass,
}: {
  value: UserRole;
  label: string;
  icon: typeof Store;
  selected: boolean;
  idleIconClass: string;
}) {
  return (
    <ToggleGroupItem
      value={value}
      className={cn(
        "relative flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white text-sm font-bold transition-all duration-200",
        "border-slate-200 text-slate-500",
        "hover:border-orange-300 hover:bg-orange-50/50 hover:text-orange-600",
        "data-[state=on]:border-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
        "data-[state=on]:shadow-lg data-[state=on]:shadow-orange-500/20",
        "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-xl transition-all",
          selected ? "bg-white/20 text-white" : idleIconClass,
        )}
      >
        <Icon className="size-5" strokeWidth={2.3} />
      </div>

      <span>{label}</span>

      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white text-orange-500">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </ToggleGroupItem>
  );
}

function TextField({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </Label>
      {children}
      <FieldErrorAlert message={error} />
    </div>
  );
}

function VendorFields({ register, errors }: FieldsProps) {
  return (
    <div className={GROUP_CLASS}>
      <TextField
        id="businessName"
        label="Business Name"
        error={errors.businessName?.message}
      >
        <Input
          {...register("businessName")}
          id="businessName"
          placeholder="Akosua's Kitchen"
          className={INPUT_CLASS}
        />
      </TextField>

      <TextField
        id="ownerName"
        label="Owner Name"
        error={errors.ownerName?.message}
      >
        <Input
          {...register("ownerName")}
          id="ownerName"
          placeholder="Enter full owner name"
          className={INPUT_CLASS}
        />
      </TextField>
    </div>
  );
}

function EmployeeFields({ register, errors }: FieldsProps) {
  return (
    <div className={GROUP_CLASS}>
      <TextField
        id="fullName"
        label="Full Name"
        error={errors.fullName?.message}
      >
        <Input
          {...register("fullName")}
          id="fullName"
          placeholder="Enter your full name"
          className={INPUT_CLASS}
        />
      </TextField>

      <TextField id="phone" label="Phone Number" error={errors.phone?.message}>
        <Input
          {...register("phone")}
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0241234567"
          className={INPUT_CLASS}
        />
      </TextField>

      <TextField
        id="officeAddress"
        label="Office Address"
        error={errors.officeAddress?.message}
        className="sm:col-span-2"
      >
        <Input
          {...register("officeAddress")}
          id="officeAddress"
          placeholder="e.g. Ridge Office Park, 3rd Floor"
          className={INPUT_CLASS}
        />
        <p className="text-xs text-slate-500">
          Where vendors should deliver your orders.
        </p>
      </TextField>
    </div>
  );
}

function AccountFields({ register, errors }: FieldsProps) {
  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5">
      <div>
        <p className="text-sm font-bold text-slate-800">Account details</p>
        <p className="mt-1 text-xs text-slate-500">
          Use these details to access your account.
        </p>
      </div>

      <TextField id="email" label="Email Address" error={errors.email?.message}>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
          className="h-11 rounded-xl border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
        />
      </TextField>

      <TextField
        id="password"
        label="Password"
        error={errors.password?.message}
      >
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className="h-11 rounded-xl border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
        />
      </TextField>
    </div>
  );
}

export function RegisterFields({ register, errors, setValue, watch }: Props) {
  // `role` is unset until the user picks one, even though the form type requires it.
  const selectedRole = watch("role") as UserRole | undefined;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="space-y-1">
          <Label
            id="role-label"
            className="text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            I am a...
          </Label>

          <p className="text-xs text-slate-500">
            Choose an account type to continue.
          </p>
        </div>

        <ToggleGroup
          value={selectedRole ? [selectedRole] : []}
          onValueChange={(value) => {
            const role = value[0] as UserRole | undefined;

            if (role) {
              setValue("role", role, { shouldValidate: true });
            }
          }}
          aria-labelledby="role-label"
          className="grid w-full grid-cols-2 gap-3"
        >
          <RoleOption
            value={UserRole.VENDOR}
            label="Vendor"
            icon={Store}
            selected={selectedRole === UserRole.VENDOR}
            idleIconClass="bg-orange-50 text-orange-500"
          />
          <RoleOption
            value={UserRole.EMPLOYEE}
            label="Employee"
            icon={User}
            selected={selectedRole === UserRole.EMPLOYEE}
            idleIconClass="bg-slate-100 text-slate-500"
          />
        </ToggleGroup>

        <input type="hidden" {...register("role")} />

        <FieldErrorAlert message={errors.role?.message} />
      </div>

      {/* Nothing below the tabs until a role is selected */}
      {selectedRole && (
        <>
          {selectedRole === UserRole.VENDOR ? (
            <VendorFields register={register} errors={errors} />
          ) : (
            <EmployeeFields register={register} errors={errors} />
          )}
          <AccountFields register={register} errors={errors} />
        </>
      )}
    </>
  );
}
