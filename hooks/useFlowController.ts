"use client";

import { useEffect, useMemo } from "react";
import { useShowcase } from "@/lib/store";
import { getFlow } from "@/data/flows";
import type { FlowStep } from "@/data/solutions";

interface UseFlowControllerResult {
  steps: FlowStep[];
  currentStep: number;
  currentStepData: FlowStep | undefined;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
}

export function useFlowController(solutionId: string | null): UseFlowControllerResult {
  const currentStep = useShowcase((s) => s.currentStep);
  const nextStep = useShowcase((s) => s.nextStep);
  const prevStep = useShowcase((s) => s.prevStep);
  const setStep = useShowcase((s) => s.setStep);
  const resetFlow = useShowcase((s) => s.resetFlow);
  const selectSolution = useShowcase((s) => s.selectSolution);

  const steps = useMemo(
    () => (solutionId ? getFlow(solutionId) : []),
    [solutionId],
  );

  useEffect(() => {
    if (solutionId && steps.length > 0) {
      selectSolution(solutionId, steps.length);
    }
  }, [solutionId, steps.length, selectSolution]);

  return {
    steps,
    currentStep,
    currentStepData: steps[currentStep],
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    next: nextStep,
    prev: prevStep,
    goTo: setStep,
    reset: resetFlow,
  };
}
