"use client";

import { cn } from "@/lib/cn";
import { PersonAvatar } from "./PersonAvatar";
import type { Photo } from "@/lib/photos";

interface PersonEntry {
  name: string;
  photo?: Photo;
}

interface StackedAvatarsProps {
  people: PersonEntry[];
  /** Max number shown before "+N" pill. Defaults to 4. */
  max?: number;
  size?: number;
  /** Overlap factor 0–1. 0 = no overlap, 0.4 = mild, 0.7 = tight. Default 0.32. */
  overlap?: number;
  /** Label after the stack, like "+5" or "12 pessoas". If omitted shows "+N" automatically. */
  extraLabel?: string;
  className?: string;
}

/**
 * Horizontal pile of overlapping circular avatars — the canon pattern from
 * the references (Linear team chips, Notion participants, PMO project leaders).
 *
 * Hides the rightmost avatars when `people.length > max` and replaces them with
 * a "+N" pill in the same shape, brand-tinted.
 */
export function StackedAvatars({
  people,
  max = 4,
  size = 32,
  overlap = 0.32,
  extraLabel,
  className,
}: StackedAvatarsProps) {
  const visible = people.slice(0, max);
  const hidden = people.length - visible.length;
  const offset = Math.floor(size * (1 - overlap));

  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label={`${people.length} pessoas`}
    >
      {visible.map((p, i) => (
        <span
          key={`${p.name}-${i}`}
          style={{ marginLeft: i === 0 ? 0 : -(size - offset) }}
          className="relative inline-block transition-transform hover:-translate-y-[1px] hover:z-10"
        >
          <PersonAvatar photo={p.photo} name={p.name} size={size} ring />
        </span>
      ))}
      {(hidden > 0 || extraLabel) && (
        <span
          style={{
            width: size,
            height: size,
            marginLeft: -(size - offset),
            fontSize: Math.max(10, Math.floor(size * 0.32)),
          }}
          className="inline-flex flex-none items-center justify-center rounded-full bg-brand-ghost font-ui font-bold text-brand ring-2 ring-white"
          aria-hidden
        >
          {extraLabel ?? `+${hidden}`}
        </span>
      )}
    </span>
  );
}
