import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VendorProfileFormInput } from "@/types/vendorProfile";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

export function ContactDetailsCard({
  register,
  errors,
}: {
  register: UseFormRegister<VendorProfileFormInput>;
  errors: FieldErrors<VendorProfileFormInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact details</CardTitle>
        <CardDescription>
          So employees and VendorHub can reach you
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            {...register("address")}
            id="address"
            placeholder="e.g. Ridge Office Park, Accra"
          />
          {errors.address?.message && (
            <Alert variant="destructive" className="px-3 py-2 text-xs">
              <AlertDescription>{errors.address.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            {...register("phone")}
            id="phone"
            type="tel"
            placeholder="e.g. 024 123 4567"
          />
          {errors.phone?.message && (
            <Alert variant="destructive" className="px-3 py-2 text-xs">
              <AlertDescription>{errors.phone.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
