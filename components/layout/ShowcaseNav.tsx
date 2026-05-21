"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { useShowcase } from "@/lib/store";
import { segmentsById, solutionsById } from "@/data/solutions";
import { SegmentIcon } from "@/components/ui/SegmentIcon";

export function ShowcaseNav() {
  const view = useShowcase((s) => s.view);
  const activeSegment = useShowcase((s) => s.activeSegment);
  const activeSolution = useShowcase((s) => s.activeSolution);
  const goBack = useShowcase((s) => s.goBack);
  const goHome = useShowcase((s) => s.goHome);

  // HOME has its own hero; SOLUTION has its own slim header inside SolutionDemo.
  // We only render the nav on the SEGMENT view.
  if (view !== "segment") return null;

  const segment = activeSegment ? segmentsById[activeSegment] : null;
  const solution = activeSolution ? solutionsById[activeSolution] : null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 flex h-14 items-center justify-between border-b border-brand/5 bg-white/95 px-6 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Voltar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-brand transition-colors hover:bg-brand-light"
        >
          <ArrowLeft size={18} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={goHome}
          aria-label="Voltar para início"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-neutral-700 transition-colors hover:bg-brand-ghost"
        >
          <Home size={18} strokeWidth={2} />
        </button>

        <Image
          src="/logo-teknisa.svg"
          alt="Teknisa"
          width={120}
          height={23}
          className="ml-1 select-none"
          priority
        />

        {segment && (
          <div className="ml-4 flex items-center gap-2 text-label-sm font-medium text-neutral-500">
            <ChevronRight size={14} strokeWidth={2.25} className="text-neutral-300" />
            <span className="flex items-center gap-1.5">
              <SegmentIcon name={segment.icon} size={14} />
              {segment.label}
            </span>
            {solution && (
              <>
                <ChevronRight size={14} strokeWidth={2.25} className="text-neutral-300" />
                <span className="font-semibold text-brand">{solution.name}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div />
    </motion.nav>
  );
}
