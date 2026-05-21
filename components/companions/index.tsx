"use client";

import type { CompanionType } from "@/data/solutions";
import { POSCardReader } from "./POSCardReader";
import { OrderTicket, type OrderItem } from "./OrderTicket";
import { KitchenDisplay } from "./KitchenDisplay";
import { MiniDashboard } from "./MiniDashboard";
import { StockIndicator } from "./StockIndicator";
import { EmployeeCard } from "./EmployeeCard";
import { FiscalBadge } from "./FiscalBadge";

export {
  POSCardReader,
  OrderTicket,
  KitchenDisplay,
  MiniDashboard,
  StockIndicator,
  EmployeeCard,
  FiscalBadge,
};

interface CompanionProps {
  type: CompanionType;
  solutionId: string;
  step: number;
  stepLabel?: string;
}

// Per-solution data the companions can read from
const TAA_COMBO_ITEMS: OrderItem[] = [
  { name: "X-Burguer Artesanal", qty: 1, price: 38.9 },
  { name: "Batata Frita Grande", qty: 1, price: 12.9 },
  { name: "Suco de Laranja 400ml", qty: 1, price: 9.9 },
];

const TAA_TOTAL = TAA_COMBO_ITEMS.reduce((s, i) => s + i.qty * i.price, 0);

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
    case "SimulatedNotification":
      // Rendered separately by NotificationStack in the demo
      return null;
    default:
      return null;
  }
}
