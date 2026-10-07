"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { VendorProfileController } from "@/hooks/useVendorProfile";

import { ContactDetailsCard } from "./ContactDetailsCard";
import { SlogansCard } from "./SlogansCard";
import { StorefrontImageCard } from "./StorefrontImageCard";

type Props = {
  form: VendorProfileController;
};

export function VendorProfileForm({ form }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isLoading,
    isProfilePending,
    isProfileError,
    profile,
  } = form;
  let submitLabel = "Save changes";
  if (isProfilePending) {
    submitLabel = "Loading profile...";
  }
  if (isLoading) {
    submitLabel = "Saving...";
  }

  useEffect(
    () => () => {
      if (previewUrl.current) {
        URL.revokeObjectURL(previewUrl.current);
      }
    },
    [],
  );

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }
    previewUrl.current = URL.createObjectURL(file);
    setValue("storefrontImage", file, { shouldValidate: true });
    setImagePreview(previewUrl.current);
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2"
    >
      <StorefrontImageCard
        imagePreview={imagePreview ?? profile?.storefrontImageUrl ?? null}
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
        disabled={isLoading || isProfilePending || isProfileError}
        className="w-fit bg-orange-500 hover:bg-orange-600 xl:col-span-2"
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
