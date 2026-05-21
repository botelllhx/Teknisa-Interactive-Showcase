"use client";

import { motion } from "framer-motion";
import {
  Utensils,
  Salad,
  Coffee,
  IceCream,
  ShoppingBag,
  Sandwich,
  Soup,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Hand,
  QrCode,
  Banknote,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface TAAProps {
  step: number;
}

const CATEGORIES = [
  { id: "pratos", label: "Pratos", Icon: Utensils, count: 12 },
  { id: "lanches", label: "Lanches", Icon: Sandwich, count: 8 },
  { id: "saladas", label: "Saladas", Icon: Salad, count: 6 },
  { id: "sopas", label: "Sopas", Icon: Soup, count: 4 },
  { id: "bebidas", label: "Bebidas", Icon: Coffee, count: 14 },
  { id: "doces", label: "Sobremesas", Icon: IceCream, count: 5 },
];

const MENU_ITEMS = [
  {
    name: "Bowl de salmão grelhado",
    desc: "Quinoa, abacate, ovo, missô",
    price: 38.9,
    kcal: 480,
    badge: "Mais pedido",
  },
  {
    name: "Wrap de frango caesar",
    desc: "Frango grelhado, parmesão, croutons",
    price: 24.5,
    kcal: 420,
  },
  {
    name: "Salada quinoa & abacate",
    desc: "Quinoa tricolor, abacate, sementes",
    price: 26.0,
    kcal: 380,
  },
];

export function TAAMockup({ step }: TAAProps) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-white via-white to-brand-ghost/40">
      <SubHeader />
      <div className="flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-3">
        {step === 0 && <WelcomeView />}
        {step === 1 && <CategoryView />}
        {step === 2 && <BuildOrderView />}
        {step === 3 && <SummaryView />}
        {step >= 4 && <PaymentDoneView />}
      </div>
    </div>
  );
}

function SubHeader() {
  return (
    <div className="flex items-center justify-between border-b border-brand/5 bg-white/80 px-5 py-2.5 backdrop-blur">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          Restaurante Central
        </p>
        <p className="font-display text-[13px] font-bold text-neutral-900">
          Quinta-feira · 21 Mai
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-brand/5 px-3 py-1 text-brand">
        <Sparkles size={11} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Self-Service
        </span>
      </div>
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-between py-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-brand text-white shadow-brand"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full ring-2 ring-brand/40"
          />
          <ShoppingBag size={48} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 text-center font-display text-[28px] font-bold leading-tight text-neutral-900"
        >
          Bem-vindo
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-2 text-center text-[14px] text-neutral-500"
        >
          Como você prefere consumir hoje?
        </motion.p>
      </div>

      <div className="w-full" data-tour="taa-welcome-action">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Comer aqui", sub: "No salão", Icon: Utensils, primary: true },
            { label: "Levar", sub: "Para viagem", Icon: ShoppingBag, primary: false },
          ].map((opt, i) => (
            <motion.button
              key={opt.label}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl px-3 py-5 transition-shadow",
                opt.primary
                  ? "bg-brand text-white shadow-brand"
                  : "border-2 border-brand/15 bg-white text-neutral-800",
              )}
            >
              <opt.Icon size={28} strokeWidth={1.75} />
              <div className="text-center">
                <p className="font-display text-[15px] font-bold leading-none">
                  {opt.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    opt.primary ? "opacity-80" : "text-neutral-500",
                  )}
                >
                  {opt.sub}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-neutral-400">
          <Hand size={11} strokeWidth={2.25} />
          Toque para começar
        </p>
      </div>
    </div>
  );
}

function CategoryView() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Etapa 1 de 4 · Categoria
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          O que você vai querer?
        </h2>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5" data-tour="taa-categories">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            className={cn(
              "relative flex flex-col items-start justify-between overflow-hidden rounded-2xl p-3.5 text-left transition-shadow",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <c.Icon size={28} strokeWidth={1.5} />
            <div>
              <p className="font-display text-[14px] font-bold">{c.label}</p>
              <p
                className={cn(
                  "text-[10px]",
                  i === 0 ? "opacity-80" : "text-neutral-500",
                )}
              >
                {c.count} opções
              </p>
            </div>
            {i === 0 && (
              <span className="absolute right-2 top-2 rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                Selecionado
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function BuildOrderView() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Etapa 2 de 4 · Monte seu pedido
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          Pratos disponíveis
        </h2>
      </div>

      <div className="space-y-2.5" data-tour="taa-build-list">
        {MENU_ITEMS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.06 * i, duration: 0.35 }}
            className={cn(
              "relative flex gap-3 rounded-2xl border bg-white p-3 shadow-card",
              i === 0 ? "border-brand/30" : "border-brand/10",
            )}
          >
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-brand-subtle via-brand-ghost to-white text-brand">
              <Salad size={28} strokeWidth={1.5} />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-[13px] font-bold leading-tight text-neutral-900">
                    {item.name}
                  </p>
                  {item.badge && (
                    <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-warning">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-neutral-500">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-[14px] font-bold text-brand">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-[9px] text-neutral-400">{item.kcal} kcal</p>
                </div>
                <button
                  type="button"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full shadow-brand transition-transform",
                    i === 0 ? "bg-brand text-white" : "border-2 border-brand/30 bg-white text-brand",
                  )}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SummaryView() {
  const items = [
    { qty: 1, name: "Bowl de salmão grelhado", price: 38.9 },
    { qty: 1, name: "Suco de laranja 400ml", price: 9.9 },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxa = subtotal * 0.1;
  const total = subtotal + taxa;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Etapa 3 de 4 · Resumo
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          Confira seu pedido
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        data-tour="taa-summary"
        className="flex flex-1 flex-col rounded-2xl border border-brand/10 bg-white p-4 shadow-card"
      >
        <div className="flex-1 space-y-2.5">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-start justify-between border-b border-dashed border-neutral-100 pb-2.5 last:border-0"
            >
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-brand-subtle text-[11px] font-bold text-brand">
                  {item.qty}
                </span>
                <div>
                  <p className="font-display text-[12px] font-semibold text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    R$ {item.price.toFixed(2).replace(".", ",")} cada
                  </p>
                </div>
              </div>
              <span className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
                R$ {(item.qty * item.price).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5 border-t border-dashed border-neutral-200 pt-3 text-[11px]">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="tabular-nums">
              R$ {subtotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Taxa de serviço (10%)</span>
            <span className="tabular-nums">
              R$ {taxa.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-baseline justify-between border-t-2 border-brand/20 pt-3">
          <span className="font-display text-[12px] font-bold uppercase tracking-wider text-neutral-500">
            Total
          </span>
          <span className="font-display text-[24px] font-bold text-brand tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            { Icon: QrCode, label: "PIX" },
            { Icon: CreditCard, label: "Cartão" },
            { Icon: Banknote, label: "Dinheiro" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-lg border border-brand/10 bg-surface-raised p-2"
            >
              <Icon size={14} strokeWidth={2} className="text-brand" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-[13px] font-bold uppercase tracking-wider text-white shadow-brand"
        >
          Confirmar e pagar
        </button>
      </motion.div>
    </div>
  );
}

function PaymentDoneView() {
  return (
    <motion.div
      data-tour="taa-payment-done"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <CheckCircle2 size={56} strokeWidth={2} />
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-6 text-center font-display text-[22px] font-bold text-neutral-900"
      >
        Pedido confirmado
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-1 text-center text-[12px] text-neutral-500"
      >
        Acompanhe sua senha no painel da retirada
      </motion.p>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6 rounded-2xl border-2 border-dashed border-brand/30 bg-gradient-to-b from-white to-brand-ghost px-8 py-5 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Sua senha
        </p>
        <p className="mt-1 font-display text-[44px] font-bold leading-none text-brand tabular-nums">
          A1247
        </p>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <Clock size={12} strokeWidth={2.25} />
          Tempo estimado · <span className="font-bold text-neutral-700">8 min</span>
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-4 text-center font-display text-[13px] font-medium text-neutral-600"
      >
        Bom apetite, cliente Teknisa!
      </motion.p>
    </motion.div>
  );
}
