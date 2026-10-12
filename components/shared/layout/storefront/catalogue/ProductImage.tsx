"use client";

import Image from "next/image";

import { useState } from "react";

import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export function ProductImage({
  name,
  imageURL,
}: {
  name: string;
  imageURL: string | null;
}) {
  const [failedToLoad, setFailedToLoad] = useState(false);

  // If the absolute fallback image fails as well, render the empty gray placeholder box
  if (failedToLoad) {
    return <div className="aspect-4/4 w-full bg-muted" />;
  }

  // Use the imageURL prop if available; otherwise, fall back to the PLACEHOLDER_IMAGE constant
  const displaySrc = imageURL || PLACEHOLDER_IMAGE;

  return (
    <div className="relative aspect-4/4 w-full overflow-hidden bg-muted">
      <Image
        src={displaySrc}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => {
          setFailedToLoad(true);
        }}
      />
    </div>
  );
}
