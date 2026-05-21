"use client";

import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Wifi,
  Battery,
  Signal,
  Receipt,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface SmartPOSProps {
  step: number;
}

const PRODUCTS = [
  { name: "Misto quente", price: 12.0, code: "PR-103", category: "Lanche" },
  { name: "Pão na chapa", price: 6.5, code: "PR-104", category: "Lanche" },
  { name: "Suco laranja 400ml", price: 9.5, code: "BB-201", category: "Bebida" },
  { name: "Café com leite", price: 7.0, code: "BB-202", category: "Bebida" },
  { name: "Brigadeiro gourmet", price: 5.5, code: "DC-301", category: "Doce" },
  { name: "Água com gás 500ml", price: 5.0, code: "BB-203", category: "Bebida" },
];

const PAYMENT_METHODS = [
  { Icon: CreditCard, label: "Crédito", sub: "Visa, Master, Elo" },
  { Icon: CreditCard, label: "Débito", sub: "Aprovação imediata" },
  { Icon: QrCode, label: "PIX", sub: "Sem taxa, na hora" },
  { Icon: Banknote, label: "Dinheiro", sub: "Com troco" },
];

export function SmartPOSMockup({ step }: SmartPOSProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <StatusBar />
      <AppHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        {step === 0 && <CatalogView />}
        {step === 1 && <QuantityView />}
        {step === 2 && <PaymentMethodView />}
        {step === 3 && <CardTapView />}
        {step >= 4 && <ApprovedView />}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 py-1.5">
      <span className="font-display text-[11px] font-bold text-neutral-900 tabular-nums">
        14:32
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <Signal size={11} strokeWidth={2.25} />
        <Wifi size={11} strokeWidth={2.25} />
        <span className="text-[10px] font-bold tabular-nums">87%</span>
        <Battery size={13} strokeWidth={2} />
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <div className="border-b border-neutral-100 px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand">
            SmartPOS
          </p>
          <p className="font-display text-[14px] font-bold text-neutral-900">
            Padaria Centro
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-neutral-500">Operador</p>
          <p className="font-display text-[10px] font-bold text-neutral-900">
            Carlos M.
          </p>
        </div>
      </div>
    </div>
  );
}

function CatalogView() {
  return (
    <div className="flex flex-1 flex-col px-4 py-3">
      <div className="flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2">
        <Search size={14} strokeWidth={2} className="text-neutral-400" />
        <span className="text-[12px] text-neutral-400">Buscar ou código</span>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Mais vendidos
      </p>
      <div className="mt-1.5 grid flex-1 grid-cols-2 gap-2">
        {PRODUCTS.map((p, i) => (
          <motion.button
            key={p.code}
            data-tour={i === 0 ? "smartpos-catalog-item" : undefined}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.04 * i, duration: 0.3 }}
            className={cn(
              "flex flex-col items-start rounded-xl border p-2.5 text-left transition-shadow",
              i === 0
                ? "border-brand bg-brand-ghost shadow-card"
                : "border-neutral-100 bg-white",
            )}
          >
            <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-subtle to-brand-ghost text-brand">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                {p.code}
              </span>
            </div>
            <p className="mt-2 line-clamp-1 font-display text-[12px] font-bold text-neutral-900">
              {p.name}
            </p>
            <p className="text-[10px] text-neutral-400">{p.category}</p>
            <p className="mt-0.5 font-display text-[12px] font-bold text-brand">
              R$ {p.price.toFixed(2).replace(".", ",")}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function QuantityView() {
  const qty = 2;
  const unit = 12.0;
  const total = qty * unit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-4 py-3"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
        Produto adicionado
      </p>

      <div className="mt-2 flex items-center gap-3 rounded-2xl bg-brand-ghost p-3">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-white text-brand shadow-card">
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
            PR-103
          </span>
        </div>
        <div className="flex-1">
          <p className="font-display text-[13px] font-bold text-neutral-900">
            Misto quente
          </p>
          <p className="text-[10px] text-neutral-500">Lanche</p>
          <p className="mt-0.5 font-display text-[13px] font-bold text-brand">
            R$ {unit.toFixed(2).replace(".", ",")} cada
          </p>
        </div>
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Quantidade
      </p>
      <div
        data-tour="smartpos-qty"
        className="mt-1.5 flex items-center justify-between rounded-2xl border-2 border-brand bg-white p-3 shadow-brand"
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised text-neutral-600"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <motion.span
          key={qty}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-[28px] font-bold tabular-nums text-neutral-900"
        >
          {qty}
        </motion.span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-brand"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-auto rounded-2xl bg-surface-raised p-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] text-neutral-500">Subtotal</p>
            <p className="font-display text-[20px] font-bold text-brand tabular-nums">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-[11px] font-bold text-white shadow-brand"
          >
            Pagar
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentMethodView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-4 py-3"
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Pagamento · R$ 24,00
        </p>
        <h2 className="mt-0.5 font-display text-[16px] font-bold text-neutral-900">
          Como você quer pagar?
        </h2>
      </div>

      <div data-tour="smartpos-payment-list" className="mt-3 flex-1 space-y-2">
        {PAYMENT_METHODS.map((m, i) => (
          <motion.button
            key={m.label}
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-shadow",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-neutral-100 bg-white text-neutral-700",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 flex-none items-center justify-center rounded-xl",
                i === 0 ? "bg-white/15" : "bg-brand-subtle text-brand",
              )}
            >
              <m.Icon size={18} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="font-display text-[13px] font-bold">{m.label}</p>
              <p
                className={cn(
                  "text-[10px]",
                  i === 0 ? "opacity-80" : "text-neutral-500",
                )}
              >
                {m.sub}
              </p>
            </div>
            <ChevronRight size={14} strokeWidth={2.25} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function CardTapView() {
  return (
    <motion.div
      data-tour="smartpos-tap"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-subtle text-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brand/15"
        />
        <CreditCard size={42} strokeWidth={1.5} />
      </motion.div>

      <p className="mt-6 text-center font-display text-[18px] font-bold text-neutral-900">
        Aproxime o cartão
      </p>
      <p className="mt-1 text-center text-[11px] text-neutral-500">
        Pagamento por aproximação · Crédito
      </p>

      <div className="mt-6 rounded-2xl bg-brand-ghost px-5 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Valor
        </p>
        <p className="font-display text-[28px] font-bold text-brand tabular-nums">
          R$ 24,00
        </p>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[10px] text-neutral-400">
        <Sparkles size={11} strokeWidth={2} />
        Aceita Visa, Master, Elo, Apple Pay, Google Pay
      </p>
    </motion.div>
  );
}

function ApprovedView() {
  return (
    <motion.div
      data-tour="smartpos-approved"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <CheckCircle2 size={56} strokeWidth={2.5} />
      </motion.div>

      <p className="mt-6 text-center font-display text-[20px] font-bold text-neutral-900">
        Aprovado
      </p>
      <p className="mt-1 text-center text-[11px] text-neutral-500">
        Pagamento confirmado em 2 segundos
      </p>

      <div className="mt-5 w-full rounded-2xl border border-success/30 bg-success/5 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-success">
            Crédito · 1× sem juros
          </p>
          <Receipt size={14} strokeWidth={2} className="text-success" />
        </div>
        <p className="mt-1 font-display text-[24px] font-bold text-success tabular-nums">
          R$ 24,00
        </p>
        <p className="text-[10px] text-neutral-500">
          Visa · ****4128 · NSU 871402
        </p>
      </div>

      <div className="mt-4 flex w-full gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand/20 bg-white py-2.5 text-[11px] font-bold text-brand"
        >
          <Receipt size={13} strokeWidth={2} />
          Comprovante
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[11px] font-bold text-white shadow-brand"
        >
          Nova venda
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
