import type { TourStep } from "../solutions";

export const taaFlow: TourStep[] = [
  {
    id: "boas-vindas",
    targetSelector: '[data-tour="taa-welcome-action"]',
    placement: "top",
    title: "Comece o pedido",
    description:
      "Toque em uma das opções para iniciar. Comer aqui ou levar: o totem adapta o fluxo conforme a escolha do cliente.",
    actionLabel: "Toque para começar",
    requiresInteraction: true,
  },
  {
    id: "categoria",
    targetSelector: '[data-tour="taa-categories"]',
    placement: "bottom",
    title: "Categorias bem organizadas",
    description:
      "Pratos, lanches, saladas, bebidas, sobremesas. Atalhos visuais com ícone reduzem o tempo de decisão na fila.",
  },
  {
    id: "monta-pedido",
    targetSelector: '[data-tour="taa-build-list"]',
    placement: "right",
    title: "Monte o pedido em poucos toques",
    description:
      "Itens com foto, preço e botão de adicionar. Personalizações aparecem em um passo só — sem fricção.",
    companions: ["OrderTicket"],
  },
  {
    id: "resumo",
    targetSelector: '[data-tour="taa-summary"]',
    placement: "top",
    title: "Resumo claro antes de pagar",
    description:
      "O cliente revisa, ajusta e confirma. A senha e o tempo estimado aparecem imediatamente após o pagamento.",
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="taa-payment-done"]',
    placement: "top",
    title: "Senha emitida e operação registrada",
    description:
      "Em segundos o cliente sai com a senha. O pedido entra automaticamente na cozinha — sem retrabalho de balcão.",
    companions: ["SimulatedNotification"],
  },
];

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
