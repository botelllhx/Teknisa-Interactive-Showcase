"use client";

import { motion } from "framer-motion";
import {
  ShoppingBasket,
  Star,
  Truck,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MercadumProps {
  step: number;
}

const ITEMS = [
  { name: "Arroz parboilizado", qty: 80, unit: "kg" },
  { name: "Frango congelado", qty: 120, unit: "kg" },
  { name: "Óleo de soja", qty: 60, unit: "L" },
];

const SUPPLIERS = [
  {
    name: "Distribuidora São Paulo",
    price: 8.92,
    days: 2,
    rating: 4.8,
    best: true,
  },
  { name: "Atacadão Central", price: 9.15, days: 3, rating: 4.5 },
  { name: "Coopcal Direto", price: 8.78, days: 5, rating: 4.2 },
];

export function MercadumMockup({ step }: MercadumProps) {
  const compare = step >= 1;
  const select = step >= 2;
  const order = step >= 3;
  const sent = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <ShoppingBasket size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Mercadum
            </p>
            <p className="text-[8px] text-neutral-500">
              Cotação · Compras Supply
            </p>
          </div>
        </div>
        {sent && (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
            <CheckCircle2 size={9} strokeWidth={2.5} />
            Pedido enviado
          </span>
        )}
      </header>

      <main className="grid flex-1 grid-cols-[1fr_36%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <div className="rounded-md bg-white p-2 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Cotação · CT-2026-0421
              </p>
              <span className="text-[8px] text-neutral-500">3 itens · 8 fornecedores</span>
            </div>
            <ul className="mt-2 space-y-1">
              {ITEMS.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ x: 6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center justify-between rounded bg-surface-raised px-2 py-1"
                >
                  <span className="text-[9px] font-semibold text-neutral-900">
                    {item.name}
                  </span>
                  <span className="text-[8px] font-bold text-brand tabular-nums">
                    {item.qty} {item.unit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {compare && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Comparativo · arroz parboilizado
              </p>
              <div className="mt-2 space-y-1.5">
                {SUPPLIERS.map((s, i) => {
                  const highlight = select && s.best;
                  return (
                    <motion.div
                      key={s.name}
                      initial={{ x: 6, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className={cn(
                        "grid grid-cols-[1fr_60px_50px_60px] items-center gap-1 rounded-md p-2 text-[8px]",
                        highlight
                          ? "border-2 border-brand bg-brand-ghost"
                          : "border border-brand/10 bg-white",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">
                          {s.name}
                        </p>
                        <span className="flex items-center gap-0.5">
                          <Star
                            size={8}
                            strokeWidth={1.5}
                            className="fill-warning text-warning"
                          />
                          <span className="text-[7px] text-neutral-600">
                            {s.rating}
                          </span>
                        </span>
                      </div>
                      <span className="text-center text-[9px] font-bold text-neutral-900 tabular-nums">
                        R$ {s.price.toFixed(2)}
                      </span>
                      <span className="flex items-center justify-center gap-0.5 text-[8px] text-neutral-600">
                        <Truck size={8} strokeWidth={2} />
                        {s.days}d
                      </span>
                      {highlight ? (
                        <span className="flex items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[7px] font-bold text-white shadow-brand">
                          <Sparkles size={8} strokeWidth={2.5} className="mr-0.5" />
                          IA
                        </span>
                      ) : (
                        <span className="text-center text-[7px] text-neutral-400">
                          —
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-2">
          {order ? (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Pedido de compra
              </p>
              <p className="mt-1 text-[9px] text-neutral-500">
                Fornecedor selecionado
              </p>
              <p className="font-display text-[10px] font-bold text-neutral-900">
                Distribuidora São Paulo
              </p>
              <div className="mt-2 space-y-1 border-t border-dashed border-neutral-200 pt-2 text-[8px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Itens</span>
                  <span className="font-semibold tabular-nums">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Volume total</span>
                  <span className="font-semibold tabular-nums">260 unid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Entrega</span>
                  <span className="font-semibold tabular-nums">2 dias</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between border-t border-neutral-100 pt-1">
                  <span className="text-[7px] font-bold uppercase tracking-wider text-neutral-500">
                    Total
                  </span>
                  <span className="font-display text-[12px] font-bold text-brand tabular-nums">
                    R$ 2.318,00
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-1 rounded py-1.5 text-[9px] font-bold",
                  sent
                    ? "bg-success text-white shadow-brand"
                    : "bg-brand text-white shadow-brand",
                )}
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={11} strokeWidth={2.5} />
                    Enviado · 21/05 14:38
                  </>
                ) : (
                  <>
                    <Send size={11} strokeWidth={2} />
                    Enviar ao fornecedor
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <div className="rounded-md border border-dashed border-brand/20 bg-white/50 p-3 text-center text-[8px] text-neutral-500">
              Selecione um fornecedor para gerar pedido
            </div>
          )}

          {select && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-2"
            >
              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-brand">
                <Sparkles size={10} strokeWidth={2.25} />
                Critério aplicado
              </p>
              <p className="mt-1 text-[8px] text-neutral-700">
                Melhor preço com avaliação ≥ 4,5 e entrega ≤ 3 dias
              </p>
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                <Pill label="Preço" />
                <Pill label="Prazo" />
                <Pill label="Avaliação" />
              </div>
            </motion.div>
          )}
        </aside>
      </main>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white px-1.5 py-0.5 text-center text-[7px] font-semibold text-brand shadow-card">
      {label}
    </span>
  );
}
