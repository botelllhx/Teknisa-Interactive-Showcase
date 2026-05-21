import type { FlowStep } from "../solutions";

export const taaFlow: FlowStep[] = [
  {
    id: "boas-vindas",
    label: "Boas-vindas",
    tooltip: "Toque em uma das opções para começar o pedido",
    highlightArea: { x: 18, y: 58, width: 64, height: 18 },
  },
  {
    id: "categoria",
    label: "Categoria",
    tooltip: "Escolha uma categoria do cardápio",
    highlightArea: { x: 8, y: 28, width: 84, height: 20 },
  },
  {
    id: "monta-pedido",
    label: "Monta o pedido",
    tooltip: "Adicione itens e personalize",
    highlightArea: { x: 8, y: 52, width: 56, height: 24 },
    companions: ["OrderTicket"],
  },
  {
    id: "resumo",
    label: "Resumo",
    tooltip: "Confirme os itens e siga para pagamento",
    highlightArea: { x: 14, y: 78, width: 72, height: 14 },
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    label: "Pagamento",
    tooltip: "Pagamento aprovado",
    companions: ["OrderTicket", "SimulatedNotification"],
  },
];

export const pdvNovoFlow: FlowStep[] = [
  {
    id: "tela-principal",
    label: "Pedido aberto",
    tooltip: "Toque em um item do cardápio para adicionar",
    highlightArea: { x: 8, y: 24, width: 84, height: 42 },
  },
  {
    id: "adicionar-item",
    label: "Item adicionado",
    tooltip: "Item adicionado ao pedido",
    highlightArea: { x: 56, y: 30, width: 36, height: 8 },
    companions: ["OrderTicket"],
  },
  {
    id: "desconto",
    label: "Desconto",
    tooltip: "Aplique um desconto promocional",
    highlightArea: { x: 8, y: 70, width: 40, height: 10 },
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    label: "Pagamento",
    tooltip: "Selecione a forma de pagamento",
    highlightArea: { x: 8, y: 82, width: 84, height: 12 },
    companions: ["POSCardReader", "OrderTicket"],
  },
  {
    id: "cupom",
    label: "Cupom emitido",
    companions: ["POSCardReader", "OrderTicket", "SimulatedNotification"],
  },
];

export const smartPosFlow: FlowStep[] = [
  {
    id: "catalogo",
    label: "Catálogo",
    tooltip: "Toque em um produto",
    highlightArea: { x: 6, y: 22, width: 88, height: 50 },
  },
  {
    id: "quantidade",
    label: "Quantidade",
    tooltip: "Ajuste a quantidade desejada",
    highlightArea: { x: 22, y: 56, width: 56, height: 14 },
  },
  {
    id: "pagamento",
    label: "Pagamento",
    tooltip: "Escolha a forma de pagamento",
    highlightArea: { x: 6, y: 70, width: 88, height: 20 },
    companions: ["POSCardReader"],
  },
  {
    id: "cartao",
    label: "Aproxime o cartão",
    tooltip: "Simulação de leitura de cartão",
    companions: ["POSCardReader"],
  },
  {
    id: "aprovado",
    label: "Aprovado",
    companions: ["POSCardReader", "SimulatedNotification"],
  },
];

export const cardapioDigitalFlow: FlowStep[] = [
  {
    id: "categorias",
    label: "Cardápio",
    tooltip: "Selecione uma categoria",
    highlightArea: { x: 6, y: 18, width: 88, height: 22 },
  },
  {
    id: "detalhe",
    label: "Detalhe do item",
    tooltip: "Personalize o item",
    highlightArea: { x: 6, y: 36, width: 88, height: 36 },
  },
  {
    id: "carrinho",
    label: "Carrinho",
    tooltip: "Confira o resumo",
    highlightArea: { x: 6, y: 72, width: 88, height: 16 },
  },
  {
    id: "confirmar",
    label: "Confirmação",
    companions: ["SimulatedNotification"],
  },
  {
    id: "em-preparo",
    label: "Em preparo",
    companions: ["KitchenDisplay", "SimulatedNotification"],
  },
];

export const quickPassFlow: FlowStep[] = [
  {
    id: "login",
    label: "Identificação",
    tooltip: "Toque para autenticar",
    highlightArea: { x: 16, y: 70, width: 68, height: 14 },
  },
  {
    id: "saldo",
    label: "Saldo",
    tooltip: "Confira seu saldo e benefícios",
    highlightArea: { x: 8, y: 30, width: 84, height: 22 },
    companions: ["StockIndicator"],
  },
  {
    id: "selecao",
    label: "Refeitório",
    tooltip: "Escolha o local",
    highlightArea: { x: 8, y: 56, width: 84, height: 24 },
    companions: ["StockIndicator"],
  },
  {
    id: "liberacao",
    label: "Acesso liberado",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "atualizado",
    label: "Saldo atualizado",
    companions: ["StockIndicator"],
  },
];
