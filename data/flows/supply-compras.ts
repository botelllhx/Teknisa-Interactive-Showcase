import type { TourStep } from "../solutions";
import { brl } from "../../lib/tourState";

const fmtMoney = (v?: number) =>
  typeof v === "number" ? brl(v) : "R$ 0,00";

// ===== Mercadum =========================================================
export const mercadumFlow: TourStep[] = [
  {
    id: "lista",
    targetSelector: '[data-tour="mc-cotacao-table"]',
    placement: "right",
    title: "Cotações em tempo real",
    description:
      "No topo, KPIs do mês: cotações abertas, economia acumulada e fornecedores ativos, com mini sparkline dos últimos 7 dias. Abaixo, a lista de RFQ com cliente, status (Pendente, Negociando, Proposta aceita, Finalizada), prazo e produtos cotados. Toque em qualquer linha para abrir.",
    actionLabel: "Abrir cotação",
    companions: ["MiniDashboard"],
  },
  {
    id: "abre-cotacao",
    targetSelector: '[data-tour="mc-row-open"]',
    placement: "right",
    title: "Abra a RFQ-2024-001",
    description:
      "Toque na primeira linha para ver detalhamento por produto, posição na disputa e comparativo com a menor cotação Mercadum.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="mc-products-table"]',
    placement: "right",
    title: (live) =>
      live.mcSelected
        ? `${live.mcSelected} produto(s) na seleção`
        : "Tabela comparativa por produto",
    description:
      "Cada linha mostra Qntd, Valor objetivo, Última cotação, Valor cotação atual, Posição na disputa, Variação e a Menor cotação do marketplace. Selecione produtos para ações em massa.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "chat",
    targetSelector: '[data-tour="mc-open-chat"]',
    placement: "top",
    title: "Negociar com o fornecedor",
    description:
      "Toque em Abrir negociação para entrar no chat integrado com o fornecedor desta cotação.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "proposta",
    targetSelector: '[data-tour="mc-proposal-panel"]',
    placement: "left",
    title: "Proposta atual ao vivo",
    description:
      "Valor original, desconto negociado, valor final, prazo e garantia em um painel. Aceite, decline ou envie contra proposta sem sair do chat.",
    actionLabel: "Concluir",
    companions: ["MiniDashboard"],
  },
];

// ===== Approve (mobile) =================================================
export const approveFlow: TourStep[] = [
  {
    id: "tabs",
    targetSelector: '[data-tour="ap-tabs"]',
    placement: "bottom",
    title: (live) =>
      `${live.apPendingCount ?? 0} solicitações aguardando aprovação`,
    description:
      "App Approve no celular do gestor. Abas Pendentes, Aprovadas, Reprovadas com contagem por status. Aprovações de compras, contratos e pedidos em um só lugar.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "card",
    targetSelector: '[data-tour="ap-first-card"]',
    placement: "right",
    title: "Toque para ver o detalhe",
    description:
      "Cada card mostra título, tipo, solicitante, prazo e valor. Toque na primeira solicitação para abrir o detalhamento completo.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "detail",
    targetSelector: '[data-tour="ap-detail"]',
    placement: "bottom",
    title: (live) => (live.apOpenTitle as string) ?? "Detalhamento",
    description:
      "Valor, variação vs. baseline e descrição completa, com diff Antes/Agora pra o gestor decidir com contexto. Mais abaixo, o histórico da solicitação aparece em estilo chat: foto e nome de quem solicitou, analisou e encaminhou, cada mensagem com timestamp.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "comment",
    targetSelector: '[data-tour="ap-comment"]',
    placement: "top",
    title: "Comentário em chips, sem teclado",
    description:
      "Toque em uma justificativa pré-pronta. A nota fica registrada no histórico da solicitação pra auditoria.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "approve",
    targetSelector: '[data-tour="ap-approve-button"]',
    placement: "top",
    title: "Aprovação em um toque",
    description:
      "Toque em Aprovar. A solicitação migra pra aba Aprovadas, o solicitante recebe push + e-mail e o pedido segue pro ERP.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
];

// ===== App Comercial ====================================================
// Mantido como estava: ainda esperando informações do cliente.
export const appComercialFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="ac-goal"]',
    placement: "bottom",
    title: "Meta visível em tempo real",
    description:
      "Representante abre o app e vê quanto falta para a meta do mês. Foco diário, sem precisar pedir relatório.",
    companions: ["MiniDashboard"],
  },
  {
    id: "cliente",
    targetSelector: '[data-tour="ac-client"]',
    placement: "right",
    title: "Histórico do cliente na mão",
    description:
      "CNPJ, pedidos anteriores, ticket médio. Atendimento consultivo, não apenas tirar pedido.",
    companions: ["MiniDashboard"],
  },
  {
    id: "produtos",
    targetSelector: '[data-tour="ac-product-suggested"]',
    placement: "left",
    title: "Sugestão de produtos por perfil",
    description:
      "IA sugere produtos baseado no histórico do cliente e no que sai mais na região. Ticket médio sobe sem pressão.",
    requiresInteraction: true,
    actionLabel: "Adicione um produto",
    companions: ["MiniDashboard"],
  },
  {
    id: "resumo",
    targetSelector: '[data-tour="ac-summary"]',
    placement: "top",
    title: "Resumo com total dinâmico",
    description:
      "Pedido revisado antes de enviar. Sem erro de digitação, sem retrabalho de back-office.",
    companions: ["MiniDashboard"],
  },
  {
    id: "enviado",
    targetSelector: '[data-tour="ac-sent"]',
    placement: "top",
    title: "Pedido enviado ao ERP",
    description:
      "Integração nativa, pedido entra no faturamento sem digitação manual. Confirmação por e-mail para o cliente.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];
