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

  // v13.18 — main posicionado absoluto com offset calculado em JS para
  // que o canto TOP-LEFT do conteúdo VISUAL fique exatamente onde
  // desejamos (centralizado), sem o bounding box 1920×1080 estourar
  // pelas bordas do viewport. Resolve o "header cortado" reportado.
  const { scale, offsetX, offsetY, width, height } = useViewportFit();

  return (
    <div
      className="bg-surface-raised"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <main
        className="bg-surface-raised"
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
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
