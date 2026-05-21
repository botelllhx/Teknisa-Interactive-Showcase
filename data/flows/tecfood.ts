import type { TourStep } from "../solutions";

export const cardapioInteligenteFlow: TourStep[] = [
  {
    id: "planejamento",
    targetSelector: '[data-tour="ci-week-grid"]',
    placement: "right",
    title: "Planejamento semanal centralizado",
    description:
      "Cardápio de toda a semana em uma única visão. Edite por dia, copie semanas anteriores, padronize por unidade.",
  },
  {
    id: "adicionar-prato",
    targetSelector: '[data-tour="ci-add-dish"]',
    placement: "right",
    title: "Adicionar prato em um toque",
    description:
      "Banco de pratos já cadastrados — selecione, ajuste porção e o cardápio é atualizado em tempo real.",
    requiresInteraction: true,
    actionLabel: "Adicione um prato",
  },
  {
    id: "nutricional",
    targetSelector: '[data-tour="ci-nutrition"]',
    placement: "left",
    title: "Análise nutricional automática",
    description:
      "Calorias, carboidratos, fibras — calculados em tempo real. Cardápio sai do planejamento já dentro das metas nutricionais.",
    companions: ["KitchenDisplay"],
  },
  {
    id: "aprovacao",
    targetSelector: '[data-tour="ci-approve"]',
    placement: "left",
    title: "Workflow de aprovação integrado",
    description:
      "Nutricionista valida, gestor aprova, unidades recebem. O fluxo todo dentro da plataforma — sem planilhas paralelas.",
    companions: ["KitchenDisplay"],
  },
  {
    id: "publicado",
    targetSelector: '[data-tour="ci-publish"]',
    placement: "left",
    title: "Publicado para todas as unidades",
    description:
      "Cardápio aprovado já chega no MyMenu de cada funcionário. Operação alinhada, sem atraso.",
    companions: ["KitchenDisplay", "SimulatedNotification"],
  },
];

export const myQuestFlow: TourStep[] = [
  {
    id: "check-in",
    targetSelector: '[data-tour="mq-checkin"]',
    placement: "top",
    title: "Entre na fila virtual",
    description:
      "Sem precisar estar no local: o funcionário entra na fila pelo celular e recebe o tempo estimado real.",
    requiresInteraction: true,
    actionLabel: "Toque em entrar na fila",
  },
  {
    id: "posicao",
    targetSelector: '[data-tour="mq-position"]',
    placement: "bottom",
    title: "Posição em tempo real",
    description:
      "Anel central animado mostra a posição. Tempo estimado atualiza a cada chamada — sem ansiedade.",
  },
  {
    id: "chamada",
    targetSelector: '[data-tour="mq-call"]',
    placement: "bottom",
    title: "Push quando for a vez",
    description:
      "Notificação no celular avisa quando chegar a hora — funcionário não perde tempo na fila física.",
    companions: ["SimulatedNotification"],
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="mq-confirm"]',
    placement: "top",
    title: "Confirme presença",
    description:
      "Ao chegar ao refeitório, um toque confirma. Quem não confirma libera a vaga para o próximo automaticamente.",
  },
  {
    id: "avaliacao",
    targetSelector: '[data-tour="mq-rating"]',
    placement: "top",
    title: "Avaliação rápida da refeição",
    description:
      "Comida, atendimento, higiene. Dados agregados viram input direto para o Cardápio Inteligente.",
  },
];

export const myMenuFlow: TourStep[] = [
  {
    id: "cardapio-dia",
    targetSelector: '[data-tour="mm-menu-list"]',
    placement: "bottom",
    title: "Cardápio do dia no celular",
    description:
      "Funcionário vê o cardápio antes de sair de casa. Filtra por restaurante e horário disponível.",
  },
  {
    id: "detalhe-prato",
    targetSelector: '[data-tour="mm-dish-detail"]',
    placement: "right",
    title: "Composição nutricional transparente",
    description:
      "Foto, descrição, valores nutricionais e compatibilidade com restrições alimentares declaradas.",
  },
  {
    id: "reservar",
    targetSelector: '[data-tour="mm-reserve"]',
    placement: "top",
    title: "Reserva por horário",
    description:
      "Escolha do horário evita pico no refeitório. Capacidade gerenciada automaticamente.",
    requiresInteraction: true,
    actionLabel: "Confirme a reserva",
    companions: ["OrderTicket"],
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="mm-confirmed"]',
    placement: "top",
    title: "Reserva confirmada",
    description:
      "Lembrete automático antes do horário. Refeição garantida — refeitório não corre risco de sobrecarga.",
    companions: ["OrderTicket", "SimulatedNotification"],
  },
  {
    id: "qr",
    targetSelector: '[data-tour="mm-qr"]',
    placement: "top",
    title: "QR de acesso ao refeitório",
    description:
      "Apresente no balcão e a refeição é registrada. Integração nativa com QuickPass para acesso liberado.",
    companions: ["OrderTicket"],
  },
];

export const approveFlow: TourStep[] = [
  {
    id: "pendentes",
    targetSelector: '[data-tour="ap-pending-list"]',
    placement: "right",
    title: "Pendências centralizadas",
    description:
      "Cardápio, compra, escala extra — todas as solicitações de aprovação em um único lugar, com prioridade automática.",
    companions: ["MiniDashboard"],
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="ap-detail"]',
    placement: "right",
    title: "Detalhe com diff de alterações",
    description:
      "O que mudou, custo estimado, impacto operacional — gestor decide com contexto completo, não no escuro.",
    companions: ["MiniDashboard"],
  },
  {
    id: "comentar",
    targetSelector: '[data-tour="ap-comment"]',
    placement: "top",
    title: "Comentário no histórico",
    description:
      "Justificativa de aprovação fica registrada para auditoria. Solicitante recebe contexto, não apenas 'aprovado'.",
    companions: ["MiniDashboard"],
  },
  {
    id: "aprovar",
    targetSelector: '[data-tour="ap-approve-button"]',
    placement: "top",
    title: "Aprovação em um toque",
    description:
      "Decisão entra em vigor imediatamente. Aprovação assíncrona — gestor não precisa estar online em horário comercial.",
    requiresInteraction: true,
    actionLabel: "Aprovar",
    companions: ["MiniDashboard"],
  },
  {
    id: "notificado",
    targetSelector: '[data-tour="ap-notified"]',
    placement: "top",
    title: "Solicitante notificado",
    description:
      "Push, e-mail e dashboard atualizam em tempo real. Operação destrava sem follow-up manual.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

export const wasteControlFlow: TourStep[] = [
  {
    id: "registro",
    targetSelector: '[data-tour="wc-item-list"]',
    placement: "right",
    title: "Sobras separadas por categoria",
    description:
      "Selecione o item e abra a tela de pesagem. Operação simples para o copeiro registrar no fim do almoço.",
    companions: ["StockIndicator"],
  },
  {
    id: "pesagem",
    targetSelector: '[data-tour="wc-weighing"]',
    placement: "right",
    title: "Pesagem direto do tablet",
    description:
      "Display grande, leitura de balança integrada. Categorize entre sobra limpa e resto consumido.",
    companions: ["StockIndicator"],
  },
  {
    id: "comparativo",
    targetSelector: '[data-tour="wc-chart"]',
    placement: "top",
    title: "Comparativo com a meta",
    description:
      "Gráfico semanal mostra evolução. Meta diária visível para o gestor agir antes do problema escalar.",
    companions: ["StockIndicator"],
  },
  {
    id: "alerta",
    targetSelector: '[data-tour="wc-alert"]',
    placement: "top",
    title: "Alerta de desvio",
    description:
      "Quando o desperdício passa da meta, alerta dispara. Gestor recebe push e o cardápio do dia seguinte é revisado.",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "relatorio",
    targetSelector: '[data-tour="wc-report"]',
    placement: "top",
    title: "Relatório enviado à supervisão",
    description:
      "Dados consolidados, prontos para auditoria de sustentabilidade. Sem planilha, sem retrabalho.",
    companions: ["StockIndicator"],
  },
];
