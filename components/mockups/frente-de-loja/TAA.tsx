"use client";

import { motion } from "framer-motion";
import {
  Utensils,
  ShoppingBag,
  Coffee,
  Pizza,
  Salad,
  IceCream,
  Check,
  Plus,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface TAAProps {
  step: number;
}

const CATEGORIES = [
  { icon: Utensils, label: "Pratos" },
  { icon: Pizza, label: "Lanches" },
  { icon: Salad, label: "Saladas" },
  { icon: Coffee, label: "Bebidas" },
  { icon: IceCream, label: "Sobremesas" },
];

const ITEMS = [
  { name: "Bowl de salmão grelhado", price: 38.9 },
  { name: "Wrap de frango caesar", price: 24.5 },
  { name: "Salada quinoa", price: 26.0 },
];

export function TAAMockup({ step }: TAAProps) {
  const completed = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-white via-white to-brand-ghost text-neutral-800">
      <div className="px-3 pt-3 pb-2 text-center">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          Teknisa · TAA
        </p>
        <p className="text-[8px] text-neutral-500">Restaurante Central</p>
      </div>

      {step === 0 && <WelcomeStep />}
      {step === 1 && <CategoryStep />}
      {step === 2 && <BuildOrderStep />}
      {step === 3 && <SummaryStep />}
      {completed && <PaymentSuccessStep />}
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <ShoppingBag size={24} strokeWidth={2} />
      </motion.div>
      <h2 className="text-center font-display text-[14px] font-bold leading-tight text-neutral-900">
        Bem-vindo
      </h2>
      <p className="mt-1 text-center text-[9px] text-neutral-500">
        Como você prefere consumir?
      </p>

      <div className="mt-5 grid w-full grid-cols-2 gap-2">
        {[
          { label: "Comer aqui", Icon: UtensilsCrossed },
          { label: "Levar", Icon: ShoppingBasket },
        ].map((opt, i) => (
          <motion.button
            key={opt.label}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md py-3 transition-colors",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <opt.Icon size={18} strokeWidth={1.75} />
            <span className="text-[9px] font-bold">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-6 text-center text-[8px] text-neutral-400">
        Toque para começar
      </p>
    </div>
  );
}

function CategoryStep() {
  return (
    <div className="flex-1 px-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Categorias
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {CATEGORIES.map(({ icon: Icon, label }, i) => (
          <motion.button
            key={label}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md p-2 transition-colors",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span className="text-[9px] font-semibold">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function BuildOrderStep() {
  return (
    <div className="flex-1 px-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Monte seu pedido
      </p>
      <div className="mt-2 space-y-1.5">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.08 * i }}
            className="flex items-center gap-2 rounded-md bg-white p-2 shadow-card"
          >
            <div className="h-7 w-7 flex-none rounded bg-brand-subtle" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-neutral-900">
                {item.name}
              </p>
              <p className="text-[8px] font-bold text-brand">
                {brl(item.price)}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                "flex h-6 w-6 flex-none items-center justify-center rounded-full",
                i === 0
                  ? "bg-brand text-white shadow-brand"
                  : "border border-brand/30 text-brand",
              )}
            >
              <Plus size={12} strokeWidth={3} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SummaryStep() {
  const items = [{ name: "Bowl de salmão grelhado", price: 38.9, qty: 1 }];
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="flex flex-1 flex-col px-3">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Resumo do pedido
      </p>
      <div className="mt-2 flex-1 rounded-md bg-white p-2 shadow-card">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between border-b border-dashed border-neutral-200 pb-1.5 last:border-0"
          >
            <div>
              <p className="text-[9px] font-semibold text-neutral-900">
                {item.name}
              </p>
              <p className="text-[8px] text-neutral-500">
                {item.qty} × {brl(item.price)}
              </p>
            </div>
            <span className="text-[9px] font-bold tabular-nums">
              {brl(item.price * item.qty)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
            Total
          </span>
          <span className="font-display text-[14px] font-bold text-brand">
            {brl(total)}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="mt-2 rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold uppercase tracking-wider text-white shadow-brand"
      >
        Confirmar e pagar
      </button>
    </div>
  );
}

function PaymentSuccessStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <Check size={28} strokeWidth={3} />
      </motion.div>
      <p className="mt-3 text-center font-display text-[12px] font-bold text-neutral-900">
        Pedido confirmado
      </p>
      <p className="mt-1 text-center text-[9px] text-neutral-500">
        Senha #A1247
      </p>
      <div className="mt-3 rounded-md border border-dashed border-brand/30 bg-brand-ghost px-3 py-2 text-center">
        <p className="text-[8px] text-neutral-500">Aguarde sua senha em</p>
        <p className="font-display text-[14px] font-bold text-brand">~ 8 min</p>
      </div>
    </motion.div>
  );
}

function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
