"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useShowcase } from "@/lib/store";
import { HeroSection } from "@/components/home/HeroSection";
import { SegmentGrid } from "@/components/home/SegmentGrid";
import { SolutionGrid } from "@/components/home/SolutionGrid";
import { ShowcaseNav } from "@/components/layout/ShowcaseNav";
import { IdleReset } from "@/components/layout/IdleReset";
import { SolutionDemo } from "@/components/demo/SolutionDemo";
import { pageTransition } from "@/lib/animations";

export default function ShowcasePage() {
  const view = useShowcase((s) => s.view);
  const activeSegment = useShowcase((s) => s.activeSegment);
  const activeSolution = useShowcase((s) => s.activeSolution);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-surface-raised">
      <ShowcaseNav />

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col"
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
          >
            <SolutionDemo solutionId={activeSolution} />
          </motion.div>
        )}
      </AnimatePresence>

      <IdleReset />
    </main>
  );
}
