"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import type { VendorProfileFormValues } from "@/types/vendorProfile";

import { ContactDetailsCard } from "./ContactDetailsCard";
import { SlogansCard } from "./SlogansCard";
import { StorefrontImageCard } from "./StorefrontImageCard";

type Props = {
  defaultValues?: Partial<VendorProfileFormValues>;
  existingImageUrl?: string;
};

export function VendorProfileForm({ defaultValues, existingImageUrl }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl ?? null,
  );
  const { register, control, handleSubmit, setValue, errors, isLoading } =
    useVendorProfile({
      defaultValues,
      onSuccess: () => toast.success("Profile updated"),
      onError: () => toast.error("Something went wrong. Please try again."),
    });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }
    setValue("storefrontImage", file, { shouldValidate: true });
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2"
    >
      <StorefrontImageCard
        imagePreview={imagePreview}
        errors={errors}
        onImageChange={handleImageChange}
      />
      <ContactDetailsCard register={register} errors={errors} />
      <SlogansCard
        control={control}
        register={register}
        errors={errors}
        className="xl:col-span-2"
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="w-fit bg-orange-500 hover:bg-orange-600 xl:col-span-2"
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
        {isLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
