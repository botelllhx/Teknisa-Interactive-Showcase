"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { solutionsById } from "@/data/solutions";
import { useFlowController } from "@/hooks/useFlowController";
import { useTour } from "@/hooks/useTour";
import { useShowcase } from "@/lib/store";
import { SolutionFrame } from "@/components/mockups/frames";
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
  const { steps } = useFlowController(solutionId);
  const goBack = useShowcase((s) => s.goBack);
  const [completionVisible, setCompletionVisible] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);

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

  const isMobileFrame = solution?.device === "mobile" || solution?.device === "kiosk";
  const hasCompanions = visualCompanions.length > 0;

  if (!solution) return null;

  const Mockup = getMockup(solutionId);

  return (
    <div className="relative h-[calc(100vh-56px)] w-full overflow-hidden bg-surface-raised">
      <div
        className={cn(
          "grid h-full w-full gap-5 px-6 py-4",
          hasCompanions
            ? isMobileFrame
              ? "grid-rows-[1fr_auto]"
              : "grid-cols-[1fr_280px]"
            : "grid-cols-1",
        )}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={cn(
              "flex h-full max-h-full items-center justify-center",
              solution.device === "desktop" && "w-full max-w-[88%]",
              solution.device === "tablet" && "h-full max-h-[88%]",
              solution.device === "pos-terminal" && "w-full max-w-[58%]",
              solution.device === "mobile" && "h-full max-h-[92%]",
              solution.device === "kiosk" && "h-full max-h-[94%]",
            )}
          >
            <SolutionFrame device={solution.device} className="h-full">
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
          </div>
        </div>

        {hasCompanions && (
          <aside
            className={cn(
              "flex gap-4",
              isMobileFrame ? "flex-row items-end justify-center" : "flex-col items-stretch",
            )}
          >
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
      </div>

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
