import type { TourStep } from "../solutions";
import { brl } from "../../lib/tourState";

const fmtMoney = (v?: number) =>
  typeof v === "number" ? brl(v) : "R$ 0,00";

// ===== CRM Premium ======================================================
// App de fidelidade Premium Club. Dark theme + amber accent (paleta do
// cliente real). Tour passa por cashback, parceiros e histórico.
export const crmPremiumFlow: TourStep[] = [
  {
    id: "cashback",
    targetSelector: '[data-tour="crm-cashback-card"]',
    placement: "right",
    title: (live) =>
      typeof live.crmCashbackTotal === "number"
        ? `Cashback acumulado de ${fmtMoney(live.crmCashbackTotal as number)}`
        : "Cashback acumulado",
    description:
      "O cartão Premium Club do cliente. Mostra saldo de cashback, parceiro atual e atalho para ofertas. Atualiza em tempo real.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "categorias",
    targetSelector: '[data-tour="crm-categories"]',
    placement: "right",
    title: "Categorias rápidas",
    description:
      "Restaurantes, bares, mercados e tudo. O cliente filtra com um toque, sem digitar nada.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "parceiro",
    targetSelector: '[data-tour="crm-store-card"]',
    placement: "right",
    title: "Toque para abrir o parceiro",
    description:
      "Cada parceiro tem foto, avaliação, distância e o cashback ativo. Toque no card do Kharina para ver as promoções.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "saldo",
    targetSelector: '[data-tour="crm-nav-saldo"]',
    placement: "top",
    title: "Aba Saldo",
    description:
      "Toque em Saldo para abrir o histórico de cashback recebido e utilizado.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "historico",
    targetSelector: '[data-tour="crm-history-item"]',
    placement: "right",
    title: "Detalhamento do cashback",
    description:
      "Toque em uma movimentação para ver o estabelecimento, valor da compra, cashback recebido e validade. Bottom sheet com tudo o que o cliente precisa.",
    actionLabel: "Concluir",
    companions: ["MiniDashboard"],
  },
];
