import type { TourStep } from "../solutions";
import { brl } from "../../lib/tourState";

// ----- Helpers -----------------------------------------------------------

const fmtMoney = (v?: number) =>
  typeof v === "number" ? brl(v) : "R$ 0,00";

const fmtItemList = (items?: unknown): string => {
  if (!Array.isArray(items) || items.length === 0) return "nada ainda";
  const list = items as { qty: number; name: string }[];
  if (list.length === 1) return `${list[0].qty}× ${list[0].name}`;
  if (list.length === 2)
    return `${list[0].qty}× ${list[0].name} e ${list[1].qty}× ${list[1].name}`;
  return `${list.length} itens (${list.reduce((s, i) => s + i.qty, 0)} unidades)`;
};

// ===== TAA ==============================================================
// O TAA tem dois temas no topo (Restaurante Central e Astrobox) que demonstram
// como o mesmo totem se adapta visualmente ao comércio do cliente. O tour
// menciona isso no primeiro passo sem usar o jargão "white-label".
export const taaFlow: TourStep[] = [
  {
    id: "welcome",
    targetSelector: '[data-tour="taa-eat-here"]',
    placement: "right",
    title: (live) =>
      `Pedido no totem ${live.skinName ?? "Restaurante Central"}`,
    description:
      "No topo dá pra alternar entre Restaurante Central e Astrobox para ver como o mesmo totem ganha a cara de cada comércio. Toque em Comer aqui para começar.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "category",
    targetSelector: '[data-tour="taa-cat-lanches"]',
    placement: "right",
    title: "Navegue pelas categorias",
    description:
      "Sushi, peixes, massas, sobremesas, bebidas. Toque em qualquer categoria para trocar o cardápio. Cada uma tem produtos próprios.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "add-combo",
    targetSelector: '[data-tour="taa-combo-burger"]',
    placement: "left",
    title: (live) =>
      live.selectedItemName
        ? `Adicione ${live.selectedItemName}`
        : "Personalize e adicione",
    description:
      "Cada produto abre com suas próprias opções: ponto da carne, sabores, acompanhamentos. Ajuste e toque em Adicionar ao carrinho.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "pay-pix",
    targetSelector: '[data-tour="taa-pix-button"]',
    placement: "left",
    title: (live) =>
      live.paymentLabel
        ? `Pagar com ${live.paymentLabel}`
        : "Escolha o pagamento",
    description: (live) => {
      const total = fmtMoney(live.cartTotal as number);
      if (live.paymentMethod === "pix") {
        return `Total ${total}. Pix abre o QR no display do caixa para o cliente apontar a câmera do app do banco.`;
      }
      if (live.paymentMethod === "credito" || live.paymentMethod === "debito") {
        return `Total ${total}. ${live.paymentLabel} envia o valor para a maquininha aproximar o cartão.`;
      }
      return `Total ${total}. Escolha Crédito, Débito/Voucher ou Pix. O dispositivo de cobrança ao lado se adapta à opção escolhida.`;
    },
    requiresInteraction: true,
    companions: ["OrderTicket", "POSCardReader"],
  },
  {
    id: "approved",
    targetSelector: '[data-tour="taa-senha-card"]',
    placement: "left",
    title: "Pedido confirmado",
    description: (live) =>
      live.paymentLabel
        ? `${live.paymentLabel} aprovado. Senha emitida e enviada para a cozinha.`
        : "Pagamento aprovado. Senha emitida e enviada para a cozinha.",
    actionLabel: "Concluir",
    companions: ["OrderTicket", "POSCardReader"],
  },
];

// ===== PDV Novo =========================================================
export const pdvNovoFlow: TourStep[] = [
  {
    id: "selecionar-pizza",
    targetSelector: '[data-tour="pdv-first-product"]',
    placement: "right",
    title: "Adicione um produto ao pedido",
    description:
      "Toque na Marguerita para incluir no pedido. Você pode tocar em outras categorias e produtos depois, está tudo livre.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "comanda-ao-vivo",
    targetSelector: '[data-tour="pdv-cart"]',
    placement: "left",
    title: (live) =>
      live.cartCount && (live.cartCount as number) > 0
        ? `Comanda com ${live.cartCount} item${(live.cartCount as number) > 1 ? "s" : ""}`
        : "Comanda atualiza ao vivo",
    description: (live) =>
      live.cartCount && (live.cartCount as number) > 0
        ? `Você tem ${fmtItemList(live.cartItems)} no pedido. Subtotal ${fmtMoney(live.cartSubtotal as number)}. Adicione mais itens se quiser.`
        : "Cada item entra na comanda ao lado e no cupom térmico ao mesmo tempo.",
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "desconto",
    targetSelector: '[data-tour="pdv-discount"]',
    placement: "right",
    title: "Aplique o desconto fidelidade",
    description: (live) =>
      `Desconto de 10% para clientes do programa. Sobre ${fmtMoney(live.cartSubtotal as number)} fica ${fmtMoney(((live.cartSubtotal as number) ?? 0) * 0.9)}.`,
    actionLabel: "Aplicar desconto",
    companions: ["OrderTicket"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="pdv-payment"]',
    placement: "top",
    title: "Escolha a forma de pagamento",
    description:
      "Toque em qualquer opção (Crédito, Débito, PIX ou Dinheiro). Para seguir o roteiro, escolha PIX.",
    requiresInteraction: true,
    companions: ["POSCardReader", "OrderTicket"],
  },
  {
    id: "cupom",
    targetSelector: '[data-tour="pdv-receipt"]',
    placement: "top",
    title: (live) =>
      `Venda de ${fmtMoney(live.cartTotal as number)} concluída`,
    description: (live) =>
      `Cupom fiscal emitido. Maquininha aprova ${live.paymentLabel ?? "o pagamento"}. Operação sincronizada com Rotina Fiscal automaticamente.`,
    actionLabel: "Concluir",
    companions: ["POSCardReader", "OrderTicket"],
  },
];

// ===== SmartPOS =========================================================
export const smartPosFlow: TourStep[] = [
  {
    id: "categoria",
    targetSelector: '[data-tour="smartpos-catalog-item"]',
    placement: "right",
    title: "Selecione uma categoria",
    description:
      "Toque em Pizzas para abrir o produto. Você pode explorar qualquer outra categoria antes de avançar.",
    requiresInteraction: true,
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "personalizar",
    targetSelector: '[data-tour="smartpos-qty"]',
    placement: "top",
    title: (live) =>
      live.selectedItemName
        ? `Personalize a ${live.selectedItemName}`
        : "Personalize o item",
    description: (live) => {
      const addons = (live.selectedAddons as string[]) ?? [];
      if (addons.length === 0) {
        return "Escolha observações, adicionais (queijo, bacon) e ajuste a quantidade. O total recalcula na hora.";
      }
      return `Adicionais escolhidos: ${addons.join(", ")}. Ajuste se quiser e toque em Adicionar.`;
    },
    actionLabel: "Continuar",
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "carrinho",
    targetSelector: '[data-tour="smartpos-payment-list"]',
    placement: "left",
    title: (live) => {
      const count = (live.cartCount as number) ?? 0;
      if (count === 0) return "Carrinho ainda vazio";
      return `Carrinho com ${count} item${count > 1 ? "s" : ""}`;
    },
    description: (live) => {
      const count = (live.cartCount as number) ?? 0;
      if (count === 0)
        return "Volte ao catálogo e adicione produtos para ver o resumo aqui.";
      return `Total: ${fmtMoney(live.cartTotal as number)}. Você pode ajustar quantidades ou remover itens. Quando estiver pronto, toque em Pagar.`;
    },
    actionLabel: "Ir para pagamento",
    companions: ["OperatorDailyPanel"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="smartpos-tap"]',
    placement: "left",
    title: "Forma de pagamento",
    description: (live) =>
      live.paymentLabel
        ? `${live.paymentLabel} selecionado para ${fmtMoney(live.cartTotal as number)}. Pode trocar para outra opção ou seguir.`
        : "Escolha Crédito, Débito, Pix ou Dinheiro. O leitor do próprio SmartPOS é ativado em seguida.",
    actionLabel: "Aprovar pagamento",
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
  {
    id: "aprovado",
    targetSelector: '[data-tour="smartpos-approved"]',
    placement: "left",
    title: "Pagamento aprovado",
    description: (live) =>
      `${fmtMoney(live.cartTotal as number)} via ${live.paymentLabel ?? "cartão"}. Cliente recebe o comprovante por SMS. O painel do operador soma a venda imediatamente.`,
    actionLabel: "Concluir",
    companions: ["OperatorDailyPanel", "CustomerReceiptPhone"],
  },
];

// ===== Cardápio Digital =================================================
export const cardapioDigitalFlow: TourStep[] = [
  {
    id: "abre-cardapio",
    targetSelector: '[data-tour="cd-categories"]',
    placement: "bottom",
    title: "Cliente abre no celular",
    description:
      "O Cardápio Digital roda direto no navegador, sem instalar nada. Toque para abrir o cardápio completo.",
    requiresInteraction: true,
    companions: ["OrderTicket"],
  },
  {
    id: "personaliza",
    targetSelector: '[data-tour="cd-detail"]',
    placement: "right",
    title: (live) =>
      live.selectedItemName
        ? `Personalize a ${live.selectedItemName}`
        : "Personalize o prato",
    description: (live) => {
      const adds = (live.selectedAddons as string[]) ?? [];
      if (adds.length === 0) {
        return "Foto, descrição e acréscimos. Toque + nos acréscimos e ajuste a quantidade. O total recalcula na hora.";
      }
      return `Acréscimos: ${adds.join(", ")}. Quantidade: ${live.dishQty ?? 1}. Toque em Adicionar quando estiver pronto.`;
    },
    actionLabel: "Continuar",
    companions: ["OrderTicket"],
  },
  {
    id: "carrinho",
    targetSelector: '[data-tour="cd-cart"]',
    placement: "right",
    title: (live) => {
      const count = (live.cartCount as number) ?? 0;
      if (count === 0) return "Carrinho do cliente";
      return `Pedido com ${count} item${count > 1 ? "s" : ""}`;
    },
    description: (live) => {
      const count = (live.cartCount as number) ?? 0;
      if (count === 0) return "Adicione itens antes de enviar para a cozinha.";
      return `${fmtItemList(live.cartItems)}. Total: ${fmtMoney(live.cartTotal as number)}. Cliente pode remover, ajustar quantidade ou pedir mais.`;
    },
    actionLabel: "Enviar para cozinha",
    companions: ["OrderTicket"],
  },
  {
    id: "enviado",
    targetSelector: '[data-tour="cd-confirm"]',
    placement: "bottom",
    title: "Pedido foi para a cozinha",
    description:
      "E lá na cozinha o pedido cai direto no KDS, sem garçom no caminho. Veja no painel ao lado.",
    actionLabel: "Ver na cozinha",
    companions: ["KitchenDisplay"],
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

// ===== QuickPass (eventos) ==============================================
export const quickPassFlow: TourStep[] = [
  {
    id: "add-fritas",
    targetSelector: '[data-tour="qp-add-fritas"]',
    placement: "left",
    title: "Adicione um item ao carrinho",
    description: (live) => {
      const count = (live.cartCount as number) ?? 0;
      if (count === 0) {
        return "Toque no + de Fritas Rústicas para adicionar. Você pode adicionar quantos itens quiser do cardápio.";
      }
      return `Você já tem ${count} item${count > 1 ? "s" : ""} no carrinho (${fmtMoney(live.cartTotal as number)}). Adicione mais Fritas Rústicas para seguir o roteiro.`;
    },
    requiresInteraction: true,
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "revisa-cupom",
    targetSelector: '[data-tour="qp-coupon"]',
    placement: "top",
    title: (live) =>
      live.couponApplied
        ? `Cupom ${live.couponCode ?? ""} aplicado`
        : "Toque para aplicar um cupom",
    description: (live) => {
      if (live.couponApplied) {
        return `Subtotal ${fmtMoney(live.cartSubtotal as number)}, desconto ${fmtMoney(live.discountValue as number)}, total ${fmtMoney(live.cartTotal as number)}.`;
      }
      return `Toque em FAN10 (10% off) ou EVENTO20 (20% off) para aplicar o desconto direto. Sem digitar nada.`;
    },
    actionLabel: "Ir para pagamento",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "pagamento",
    targetSelector: '[data-tour="qp-payment-tabs"]',
    placement: "bottom",
    title: (live) =>
      live.paymentMethod === "pix" ? "Pagando com Pix" : "Pagando no cartão",
    description: (live) => {
      const method = live.paymentMethod === "pix" ? "Pix" : "cartão salvo";
      return `Total ${fmtMoney(live.cartTotal as number)} via ${method}. Você pode trocar entre Cartão e Pix nas abas acima.`;
    },
    actionLabel: "Concluir pagamento",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "retirada",
    targetSelector: '[data-tour="qp-retirada-qr"]',
    placement: "left",
    title: "QR de retirada pronto",
    description: (live) => {
      const method = live.paymentMethod === "pix" ? "Pix" : "cartão";
      return `Pagamento de ${fmtMoney(live.cartTotal as number)} via ${method} aprovado. O cliente apresenta este QR no balcão e retira sem fila.`;
    },
    actionLabel: "Concluir",
    companions: ["RestaurantQueueBoard"],
  },
];
