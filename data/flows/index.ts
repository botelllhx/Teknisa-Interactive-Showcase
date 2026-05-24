import type { TourStep } from "../solutions";
import {
  retailIntelligenceFlow,
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
import {
  mercadumFlow,
  appComercialFlow,
  approveFlow,
} from "./supply-compras";
import { crmPremiumFlow } from "./crm";
import { isaChatbotFlow, analisePreditivaIAFlow } from "./ia";

export const flows: Record<string, TourStep[]> = {
  "retail-intelligence": retailIntelligenceFlow,
  taa: taaFlow,
  "pdv-novo": pdvNovoFlow,
  "smart-pos": smartPosFlow,
  "cardapio-digital": cardapioDigitalFlow,
  quickpass: quickPassFlow,

  "cardapio-inteligente": cardapioInteligenteFlow,
  myquest: myQuestFlow,
  mymenu: myMenuFlow,
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
  approve: approveFlow,

  "crm-premium": crmPremiumFlow,

  "isa-chatbot": isaChatbotFlow,
  "analise-preditiva-ia": analisePreditivaIAFlow,
};

export function getFlow(solutionId: string): TourStep[] {
  return flows[solutionId] ?? [];
}
