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

  // v13.22 — REMOVIDO auto-fit (useViewportFit). Volta ao layout natural
  // 100vw × 100vh. Solution view fills 100vh, device frame scales pelo
  // SolutionFrame pra encaixar no espaço disponível. SEM crop, SEM scroll,
  // SEM whitespace centralizado. Cada viewport renderiza naturalmente.
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-surface-raised">
      <ShowcaseNav />

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex h-full flex-col justify-center"
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
            className="flex h-full flex-col justify-center"
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
            className="h-full"
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
