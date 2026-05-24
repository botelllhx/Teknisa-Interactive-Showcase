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

  // v13.17 — fit por largura E altura, content sempre visível em 100vh.
  // Flex center + transform-origin top-left mantém o canvas 1920×1080
  // ancorado no canto e o flex centraliza a bounding box restante.
  const { scale, width, height } = useViewportFit();

  return (
    <div
      className="bg-surface-raised"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <main
        className="relative bg-surface-raised"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          // center origin keeps the visual content in the middle of the
          // bounding box, so flex center aligns the visual content too
          transformOrigin: "center center",
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
              className="flex h-full flex-col"
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
              className="h-full"
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
    </div>
  );
}
