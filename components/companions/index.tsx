"use client";

import type { CompanionType } from "@/data/solutions";
import { POSCardReader } from "./POSCardReader";
import { OrderTicket, type OrderItem } from "./OrderTicket";
import { KitchenDisplay } from "./KitchenDisplay";
import { MiniDashboard } from "./MiniDashboard";
import { StockIndicator } from "./StockIndicator";
import { EmployeeCard } from "./EmployeeCard";
import { FiscalBadge } from "./FiscalBadge";
import { OperatorDailyPanel } from "./OperatorDailyPanel";
import { CustomerReceiptPhone } from "./CustomerReceiptPhone";
import { RestaurantQueueBoard } from "./RestaurantQueueBoard";

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
  // ============================================
  // TAA — Self-service kiosk fast food
  // ============================================
  if (solutionId === "taa") {
    if (type === "OrderTicket") {
      const items = step >= 2 ? TAA_COMBO_ITEMS : [];
      return (
        <OrderTicket
          items={items}
          orderNumber="A1247"
          store="Sapore — Berrini"
          approved={step >= 4}
        />
      );
    }
    if (type === "POSCardReader") {
      if (step < 3) return null;
      return (
        <POSCardReader
          status={step >= 4 ? "approved" : "waiting"}
          amount={TAA_TOTAL}
          brand="PIX"
          installments="Aprovação imediata"
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
