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
import { useViewportFit } from "@/hooks/useViewportFit";

export default function ShowcasePage() {
  const view = useShowcase((s) => s.view);
  const activeSegment = useShowcase((s) => s.activeSegment);
  const activeSolution = useShowcase((s) => s.activeSolution);

  // v13.15 — auto-fit pra qualquer monitor. Conteúdo é renderizado em
  // 1920×1080 lógicos, depois escalado pelo CSS transform pra caber
  // 100% no viewport real. TV 1920+: scale = 1 (sem mudança).
  // Laptop 1366×768: scale ~0.71 (cabe certinho, sem bleed).
  const { scale, width, height } = useViewportFit();

  return (
    <div
      className="bg-surface-raised"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <main
        className="relative overflow-hidden bg-surface-raised"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          flexShrink: 0,
        }}
      >
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
        <PresentationToggle />
      </main>
    </div>
  );
}
