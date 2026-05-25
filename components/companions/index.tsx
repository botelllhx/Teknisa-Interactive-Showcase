"use client";

import type { CompanionType } from "@/data/solutions";
import { POSCardReader } from "./POSCardReader";
import type { PaymentMethod } from "@/lib/payment";
import { OrderTicket, type OrderItem } from "./OrderTicket";
import { KitchenDisplay } from "./KitchenDisplay";
import { MiniDashboard } from "./MiniDashboard";
import { StockIndicator } from "./StockIndicator";
import { EmployeeCard } from "./EmployeeCard";
import { FiscalBadge } from "./FiscalBadge";
import { OperatorDailyPanel } from "./OperatorDailyPanel";
import { CustomerReceiptPhone } from "./CustomerReceiptPhone";
import { RestaurantQueueBoard } from "./RestaurantQueueBoard";
import { useTourLive } from "@/lib/tourState";

export {
  POSCardReader,
  OrderTicket,
  KitchenDisplay,
  MiniDashboard,
  StockIndicator,
  EmployeeCard,
  FiscalBadge,
  OperatorDailyPanel,
  CustomerReceiptPhone,
  RestaurantQueueBoard,
};

interface CompanionProps {
  type: CompanionType;
  solutionId: string;
  step: number;
  stepLabel?: string;
}

// =====================================================================
// Per-solution data sets
// =====================================================================

const TAA_COMBO_ITEMS: OrderItem[] = [
  { name: "X-Burguer Artesanal", qty: 1, price: 38.9 },
  { name: "Batata Frita Grande", qty: 1, price: 12.9 },
  { name: "Suco de Laranja 400ml", qty: 1, price: 9.9 },
];
const TAA_TOTAL = TAA_COMBO_ITEMS.reduce((s, i) => s + i.qty * i.price, 0);

const PDV_ITEMS_FIRST: OrderItem[] = [
  { name: "Costela no bafo 350g", qty: 2, price: 44.9 },
];
const PDV_ITEMS_SECOND: OrderItem[] = [
  ...PDV_ITEMS_FIRST,
  { name: "Suco natural laranja", qty: 1, price: 9.9 },
];
const PDV_SUBTOTAL = PDV_ITEMS_SECOND.reduce((s, i) => s + i.qty * i.price, 0);
const PDV_DISCOUNT = PDV_SUBTOTAL * 0.1;
const PDV_TOTAL = PDV_SUBTOTAL - PDV_DISCOUNT;

const CD_ORDER_ITEMS: OrderItem[] = [
  { name: "Penne ao molho funghi", qty: 1, price: 42.0 },
  { name: "Parmesão extra", qty: 1, price: 4.0 },
];

export function Companion({ type, solutionId, step, stepLabel }: CompanionProps) {
  const live = useTourLive((s) => s.live);
  const livePaymentMethod = (live.paymentMethod as PaymentMethod | undefined) ?? undefined;
  const liveCartTotal =
    typeof live.cartTotal === "number" && (live.cartTotal as number) > 0
      ? (live.cartTotal as number)
      : undefined;

  // ============================================
  // TAA — Self-service kiosk (commerce white-label demo)
  // ============================================
  if (solutionId === "taa") {
    const storeName =
      (live.skinName as string | undefined) ?? "Restaurante Central";
    if (type === "OrderTicket") {
      const liveItems = (live.cartItems as
        | { name: string; qty: number; price: number }[]
        | undefined) ?? [];
      const items: OrderItem[] =
        liveItems.length > 0
          ? liveItems.map((i) => ({
              name: i.name,
              qty: i.qty,
              price: i.price,
            }))
          : step >= 2
            ? TAA_COMBO_ITEMS
            : [];
      return (
        <OrderTicket
          items={items}
          orderNumber="A1247"
          store={storeName}
          approved={step >= 4}
        />
      );
    }
    if (type === "POSCardReader") {
      if (step < 3) return null;
      const method = livePaymentMethod ?? "pix";
      const brandByMethod =
        method === "credito"
          ? "Crédito Visa"
          : method === "debito"
            ? "Débito Visa"
            : method === "dinheiro"
              ? "Dinheiro"
              : "Pix";
      const installmentsByMethod =
        method === "credito"
          ? "Até 3× sem juros"
          : method === "debito"
            ? "Aprovação na hora"
            : method === "dinheiro"
              ? "Com troco"
              : "Aprovação imediata";
      return (
        <POSCardReader
          status={step >= 4 ? "approved" : "waiting"}
          amount={liveCartTotal ?? TAA_TOTAL}
          method={method}
          brand={brandByMethod}
          installments={installmentsByMethod}
        />
      );
    }
  }

  // ============================================
  // PDV Novo — operator-facing POS terminal
  // ============================================
  if (solutionId === "pdv-novo") {
    if (type === "OrderTicket") {
      const items =
        step >= 2 ? PDV_ITEMS_SECOND : step >= 1 ? PDV_ITEMS_FIRST : [];
      return (
        <OrderTicket
          items={items}
          orderNumber="P3094"
          store="Restaurante Central"
          approved={step >= 4}
        />
      );
    }
    if (type === "POSCardReader") {
      if (step < 3) return null;
      return (
        <POSCardReader
          status={step >= 4 ? "approved" : "waiting"}
          amount={PDV_TOTAL}
          brand="VISA"
          installments="2× sem juros"
        />
      );
    }
  }

  // ============================================
  // SmartPOS — mobile cashier (no separate reader, it IS the reader)
  // ============================================
  if (solutionId === "smart-pos") {
    if (type === "OperatorDailyPanel") {
      // Sales grow as the day progresses across the tour
      const salesAtStep = [1842.5, 1842.5, 1854.5, 1854.5, 1878.5];
      const ordersAtStep = [47, 47, 48, 48, 49];
      return (
        <OperatorDailyPanel
          operatorName="Carlos Mello"
          operatorInitials="CM"
          totalSales={salesAtStep[Math.min(step, 4)]}
          orderCount={ordersAtStep[Math.min(step, 4)]}
        />
      );
    }
    if (type === "CustomerReceiptPhone") {
      return (
        <CustomerReceiptPhone
          amount={24.0}
          brand="VISA"
          delivered={step >= 4}
        />
      );
    }
  }

  // ============================================
  // Cardápio Digital — customer-facing tablet
  // ============================================
  if (solutionId === "cardapio-digital") {
    if (type === "KitchenDisplay") {
      // The kitchen receives the order on step 3+ (Confirm view → Kitchen status)
      const showCustomerOrder = step >= 3;
      return (
        <KitchenDisplay
          highlightId={showCustomerOrder ? "C-219" : undefined}
        />
      );
    }
    if (type === "OrderTicket") {
      const items = step >= 1 ? CD_ORDER_ITEMS : [];
      return (
        <OrderTicket
          items={items}
          orderNumber="C1247"
          store="Restaurante Bella Mesa · Mesa 12"
          approved={step >= 3}
        />
      );
    }
  }

  // ============================================
  // QuickPass — fast-service in events (stadiums, shows, festivals)
  // ============================================
  if (solutionId === "quickpass") {
    if (type === "RestaurantQueueBoard") {
      // Event vendor board — what's available at the venue right now
      const eventVendors = [
        {
          id: "hells",
          name: "Hell's Burgers · Setor B",
          distance: "Aqui mesmo",
          queue: 0,
          eta: "4 min",
          capacity: 45,
          status: "livre" as const,
        },
        {
          id: "pizza",
          name: "Pizza Stop · Setor A",
          distance: "120 m",
          queue: 14,
          eta: "22 min",
          capacity: 88,
          status: "cheio" as const,
        },
        {
          id: "doce",
          name: "Doce&Cia · Praça norte",
          distance: "240 m",
          queue: 5,
          eta: "9 min",
          capacity: 55,
          status: "moderado" as const,
        },
      ];
      // Highlight Hell's Burgers from the start since that's the store being used
      return (
        <RestaurantQueueBoard
          restaurants={eventVendors}
          selectedId="hells"
        />
      );
    }
  }

  // ============================================
  // Fallback per type (used by other solutions until per-solution rules land)
  // ============================================
  const lower = stepLabel?.toLowerCase() ?? "";
  const approvedHint =
    lower.includes("aprovad") ||
    lower.includes("cupom") ||
    lower.includes("enviad");

  // Per-solution MiniDashboard dataset — each solution gets context-relevant
  // KPIs so the same widget never repeats "1.284 / R$ 38,90 / 24" across the
  // whole showcase. Falls through to the generic dataset if not mapped.
  if (type === "MiniDashboard") {
    const datasets: Record<
      string,
      { title: string; metrics: { label: string; value: string; trend: number; sparkline: number[] }[] }
    > = {
      approve: {
        title: "Aprovações",
        metrics: [
          {
            label: "Pendentes hoje",
            value: "23",
            trend: -12.5,
            sparkline: [42, 38, 41, 35, 33, 30, 28, 27, 26, 25, 24, 23],
          },
          {
            label: "Aprovadas mês",
            value: "187",
            trend: 18.2,
            sparkline: [120, 128, 132, 140, 148, 155, 162, 168, 174, 180, 184, 187],
          },
          {
            label: "Tempo médio",
            value: "1h 42min",
            trend: -8.4,
            sparkline: [220, 210, 205, 198, 192, 186, 180, 175, 168, 160, 152, 142],
          },
        ],
      },
      "cardapio-inteligente": {
        title: "Operação semanal",
        metrics: [
          {
            label: "Cardápios publicados",
            value: "32",
            trend: 6.7,
            sparkline: [22, 24, 25, 26, 27, 28, 29, 30, 30, 31, 32, 32],
          },
          {
            label: "Custo médio refeição",
            value: "R$ 9,60",
            trend: -3.2,
            sparkline: [110, 108, 105, 104, 102, 100, 98, 97, 96, 96, 96, 96],
          },
          {
            label: "Pratos populares",
            value: "14",
            trend: 9.1,
            sparkline: [8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 14],
          },
        ],
      },
      mymenu: {
        title: "Refeições do dia",
        metrics: [
          {
            label: "Reservas hoje",
            value: "612",
            trend: 14.6,
            sparkline: [420, 440, 460, 480, 500, 520, 540, 560, 580, 590, 602, 612],
          },
          {
            label: "Avaliação média",
            value: "4,6",
            trend: 2.1,
            sparkline: [42, 43, 44, 44, 44, 45, 45, 45, 46, 46, 46, 46],
          },
          {
            label: "Sem comparecimento",
            value: "4,2%",
            trend: -1.1,
            sparkline: [62, 60, 58, 56, 54, 52, 50, 48, 46, 44, 43, 42],
          },
        ],
      },
      "mesa-operacoes": {
        title: "Unidades em tempo real",
        metrics: [
          {
            label: "Unidades online",
            value: "6 / 6",
            trend: 0,
            sparkline: [55, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
          },
          {
            label: "Absenteísmo",
            value: "8,4%",
            trend: 2.8,
            sparkline: [55, 58, 60, 62, 65, 68, 72, 76, 78, 80, 82, 84],
          },
          {
            label: "Alertas ativos",
            value: "2",
            trend: -33.3,
            sparkline: [9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2],
          },
        ],
      },
      "analise-preditiva": {
        title: "Previsão de turnover",
        metrics: [
          {
            label: "Risco crítico",
            value: "14",
            trend: 21.4,
            sparkline: [6, 7, 7, 8, 9, 10, 11, 12, 12, 13, 14, 14],
          },
          {
            label: "Médio risco",
            value: "26",
            trend: 8.5,
            sparkline: [18, 19, 20, 21, 22, 23, 23, 24, 25, 25, 26, 26],
          },
          {
            label: "Acurácia do modelo",
            value: "91,2%",
            trend: 1.3,
            sparkline: [86, 87, 88, 88, 89, 89, 90, 90, 91, 91, 91, 91],
          },
        ],
      },
      mercadum: {
        title: "Cotações ativas",
        metrics: [
          {
            label: "Cotações abertas",
            value: "47",
            trend: 6.8,
            sparkline: [36, 38, 39, 40, 42, 43, 44, 45, 46, 46, 47, 47],
          },
          {
            label: "Economia do mês",
            value: "R$ 84,2k",
            trend: 22.7,
            sparkline: [42, 48, 54, 60, 64, 68, 72, 75, 78, 80, 82, 84],
          },
          {
            label: "Fornecedores ativos",
            value: "128",
            trend: 4.4,
            sparkline: [110, 112, 115, 117, 120, 122, 124, 125, 126, 127, 128, 128],
          },
        ],
      },
      "app-comercial": {
        title: "Performance comercial",
        metrics: [
          {
            label: "Meta mensal",
            value: "78%",
            trend: 12.4,
            sparkline: [40, 46, 50, 55, 58, 62, 65, 68, 72, 74, 76, 78],
          },
          {
            label: "Pedidos hoje",
            value: "12",
            trend: 33.3,
            sparkline: [4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12, 12],
          },
          {
            label: "Ticket médio",
            value: "R$ 1.847",
            trend: 8.6,
            sparkline: [1500, 1550, 1600, 1640, 1680, 1710, 1740, 1770, 1790, 1810, 1830, 1847],
          },
        ],
      },
      "crm-premium": {
        title: "Premium Club, em tempo real",
        metrics: [
          {
            label: "Cashback creditado",
            value: "R$ 142k",
            trend: 18.7,
            sparkline: [80, 88, 94, 102, 108, 116, 122, 128, 132, 136, 140, 142],
          },
          {
            label: "Clientes ativos",
            value: "8,4k",
            trend: 6.2,
            sparkline: [70, 72, 74, 76, 78, 79, 80, 81, 82, 83, 84, 84],
          },
          {
            label: "Resgates hoje",
            value: "127",
            trend: 11.8,
            sparkline: [85, 90, 95, 100, 104, 108, 112, 116, 120, 122, 125, 127],
          },
        ],
      },
    };
    const ds = datasets[solutionId];
    if (ds) return <MiniDashboard title={ds.title} metrics={ds.metrics} />;
  }

  switch (type) {
    case "POSCardReader":
      return <POSCardReader status={approvedHint ? "approved" : "waiting"} />;
    case "OrderTicket":
      return <OrderTicket approved={approvedHint} />;
    case "KitchenDisplay":
      return <KitchenDisplay />;
    case "MiniDashboard":
      return <MiniDashboard />;
    case "StockIndicator":
      return <StockIndicator />;
    case "EmployeeCard":
      return <EmployeeCard />;
    case "FiscalBadge":
      return <FiscalBadge />;
    case "OperatorDailyPanel":
      return <OperatorDailyPanel />;
    case "CustomerReceiptPhone":
      return <CustomerReceiptPhone delivered={approvedHint} />;
    case "RestaurantQueueBoard":
      return <RestaurantQueueBoard />;
    case "SimulatedNotification":
      return null;
    default:
      return null;
  }
}
