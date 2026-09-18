"use client";

import { LoginFormData } from "@/types/loginSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
};

export default function LoginCredentialsFields({ register, errors }: Props) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Email Address
        </label>
        <input
          {...register("email")}
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
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Password
        </label>
        <input
          {...register("password")}
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
    </>
  );
}
