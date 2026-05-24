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

  // v13.20 — scale APENAS por largura. Conteúdo em tamanho TV nativo.
  // Em monitores menores, scale-down por largura. Vertical scroll se
  // necessário (cliente prefere conteúdo grande + scroll do que pequeno).
  const { scale, offsetX, width } = useViewportFit();

  return (
    <div
      className="bg-surface-raised"
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <main
        className="bg-surface-raised"
        style={{
          position: "relative",
          marginLeft: offsetX,
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          // Reserva o espaço visual para que o documento "saiba" a altura
          // real do conteúdo escalado e o scroll vertical funcione direito
          marginBottom: `calc(-1080px * (1 - ${scale}))`,
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
              style={{ minHeight: 1080 }}
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
              style={{ minHeight: 1080 }}
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
              style={{ width: 1920, height: 1080 }}
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
