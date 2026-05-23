"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { colorForInitials, pexels, type Photo } from "@/lib/photos";

interface PersonAvatarProps {
  /** Pexels photo descriptor; if omitted falls back to colored initials. */
  photo?: Photo;
  /** Display name — used for initials and aria-label. */
  name: string;
  /** Visual size in px (square). Defaults to 40. */
  size?: number;
  /** Show a 2px white ring (for stacking and contrast). */
  ring?: boolean;
  /** Show a small status dot at bottom-right (online indicator). */
  status?: "online" | "offline" | "busy";
  className?: string;
}

/**
 * Circular avatar that renders a real Pexels portrait when `photo` is provided,
 * or falls back to colored initials when not (or when the image fails to load).
 *
 * Designed for TV touch — uses next/image with cover crop so portraits stay
 * sharp at any size.
 */
export function PersonAvatar({
  photo,
  name,
  size = 40,
  ring = false,
  status,
  className,
}: PersonAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(name);
  const color = colorForInitials(initials);

  const ringClass = ring ? "ring-2 ring-white" : "";
  const showFallback = !photo || imgFailed;

  return (
    <span
      aria-label={name}
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full",
        ringClass,
        className,
      )}
    >
      {showFallback ? (
        <span
          aria-hidden
          style={{
            background: color.bg,
            color: color.fg,
            fontSize: Math.max(11, Math.floor(size * 0.4)),
          }}
          className="flex h-full w-full items-center justify-center font-ui font-bold leading-none"
        >
          {initials}
        </span>
      ) : (
        <Image
          src={pexels(photo.id, { w: Math.max(96, size * 2), h: Math.max(96, size * 2), fit: "crop" })}
          alt={photo.alt}
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      )}

      {status && (
        <span
          aria-hidden
          style={{
            width: Math.max(8, size * 0.22),
            height: Math.max(8, size * 0.22),
          }}
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
            status === "online" && "bg-success",
            status === "busy" && "bg-warning",
            status === "offline" && "bg-neutral-400",
          )}
        />
      )}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name
    .replace(/[^a-zA-ZÀ-ÿ\s.]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
