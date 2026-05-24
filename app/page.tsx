"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useShowcase } from "@/lib/store";
import { HeroSection } from "@/components/home/HeroSection";
import { SegmentGrid } from "@/components/home/SegmentGrid";
import { SolutionGrid } from "@/components/home/SolutionGrid";
import { ShowcaseNav } from "@/components/layout/ShowcaseNav";
import { IdleReset } from "@/components/layout/IdleReset";
import { PresentationToggle } from "@/components/layout/PresentationToggle";
import { SolutionDemo } from "@/components/demo/SolutionDemo";
import { pageTransition } from "@/lib/animations";

export default function ShowcasePage() {
  const view = useShowcase((s) => s.view);
  const activeSegment = useShowcase((s) => s.activeSegment);
  const activeSolution = useShowcase((s) => s.activeSolution);

  // v13.23 — main vira flex flex-col, então ShowcaseNav ocupa seus 56px e
  // o motion.div fica flex-1 min-h-0 (ocupa o RESTO, não overlap com nav).
  // Antes: nav era relative + motion.div h-full sobrepondo, escondendo
  // os 56px superiores do conteúdo atrás do header → títulos colados.
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-surface-raised">
      <ShowcaseNav />

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col justify-center"
          >
            <HeroSection />
            <SegmentGrid />
          </motion.div>
        )}

        {view === "segment" && activeSegment && (
          <motion.div
            key={`segment-${activeSegment}`}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col"
          >
            <SolutionGrid segmentId={activeSegment} />
          </motion.div>
        )}

        {view === "solution" && activeSolution && (
          <motion.div
            key={`solution-${activeSolution}`}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-0 flex-1"
          >
            <SolutionDemo solutionId={activeSolution} />
          </motion.div>
        )}
      </AnimatePresence>

      <IdleReset />
      <PresentationToggle />
    </main>
  );
}
