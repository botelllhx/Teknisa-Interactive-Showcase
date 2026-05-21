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
    title: "Cardápio sempre visível",
    description:
      "Grid de produtos com foto e preço — toque para adicionar. Layout pensado para operação contínua sem confusão.",
    requiresInteraction: true,
    actionLabel: "Toque em um produto",
  },
  {
    id: "adicionar-item",
    targetSelector: '[data-tour="pdv-cart"]',
    placement: "left",
    title: "Carrinho lateral em tempo real",
    description:
      "Cada item adicionado aparece instantaneamente no carrinho com quantidade, preço e total atualizados.",
    companions: ["OrderTicket"],
  },
  {
    id: "desconto",
    targetSelector: '[data-tour="pdv-discount"]',
    placement: "top",
    title: "Descontos e promoções aplicados em um toque",
    description:
      "Promoções automáticas e cupons manuais ficam visíveis na linha do total. Sem ir e voltar entre telas.",
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="pdv-payment"]',
    placement: "top",
    title: "Todas as formas de pagamento",
    description:
      "Crédito, débito, PIX e dinheiro lado a lado. Integração nativa com SmartPOS para finalização sem digitar valor.",
    companions: ["POSCardReader", "OrderTicket"],
  },
  {
    id: "cupom",
    targetSelector: '[data-tour="pdv-receipt"]',
    placement: "top",
    title: "Cupom fiscal emitido em segundos",
    description:
      "Cupom impresso e enviado por e-mail simultaneamente. Operação fiscal integrada ao Rotina Fiscal automaticamente.",
    companions: ["POSCardReader", "OrderTicket", "SimulatedNotification"],
  },
];

export const smartPosFlow: TourStep[] = [
  {
    id: "catalogo",
    targetSelector: '[data-tour="smartpos-catalog-item"]',
    placement: "right",
    title: "Catálogo na palma da mão",
    description:
      "Operador percorre o catálogo direto no SmartPOS. Atende em qualquer ponto da loja sem terminal fixo.",
    requiresInteraction: true,
    actionLabel: "Toque em um item",
  },
  {
    id: "quantidade",
    targetSelector: '[data-tour="smartpos-qty"]',
    placement: "top",
    title: "Ajuste de quantidade rápido",
    description:
      "Stepper grande, contagem instantânea. Pensado para uso com luvas e em movimento.",
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="smartpos-payment-list"]',
    placement: "right",
    title: "Forma de pagamento direto no app",
    description:
      "Tudo integrado: o mesmo dispositivo que tira o pedido recebe o pagamento e emite o comprovante.",
    companions: ["POSCardReader"],
  },
  {
    id: "cartao",
    targetSelector: '[data-tour="smartpos-tap"]',
    placement: "top",
    title: "Aproximação e pagamento",
    description:
      "Cliente aproxima o cartão ou celular. Aprovação em segundos, sem trocar de aparelho.",
    companions: ["POSCardReader"],
  },
  {
    id: "aprovado",
    targetSelector: '[data-tour="smartpos-approved"]',
    placement: "top",
    title: "Aprovado e comprovante enviado",
    description:
      "Comprovante digital por e-mail ou SMS. Zero papel, zero fila.",
    companions: ["POSCardReader", "SimulatedNotification"],
  },
];

export const cardapioDigitalFlow: TourStep[] = [
  {
    id: "categorias",
    targetSelector: '[data-tour="cd-categories"]',
    placement: "bottom",
    title: "Cardápio próprio do cliente",
    description:
      "O cliente navega no próprio celular ou no tablet da mesa. Categorias com foto e tempo médio de preparo.",
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="cd-detail"]',
    placement: "right",
    title: "Detalhe do prato com personalização",
    description:
      "Foto, descrição, adicionais e restrições. O pedido sai do jeito que o cliente quer — sem ruído de comanda manual.",
  },
  {
    id: "carrinho",
    targetSelector: '[data-tour="cd-cart"]',
    placement: "top",
    title: "Carrinho com total dinâmico",
    description:
      "Itens, observações e total. O cliente revisa e confirma sem chamar atendente.",
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="cd-confirm"]',
    placement: "top",
    title: "Pedido enviado direto à cozinha",
    description:
      "O pedido vai imediatamente para o KDS da cozinha — zero erro de digitação, zero pedido perdido.",
    companions: ["SimulatedNotification"],
  },
  {
    id: "em-preparo",
    targetSelector: '[data-tour="cd-kitchen"]',
    placement: "top",
    title: "Status em tempo real para o cliente",
    description:
      "Recebido, em preparo, a caminho — visibilidade total. Cliente para de perguntar 'já saiu?'.",
    companions: ["KitchenDisplay", "SimulatedNotification"],
  },
];

export const quickPassFlow: TourStep[] = [
  {
    id: "login",
    targetSelector: '[data-tour="qp-login"]',
    placement: "bottom",
    title: "Acesso sem cartão físico",
    description:
      "QR Code ou biometria. Funcionário libera entrada e benefícios sem precisar levar nada além do crachá digital.",
  },
  {
    id: "saldo",
    targetSelector: '[data-tour="qp-balance"]',
    placement: "bottom",
    title: "Saldo e benefícios visíveis",
    description:
      "Refeição executiva, café da manhã, créditos. Tudo consolidado em um único cartão digital.",
    companions: ["StockIndicator"],
  },
  {
    id: "selecao",
    targetSelector: '[data-tour="qp-restaurant"]',
    placement: "top",
    title: "Escolha o refeitório",
    description:
      "Distância, fila estimada, capacidade. Funcionário decide informado — refeitório cheio não vira surpresa.",
    companions: ["StockIndicator"],
  },
  {
    id: "liberacao",
    targetSelector: '[data-tour="qp-access"]',
    placement: "top",
    title: "Acesso liberado em < 1 segundo",
    description:
      "Catraca abre, refeição registrada. Sem fila, sem ficha, sem perda de tempo.",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "atualizado",
    targetSelector: '[data-tour="qp-updated"]',
    placement: "top",
    title: "Saldo atualizado em tempo real",
    description:
      "O funcionário sabe exatamente quanto restou. RH e financeiro veem o consumo agregado para gestão de benefícios.",
    companions: ["StockIndicator"],
  },
];
