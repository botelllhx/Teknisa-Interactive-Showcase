"use client";

import { motion } from "framer-motion";
import { Check, Percent, CreditCard, Banknote, QrCode, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface PDVNovoProps {
  step: number;
}

const PRODUCTS = [
  { name: "Almoço Executivo", price: 32.9 },
  { name: "Filé à Parmegiana", price: 38.5 },
  { name: "Risoto Funghi", price: 41.0 },
  { name: "Salada Caesar", price: 24.9 },
  { name: "Suco Natural", price: 9.5 },
  { name: "Refrigerante 350ml", price: 6.9 },
  { name: "Sobremesa do dia", price: 8.0 },
  { name: "Café espresso", price: 4.5 },
];

export function PDVNovoMockup({ step }: PDVNovoProps) {
  const cartHasItem = step >= 1;
  const discountApplied = step >= 2;
  const showPayment = step >= 3;
  const completed = step >= 4;

  const subtotal = 32.9;
  const discount = discountApplied ? 3.29 : 0;
  const total = subtotal - discount;

  return (
    <div className="flex h-full w-full bg-surface-raised text-neutral-800">
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
            <span className="font-display text-[10px] font-bold">T</span>
          </div>
          <span className="font-display text-[10px] font-bold text-brand">PDV NOVO</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-neutral-500">
          <span>Caixa 02</span>
          <span>·</span>
          <span>Operador: Ana</span>
        </div>
      </header>

      <main className="mt-9 grid w-full grid-cols-[1fr_38%] gap-2 p-3">
        <section className="flex flex-col gap-2">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
            Cardápio do dia
          </p>
          <div className="grid flex-1 grid-cols-4 gap-1.5">
            {PRODUCTS.map((p, i) => {
              const isFirst = i === 0;
              const highlight = step === 1 && isFirst;
              return (
                <motion.button
                  key={p.name}
                  type="button"
                  animate={highlight ? { scale: [1, 1.03, 1] } : undefined}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className={cn(
                    "relative flex flex-col justify-between rounded-md bg-white p-1.5 text-left shadow-card",
                    highlight && "ring-2 ring-brand",
                  )}
                >
                  <div className="h-6 rounded bg-brand-subtle" />
                  <div className="mt-1">
                    <p className="line-clamp-1 text-[8px] font-semibold text-neutral-800">
                      {p.name}
                    </p>
                    <p className="text-[8px] font-bold text-brand">
                      {brl(p.price)}
                    </p>
                  </div>
                  {cartHasItem && isFirst && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white shadow-brand"
                    >
                      1
                    </motion.span>
                  )}
                  <span className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Plus size={8} strokeWidth={3} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col rounded-md bg-white p-2 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-display text-[9px] font-bold uppercase text-brand">
              Pedido #A1247
            </p>
            <span className="text-[8px] text-neutral-500">12:34</span>
          </div>

          <div className="mt-1.5 min-h-[60px] flex-1 space-y-1 border-t border-dashed border-neutral-200 pt-1.5">
            {cartHasItem ? (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start justify-between gap-1"
              >
                <div>
                  <p className="text-[8px] font-semibold text-neutral-800">
                    Almoço Executivo
                  </p>
                  <p className="text-[7px] text-neutral-500">1 × {brl(32.9)}</p>
                </div>
                <span className="text-[8px] font-bold tabular-nums text-neutral-900">
                  {brl(32.9)}
                </span>
              </motion.div>
            ) : (
              <p className="text-[8px] italic text-neutral-400">
                Nenhum item adicionado
              </p>
            )}
          </div>

          <div className="mt-1.5 space-y-0.5 border-t border-dashed border-neutral-200 pt-1.5 text-[8px]">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="tabular-nums">{brl(subtotal)}</span>
            </div>
            <motion.div
              animate={
                step === 2 ? { backgroundColor: ["#fff0", "#fef3c7", "#fff0"] } : undefined
              }
              transition={{ duration: 1.2, repeat: Infinity }}
              className={cn(
                "flex justify-between rounded px-1",
                discountApplied ? "text-success" : "text-neutral-500",
              )}
            >
              <span className="flex items-center gap-1">
                <Percent size={8} strokeWidth={2.5} />
                Desconto 10%
              </span>
              <span className="tabular-nums">
                {discountApplied ? `- ${brl(discount)}` : brl(0)}
              </span>
            </motion.div>
          </div>

          <div className="mt-1 flex items-baseline justify-between border-t border-neutral-200 pt-1.5">
            <span className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
              Total
            </span>
            <span className="font-display text-[14px] font-bold text-brand">
              {brl(total)}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1">
            {[
              { Icon: CreditCard, label: "Crédito" },
              { Icon: CreditCard, label: "Débito" },
              { Icon: QrCode, label: "PIX" },
              { Icon: Banknote, label: "Cash" },
            ].map(({ Icon, label }, i) => {
              const active = showPayment && i === 2;
              return (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded p-1 transition-colors",
                    active
                      ? "bg-brand text-white shadow-brand"
                      : "bg-surface-raised text-neutral-600",
                  )}
                >
                  <Icon size={10} strokeWidth={2} />
                  <span className="text-[7px] font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/95 backdrop-blur"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white shadow-brand">
            <Check size={24} strokeWidth={3} />
          </div>
          <p className="font-display text-[12px] font-bold text-neutral-900">
            Cupom emitido
          </p>
          <p className="text-[9px] text-neutral-500">
            Pedido #A1247 · {brl(total)}
          </p>
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
