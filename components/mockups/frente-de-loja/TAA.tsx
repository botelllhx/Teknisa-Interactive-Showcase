"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  QrCode,
  Banknote,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface TAAProps {
  step: number;
}

const CATEGORIES = [
  { id: "pratos", label: "Pratos", Icon: Utensils, count: 12 },
  { id: "lanches", label: "Lanches", Icon: Sandwich, count: 8, target: true },
  { id: "saladas", label: "Saladas", Icon: Salad, count: 6 },
  { id: "sopas", label: "Sopas", Icon: Soup, count: 4 },
  { id: "bebidas", label: "Bebidas", Icon: Coffee, count: 14 },
  { id: "doces", label: "Sobremesas", Icon: IceCream, count: 5 },
];

const COMBO_ITEMS = [
  {
    id: "xburguer",
    name: "X-Burguer Artesanal Combo",
    desc: "Hambúrguer artesanal 180g, batata frita grande, suco de laranja 400ml",
    price: 61.7,
    badge: "Combo do dia",
    target: true,
  },
  {
    id: "chicken",
    name: "Chicken Crispy Combo",
    desc: "Sanduíche de frango empanado, batata rústica, refrigerante",
    price: 54.9,
  },
  {
    id: "veggie",
    name: "Veggie Bowl Combo",
    desc: "Wrap vegetariano, salada quinoa, suco verde 400ml",
    price: 48.5,
  },
];

export function TAAMockup({ step }: TAAProps) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-white via-white to-brand-ghost/40">
      <BrandStripe />
      <SubHeader />
      <div className="flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-3">
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeView key="welcome" />}
          {step === 1 && <CategoryView key="category" />}
          {step === 2 && <ItemListView key="items" />}
          {step === 3 && <SummaryPaymentView key="payment" />}
          {step >= 4 && <PaymentDoneView key="done" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BrandStripe() {
  return (
    <div className="flex items-center justify-center bg-brand px-4 py-2.5">
      <Image
        src="/logo-teknisa-white.svg"
        alt="Teknisa"
        width={96}
        height={18}
        priority
        className="select-none opacity-95"
      />
    </div>
  );
}

function SubHeader() {
  return (
    <div className="flex items-center justify-between border-b border-brand/5 bg-white/80 px-5 py-2 backdrop-blur">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          Sapore — Berrini
        </p>
        <p className="font-display text-[12px] font-bold text-neutral-900">
          Quinta-feira · 21 Mai · 12:14
        </p>
      </div>
      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success">
        Aberto
      </span>
    </div>
  );
}

function WelcomeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-white shadow-brand">
          <ShoppingBag size={42} strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 text-center font-display text-[26px] font-bold leading-tight text-neutral-900">
          Bem-vindo
        </h1>
        <p className="mt-1 text-center text-[13px] text-neutral-500">
          Como você prefere consumir?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2">
        <motion.button
          data-tour="taa-eat-here"
          type="button"
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex flex-col items-center gap-2 rounded-2xl bg-brand px-3 py-5 text-white shadow-brand transition-transform"
        >
          <Utensils size={32} strokeWidth={1.75} />
          <div className="text-center">
            <p className="font-display text-[16px] font-bold leading-none">
              Comer aqui
            </p>
            <p className="mt-1 text-[10px] opacity-85">No salão</p>
          </div>
        </motion.button>
        <button
          type="button"
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-brand/15 bg-white px-3 py-5 text-neutral-800"
        >
          <ShoppingBag size={32} strokeWidth={1.75} />
          <div className="text-center">
            <p className="font-display text-[16px] font-bold leading-none">
              Levar
            </p>
            <p className="mt-1 text-[10px] text-neutral-500">Para viagem</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function CategoryView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col"
    >
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Comer aqui
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          O que você vai querer?
        </h2>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5">
        {CATEGORIES.map((c) => (
          <motion.button
            key={c.id}
            data-tour={c.target ? "taa-cat-lanches" : undefined}
            type="button"
            whileTap={c.target ? { scale: 0.96 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
              "relative flex flex-col items-start justify-between overflow-hidden rounded-2xl p-3.5 text-left transition-shadow",
              c.target
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <c.Icon size={28} strokeWidth={1.5} />
            <div>
              <p className="font-display text-[15px] font-bold">{c.label}</p>
              <p
                className={cn(
                  "text-[10px]",
                  c.target ? "opacity-80" : "text-neutral-500",
                )}
              >
                {c.count} opções
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ItemListView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col"
    >
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Lanches
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          Selecione seu combo
        </h2>
      </div>

      <div className="space-y-2.5">
        {COMBO_ITEMS.map((item) => (
          <div
            key={item.id}
            className={cn(
              "relative flex gap-3 rounded-2xl border bg-white p-3 shadow-card",
              item.target ? "border-brand/40 ring-2 ring-brand/15" : "border-brand/10",
            )}
          >
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-warning/30 via-warning/10 to-white text-warning">
              <Sandwich size={30} strokeWidth={1.5} />
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
                <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">
                  {item.desc}
                </p>
              </div>
              <div className="mt-1 flex items-end justify-between">
                <p className="font-display text-[15px] font-bold text-brand">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </p>
                <motion.button
                  data-tour={item.target ? "taa-combo-burger" : undefined}
                  type="button"
                  whileTap={item.target ? { scale: 0.92 } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-transform",
                    item.target
                      ? "bg-brand text-white shadow-brand"
                      : "border-2 border-brand/30 bg-white text-brand",
                  )}
                  aria-label={`Adicionar ${item.name}`}
                >
                  <Plus size={18} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SummaryPaymentView() {
  const subtotal = 61.7;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col"
    >
      <div className="mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Pagamento
        </p>
        <h2 className="font-display text-[20px] font-bold text-neutral-900">
          Como você quer pagar?
        </h2>
      </div>

      <div className="rounded-2xl border border-brand/10 bg-white p-3 shadow-card">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Total a pagar
          </span>
          <span className="font-display text-[24px] font-bold text-brand tabular-nums">
            R$ {subtotal.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-neutral-500">
          1 combo X-Burguer · Pedido #A1247
        </p>
      </div>

      <div className="mt-3 flex-1 space-y-2">
        <motion.button
          data-tour="taa-pix-button"
          type="button"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex w-full items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-brand"
        >
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/15">
            <QrCode size={22} strokeWidth={2} />
          </span>
          <div className="flex-1 text-left">
            <p className="font-display text-[15px] font-bold">PIX</p>
            <p className="text-[11px] opacity-85">
              Aprovação imediata · Sem taxa
            </p>
          </div>
          <ChevronRight size={18} strokeWidth={2.25} />
        </motion.button>

        {[
          { Icon: CreditCard, label: "Crédito", sub: "Visa, Master, Elo · até 3x" },
          { Icon: CreditCard, label: "Débito", sub: "Aprovação na hora" },
          { Icon: Banknote, label: "Dinheiro", sub: "Com troco" },
        ].map((m) => (
          <button
            key={m.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-brand/10 bg-white p-3 text-neutral-700"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-subtle text-brand">
              <m.Icon size={18} strokeWidth={2} />
            </span>
            <div className="flex-1 text-left">
              <p className="font-display text-[13px] font-bold">{m.label}</p>
              <p className="text-[10px] text-neutral-500">{m.sub}</p>
            </div>
            <ChevronRight size={14} strokeWidth={2.25} className="text-neutral-300" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function PaymentDoneView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <CheckCircle2 size={56} strokeWidth={2} />
      </motion.div>

      <h2 className="mt-5 text-center font-display text-[22px] font-bold text-neutral-900">
        Pedido confirmado
      </h2>
      <p className="mt-1 text-center text-[12px] text-neutral-500">
        Acompanhe sua senha no painel da retirada
      </p>

      <div
        data-tour="taa-senha-card"
        className="mt-5 rounded-2xl border-2 border-dashed border-brand/30 bg-gradient-to-b from-white to-brand-ghost px-8 py-5 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Sua senha
        </p>
        <p className="mt-1 font-display text-[44px] font-bold leading-none text-brand tabular-nums">
          A1247
        </p>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <Clock size={12} strokeWidth={2.25} />
          Tempo estimado ·{" "}
          <span className="font-bold text-neutral-700">8 min</span>
        </p>
      </div>

      <p className="mt-4 text-center font-display text-[13px] font-medium text-neutral-600">
        Bom apetite, cliente Teknisa!
      </p>
    </motion.div>
  );
}
