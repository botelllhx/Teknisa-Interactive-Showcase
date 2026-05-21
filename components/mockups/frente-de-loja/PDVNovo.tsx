"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Percent,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Printer,
  Trash2,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PDVNovoProps {
  step: number;
}

const PRODUCTS = [
  { id: "costela", name: "Costela no bafo 350g", price: 44.9, code: "PR-0084" },
  { id: "parmegiana", name: "Filé à parmegiana", price: 38.5, code: "PR-0112" },
  { id: "frango", name: "Frango grelhado", price: 32.9, code: "PR-0034" },
  { id: "risoto", name: "Risoto de cogumelos", price: 41.0, code: "PR-0058" },
  { id: "salada", name: "Salada caesar", price: 24.9, code: "PR-0091" },
  { id: "suco", name: "Suco natural laranja", price: 9.9, code: "BB-0011" },
  { id: "refri", name: "Refrigerante 350ml", price: 6.9, code: "BB-0023" },
  { id: "cafe", name: "Café espresso", price: 4.5, code: "BB-0044" },
];

export function PDVNovoMockup({ step }: PDVNovoProps) {
  const cartItems = step >= 1
    ? [
        { name: "Costela no bafo 350g", qty: 2, unit: 44.9, code: "PR-0084" },
      ]
    : [];

  if (step >= 2) {
    cartItems.push({ name: "Suco natural laranja", qty: 1, unit: 9.9, code: "BB-0011" });
  }

  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.unit, 0);
  const discountApplied = step >= 2;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const showPayment = step >= 3;
  const completed = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <Header />

      <main className="grid flex-1 grid-cols-[1fr_280px] gap-2 overflow-hidden p-2">
        <CatalogSection step={step} />
        <CartAside
          items={cartItems}
          subtotal={subtotal}
          discount={discount}
          discountApplied={discountApplied}
          showPayment={showPayment}
          step={step}
        />
      </main>

      <AnimatePresence>
        {completed && <ReceiptOverlay total={subtotal - discount} />}
      </AnimatePresence>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-1.5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
          <span className="font-display text-[10px] font-bold">T</span>
        </div>
        <span className="font-display text-[11px] font-bold text-brand">PDV NOVO</span>
        <span className="text-[10px] text-neutral-300">|</span>
        <span className="text-[10px] text-neutral-500">Caixa 02</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-neutral-500">
        <span className="flex items-center gap-1">
          <User size={10} strokeWidth={2} />
          Maria Santos
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} strokeWidth={2} />
          14:32
        </span>
        <span className="rounded-full bg-success/15 px-2 py-0.5 font-bold uppercase tracking-wider text-success">
          Online
        </span>
      </div>
    </header>
  );
}

function CatalogSection({ step }: { step: number }) {
  return (
    <section className="flex flex-col overflow-hidden">
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-2 py-1 shadow-card">
          <Search size={11} strokeWidth={2} className="text-neutral-400" />
          <span className="text-[10px] text-neutral-400">Buscar produto ou código</span>
        </div>
        <button
          type="button"
          className="rounded-md bg-brand/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand"
        >
          F2 Cardápio
        </button>
      </div>

      <div className="grid flex-1 grid-cols-4 grid-rows-2 gap-1.5">
        {PRODUCTS.map((p, i) => {
          const highlight = step === 0 && i === 0;
          return (
            <motion.button
              key={p.id}
              type="button"
              data-tour={i === 0 ? "pdv-first-product" : undefined}
              animate={highlight ? { scale: [1, 1.02, 1] } : undefined}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "relative flex flex-col justify-between rounded-lg border bg-white p-2 text-left shadow-card",
                highlight ? "border-brand ring-2 ring-brand/30" : "border-neutral-100",
              )}
            >
              <div className="flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-br from-brand-subtle via-brand-ghost to-white">
                <span className="text-[8px] font-bold uppercase tracking-wider text-brand/60">
                  {p.code}
                </span>
              </div>
              <div className="mt-1.5">
                <p className="line-clamp-1 font-display text-[10px] font-bold text-neutral-900">
                  {p.name}
                </p>
                <p className="text-[10px] font-bold text-brand">
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Plus size={9} strokeWidth={3} />
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

interface CartItem {
  name: string;
  qty: number;
  unit: number;
  code: string;
}

interface CartAsideProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountApplied: boolean;
  showPayment: boolean;
  step: number;
}

function CartAside({
  items,
  subtotal,
  discount,
  discountApplied,
  showPayment,
  step,
}: CartAsideProps) {
  return (
    <aside
      data-tour="pdv-cart"
      className="flex flex-col overflow-hidden rounded-lg bg-white shadow-card"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider text-brand">
            Comanda
          </p>
          <p className="font-display text-[11px] font-bold text-neutral-900">
            #A1247 · Mesa 12
          </p>
        </div>
        <button
          type="button"
          className="text-neutral-300"
          aria-label="Limpar comanda"
        >
          <Trash2 size={12} strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <p className="py-4 text-center text-[10px] italic text-neutral-400">
              Toque em um produto para começar
            </p>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="rounded-md border border-neutral-100 bg-surface-raised p-2"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-display text-[10px] font-bold text-neutral-900">
                      {item.name}
                    </p>
                    <p className="text-[8px] text-neutral-400">{item.code}</p>
                  </div>
                  <span className="font-display text-[10px] font-bold tabular-nums text-neutral-900">
                    R$ {(item.qty * item.unit).toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[9px] font-medium text-neutral-700 shadow-card">
                    <button className="text-neutral-400">−</button>
                    <span className="px-1 tabular-nums">{item.qty}x</span>
                    <button className="text-brand">+</button>
                  </div>
                  <span className="text-[8px] text-neutral-400">
                    R$ {item.unit.toFixed(2).replace(".", ",")} un
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-1 border-t border-dashed border-neutral-200 px-3 py-2 text-[10px]">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span className="tabular-nums">
            R$ {subtotal.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <motion.div
          data-tour="pdv-discount"
          animate={
            step === 2 ? { backgroundColor: ["rgba(255,255,255,0)", "rgba(254,243,199,1)", "rgba(255,255,255,0)"] } : undefined
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          className={cn(
            "flex justify-between rounded px-1",
            discountApplied ? "text-success" : "text-neutral-500",
          )}
        >
          <span className="flex items-center gap-1">
            <Percent size={9} strokeWidth={2.5} />
            Desconto fidelidade (10%)
          </span>
          <span className="tabular-nums">
            {discountApplied ? `– R$ ${discount.toFixed(2).replace(".", ",")}` : "—"}
          </span>
        </motion.div>
      </div>

      <div className="flex items-baseline justify-between border-t border-neutral-100 bg-brand-ghost px-3 py-2">
        <span className="font-display text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          Total
        </span>
        <span className="font-display text-[17px] font-bold text-brand tabular-nums">
          R$ {(subtotal - discount).toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div data-tour="pdv-payment" className="grid grid-cols-4 gap-1 border-t border-neutral-100 p-2">
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
                "flex flex-col items-center gap-0.5 rounded-md py-1.5 transition-colors",
                active
                  ? "bg-brand text-white shadow-brand"
                  : "border border-neutral-100 bg-white text-neutral-600",
              )}
            >
              <Icon size={11} strokeWidth={2} />
              <span className="text-[8px] font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ReceiptOverlay({ total }: { total: number }) {
  return (
    <motion.div
      data-tour="pdv-receipt"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur"
    >
      <motion.div
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="flex w-64 flex-col items-center rounded-2xl border-2 border-success/30 bg-white p-5 shadow-frame"
      >
        <motion.div
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-brand"
        >
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </motion.div>
        <p className="mt-3 font-display text-[16px] font-bold text-neutral-900">
          Venda concluída
        </p>
        <p className="text-[10px] text-neutral-500">Pedido #A1247</p>

        <div className="mt-3 w-full rounded-xl bg-surface-raised p-3 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            Total pago
          </p>
          <p className="font-display text-[22px] font-bold text-success tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
          <p className="mt-1 text-[9px] text-neutral-500">PIX · aprovado em 2s</p>
        </div>

        <div className="mt-3 flex w-full items-center justify-between gap-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand/20 bg-white py-2 text-[10px] font-bold text-brand">
            <Printer size={12} strokeWidth={2} />
            Imprimir
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-[10px] font-bold text-white shadow-brand">
            Próximo pedido
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
