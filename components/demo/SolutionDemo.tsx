"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { solutionsById, resolveText } from "@/data/solutions";
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
import { ConfirmationFeedback } from "@/components/ui/ConfirmationFeedback";
import { Companion } from "@/components/companions";
import { getMockup } from "@/components/mockups";
import type { CompanionType } from "@/data/solutions";
import { useTourLive } from "@/lib/tourState";
import { cn } from "@/lib/cn";

interface SolutionDemoProps {
  solutionId: string;
}

// Per-solution preference of which companions live on which side of the frame.
const COMPANION_LAYOUT: Record<
  string,
  { left?: CompanionType[]; right?: CompanionType[] }
> = {
  // Frente de Loja — V6 patterns
  taa: { left: ["OrderTicket"], right: ["POSCardReader"] },
  "pdv-novo": { left: ["OrderTicket"], right: ["POSCardReader"] },
  "smart-pos": {
    left: ["OperatorDailyPanel"],
    right: ["CustomerReceiptPhone"],
  },
  "cardapio-digital": {
    left: ["OrderTicket"],
    right: ["KitchenDisplay"],
  },
  quickpass: {
    right: ["RestaurantQueueBoard"],
  },
  // Other groups (kept as-is until their V6 pass)
  approve: { right: ["MiniDashboard"] },
  "cardapio-inteligente": { right: ["MiniDashboard"] },
  "waste-control": { right: ["StockIndicator"] },
  "rotina-fiscal": { right: ["FiscalBadge"] },
  "rotina-rastreabilidade": { right: ["StockIndicator"] },
  "app-rotinas-estoque": { right: ["StockIndicator"] },
  "portal-gestor": { left: ["EmployeeCard"], right: ["MiniDashboard"] },
  "portal-funcionario": { right: ["EmployeeCard"] },
  "mesa-operacoes": { right: ["MiniDashboard"] },
  "analise-preditiva": { right: ["MiniDashboard"] },
  "assistente-regras": {},
  mercadum: { right: ["MiniDashboard"] },
  "app-comercial": { right: ["MiniDashboard"] },
  "crm-premium": { right: ["MiniDashboard"] },
  myquest: { right: ["RestaurantQueueBoard"] },
  mymenu: { right: ["MiniDashboard"] },
};

function distributeCompanions(
  solutionId: string,
  active: CompanionType[],
): { left: CompanionType[]; right: CompanionType[] } {
  const layout = COMPANION_LAYOUT[solutionId] ?? {};
  const left: CompanionType[] = [];
  const right: CompanionType[] = [];

  for (const c of active) {
    if (layout.left?.includes(c)) left.push(c);
    else if (layout.right?.includes(c)) right.push(c);
    else right.push(c); // unknown → right
  }

  return { left, right };
}

export function SolutionDemo({ solutionId }: SolutionDemoProps) {
  const solution = solutionsById[solutionId];
  const segment = solution ? segmentsById[solution.segment] : null;
  const { steps } = useFlowController(solutionId);
  const goBack = useShowcase((s) => s.goBack);
  const goHome = useShowcase((s) => s.goHome);

  const [completionVisible, setCompletionVisible] = useState(false);
  const [frameRef, frameSize] = useMeasure<HTMLDivElement>();
  const resetTourLive = useTourLive((s) => s.reset);

  // Reset shared live state when entering a different solution so previous
  // selections don't leak into the new tour's tooltips.
  useEffect(() => {
    resetTourLive();
  }, [solutionId, resetTourLive]);

  const tour = useTour({
    steps,
    resetKey: solutionId,
    onFinish: () => setCompletionVisible(true),
  });

  const currentStepData = steps[tour.index];
  const live = useTourLive((s) => s.live);
  const resolvedTitle = currentStepData
    ? resolveText(currentStepData.title, live)
    : "";
  const resolvedDescription = currentStepData
    ? resolveText(currentStepData.description, live)
    : "";
  const wantsNotification = currentStepData?.companions?.includes(
    "SimulatedNotification",
  );
  const activeCompanions: CompanionType[] = (
    currentStepData?.companions ?? []
  ).filter((c) => c !== "SimulatedNotification");

  const { left: leftCompanions, right: rightCompanions } = distributeCompanions(
    solutionId,
    activeCompanions,
  );

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
            src="/logo-teknisa.svg"
            alt="Teknisa"
            width={108}
            height={20}
            className="ml-1 select-none"
            priority
          />
          {segment && (
            <div className="ml-3 flex items-center gap-2 text-label-sm font-medium text-neutral-500">
              <ChevronRight
                size={14}
                strokeWidth={2.25}
                className="text-neutral-300"
              />
              <span className="flex items-center gap-1.5">
                <SegmentIcon name={segment.icon} size={14} />
                {segment.label}
              </span>
              <ChevronRight
                size={14}
                strokeWidth={2.25}
                className="text-neutral-300"
              />
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

      {/* Main: 3 columns when companions exist, 1 column when not */}
      <main
        className={cn(
          "grid min-h-0 flex-1 items-stretch gap-6 p-6",
          activeCompanions.length === 0 && "grid-cols-1",
          activeCompanions.length > 0 && "grid-cols-[340px_1fr_340px]",
        )}
      >
        {activeCompanions.length > 0 && (
          <CompanionColumn
            companions={leftCompanions}
            solutionId={solutionId}
            step={tour.index}
            stepLabel={resolvedTitle}
            align="end"
          />
        )}

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

        {activeCompanions.length > 0 && (
          <CompanionColumn
            companions={rightCompanions}
            solutionId={solutionId}
            step={tour.index}
            stepLabel={resolvedTitle}
            align="start"
          />
        )}
      </main>

      <NotificationStack>
        {wantsNotification && (
          <SimulatedNotification
            id={`${solutionId}-${tour.index}`}
            type={inferType(resolvedTitle)}
            title={resolvedTitle}
            description={resolvedDescription}
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
        onNext={tour.next}
        onPrev={tour.prev}
        onSkip={tour.skip}
      />

      <AnimatePresence>
        {completionVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/90 backdrop-blur-md"
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

function CompanionColumn({
  companions,
  solutionId,
  step,
  stepLabel,
  align,
}: {
  companions: CompanionType[];
  solutionId: string;
  step: number;
  stepLabel?: string;
  align: "start" | "end";
}) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 overflow-y-auto py-2",
        align === "start" ? "items-start" : "items-end",
        "justify-center",
      )}
    >
      <AnimatePresence mode="popLayout">
        {companions.map((c) => (
          <motion.div
            key={c}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("w-full", align === "start" ? "flex justify-start" : "flex justify-end")}
          >
            <Companion
              type={c}
              solutionId={solutionId}
              step={step}
              stepLabel={stepLabel}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}

function inferType(label?: string): "success" | "warning" | "info" {
  if (!label) return "info";
  const lower = label.toLowerCase();
  if (
    lower.includes("alerta") ||
    lower.includes("desvio") ||
    lower.includes("recall")
  ) {
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
