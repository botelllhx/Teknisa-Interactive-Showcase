import type { TourStep } from "../solutions";

// v13.34 — flows alinhados com os data-tour reais dos mockups.
// Anteriormente os selectors aqui referenciavam tags que nunca existiram
// no DOM (pg-pendentes-tile, mo-dashboard, ap-table etc) e o tooltip caía
// no fallback de centro, sobrepondo o mockup.

export const portalGestorFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="pg-dashboard"]',
    placement: "right",
    title: "Painel do gestor",
    description:
      "Indicadores em tempo real da equipe: presença do dia, banco de horas, atestados e ocorrências. Tudo concentrado pro gestor decidir sem trocar de tela.",
  },
  {
    id: "schedule",
    targetSelector: '[data-tour="pg-schedule"]',
    placement: "right",
    title: "Escala da semana",
    description:
      "Grade completa por função e turno, com sinalização visual de cobertura insuficiente. O gestor reorganiza arrastando ou aprovando trocas sugeridas.",
  },
  {
    id: "punch",
    targetSelector: '[data-tour="pg-punch"]',
    placement: "right",
    title: "Espelho de ponto · hoje",
    description:
      "Marcações do turno atual com filtros por unidade e cargo. Inconsistências (ausência sem aviso, hora extra fora da meta) ficam destacadas.",
  },
  {
    id: "requests",
    targetSelector: '[data-tour="pg-requests"]',
    placement: "right",
    title: "Solicitações pendentes",
    description:
      "Férias, hora extra, ajuste de ponto. Cada card mostra solicitante, motivo e impacto na escala. Aprovação dispara notificação e folha em paralelo.",
  },
  {
    id: "export",
    targetSelector: '[data-tour="pg-export"]',
    placement: "left",
    title: "Relatório exportado",
    description:
      "Um clique compila o panorama da equipe em PDF assinado para RH corporativo. Sem montagem manual a cada mês.",
    requiresInteraction: true,
    actionLabel: "Exportar",
  },
];

export const portalFuncionarioFlow: TourStep[] = [
  {
    id: "login",
    targetSelector: '[data-tour="pf-login"]',
    placement: "right",
    title: "Acesso do funcionário",
    description:
      "Login direto no celular do colaborador, sem precisar passar pelo RH. Biometria opcional pra acelerar.",
    requiresInteraction: true,
    actionLabel: "Entrar",
  },
  {
    id: "punch-sheet",
    targetSelector: '[data-tour="pf-punch-sheet"]',
    placement: "right",
    title: "Espelho de ponto do mês",
    description:
      "Todas as marcações em uma tela: entrada, intervalo, saída. Saldo de banco de horas atualizado em tempo real.",
  },
  {
    id: "vacation",
    targetSelector: '[data-tour="pf-vacation-button"]',
    placement: "right",
    title: "Solicitar férias",
    description:
      "Solicitação aberta direto pelo app: período, motivo, anexos. Toque para começar a solicitação.",
    requiresInteraction: true,
    actionLabel: "Solicitar férias",
  },
  {
    id: "status",
    targetSelector: '[data-tour="pf-status"]',
    placement: "right",
    title: "Status da solicitação",
    description:
      "A solicitação aparece em tempo real com o nome do gestor que vai aprovar. Sem ligar pro RH para saber.",
  },
  {
    id: "payslip",
    targetSelector: '[data-tour="pf-payslip"]',
    placement: "left",
    title: "Holerite no app",
    description:
      "Demonstrativo de pagamento disponível em PDF, sem precisar pedir pra RH ou acessar portal web. Histórico de meses anteriores também.",
  },
];

export const mesaOperacoesFlow: TourStep[] = [
  {
    id: "grid",
    targetSelector: '[data-tour="mo-grid"]',
    placement: "right",
    title: "Painel operacional do turno",
    description:
      "Mapa das unidades em tempo real: presença, cobertos, ocorrências. O gestor olha e sabe onde precisa agir.",
  },
  {
    id: "alert",
    targetSelector: '[data-tour="mo-alert"]',
    placement: "right",
    title: "Alerta de cobertura",
    description:
      "Unidade Norte com 62% de presença, 22pp abaixo da meta. 8 ausentes hoje. A IA já sugere quem pode cobrir.",
  },
  {
    id: "realocar",
    targetSelector: '[data-tour="mo-realloc"]',
    placement: "left",
    title: "Mesma cor cobre mesma cor",
    description:
      "A IA filtra cozinheiros disponíveis com horas extras dentro da meta. Toque em Realocar e a escala se ajusta automaticamente.",
    requiresInteraction: true,
    actionLabel: "Toque em Realocar",
  },
  {
    id: "confirmed",
    targetSelector: '[data-tour="mo-confirmed"]',
    placement: "right",
    title: "Realocação confirmada",
    description:
      "Unidade Norte agora projeta 82% de presença. Notificação saiu pro colaborador realocado e pra escala do turno.",
  },
  {
    id: "log",
    targetSelector: '[data-tour="mo-log"]',
    placement: "right",
    title: "Log de operação",
    description:
      "Cada ação fica registrada com horário, responsável e impacto. Auditoria pronta sem montagem manual.",
  },
];

export const analisePreditivaFlow: TourStep[] = [
  {
    id: "kpis",
    targetSelector: '[data-tour="ip-kpis"]',
    placement: "right",
    title: "Indicadores preditivos de RH",
    description:
      "Turnover atual, predição para 90 dias e número de funcionários em risco crítico. A IA cruza atestados, advertências, horas extras e movimentações pra calcular o score.",
  },
  {
    id: "risk-map",
    targetSelector: '[data-tour="ip-risk-map"]',
    placement: "right",
    title: "Mapa de risco · pessoas",
    description:
      "Cada vínculo aparece com o nível de risco e os fatores que mais pesam. Toque em um colaborador para abrir os detalhes.",
    requiresInteraction: true,
    actionLabel: "Toque em uma pessoa",
  },
  {
    id: "suggestion",
    targetSelector: '[data-tour="ip-suggestion"]',
    placement: "left",
    title: "Plano sugerido pela IA",
    description:
      "Ações recomendadas pra mitigar o risco daquela pessoa: ajuste salarial, programa de mentoria, conversa de carreira. Cada ação tem impacto estimado.",
  },
  {
    id: "impact",
    targetSelector: '[data-tour="ip-impact"]',
    placement: "left",
    title: "Simulação de impacto",
    description:
      "Antes/depois do plano: risco cai de Alto pra Baixo, probabilidade de turnover reduzida. Decisão com dado, não com achismo.",
  },
];
