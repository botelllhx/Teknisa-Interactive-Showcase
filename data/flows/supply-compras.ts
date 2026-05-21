import type { TourStep } from "../solutions";

export const mercadumFlow: TourStep[] = [
  {
    id: "cotacao",
    targetSelector: '[data-tour="mc-quote-list"]',
    placement: "right",
    title: "Cotação abrangente",
    description:
      "Lista de insumos a cotar com volume e unidade. Cotação aberta dispara para todos os fornecedores ativos simultaneamente.",
  },
  {
    id: "comparativo",
    targetSelector: '[data-tour="mc-supplier-grid"]',
    placement: "top",
    title: "Comparativo lado a lado",
    description:
      "Preço, prazo, avaliação. Comprador decide com toda informação à mão, sem trocar e-mails com 8 fornecedores.",
    companions: ["MiniDashboard"],
  },
  {
    id: "selecao",
    targetSelector: '[data-tour="mc-best-pick"]',
    placement: "left",
    title: "Seleção sugerida pela IA",
    description:
      "Melhor combinação de preço, prazo e avaliação destacada. Comprador pode aceitar a sugestão ou priorizar outro critério.",
    companions: ["MiniDashboard"],
  },
  {
    id: "pedido",
    targetSelector: '[data-tour="mc-po"]',
    placement: "left",
    title: "Pedido de compra gerado",
    description:
      "Cotação vira pedido formal em um clique. Documento padronizado, integrado ao ERP, pronto para envio.",
    companions: ["MiniDashboard"],
  },
  {
    id: "enviado",
    targetSelector: '[data-tour="mc-sent"]',
    placement: "left",
    title: "Enviado ao fornecedor",
    description:
      "Pedido entra na fila do fornecedor com confirmação automática. Comprador acompanha o status sem ligar pedindo previsão.",
    requiresInteraction: true,
    actionLabel: "Enviar pedido",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

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
