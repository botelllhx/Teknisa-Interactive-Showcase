"use client";

import dynamic from "next/dynamic";
import { type ComponentType } from "react";

interface MockupProps {
  step: number;
}

function MockupSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/60">
      <div className="flex flex-col items-center gap-2">
        <span className="h-1.5 w-12 animate-pulse rounded-full bg-brand/30" />
        <span className="h-1 w-20 animate-pulse rounded-full bg-brand/20" />
      </div>
    </div>
  );
}

function lazy(loader: () => Promise<{ default: ComponentType<MockupProps> }>) {
  return dynamic(loader, { loading: () => <MockupSkeleton />, ssr: false });
}

const MOCKUPS: Record<string, ComponentType<MockupProps>> = {
  "retail-intelligence": lazy(() =>
    import("./frente-de-loja/RetailIntelligence").then((m) => ({
      default: m.RetailIntelligenceMockup,
    })),
  ),
  "pdv-novo": lazy(() =>
    import("./frente-de-loja/PDVNovo").then((m) => ({ default: m.PDVNovoMockup })),
  ),
  taa: lazy(() => import("./frente-de-loja/TAA").then((m) => ({ default: m.TAAMockup }))),
  "smart-pos": lazy(() =>
    import("./frente-de-loja/SmartPOS").then((m) => ({ default: m.SmartPOSMockup })),
  ),
  "cardapio-digital": lazy(() =>
    import("./frente-de-loja/CardapioDigital").then((m) => ({
      default: m.CardapioDigitalMockup,
    })),
  ),
  quickpass: lazy(() =>
    import("./frente-de-loja/QuickPass").then((m) => ({ default: m.QuickPassMockup })),
  ),

  "cardapio-inteligente": lazy(() =>
    import("./tecfood/CardapioInteligente").then((m) => ({
      default: m.CardapioInteligenteMockup,
    })),
  ),
  myquest: lazy(() =>
    import("./tecfood/MyQuest").then((m) => ({ default: m.MyQuestMockup })),
  ),
  mymenu: lazy(() =>
    import("./tecfood/MyMenu").then((m) => ({ default: m.MyMenuMockup })),
  ),
  "waste-control": lazy(() =>
    import("./tecfood/WasteControl").then((m) => ({ default: m.WasteControlMockup })),
  ),

  "rotina-fiscal": lazy(() =>
    import("./erp-backoffice/RotinaFiscal").then((m) => ({ default: m.RotinaFiscalMockup })),
  ),
  "rotina-rastreabilidade": lazy(() =>
    import("./erp-backoffice/RotinaRastreabilidade").then((m) => ({
      default: m.RotinaRastreabilidadeMockup,
    })),
  ),
  "app-rotinas-estoque": lazy(() =>
    import("./erp-backoffice/AppRotinasEstoque").then((m) => ({
      default: m.AppRotinasEstoqueMockup,
    })),
  ),

  "portal-gestor": lazy(() =>
    import("./pessoas-rh/PortalGestor").then((m) => ({ default: m.PortalGestorMockup })),
  ),
  "portal-funcionario": lazy(() =>
    import("./pessoas-rh/PortalFuncionario").then((m) => ({
      default: m.PortalFuncionarioMockup,
    })),
  ),
  "mesa-operacoes": lazy(() =>
    import("./pessoas-rh/MesaOperacoes").then((m) => ({
      default: m.MesaOperacoesMockup,
    })),
  ),
  "analise-preditiva": lazy(() =>
    import("./pessoas-rh/AnalisePreditiva").then((m) => ({
      default: m.AnalisePreditivaMockup,
    })),
  ),
  "assistente-regras": lazy(() =>
    import("./pessoas-rh/AssistenteRegras").then((m) => ({
      default: m.AssistenteRegrasMockup,
    })),
  ),

  mercadum: lazy(() =>
    import("./supply-compras/Mercadum").then((m) => ({ default: m.MercadumMockup })),
  ),
  "app-comercial": lazy(() =>
    import("./supply-compras/AppComercial").then((m) => ({
      default: m.AppComercialMockup,
    })),
  ),
  approve: lazy(() =>
    import("./supply-compras/Approve").then((m) => ({ default: m.ApproveMockup })),
  ),

  "crm-premium": lazy(() =>
    import("./crm/CRMPremium").then((m) => ({ default: m.CRMPremiumMockup })),
  ),

  "isa-chatbot": lazy(() =>
    import("./ia/ISA").then((m) => ({ default: m.ISAMockup })),
  ),
  "analise-preditiva-ia": lazy(() =>
    import("./ia/AnalisePreditivaIA").then((m) => ({
      default: m.AnalisePreditivaIAMockup,
    })),
  ),
};

export function getMockup(solutionId: string): ComponentType<MockupProps> | null {
  return MOCKUPS[solutionId] ?? null;
}

export function hasMockup(solutionId: string): boolean {
  return solutionId in MOCKUPS;
}
