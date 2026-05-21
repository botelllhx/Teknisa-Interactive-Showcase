"use client";

import type { CompanionType } from "@/data/solutions";
import { POSCardReader } from "./POSCardReader";
import { OrderTicket } from "./OrderTicket";
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
  stepLabel?: string;
}

export function Companion({ type, stepLabel }: CompanionProps) {
  const lower = stepLabel?.toLowerCase() ?? "";
  const approved =
    lower.includes("aprovad") ||
    lower.includes("cupom") ||
    lower.includes("enviad");

  switch (type) {
    case "POSCardReader":
      return <POSCardReader status={approved ? "approved" : "waiting"} />;
    case "OrderTicket":
      return <OrderTicket approved={approved} />;
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
      // SimulatedNotification is rendered separately in NotificationStack
      return null;
    default:
      return null;
  }
}
