import type { FlowStep } from "../solutions";

export const cardapioInteligenteFlow: FlowStep[] = [
  {
    id: "planejamento",
    label: "Planejamento",
    tooltip: "Selecione um dia para editar",
    highlightArea: { x: 6, y: 22, width: 88, height: 36 },
  },
  {
    id: "adicionar-prato",
    label: "Adicionar prato",
    tooltip: "Inclua uma refeição ao cardápio",
    highlightArea: { x: 30, y: 30, width: 38, height: 14 },
  },
  {
    id: "nutricional",
    label: "Análise nutricional",
    tooltip: "Veja a composição calculada",
    highlightArea: { x: 6, y: 58, width: 88, height: 24 },
    companions: ["KitchenDisplay"],
  },
  {
    id: "aprovacao",
    label: "Aprovação",
    tooltip: "Aprove o cardápio da semana",
    highlightArea: { x: 60, y: 82, width: 34, height: 10 },
    companions: ["KitchenDisplay"],
  },
  {
    id: "publicado",
    label: "Publicado",
    companions: ["KitchenDisplay", "SimulatedNotification"],
  },
];

export const myQuestFlow: FlowStep[] = [
  {
    id: "check-in",
    label: "Check-in",
    tooltip: "Confirme presença na fila",
    highlightArea: { x: 8, y: 60, width: 84, height: 12 },
  },
  {
    id: "posicao",
    label: "Posição",
    tooltip: "Acompanhe a posição estimada",
    highlightArea: { x: 8, y: 24, width: 84, height: 32 },
  },
  {
    id: "chamada",
    label: "Chamada",
    companions: ["SimulatedNotification"],
  },
  {
    id: "confirmar",
    label: "Presença",
    tooltip: "Confirme presença ao chegar",
    highlightArea: { x: 16, y: 72, width: 68, height: 12 },
  },
  {
    id: "avaliacao",
    label: "Avaliação",
    tooltip: "Avalie a refeição",
    highlightArea: { x: 12, y: 52, width: 76, height: 28 },
  },
];

export const myMenuFlow: FlowStep[] = [
  {
    id: "cardapio-dia",
    label: "Cardápio do dia",
    tooltip: "Escolha o refeitório",
    highlightArea: { x: 6, y: 20, width: 88, height: 24 },
  },
  {
    id: "detalhe-prato",
    label: "Detalhes",
    tooltip: "Veja a composição do prato",
    highlightArea: { x: 6, y: 44, width: 88, height: 28 },
  },
  {
    id: "reservar",
    label: "Reservar",
    tooltip: "Reserve sua refeição",
    highlightArea: { x: 16, y: 76, width: 68, height: 12 },
    companions: ["OrderTicket"],
  },
  {
    id: "confirmar",
    label: "Confirmado",
    companions: ["OrderTicket", "SimulatedNotification"],
  },
  {
    id: "qr",
    label: "QR de acesso",
    companions: ["OrderTicket"],
  },
];

export const approveFlow: FlowStep[] = [
  {
    id: "pendentes",
    label: "Pendentes",
    tooltip: "Toque em uma solicitação",
    highlightArea: { x: 6, y: 20, width: 88, height: 60 },
    companions: ["MiniDashboard"],
  },
  {
    id: "detalhe",
    label: "Detalhe",
    tooltip: "Analise a solicitação",
    highlightArea: { x: 6, y: 20, width: 88, height: 60 },
    companions: ["MiniDashboard"],
  },
  {
    id: "comentar",
    label: "Comentário",
    tooltip: "Adicione observação",
    highlightArea: { x: 6, y: 60, width: 88, height: 18 },
    companions: ["MiniDashboard"],
  },
  {
    id: "aprovar",
    label: "Aprovar",
    tooltip: "Aprove ou reprove",
    highlightArea: { x: 50, y: 82, width: 44, height: 12 },
    companions: ["MiniDashboard"],
  },
  {
    id: "notificado",
    label: "Notificado",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

export const wasteControlFlow: FlowStep[] = [
  {
    id: "registro",
    label: "Registro",
    tooltip: "Selecione um item para registrar",
    highlightArea: { x: 6, y: 22, width: 88, height: 30 },
    companions: ["StockIndicator"],
  },
  {
    id: "pesagem",
    label: "Pesagem",
    tooltip: "Informe a quantidade pesada",
    highlightArea: { x: 14, y: 52, width: 72, height: 18 },
    companions: ["StockIndicator"],
  },
  {
    id: "comparativo",
    label: "Comparativo",
    tooltip: "Compare com a meta",
    highlightArea: { x: 6, y: 70, width: 88, height: 22 },
    companions: ["StockIndicator"],
  },
  {
    id: "alerta",
    label: "Alerta de desvio",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "relatorio",
    label: "Relatório",
    companions: ["StockIndicator"],
  },
];
