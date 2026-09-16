"use client";

import { RegisterFormData } from "@/types/registerSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
};

export default function BusinessInfoStep({ register, errors }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Business Name
        </label>
        <input
          {...register("businessName")}
          type="text"
          placeholder="Enter your business name"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
          required
        />
        {errors.businessName?.message && (
          <span className="text-xs text-red-500 font-medium">
            {errors.businessName.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Owner Name
        </label>
        <input
          {...register("ownerName")}
          type="text"
          placeholder="Enter full owner name"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
        />
        {errors.ownerName?.message && (
          <span className="text-xs text-red-500 font-medium">
            {errors.ownerName.message}
          </span>
        )}
      </div>
    </div>
  );
}
