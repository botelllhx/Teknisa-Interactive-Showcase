"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { solutionsById } from "@/data/solutions";
import { useFlowController } from "@/hooks/useFlowController";
import { useTour } from "@/hooks/useTour";
import { useMeasure } from "@/hooks/useMeasure";
import { useShowcase } from "@/lib/store";
import { segmentsById } from "@/data/solutions";
import { SolutionFrame } from "@/components/mockups/frames";
import { SegmentIcon } from "@/components/ui/SegmentIcon";
import { TourOverlay } from "@/components/ui/TourOverlay";
import {
  NotificationStack,
  SimulatedNotification,
} from "@/components/ui/SimulatedNotification";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { ConfirmationFeedback } from "@/components/ui/ConfirmationFeedback";
import { Companion } from "@/components/companions";
import { getMockup } from "@/components/mockups";
import type { CompanionType } from "@/data/solutions";
import { cn } from "@/lib/cn";

interface SolutionDemoProps {
  solutionId: string;
}

export function SolutionDemo({ solutionId }: SolutionDemoProps) {
  const solution = solutionsById[solutionId];
  const segment = solution ? segmentsById[solution.segment] : null;
  const { steps } = useFlowController(solutionId);
  const goBack = useShowcase((s) => s.goBack);
  const goHome = useShowcase((s) => s.goHome);

  const [completionVisible, setCompletionVisible] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);
  const [frameRef, frameSize] = useMeasure<HTMLDivElement>();

  const tour = useTour({
    steps,
    resetKey: solutionId,
    onFinish: () => setCompletionVisible(true),
  });

  const currentStepData = steps[tour.index];
  const wantsNotification = currentStepData?.companions?.includes("SimulatedNotification");
  const visualCompanions: CompanionType[] = (currentStepData?.companions ?? []).filter(
    (c) => c !== "SimulatedNotification",
  );
  const hasCompanions = visualCompanions.length > 0;

  if (!solution) return null;

  const Mockup = getMockup(solutionId);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-surface-raised">
      {/* Slim header — 56px */}
      <header className="z-30 flex h-14 flex-shrink-0 items-center justify-between border-b border-brand/5 bg-white/95 px-6 backdrop-blur">
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
            src="/teknisa-logo.svg"
            alt="Teknisa"
            width={108}
            height={20}
            className="ml-1 select-none"
            priority
          />
          {segment && (
            <div className="ml-3 flex items-center gap-2 text-label-sm font-medium text-neutral-500">
              <ChevronRight size={14} strokeWidth={2.25} className="text-neutral-300" />
              <span className="flex items-center gap-1.5">
                <SegmentIcon name={segment.icon} size={14} />
                {segment.label}
              </span>
              <ChevronRight size={14} strokeWidth={2.25} className="text-neutral-300" />
              <span className="font-semibold text-brand">{solution.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end leading-tight">
          <span className="font-display text-[15px] font-semibold text-neutral-900">
            {solution.name}
          </span>
          <span className="font-ui text-caption text-neutral-500">
            {solution.tagline}
          </span>
        </div>
      </header>

      {/* Main: fills 100% of remaining height */}
      <main
        className={cn(
          "grid min-h-0 flex-1 gap-4 p-4",
          hasCompanions ? "grid-cols-[1fr_280px]" : "grid-cols-1",
        )}
      >
        <div
          ref={frameRef}
          className="relative flex h-full min-h-0 items-center justify-center"
        >
          {frameSize.height > 0 && (
            <SolutionFrame
              device={solution.device}
              containerWidth={frameSize.width}
              containerHeight={frameSize.height}
            >
              <div className="relative h-full w-full">
                <LoadingBar key={loadingKey} visible duration={500} />
                {Mockup ? (
                  <Mockup step={tour.index} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    Mockup não disponível
                  </div>
                )}
              </div>
            </SolutionFrame>
          )}
        </div>

        {hasCompanions && (
          <aside className="flex h-full min-h-0 flex-col items-stretch gap-3 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {visualCompanions.map((c) => (
                <motion.div
                  key={`${c}-${tour.index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Companion type={c} stepLabel={currentStepData?.title} />
                </motion.div>
              ))}
            </AnimatePresence>
          </aside>
        )}
      </main>

      <NotificationStack>
        {wantsNotification && (
          <SimulatedNotification
            id={`${solutionId}-${tour.index}`}
            type={inferType(currentStepData?.title)}
            title={currentStepData?.title ?? ""}
            description={currentStepData?.description}
          />
        )}
      </NotificationStack>

      <TourOverlay
        active={tour.active}
        step={tour.step}
        stepIndex={tour.index}
        totalSteps={tour.total}
        geometry={tour.geometry}
        isFirst={tour.isFirst}
        isLast={tour.isLast}
        onNext={() => {
          setLoadingKey((k) => k + 1);
          tour.next();
        }}
        onPrev={() => {
          setLoadingKey((k) => k + 1);
          tour.prev();
        }}
        onSkip={tour.skip}
      />

      <AnimatePresence>
        {completionVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/85 backdrop-blur-md"
          >
            <ConfirmationFeedback
              title="Exploração concluída"
              description={`${solution.name} — ${solution.tagline}. Quer conhecer outra solução?`}
              primaryLabel="Explorar outra solução"
              secondaryLabel="Repetir tour"
              onPrimary={() => {
                setCompletionVisible(false);
                goBack();
              }}
              onSecondary={() => {
                setCompletionVisible(false);
                tour.restart();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function inferType(label?: string): "success" | "warning" | "info" {
  if (!label) return "info";
  const lower = label.toLowerCase();
  if (lower.includes("alerta") || lower.includes("desvio") || lower.includes("recall")) {
    return "warning";
  }
  if (
    lower.includes("ativad") ||
    lower.includes("enviad") ||
    lower.includes("aprovad") ||
    lower.includes("confirm") ||
    lower.includes("publicado") ||
    lower.includes("conclu")
  ) {
    return "success";
  }
  return "info";
}
