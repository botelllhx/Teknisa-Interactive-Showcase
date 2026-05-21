import type { TourStep } from "../solutions";

export const taaFlow: TourStep[] = [
  {
    id: "welcome",
    targetSelector: '[data-tour="taa-eat-here"]',
    placement: "right",
    title: "Comece o pedido",
    description: "Toque em Comer aqui para escolher onde consumir.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "category",
    targetSelector: '[data-tour="taa-cat-lanches"]',
    placement: "right",
    title: "Escolha uma categoria",
    description: "Toque em Lanches para ver as opções.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "add-combo",
    targetSelector: '[data-tour="taa-combo-burger"]',
    placement: "right",
    title: "Selecione um combo",
    description:
      "Toque para adicionar o combo X-Burguer. O cupom à direita preenche em tempo real.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "pay-pix",
    targetSelector: '[data-tour="taa-pix-button"]',
    placement: "left",
    title: "Pague com PIX",
    description: "Toque em PIX. A maquininha entra em modo de cobrança.",
    requiresInteraction: true,
    companions: ["OrderTicket", "POSCardReader"],
  },
  {
    id: "approved",
    targetSelector: '[data-tour="taa-senha-card"]',
    placement: "left",
    title: "Pedido confirmado",
    description:
      "Senha emitida e enviada para a cozinha. O cupom registra o pagamento aprovado.",
    actionLabel: "Concluir",
    companions: ["OrderTicket", "POSCardReader"],
  },
];

// --- The remaining Frente de Loja flows keep their existing structure ---

export const pdvNovoFlow: TourStep[] = [
  {
    id: "tela-principal",
    targetSelector: '[data-tour="pdv-first-product"]',
    placement: "right",
    title: "Adicione um produto",
    description: "Toque na Costela no bafo para incluir no pedido.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "adicionar-bebida",
    targetSelector: '[data-tour="pdv-cart"]',
    placement: "left",
    title: "Carrinho atualiza ao vivo",
    description:
      "Cada item entra na comanda ao lado e no cupom térmico ao mesmo tempo.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "desconto",
    targetSelector: '[data-tour="pdv-discount"]',
    placement: "right",
    title: "Aplique o desconto fidelidade",
    description:
      "Desconto automático de 10% para clientes do programa de fidelidade — visível na linha do total.",
    actionLabel: "Aplicar desconto",
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="pdv-payment"]',
    placement: "top",
    title: "Finalize no cartão",
    description: "Toque na opção VISA Crédito — a maquininha entra em ação.",
    requiresInteraction: true,
    companions: ["POSCardReader", "OrderTicket"],
  },
  {
    id: "cupom",
    targetSelector: '[data-tour="pdv-receipt"]',
    placement: "top",
    title: "Venda concluída",
    description:
      "Cupom fiscal emitido. Maquininha aprova. Operação fiscal sincronizada com Rotina Fiscal automaticamente.",
    actionLabel: "Concluir",
    companions: ["POSCardReader", "OrderTicket"],
  },
];

export const smartPosFlow: TourStep[] = [
  {
    id: "catalogo",
    targetSelector: '[data-tour="smartpos-catalog-item"]',
    placement: "right",
    title: "Selecione o produto",
    description:
      "Toque no Misto quente para adicionar à venda. O catálogo está sempre na mão do operador.",
    requiresInteraction: true,
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "quantidade",
    targetSelector: '[data-tour="smartpos-qty"]',
    placement: "top",
    title: "Ajuste a quantidade",
    description: "Stepper grande, contagem instantânea. Confirme com o + brand.",
    actionLabel: "Continuar",
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="smartpos-payment-list"]',
    placement: "right",
    title: "Cliente escolhe pagar com cartão",
    description: "Toque em Crédito. O leitor do próprio SmartPOS é ativado.",
    requiresInteraction: true,
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
  {
    id: "cartao",
    targetSelector: '[data-tour="smartpos-tap"]',
    placement: "right",
    title: "Cliente aproxima o cartão",
    description:
      "O SmartPOS é a maquininha. Aprovação em 2 segundos via NFC ou inserção.",
    actionLabel: "Aprovar",
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
  {
    id: "aprovado",
    targetSelector: '[data-tour="smartpos-approved"]',
    placement: "left",
    title: "Comprovante na hora",
    description:
      "Cliente recebe o comprovante por SMS no celular. O painel do operador soma a venda imediatamente.",
    actionLabel: "Concluir",
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
];

export const cardapioDigitalFlow: TourStep[] = [
  {
    id: "categorias",
    targetSelector: '[data-tour="cd-categories"]',
    placement: "right",
    title: "Cliente navega no tablet",
    description: "Toque em Pratos para abrir as opções.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="cd-detail"]',
    placement: "right",
    title: "Personalize o prato",
    description:
      "Foto, descrição, valores nutricionais e adicionais. O cliente decide tudo sem chamar atendente.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "carrinho",
    targetSelector: '[data-tour="cd-cart"]',
    placement: "right",
    title: "Cliente revisa o pedido",
    description:
      "Itens, adicionais e total dinâmico. O cupom à esquerda mostra exatamente o que o cliente está vendo.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="cd-confirm"]',
    placement: "left",
    title: "Pedido entra na cozinha",
    description:
      "Toque em Confirmar pedido — o KDS da cozinha à direita recebe na hora.",
    requiresInteraction: true,
    companions: ["OrderTicket", "KitchenDisplay", "SimulatedNotification"],
  },
  {
    id: "em-preparo",
    targetSelector: '[data-tour="cd-kitchen"]',
    placement: "left",
    title: "Status em tempo real",
    description:
      "Cliente acompanha cada etapa no tablet. Cozinha trabalha sem interrupção. Garçom só atua se necessário.",
    actionLabel: "Concluir",
    companions: ["OrderTicket", "KitchenDisplay"],
  },
];

export const quickPassFlow: TourStep[] = [
  {
    id: "login",
    targetSelector: '[data-tour="qp-login"]',
    placement: "right",
    title: "Entre com biometria",
    description: "Toque em Usar biometria para autenticar.",
    requiresInteraction: true,
    companions: ["EmployeeCard", "RestaurantQueueBoard"],
  },
  {
    id: "saldo",
    targetSelector: '[data-tour="qp-balance"]',
    placement: "right",
    title: "Saldo e benefícios sincronizados",
    description:
      "Saldo, refeições restantes e próxima recarga aparecem no crachá digital à esquerda.",
    actionLabel: "Continuar",
    companions: ["EmployeeCard", "RestaurantQueueBoard"],
  },
  {
    id: "selecao",
    targetSelector: '[data-tour="qp-restaurant"]',
    placement: "left",
    title: "Escolha o refeitório",
    description:
      "Confira a fila em tempo real no painel à direita. Toque em Restaurante Central.",
    requiresInteraction: true,
    companions: ["EmployeeCard", "RestaurantQueueBoard"],
  },
  {
    id: "liberacao",
    targetSelector: '[data-tour="qp-access"]',
    placement: "left",
    title: "Catraca liberada",
    description:
      "Acesso em menos de 1 segundo. A refeição é registrada automaticamente.",
    actionLabel: "Continuar",
    companions: ["EmployeeCard", "RestaurantQueueBoard"],
  },
  {
    id: "atualizado",
    targetSelector: '[data-tour="qp-updated"]',
    placement: "left",
    title: "Saldo descontado na hora",
    description:
      "O crachá digital atualiza o saldo. RH vê o consumo agregado no Portal Gestor.",
    actionLabel: "Concluir",
    companions: ["EmployeeCard", "RestaurantQueueBoard"],
  },
];
