"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { solutionsById, type Solution } from "@/data/solutions";
import { useFlowController } from "@/hooks/useFlowController";
import { useShowcase } from "@/lib/store";
import { SolutionFrame, frameMaxWidth } from "@/components/mockups/frames";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { PulsingDot } from "@/components/ui/PulsingDot";
import { FlowGuide } from "@/components/ui/FlowGuide";
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

interface SolutionDemoPlaceholderProps {
  solutionId: string;
}

export function SolutionDemoPlaceholder({ solutionId }: SolutionDemoPlaceholderProps) {
  const solution = solutionsById[solutionId];
  const { steps, currentStep, currentStepData, isFirst, isLast, next, prev, goTo, reset } =
    useFlowController(solutionId);
  const goBack = useShowcase((s) => s.goBack);

  const [loading, setLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (steps.length === 0) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [currentStep, steps.length]);

  useEffect(() => {
    setShowCompletion(false);
  }, [solutionId]);

  if (!solution) return null;

  const handleAdvance = () => {
    if (isLast) {
      setShowCompletion(true);
      return;
    }
    next();
  };

  const notificationCompanion = currentStepData?.companions?.includes(
    "SimulatedNotification",
  );

  return (
    <div className="flex h-full flex-col px-16 pb-10">
      <div className="mb-8 w-full">
        <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goTo} />
      </div>

      <div className="grid flex-1 grid-cols-[280px_minmax(0,1fr)_280px] items-center gap-8">
        <SolutionInfo solution={solution} />

        <div className="flex flex-col items-center gap-6">
          <div
            className={cn(
              "relative w-full",
              frameMaxWidth(solution.device),
            )}
          >
            <SolutionFrame device={solution.device}>
              <div className="relative h-full w-full">
                <LoadingBar visible={loading} />
                <MockupOrFallback
                  solutionId={solutionId}
                  solutionName={solution.name}
                  currentStep={currentStep}
                  stepLabel={currentStepData?.label ?? ""}
                />
                <AnimatePresence>
                  {currentStepData?.highlightArea && !loading && (
                    <PulsingDot
                      key={`${solutionId}-${currentStep}`}
                      area={currentStepData.highlightArea}
                    />
                  )}
                </AnimatePresence>
              </div>
            </SolutionFrame>
          </div>
        </div>

        <CompanionsPanel
          companions={currentStepData?.companions ?? []}
          stepLabel={currentStepData?.label}
        />
      </div>

      <div className="mt-8 flex items-end justify-between gap-6">
        <FlowGuide
          stepLabel={currentStepData ? `Etapa ${currentStep + 1} de ${steps.length}` : undefined}
          message={currentStepData?.tooltip ?? currentStepData?.label ?? ""}
          visible={!showCompletion && Boolean(currentStepData)}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={isFirst || showCompletion}
            aria-label="Etapa anterior"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-card transition-opacity hover:bg-brand-ghost disabled:opacity-40"
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={handleAdvance}
            disabled={showCompletion}
            aria-label={isLast ? "Concluir" : "Próxima etapa"}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-brand px-7 font-ui text-body-md font-semibold text-white shadow-brand transition-colors hover:bg-brand-light disabled:opacity-40"
          >
            {isLast ? "Concluir" : "Próxima etapa"}
            <ArrowRight size={20} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <NotificationStack>
        {notificationCompanion && !loading && (
          <SimulatedNotification
            id={`${solutionId}-${currentStep}`}
            type={inferNotificationType(currentStepData?.label)}
            title={currentStepData?.label ?? ""}
            description={currentStepData?.tooltip}
          />
        )}
      </NotificationStack>

      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/85 backdrop-blur-md"
          >
            <ConfirmationFeedback
              title={`${solution.name} pronto`}
              description={`Fluxo de ${steps.length} etapas concluído. Quer explorar outra solução?`}
              primaryLabel="Voltar às soluções"
              secondaryLabel="Refazer"
              onPrimary={() => {
                setShowCompletion(false);
                goBack();
              }}
              onSecondary={() => {
                reset();
                setShowCompletion(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SolutionInfo({ solution }: { solution: Solution }) {
  return (
    <aside>
      <p className="text-label-sm font-medium uppercase tracking-wider text-brand">
        {deviceLabel(solution.device)}
      </p>
      <h1 className="mt-1 font-display text-display-lg leading-tight text-neutral-900">
        {solution.name}
      </h1>
      <p className="mt-3 text-body-md text-neutral-600">{solution.description}</p>
      {solution.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {solution.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-subtle px-3 py-1 text-caption font-medium text-brand"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}

function CompanionsPanel({
  companions,
  stepLabel,
}: {
  companions: CompanionType[];
  stepLabel?: string;
}) {
  const visual = companions.filter((c) => c !== "SimulatedNotification");

  if (visual.length === 0) {
    return (
      <aside className="rounded-frame border border-dashed border-brand/20 bg-white/40 p-6">
        <p className="text-caption font-medium uppercase tracking-wider text-neutral-400">
          Companions
        </p>
        <p className="mt-2 text-label-sm text-neutral-500">
          Esta etapa não traz elementos complementares.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col items-end gap-4">
      <AnimatePresence mode="popLayout">
        {visual.map((c) => (
          <motion.div
            key={`${c}-${stepLabel}`}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Companion type={c} stepLabel={stepLabel} />
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}

function MockupOrFallback({
  solutionId,
  solutionName,
  currentStep,
  stepLabel,
}: {
  solutionId: string;
  solutionName: string;
  currentStep: number;
  stepLabel: string;
}) {
  const Mockup = getMockup(solutionId);

  if (Mockup) {
    return <Mockup step={currentStep} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/60 p-6 text-center">
      <span className="h-1.5 w-12 rounded-full bg-brand/30" />
      <div>
        <p className="font-display text-body-md font-semibold text-brand">
          {solutionName}
        </p>
        {stepLabel && (
          <p className="mt-1 text-label-sm text-neutral-600">{stepLabel}</p>
        )}
      </div>
      <p className="mt-1 max-w-[28ch] text-caption text-neutral-400">
        Mockup desta solução será adicionado em breve
      </p>
    </div>
  );
}

function inferNotificationType(label?: string): "success" | "warning" | "info" {
  if (!label) return "info";
  const lower = label.toLowerCase();
  if (lower.includes("alerta") || lower.includes("divergência") || lower.includes("recall")) {
    return "warning";
  }
  if (
    lower.includes("aprovado") ||
    lower.includes("enviado") ||
    lower.includes("publicado") ||
    lower.includes("ativad") ||
    lower.includes("confirm")
  ) {
    return "success";
  }
  return "info";
}

function deviceLabel(device: string): string {
  switch (device) {
    case "desktop":
      return "Desktop";
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    case "pos-terminal":
      return "Terminal PDV";
    case "kiosk":
      return "Totem";
    default:
      return device;
  }
}
