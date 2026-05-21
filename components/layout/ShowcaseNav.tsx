"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { useShowcase } from "@/lib/store";
import { segmentsById, solutionsById } from "@/data/solutions";
import { BackButton } from "./BackButton";

export function ShowcaseNav() {
  const view = useShowcase((s) => s.view);
  const activeSegment = useShowcase((s) => s.activeSegment);
  const activeSolution = useShowcase((s) => s.activeSolution);
  const goHome = useShowcase((s) => s.goHome);

  if (view === "home") return null;

  const segment = activeSegment ? segmentsById[activeSegment] : null;
  const solution = activeSolution ? solutionsById[activeSolution] : null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-16 py-8"
    >
      <div className="flex items-center gap-4">
        <BackButton />
        <button
          type="button"
          onClick={goHome}
          aria-label="Voltar para início"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/10 bg-white text-neutral-700 shadow-card transition-colors hover:bg-brand-ghost"
        >
          <Home size={22} strokeWidth={2} />
        </button>

        <div className="ml-2 flex items-center gap-2 text-body-lg font-medium text-neutral-600">
          <span className="font-ui">Soluções</span>
          {segment && (
            <>
              <ChevronRight size={18} strokeWidth={2.25} className="text-neutral-400" />
              <span className="text-neutral-800">{segment.label}</span>
            </>
          )}
          {solution && (
            <>
              <ChevronRight size={18} strokeWidth={2.25} className="text-neutral-400" />
              <span className="font-semibold text-brand">{solution.name}</span>
            </>
          )}
        </div>
      </div>

      <Image
        src="/teknisa-logo.svg"
        alt="Teknisa"
        width={160}
        height={30}
        className="select-none opacity-90"
      />
    </motion.nav>
  );
}
