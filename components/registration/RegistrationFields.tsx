// components/registration/RegistrationFields.tsx
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { RegisterFormData } from "@/types/registerSchema";

type Props = {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  watch: UseFormWatch<RegisterFormData>;
};

export function RegistrationFields({
  register,
  errors,
  setValue,
  watch,
}: Props) {
  const selectedRole = watch("role");

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Email Address
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
        />
        {errors.email?.message && (
          <span className="text-xs text-red-500 font-medium">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
        />
        {errors.password?.message && (
          <span className="text-xs text-red-500 font-medium">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          id="role-label"
          className="text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          I am a...
        </span>

        <div
          role="tablist"
          aria-labelledby="role-label"
          className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedRole === "vendor"}
            onClick={() => setValue("role", "vendor", { shouldValidate: true })}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
              selectedRole === "vendor"
                ? "bg-white text-blue-9000 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Vendor
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedRole === "employee"}
            onClick={() =>
              setValue("role", "employee", { shouldValidate: true })
            }
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
              selectedRole === "employee"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Employee
          </button>
        </div>

        {/* Hidden input keeps role registered with React Hook Form for validation */}
        <input type="hidden" {...register("role")} />

        {errors.role?.message && (
          <span className="text-xs text-red-500 font-medium">
            {errors.role.message}
          </span>
        )}
      </div>
    </>
  );
}
