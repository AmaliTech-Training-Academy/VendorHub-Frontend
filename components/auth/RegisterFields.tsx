import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RegisterFieldsProps } from "@/types/interfaces";
import type { RegisterFormData } from "@/types/types";

export function RegisterFields({
  register,
  errors,
  setValue,
  watch,
}: RegisterFieldsProps) {
  const selectedRole = watch("role");

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
            if (role)
              setValue("role", role, {
                shouldValidate: true,
              });
          }}
          aria-labelledby="role-label"
          className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl"
        >
          <ToggleGroupItem
            value="vendor"
            className={cn(
              "py-2.5 rounded-lg text-sm font-semibold",
              "aria-pressed:bg-white aria-pressed:text-blue-900 aria-pressed:shadow-sm",
            )}
          >
            Vendor
          </ToggleGroupItem>

          <ToggleGroupItem
            value="employee"
            className={cn(
              "py-2.5 rounded-lg text-sm font-semibold",
              "aria-pressed:bg-white aria-pressed:text-blue-900 aria-pressed:shadow-sm",
            )}
          >
            Employee
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Hidden input keeps role registered with React Hook Form for validation */}
        <input type="hidden" {...register("role")} />

        {errors.role?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{errors.role.message}</AlertDescription>
          </Alert>
        )}
      </div>

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
            <AlertDescription>{errors.email.message}</AlertDescription>
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
            <AlertDescription>{errors.password.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
