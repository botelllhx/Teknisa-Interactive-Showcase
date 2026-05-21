export type SolutionDevice =
  | "desktop"
  | "mobile"
  | "tablet"
  | "pos-terminal"
  | "kiosk";

export type SolutionSegment =
  | "frente-de-loja"
  | "tecfood"
  | "erp-backoffice"
  | "pessoas-rh"
  | "supply-compras"
  | "crm"
  | "ia"
  | "gestao-corporativa";

export type CompanionType =
  | "POSCardReader"
  | "OrderTicket"
  | "KitchenDisplay"
  | "MiniDashboard"
  | "StockIndicator"
  | "EmployeeCard"
  | "SimulatedNotification"
  | "FiscalBadge"
  | "OperatorDailyPanel"
  | "CustomerReceiptPhone"
  | "RestaurantQueueBoard";

export type SolutionBadge = "IA" | "Em breve" | "Reforma Tributária";

export type TourPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "bottom-end";

import type { TourLiveState } from "../lib/tourState";

/** Field that may be a static string or a function of the live mockup state. */
export type DynamicText = string | ((live: TourLiveState) => string);

export interface TourStep {
  id: string;
  // CSS selector for the target element inside the mockup
  // e.g. '[data-tour="pdv-add-item"]'
  targetSelector: string;
  placement: TourPlacement;
  title: DynamicText;
  description: DynamicText;
  actionLabel?: DynamicText;
  // If true: advance only when the target element is clicked (PulsingDot shows on element)
  // If false: advance via the tooltip's primary button
  requiresInteraction?: boolean;
  // Visual emphasis on the target beyond the spotlight
  highlightStyle?: "pulse" | "ring" | "glow";
  // Companions that should appear during this step (still supported)
  companions?: CompanionType[];
}

/** Resolve a static or dynamic text against the current live state. */
export function resolveText(value: DynamicText, live: TourLiveState): string {
  return typeof value === "function" ? value(live) : value;
}

export interface Solution {
  id: string;
  segment: SolutionSegment;
  name: string;
  tagline: string;
  description: string;
  device: SolutionDevice;
  icon: string;
  tags: string[];
  badges?: SolutionBadge[];
  companions?: CompanionType[];
  status: "ready" | "in-progress" | "placeholder";
}

export interface Segment {
  id: SolutionSegment;
  label: string;
  description: string;
  tagline: string;
  icon: string;
  color: string;
  solutions: string[];
  comingSoon?: boolean;
}

export const segments: Segment[] = [
  {
    id: "frente-de-loja",
    label: "Frente de Loja",
    description: "PDV, autoatendimento e experiência de compra",
    tagline: "Vendas e atendimento em qualquer ponto de contato",
    icon: "Monitor",
    color: "#020788",
    solutions: ["taa", "pdv-novo", "smart-pos", "cardapio-digital", "quickpass"],
  },
  {
    id: "tecfood",
    label: "TecFood",
    description: "Gestão especializada em refeições coletivas",
    tagline: "Food service do planejamento ao prato",
    icon: "Utensils",
    color: "#020788",
    solutions: [
      "cardapio-inteligente",
      "myquest",
      "mymenu",
      "approve",
      "waste-control",
    ],
  },
  {
    id: "erp-backoffice",
    label: "ERP Backoffice",
    description: "Gestão fiscal, estoque e rastreabilidade",
    tagline: "Operação financeira e fiscal sob controle",
    icon: "LayoutGrid",
    color: "#020788",
    solutions: [
      "rotina-fiscal",
      "rotina-rastreabilidade",
      "app-rotinas-estoque",
    ],
  },
  {
    id: "pessoas-rh",
    label: "Pessoas e RH",
    description: "Gestão de pessoas, ponto e operações de RH",
    tagline: "Gente e operação alinhadas em tempo real",
    icon: "Users",
    color: "#020788",
    solutions: [
      "portal-gestor",
      "portal-funcionario",
      "mesa-operacoes",
      "analise-preditiva",
      "assistente-regras",
    ],
  },
  {
    id: "supply-compras",
    label: "Supply e Compras",
    description: "Cotações, compras e gestão de fornecedores",
    tagline: "Negociação inteligente de ponta a ponta",
    icon: "ShoppingCart",
    color: "#020788",
    solutions: ["mercadum", "app-comercial"],
  },
  {
    id: "crm",
    label: "CRM",
    description: "Fidelidade, jornada do cliente e campanhas",
    tagline: "Relacionamento que vira receita recorrente",
    icon: "Heart",
    color: "#020788",
    solutions: ["crm-premium"],
  },
  {
    id: "ia",
    label: "IA",
    description: "Inteligência artificial aplicada ao food service",
    tagline: "Capacidades transversais de IA da plataforma",
    icon: "Sparkles",
    color: "#020788",
    solutions: [],
    comingSoon: true,
  },
  {
    id: "gestao-corporativa",
    label: "Gestão Corporativa",
    description: "Multiunidades, franquias e BI",
    tagline: "Visão consolidada de toda a rede",
    icon: "Globe",
    color: "#020788",
    solutions: [],
    comingSoon: true,
  },
];

export const solutions: Solution[] = [
  // Frente de Loja
  {
    id: "taa",
    segment: "frente-de-loja",
    name: "TAA",
    tagline: "Terminal de autoatendimento",
    description:
      "Autoatendimento moderno para food service. Pedido completo sem fila, com personalização e pagamento integrado.",
    device: "kiosk",
    icon: "Monitor",
    tags: ["Autoatendimento", "Totem", "Self-service"],
    companions: ["OrderTicket", "SimulatedNotification"],
    status: "ready",
  },
  {
    id: "pdv-novo",
    segment: "frente-de-loja",
    name: "PDV Novo",
    tagline: "Caixa de loja repaginado",
    description:
      "Frente de caixa rápida, com cobrança integrada, descontos e cupom fiscal em segundos.",
    device: "desktop",
    icon: "Calculator",
    tags: ["PDV", "Caixa", "Frente de loja"],
    companions: ["POSCardReader", "OrderTicket"],
    status: "ready",
  },
  {
    id: "smart-pos",
    segment: "frente-de-loja",
    name: "SmartPOS",
    tagline: "PDV portátil na palma da mão",
    description:
      "Maquininha inteligente que une venda, pagamento e cupom em um único dispositivo móvel.",
    device: "mobile",
    icon: "Smartphone",
    tags: ["Mobile", "POS", "Pagamento"],
    companions: ["POSCardReader"],
    status: "ready",
  },
  {
    id: "cardapio-digital",
    segment: "frente-de-loja",
    name: "Cardápio Digital",
    tagline: "Pedido direto da mesa",
    description:
      "Cardápio interativo para o cliente pedir do próprio celular, com integração direta ao KDS da cozinha.",
    device: "mobile",
    icon: "BookOpen",
    tags: ["Cardápio", "QR", "Mesa"],
    companions: ["KitchenDisplay"],
    status: "ready",
  },
  {
    id: "quickpass",
    segment: "frente-de-loja",
    name: "QuickPass",
    tagline: "Atendimento rápido em eventos",
    description:
      "Sistema de atendimento rápido para estádios, shows e festivais. Cliente pede, paga e retira com QR, sem fila.",
    device: "mobile",
    icon: "Zap",
    tags: ["Eventos", "Mobile", "Pula fila"],
    companions: ["RestaurantQueueBoard"],
    status: "ready",
  },

  // TecFood
  {
    id: "cardapio-inteligente",
    segment: "tecfood",
    name: "Cardápio Inteligente",
    tagline: "Planejamento semanal nutricional",
    description:
      "Monta cardápios balanceados com análise nutricional automática e distribuição multiunidade.",
    device: "desktop",
    icon: "ChefHat",
    tags: ["Cardápio", "Nutrição", "Planejamento"],
    companions: ["KitchenDisplay"],
    status: "ready",
  },
  {
    id: "myquest",
    segment: "tecfood",
    name: "MyQuest",
    tagline: "Fila virtual de refeitório",
    description:
      "Reserva de horário e chamada por notificação. Refeitório sem fila e com previsibilidade.",
    device: "mobile",
    icon: "Timer",
    tags: ["Fila virtual", "Refeitório", "Mobile"],
    companions: ["SimulatedNotification"],
    status: "ready",
  },
  {
    id: "mymenu",
    segment: "tecfood",
    name: "MyMenu",
    tagline: "Cardápio do dia no celular",
    description:
      "Consulta do cardápio, agendamento e QR Code de acesso para os funcionários do refeitório.",
    device: "mobile",
    icon: "Salad",
    tags: ["Mobile", "Cardápio", "Agendamento"],
    companions: ["OrderTicket"],
    status: "ready",
  },
  {
    id: "approve",
    segment: "tecfood",
    name: "Approve",
    tagline: "Aprovações em um toque",
    description:
      "Centraliza solicitações de cardápio, compras e escala em um único fluxo de aprovação móvel.",
    device: "tablet",
    icon: "BadgeCheck",
    tags: ["Aprovação", "Workflow", "Gestão"],
    companions: ["MiniDashboard"],
    status: "ready",
  },
  {
    id: "waste-control",
    segment: "tecfood",
    name: "WasteControl",
    tagline: "Controle de desperdício",
    description:
      "Pesagem de sobras, categorização e comparativo com metas para reduzir o desperdício na operação.",
    device: "tablet",
    icon: "Scale",
    tags: ["Sustentabilidade", "Desperdício", "Indicadores"],
    companions: ["StockIndicator"],
    status: "ready",
  },

  // ERP Backoffice
  {
    id: "rotina-fiscal",
    segment: "erp-backoffice",
    name: "Rotina Fiscal",
    tagline: "Preparado para a Reforma Tributária",
    description:
      "Apuração, validação e geração de obrigações fiscais já alinhada ao novo regime IBS/CBS/IS.",
    device: "desktop",
    icon: "FileText",
    tags: ["Fiscal", "Reforma", "SPED"],
    badges: ["Reforma Tributária"],
    companions: ["FiscalBadge"],
    status: "ready",
  },
  {
    id: "rotina-rastreabilidade",
    segment: "erp-backoffice",
    name: "Rotina Rastreabilidade",
    tagline: "Da origem ao consumo",
    description:
      "Rastreio de lote ponta a ponta, com linha do tempo de movimentações e alerta de recall.",
    device: "desktop",
    icon: "GitBranch",
    tags: ["Rastreabilidade", "Lote", "Compliance"],
    companions: ["StockIndicator"],
    status: "ready",
  },
  {
    id: "app-rotinas-estoque",
    segment: "erp-backoffice",
    name: "App Rotinas de Estoque",
    tagline: "Estoque no chão de loja",
    description:
      "Contagem, divergência e ajuste de estoque direto do mobile, com sincronização em tempo real.",
    device: "mobile",
    icon: "PackageSearch",
    tags: ["Estoque", "Mobile", "Inventário"],
    companions: ["StockIndicator"],
    status: "ready",
  },

  // Pessoas e RH
  {
    id: "portal-gestor",
    segment: "pessoas-rh",
    name: "Portal Gestor",
    tagline: "Equipe sob controle do gestor",
    description:
      "Escala, ponto, aprovação de hora extra e indicadores de presença em um único painel.",
    device: "desktop",
    icon: "UsersRound",
    tags: ["RH", "Gestão", "Escala"],
    companions: ["EmployeeCard", "MiniDashboard"],
    status: "ready",
  },
  {
    id: "portal-funcionario",
    segment: "pessoas-rh",
    name: "Portal Funcionário",
    tagline: "RH no bolso do colaborador",
    description:
      "Espelho de ponto, férias, holerite e benefícios disponíveis a qualquer hora, em qualquer lugar.",
    device: "mobile",
    icon: "UserCircle",
    tags: ["Funcionário", "Mobile", "Self-service"],
    companions: ["SimulatedNotification"],
    status: "ready",
  },
  {
    id: "mesa-operacoes",
    segment: "pessoas-rh",
    name: "Mesa de Operações",
    tagline: "Centro de controle multiunidades",
    description:
      "Visão consolidada de várias unidades com alertas em tempo real e ações de realocação.",
    device: "desktop",
    icon: "LayoutDashboard",
    tags: ["Operações", "Multi-unidade", "Tempo real"],
    companions: ["MiniDashboard"],
    status: "ready",
  },
  {
    id: "analise-preditiva",
    segment: "pessoas-rh",
    name: "Análise Preditiva",
    tagline: "Antecipa o turnover",
    description:
      "IA aplicada ao RH: identifica risco de turnover e sugere planos de retenção com simulação de impacto.",
    device: "desktop",
    icon: "TrendingUp",
    tags: ["IA", "Preditivo", "Turnover"],
    badges: ["IA"],
    companions: ["MiniDashboard"],
    status: "ready",
  },
  {
    id: "assistente-regras",
    segment: "pessoas-rh",
    name: "Assistente de Criação de Regras",
    tagline: "Crie regras conversando",
    description:
      "Wizard com IA para definir regras de ponto, escala e benefícios sem precisar de configuração técnica.",
    device: "desktop",
    icon: "Sparkles",
    tags: ["IA", "Wizard", "Configuração"],
    badges: ["IA"],
    companions: ["SimulatedNotification"],
    status: "ready",
  },

  // Supply e Compras
  {
    id: "mercadum",
    segment: "supply-compras",
    name: "Mercadum",
    tagline: "Cotação inteligente de insumos",
    description:
      "Compara fornecedores em tempo real e dispara pedidos com a melhor relação preço-prazo-avaliação.",
    device: "desktop",
    icon: "ShoppingBasket",
    tags: ["Cotação", "Suprimentos", "Marketplace"],
    companions: ["MiniDashboard"],
    status: "ready",
  },
  {
    id: "app-comercial",
    segment: "supply-compras",
    name: "App Comercial",
    tagline: "Força de vendas mobile",
    description:
      "Pedidos, metas e clientes na mão do representante, com sincronização e indicadores em tempo real.",
    device: "mobile",
    icon: "Briefcase",
    tags: ["Comercial", "Vendas", "Mobile"],
    companions: ["MiniDashboard"],
    status: "ready",
  },

  // CRM
  {
    id: "crm-premium",
    segment: "crm",
    name: "CRM Premium",
    tagline: "Fidelidade que gera recorrência",
    description:
      "Conhece o cliente, segmenta automaticamente e dispara campanhas personalizadas de fidelidade.",
    device: "desktop",
    icon: "Heart",
    tags: ["CRM", "Fidelidade", "Campanhas"],
    companions: ["MiniDashboard"],
    status: "ready",
  },
];

export const solutionsById: Record<string, Solution> = Object.fromEntries(
  solutions.map((s) => [s.id, s]),
);

export const segmentsById: Record<SolutionSegment, Segment> = Object.fromEntries(
  segments.map((s) => [s.id, s]),
) as Record<SolutionSegment, Segment>;

export function getSolutionsBySegment(segment: SolutionSegment): Solution[] {
  const seg = segmentsById[segment];
  if (!seg) return [];
  return seg.solutions
    .map((id) => solutionsById[id])
    .filter((s): s is Solution => Boolean(s));
}
