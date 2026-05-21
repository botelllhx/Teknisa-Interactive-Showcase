"use client";

import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Banknote,
  Check,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface SmartPOSProps {
  step: number;
}

const PRODUCTS = [
  { name: "Pão na chapa", price: 6.5 },
  { name: "Misto quente", price: 12.0 },
  { name: "Suco de laranja", price: 9.5 },
  { name: "Café com leite", price: 7.0 },
];

export function SmartPOSMockup({ step }: SmartPOSProps) {
  const qty = step >= 1 ? 2 : 1;
  const selectedPrice = 12.0;
  const total = selectedPrice * qty;
  const showCardReader = step >= 3;
  const approved = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
        <span className="font-display text-[9px] font-bold text-brand">
          SmartPOS
        </span>
        <div className="flex items-center gap-1 text-[8px] text-neutral-500">
          <Wifi size={9} strokeWidth={2.25} />
          <span>4G</span>
        </div>
      </header>

      {step === 0 && (
        <div className="flex-1 px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-surface-raised px-2 py-1.5">
            <Search size={10} strokeWidth={2} className="text-neutral-400" />
            <span className="text-[9px] text-neutral-400">Buscar produto</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {PRODUCTS.map((p, i) => (
              <motion.button
                key={p.name}
                data-tour={i === 1 ? "smartpos-catalog-item" : undefined}
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex flex-col items-start rounded-md border p-2 text-left",
                  i === 1 ? "border-brand bg-brand-ghost" : "border-neutral-100 bg-white",
                )}
              >
                <div className="h-6 w-full rounded bg-brand-subtle" />
                <p className="mt-1 line-clamp-1 text-[8px] font-semibold text-neutral-900">
                  {p.name}
                </p>
                <p className="text-[8px] font-bold text-brand">{brl(p.price)}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-1 flex-col px-3 py-3">
          <div className="rounded-md bg-surface-raised p-2">
            <div className="h-8 w-full rounded bg-brand-subtle" />
            <p className="mt-1.5 font-display text-[10px] font-bold text-neutral-900">
              Misto quente
            </p>
            <p className="text-[9px] font-bold text-brand">{brl(12.0)}</p>
          </div>

          <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
            Quantidade
          </p>
          <div data-tour="smartpos-qty" className="mt-1 flex items-center justify-between rounded-md border border-brand/20 bg-white p-2">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-neutral-600"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <motion.span
              key={qty}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-display text-[16px] font-bold text-neutral-900"
            >
              {qty}
            </motion.span>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow-brand"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-auto flex items-baseline justify-between border-t border-dashed border-neutral-200 pt-2">
            <span className="text-[9px] text-neutral-500">Total</span>
            <span className="font-display text-[14px] font-bold text-brand">
              {brl(total)}
            </span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
            Forma de pagamento
          </p>
          <div data-tour="smartpos-payment-list" className="mt-2 space-y-1.5">
            {[
              { Icon: CreditCard, label: "Crédito" },
              { Icon: CreditCard, label: "Débito" },
              { Icon: QrCode, label: "PIX" },
              { Icon: Banknote, label: "Dinheiro" },
            ].map(({ Icon, label }, i) => (
              <motion.button
                key={label}
                initial={{ x: 6, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md p-2 text-left",
                  i === 0
                    ? "bg-brand text-white shadow-brand"
                    : "border border-neutral-100 bg-white text-neutral-700",
                )}
              >
                <Icon size={14} strokeWidth={2} />
                <span className="text-[10px] font-semibold">{label}</span>
              </motion.button>
            ))}
          </div>
          <div className="mt-auto flex items-baseline justify-between border-t border-dashed border-neutral-200 pt-2">
            <span className="text-[9px] text-neutral-500">Total</span>
            <span className="font-display text-[14px] font-bold text-brand">
              {brl(total)}
            </span>
          </div>
        </div>
      )}

      {showCardReader && !approved && (
        <motion.div
          data-tour="smartpos-tap"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-subtle text-brand"
          >
            <CreditCard size={22} strokeWidth={2} />
          </motion.div>
          <p className="font-display text-[10px] font-bold text-neutral-900">
            Aproxime o cartão
          </p>
          <p className="text-[9px] text-neutral-500">
            {brl(total)} · Crédito
          </p>
        </motion.div>
      )}

      {approved && (
        <motion.div
          data-tour="smartpos-approved"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-brand">
            <Check size={28} strokeWidth={3} />
          </div>
          <p className="font-display text-[11px] font-bold text-neutral-900">
            Aprovado
          </p>
          <div className="rounded border border-dashed border-success/40 bg-success/5 px-3 py-1.5 text-center">
            <p className="text-[8px] text-neutral-500">Crédito · 1×</p>
            <p className="font-display text-[12px] font-bold text-success">
              {brl(total)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
