"use client";

import { create } from "zustand";
import type { SolutionSegment } from "@/data/solutions";

export type ShowcaseView = "home" | "segment" | "solution";

interface ShowcaseStore {
  view: ShowcaseView;
  activeSegment: SolutionSegment | null;
  activeSolution: string | null;

  currentStep: number;
  totalSteps: number;

  selectSegment: (id: SolutionSegment) => void;
  selectSolution: (id: string, totalSteps: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetFlow: () => void;
  goHome: () => void;
  goBack: () => void;
}

export const useShowcase = create<ShowcaseStore>((set, get) => ({
  view: "home",
  activeSegment: null,
  activeSolution: null,

  currentStep: 0,
  totalSteps: 0,

  selectSegment: (id) =>
    set({
      view: "segment",
      activeSegment: id,
      activeSolution: null,
      currentStep: 0,
      totalSteps: 0,
    }),

  selectSolution: (id, totalSteps) =>
    set({
      view: "solution",
      activeSolution: id,
      currentStep: 0,
      totalSteps,
    }),

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setStep: (step) => {
    const { totalSteps } = get();
    const max = Math.max(0, totalSteps - 1);
    const clamped = Math.max(0, Math.min(Number.isFinite(step) ? Math.trunc(step) : 0, max));
    set({ currentStep: clamped });
  },

  resetFlow: () => set({ currentStep: 0 }),

  goHome: () =>
    set({
      view: "home",
      activeSegment: null,
      activeSolution: null,
      currentStep: 0,
      totalSteps: 0,
    }),

  goBack: () => {
    const { view } = get();
    if (view === "solution") {
      set({ view: "segment", activeSolution: null, currentStep: 0, totalSteps: 0 });
    } else if (view === "segment") {
      set({ view: "home", activeSegment: null });
    }
  },
}));
