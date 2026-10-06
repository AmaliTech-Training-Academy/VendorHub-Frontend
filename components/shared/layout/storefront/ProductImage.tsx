"use client";

import Image from "next/image";

import { useState } from "react";

import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export function ProductImage({ name }: { name: string }) {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (failedToLoad) {
    return <div className="aspect-4/3 w-full bg-muted" />;
  }

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
      <Image
        src={PLACEHOLDER_IMAGE}
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
