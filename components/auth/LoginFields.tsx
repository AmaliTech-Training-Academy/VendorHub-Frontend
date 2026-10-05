"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginFieldsProps } from "@/types/interfaces";

export default function LoginFields({ register, errors }: LoginFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="email"
          className="text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Email Address
        </Label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
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
          className="text-xs font-bold text-gray-700 uppercase tracking-wider"
        >
          Password
        </Label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
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
