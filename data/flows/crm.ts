import type { TourStep } from "../solutions";
import { brl } from "../../lib/tourState";

const fmtMoney = (v?: number) =>
  typeof v === "number" ? brl(v) : "R$ 0,00";

// ===== CRM Premium ======================================================
// Premium Club: app de fidelidade no celular do cliente. Narrativa do tour:
// cliente abre o app → escolhe parceiro próximo → simula compra → cashback
// é creditado em tempo real com animação → push notification → histórico
// atualizado com a nova entrada destacada.
export const crmPremiumFlow: TourStep[] = [
  {
    id: "saldo",
    targetSelector: '[data-tour="crm-cashback-card"]',
    placement: "right",
    title: (live) =>
      typeof live.crmCashbackTotal === "number"
        ? `${fmtMoney(live.crmCashbackTotal as number)} no Premium Club`
        : "Saldo Premium Club",
    description:
      "O cartão principal do app. Mostra o saldo de cashback acumulado e a oferta destacada do dia. Usável em qualquer parceiro do programa.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "loja",
    targetSelector: '[data-tour="crm-store-kharina"]',
    placement: "right",
    title: "Kharina · 10% de cashback hoje",
    description:
      "O Kharina está com oferta exclusiva. Toque no card para abrir o parceiro e escolher uma promoção.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "promo",
    targetSelector: '[data-tour="crm-promo-pick"]',
    placement: "left",
    title: "Promoção elegível para cashback",
    description:
      "Cada promoção mostra o valor e o quanto vai voltar de cashback. Toque em qualquer item para selecionar e ver na barra inferior.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "checkout",
    targetSelector: '[data-tour="crm-checkout-cta"]',
    placement: "top",
    title: "Simular pagamento",
    description:
      "Toque em Simular pagamento. Abre a folha de confirmação com valor da compra, cashback que será creditado e total.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "confirm",
    targetSelector: '[data-tour="crm-confirm-payment"]',
    placement: "top",
    title: (live) =>
      typeof live.crmLastCashback === "number"
        ? `Confirmar e ganhar ${fmtMoney(live.crmLastCashback as number)}`
        : "Confirmar pagamento",
    description:
      "Toque em Confirmar pagamento. O app processa, anima o cashback entrando no saldo em tempo real e dispara push notification.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "push",
    targetSelector: '[data-tour="crm-push"]',
    placement: "bottom",
    title: "Push notification em tempo real",
    description:
      "O cliente é avisado imediatamente do crédito. A notificação inclui valor, parceiro e validade do cashback.",
    actionLabel: "Ver histórico",
    companions: ["MiniDashboard"],
  },
  {
    id: "historico",
    targetSelector: '[data-tour="crm-history"]',
    placement: "right",
    title: "Histórico com a nova entrada destacada",
    description:
      "A movimentação acabou de entrar no topo da lista, marcada como Nova. Cada linha pode ser tocada para ver o detalhamento completo da operação.",
    actionLabel: "Concluir",
    companions: ["MiniDashboard"],
  },
];
