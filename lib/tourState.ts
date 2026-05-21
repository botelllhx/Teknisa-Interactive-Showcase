"use client";

import { create } from "zustand";

/**
 * Live mockup selections that the tour reads to render dynamic tooltips.
 * Each mockup pushes whatever the user has chosen here (selected item,
 * quantities, cart total, payment method, etc.). Tour step descriptions
 * accept a function that receives this state and returns the real text.
 *
 * Convention: state.solutionId scopes the keys; we don't share state
 * across solutions, but using one flat dictionary keeps things simple.
 */
export interface TourLiveState {
  // Currently focused item (the one most relevant to the current step)
  selectedItemName?: string;
  selectedItemPrice?: number;
  // Aggregated cart
  cartCount?: number;
  cartTotal?: number;
  // Payment
  paymentMethod?: "cartao" | "pix" | "dinheiro" | "credito" | "debito";
  paymentApproved?: boolean;
  // Coupons / discounts
  couponCode?: string;
  couponApplied?: boolean;
  discountValue?: number;
  // Any other ad-hoc keys
  [key: string]: unknown;
}

interface TourStateStore {
  live: TourLiveState;
  patch: (next: TourLiveState) => void;
  reset: () => void;
}

export const useTourLive = create<TourStateStore>((set) => ({
  live: {},
  patch: (next) => set((prev) => ({ live: { ...prev.live, ...next } })),
  reset: () => set({ live: {} }),
}));

/**
 * Format BRL currency without the R$ prefix variations across browsers.
 */
export function brl(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
