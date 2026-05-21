import type { TourStep } from "../solutions";
import {
  taaFlow,
  pdvNovoFlow,
  smartPosFlow,
  cardapioDigitalFlow,
  quickPassFlow,
} from "./frente-de-loja";
import {
  cardapioInteligenteFlow,
  myQuestFlow,
  myMenuFlow,
  approveFlow,
  wasteControlFlow,
} from "./tecfood";
import {
  rotinaFiscalFlow,
  rotinaRastreabilidadeFlow,
  appRotinasEstoqueFlow,
} from "./erp-backoffice";
import {
  portalGestorFlow,
  portalFuncionarioFlow,
  mesaOperacoesFlow,
  analisePreditivaFlow,
  assistenteRegrasFlow,
} from "./pessoas-rh";
import { mercadumFlow, appComercialFlow } from "./supply-compras";
import { crmPremiumFlow } from "./crm";

export const flows: Record<string, TourStep[]> = {
  taa: taaFlow,
  "pdv-novo": pdvNovoFlow,
  "smart-pos": smartPosFlow,
  "cardapio-digital": cardapioDigitalFlow,
  quickpass: quickPassFlow,

  "cardapio-inteligente": cardapioInteligenteFlow,
  myquest: myQuestFlow,
  mymenu: myMenuFlow,
  approve: approveFlow,
  "waste-control": wasteControlFlow,

  "rotina-fiscal": rotinaFiscalFlow,
  "rotina-rastreabilidade": rotinaRastreabilidadeFlow,
  "app-rotinas-estoque": appRotinasEstoqueFlow,

  "portal-gestor": portalGestorFlow,
  "portal-funcionario": portalFuncionarioFlow,
  "mesa-operacoes": mesaOperacoesFlow,
  "analise-preditiva": analisePreditivaFlow,
  "assistente-regras": assistenteRegrasFlow,

  mercadum: mercadumFlow,
  "app-comercial": appComercialFlow,

  "crm-premium": crmPremiumFlow,
};

export function getFlow(solutionId: string): TourStep[] {
  return flows[solutionId] ?? [];
}
