"use client";

import { type ComponentType } from "react";
import { PDVNovoMockup } from "./frente-de-loja/PDVNovo";
import { TAAMockup } from "./frente-de-loja/TAA";
import { SmartPOSMockup } from "./frente-de-loja/SmartPOS";
import { CardapioDigitalMockup } from "./frente-de-loja/CardapioDigital";
import { QuickPassMockup } from "./frente-de-loja/QuickPass";
import { CardapioInteligenteMockup } from "./tecfood/CardapioInteligente";
import { MyQuestMockup } from "./tecfood/MyQuest";
import { MyMenuMockup } from "./tecfood/MyMenu";
import { ApproveMockup } from "./tecfood/Approve";
import { WasteControlMockup } from "./tecfood/WasteControl";
import { RotinaFiscalMockup } from "./erp-backoffice/RotinaFiscal";
import { RotinaRastreabilidadeMockup } from "./erp-backoffice/RotinaRastreabilidade";
import { AppRotinasEstoqueMockup } from "./erp-backoffice/AppRotinasEstoque";
import { PortalGestorMockup } from "./pessoas-rh/PortalGestor";
import { PortalFuncionarioMockup } from "./pessoas-rh/PortalFuncionario";
import { MesaOperacoesMockup } from "./pessoas-rh/MesaOperacoes";
import { AnalisePreditivaMockup } from "./pessoas-rh/AnalisePreditiva";
import { AssistenteRegrasMockup } from "./pessoas-rh/AssistenteRegras";
import { MercadumMockup } from "./supply-compras/Mercadum";
import { AppComercialMockup } from "./supply-compras/AppComercial";
import { CRMPremiumMockup } from "./crm/CRMPremium";

interface MockupProps {
  step: number;
}

const MOCKUPS: Record<string, ComponentType<MockupProps>> = {
  "pdv-novo": PDVNovoMockup,
  taa: TAAMockup,
  "smart-pos": SmartPOSMockup,
  "cardapio-digital": CardapioDigitalMockup,
  quickpass: QuickPassMockup,

  "cardapio-inteligente": CardapioInteligenteMockup,
  myquest: MyQuestMockup,
  mymenu: MyMenuMockup,
  approve: ApproveMockup,
  "waste-control": WasteControlMockup,

  "rotina-fiscal": RotinaFiscalMockup,
  "rotina-rastreabilidade": RotinaRastreabilidadeMockup,
  "app-rotinas-estoque": AppRotinasEstoqueMockup,

  "portal-gestor": PortalGestorMockup,
  "portal-funcionario": PortalFuncionarioMockup,
  "mesa-operacoes": MesaOperacoesMockup,
  "analise-preditiva": AnalisePreditivaMockup,
  "assistente-regras": AssistenteRegrasMockup,

  mercadum: MercadumMockup,
  "app-comercial": AppComercialMockup,

  "crm-premium": CRMPremiumMockup,
};

export function getMockup(solutionId: string): ComponentType<MockupProps> | null {
  return MOCKUPS[solutionId] ?? null;
}

export function hasMockup(solutionId: string): boolean {
  return solutionId in MOCKUPS;
}
