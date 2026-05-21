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

// --- Frente de Loja: tours interativos com recomendações inteligentes ---

export const pdvNovoFlow: TourStep[] = [
  {
    id: "tela-principal",
    targetSelector: '[data-tour="pdv-first-product"]',
    placement: "right",
    title: "Adicione um produto",
    description:
      "Toque na Costela no bafo para iniciar o pedido. Tente clicar em outras categorias também — está tudo livre.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "adicionar-bebida",
    targetSelector: '[data-tour="pdv-cart"]',
    placement: "left",
    title: "Carrinho atualiza ao vivo",
    description:
      "Cada item entra na comanda e no cupom térmico ao mesmo tempo. Você pode ajustar quantidade ou remover qualquer item.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "desconto",
    targetSelector: '[data-tour="pdv-discount"]',
    placement: "right",
    title: "Aplique o desconto fidelidade",
    description:
      "Desconto de 10% para clientes do programa de fidelidade — visível na linha do total.",
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
      "Cupom fiscal emitido. Maquininha aprova. Operação sincronizada com Rotina Fiscal automaticamente.",
    actionLabel: "Concluir",
    companions: ["POSCardReader", "OrderTicket"],
  },
];

export const smartPosFlow: TourStep[] = [
  {
    id: "catalogo",
    targetSelector: '[data-tour="smartpos-catalog-item"]',
    placement: "right",
    title: "Selecione uma categoria",
    description:
      "Toque em Pizzas para abrir o catálogo. Você pode explorar qualquer outra categoria também.",
    requiresInteraction: true,
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "quantidade",
    targetSelector: '[data-tour="smartpos-qty"]',
    placement: "top",
    title: "Personalize o pedido",
    description:
      "Adicione queijo, bacon, ajuste o corte e a quantidade. Tudo livre para o atendente — o total recalcula na hora.",
    actionLabel: "Continuar",
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="smartpos-payment-list"]',
    placement: "left",
    title: "Cliente escolhe pagar com cartão",
    description: "Toque em Crédito. O leitor do próprio SmartPOS é ativado.",
    requiresInteraction: true,
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
  {
    id: "cartao",
    targetSelector: '[data-tour="smartpos-tap"]',
    placement: "left",
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
      "Cliente recebe o comprovante por SMS. O painel do operador soma a venda imediatamente.",
    actionLabel: "Concluir",
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
];

export const cardapioDigitalFlow: TourStep[] = [
  {
    id: "categorias",
    targetSelector: '[data-tour="cd-categories"]',
    placement: "bottom",
    title: "Cliente abre no celular",
    description:
      "O cardápio digital roda direto no navegador — sem instalar nada. Toque para entrar no cardápio.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="cd-detail"]',
    placement: "right",
    title: "Personalize o prato",
    description:
      "Foto, descrição e acréscimos. Toque + nos acréscimos e ajuste a quantidade — o total recalcula na hora.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "carrinho",
    targetSelector: '[data-tour="cd-cart"]',
    placement: "right",
    title: "Cliente revisa o pedido",
    description:
      "Itens, quantidades e total dinâmico. Pode adicionar mais, remover, ou enviar para a cozinha.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="cd-confirm"]',
    placement: "bottom",
    title: "Pedido enviado para a cozinha",
    description:
      "Pronto — e lá na cozinha o pedido cai direto no KDS, sem garçom no caminho.",
    actionLabel: "Ver na cozinha",
    companions: ["KitchenDisplay", "SimulatedNotification"],
  },
  {
    id: "em-preparo",
    targetSelector: '[data-tour="cd-kitchen"]',
    placement: "left",
    title: "Status em tempo real",
    description:
      "O cliente acompanha cada etapa no celular. A cozinha trabalha sem interrupção. O garçom só atua se necessário.",
    actionLabel: "Concluir",
    companions: ["KitchenDisplay"],
  },
];

export const quickPassFlow: TourStep[] = [
  {
    id: "evento",
    targetSelector: '[data-tour="qp-catalog"]',
    placement: "right",
    title: "Atendimento rápido em eventos",
    description:
      "QuickPass é o sistema de atendimento rápido da Teknisa — ideal para estádios, shows e festivais. O cliente abre no celular dele e já vê o cardápio da loja mais próxima.",
    actionLabel: "Continuar",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "add-fritas",
    targetSelector: '[data-tour="qp-add-fritas"]',
    placement: "left",
    title: "Adicione itens com 1 toque",
    description:
      "Toque no + de Fritas Rústicas para adicionar ao carrinho. Adicione mais quantos quiser — tudo livre.",
    requiresInteraction: true,
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "cupom",
    targetSelector: '[data-tour="qp-coupon"]',
    placement: "top",
    title: "Aplique um cupom",
    description:
      "Digite FAN10 e toque em Aplicar para ganhar 10% no pedido. Cupons promocionais ativados em tempo real.",
    actionLabel: "Continuar",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="qp-payment-tabs"]',
    placement: "bottom",
    title: "Pague no próprio celular",
    description:
      "Cartão salvo ou Pix — alterne entre as abas e escolha. Sem precisar entrar na fila do caixa.",
    actionLabel: "Continuar",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "retirada",
    targetSelector: '[data-tour="qp-retirada-qr"]',
    placement: "left",
    title: "QR de retirada · pula a fila",
    description:
      "Compra concluída. O cliente apresenta este QR no balcão e retira o pedido. Velocidade, fluidez e integração total com o ecossistema de vendas.",
    actionLabel: "Concluir",
    companions: ["RestaurantQueueBoard"],
  },
];
