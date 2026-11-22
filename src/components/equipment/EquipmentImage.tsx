"use client";

import * as React from "react";
import Image from "next/image";

/** Shared fallback for equipment images that fail to load (broken URLs). */
export const EQUIPMENT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

interface EquipmentImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Responsive equipment image with a graceful fallback to the shared
 * placeholder when the remote URL is unavailable or fails mid-flight.
 */
export function EquipmentImage({
  src,
  alt,
  sizes,
  priority,
  fill,
  width,
  height,
  className,
}: EquipmentImageProps) {
  const [imageSrc, setImageSrc] = React.useState(src);

  React.useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      fill={fill}
      width={width}
      height={height}
      onError={() => setImageSrc(EQUIPMENT_FALLBACK_IMAGE)}
    />
  );
}
