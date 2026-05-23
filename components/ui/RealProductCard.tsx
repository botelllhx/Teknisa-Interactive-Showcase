"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { pexels, type Photo } from "@/lib/photos";

interface RealProductCardProps {
  photo: Photo;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  /** Show a "promo" tag on top-left of the photo. */
  promoTag?: string;
  /** Show a small AI badge (gradient brand→purple) for AI-suggested items. */
  aiSuggested?: boolean;
  /** Quantity already in cart — when > 0 shows a count badge instead of the + icon. */
  inCart?: number;
  onClick?: () => void;
  /** Pass through data-tour if the card needs to be a tour target. */
  "data-tour"?: string;
  className?: string;
}

/**
 * Premium product card with a real Pexels photo, subtle dark→clear gradient
 * overlay so text remains legible regardless of image, brand-accent price,
 * and a primary add-action with cart-count feedback.
 *
 * Visual reference: Notion AI / Vercel storefront cards — soft shadows,
 * sharp typography, photo as hero, content as concise data.
 */
export function RealProductCard({
  photo,
  name,
  description,
  price,
  oldPrice,
  promoTag,
  aiSuggested,
  inCart = 0,
  onClick,
  className,
  ...rest
}: RealProductCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      data-tour={rest["data-tour"]}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card transition-shadow hover:shadow-card-hover",
        "border border-brand/8",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={pexels(photo.id, { w: 600, h: 450, fit: "crop" })}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
          sizes="(max-width: 768px) 50vw, 300px"
        />
        {/* Subtle dark gradient at bottom for readability if we layer text on photo later */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent"
        />
        {promoTag && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wider text-brand shadow-card backdrop-blur">
            {promoTag}
          </span>
        )}
        {aiSuggested && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand via-brand-light to-[#7c3aed] px-2 py-0.5 font-ui text-[9px] font-bold uppercase tracking-wider text-white shadow-brand">
            <Sparkles size={9} strokeWidth={2.5} />
            IA
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="font-ui text-[13px] font-bold leading-tight text-neutral-900 line-clamp-1">
          {name}
        </p>
        {description && (
          <p className="font-ui text-[11px] leading-snug text-neutral-500 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-1 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            {oldPrice && oldPrice > price && (
              <span className="font-ui text-[10px] text-neutral-400 line-through">
                R$ {oldPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span className="font-ui text-[15px] font-bold tabular-nums text-brand">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-white shadow-brand transition-colors",
              inCart > 0
                ? "bg-success"
                : "bg-brand group-hover:bg-brand-light",
            )}
            aria-hidden
          >
            {inCart > 0 ? (
              <span className="font-ui text-[11px] font-bold tabular-nums">
                {inCart}
              </span>
            ) : (
              <Plus size={15} strokeWidth={2.5} />
            )}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
