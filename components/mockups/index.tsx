"use client";

import { type ComponentType } from "react";
import { PDVNovoMockup } from "./frente-de-loja/PDVNovo";
import { TAAMockup } from "./frente-de-loja/TAA";
import { SmartPOSMockup } from "./frente-de-loja/SmartPOS";
import { CardapioDigitalMockup } from "./frente-de-loja/CardapioDigital";
import { QuickPassMockup } from "./frente-de-loja/QuickPass";

interface MockupProps {
  step: number;
}

const MOCKUPS: Record<string, ComponentType<MockupProps>> = {
  "pdv-novo": PDVNovoMockup,
  taa: TAAMockup,
  "smart-pos": SmartPOSMockup,
  "cardapio-digital": CardapioDigitalMockup,
  quickpass: QuickPassMockup,
};

export function getMockup(solutionId: string): ComponentType<MockupProps> | null {
  return MOCKUPS[solutionId] ?? null;
}

export function hasMockup(solutionId: string): boolean {
  return solutionId in MOCKUPS;
}
