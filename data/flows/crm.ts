import type { TourStep } from "../solutions";

export const crmPremiumFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="crm-kpis"]',
    placement: "right",
    title: "Indicadores de fidelidade",
    description:
      "Base ativa, LTV médio, recompra. Métricas que mostram saúde do relacionamento, não apenas vendas no caixa.",
    companions: ["MiniDashboard"],
  },
  {
    id: "perfil",
    targetSelector: '[data-tour="crm-profile"]',
    placement: "top",
    title: "Perfil do cliente em foco",
    description:
      "Frequência, ticket médio, categoria favorita. CRM com dados de venda integrados, não cadastro de e-mail isolado.",
    companions: ["MiniDashboard"],
  },
  {
    id: "campanha",
    targetSelector: '[data-tour="crm-campaign"]',
    placement: "left",
    title: "Crie campanhas segmentadas",
    description:
      "Defina público (VIPs inativos, por categoria, por LTV) e o sistema sugere o conteúdo. Marketing direto, sem agência.",
    companions: ["MiniDashboard"],
  },
  {
    id: "oferta",
    targetSelector: '[data-tour="crm-offer"]',
    placement: "left",
    title: "Oferta personalizada",
    description:
      "Desconto, brinde, frete, combinação por segmento. IA estima alcance de 1.842 clientes para a campanha atual.",
    requiresInteraction: true,
    actionLabel: "Ativar campanha",
    companions: ["MiniDashboard"],
  },
  {
    id: "ativada",
    targetSelector: '[data-tour="crm-activated"]',
    placement: "left",
    title: "Campanha ativada e monitorada",
    description:
      "Funil em tempo real: enviadas, abertas, resgatadas. Resultado mensurável, sem 'achismo' de retorno.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];
