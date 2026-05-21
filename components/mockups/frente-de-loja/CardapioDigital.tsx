"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Plus,
  CheckCircle2,
  ChefHat,
  Utensils,
  Sandwich,
  Salad,
  Coffee,
  IceCream,
  Bell,
  Clock,
  Flame,
  Leaf,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CardapioDigitalProps {
  step: number;
}

const CATEGORIES = [
  { Icon: Utensils, label: "Pratos", count: 18 },
  { Icon: Sandwich, label: "Lanches", count: 12 },
  { Icon: Salad, label: "Saladas", count: 9 },
  { Icon: Coffee, label: "Bebidas", count: 24 },
  { Icon: IceCream, label: "Doces", count: 8 },
];

const FEATURED_DISHES = [
  {
    name: "Penne ao molho funghi",
    desc: "Massa fresca, funghi porcini, parmesão e azeite trufado",
    price: 42.0,
    time: "18 min",
    rating: 4.8,
    badge: "Mais pedido",
  },
  {
    name: "Salmão grelhado com purê",
    desc: "Salmão da Noruega, purê de batata baroa, vegetais salteados",
    price: 58.9,
    time: "22 min",
    rating: 4.9,
  },
];

export function CardapioDigitalMockup({ step }: CardapioDigitalProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <Header step={step} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {step === 0 && <CategoriesView />}
        {step === 1 && <DishDetailView />}
        {step === 2 && <CartView />}
        {step === 3 && <ConfirmView />}
        {step >= 4 && <KitchenStatusView />}
      </main>
    </div>
  );
}

function Header({ step }: { step: number }) {
  const cartCount = step >= 2 ? 1 : 0;
  return (
    <header className="flex items-center justify-between bg-white px-5 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-brand">
          <ChefHat size={20} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
            Mesa 12 · Atendimento
          </p>
          <p className="font-display text-[15px] font-bold text-neutral-900">
            Boa noite, Sr. Carlos
          </p>
        </div>
      </div>

      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-subtle text-brand"
      >
        <ShoppingCart size={18} strokeWidth={2} />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand font-display text-[10px] font-bold text-white shadow-brand">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}

function CategoriesView() {
  return (
    <div className="flex flex-1 flex-col px-5 py-4">
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-card">
        <Search size={14} strokeWidth={2} className="text-neutral-400" />
        <span className="text-[12px] text-neutral-400">
          Buscar prato, ingrediente ou bebida…
        </span>
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Categorias
      </p>
      <div data-tour="cd-categories" className="mt-2 grid grid-cols-5 gap-2">
        {CATEGORIES.map(({ Icon, label, count }, i) => (
          <motion.button
            key={label}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.04 * i, duration: 0.3 }}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl py-3 transition-shadow",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            <div className="text-center">
              <p className="font-display text-[11px] font-bold">{label}</p>
              <p
                className={cn(
                  "text-[9px]",
                  i === 0 ? "opacity-80" : "text-neutral-400",
                )}
              >
                {count} itens
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Em destaque hoje
        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[9px] text-warning">
          Chef recomenda
        </span>
      </p>

      <div className="mt-2 space-y-2.5">
        {FEATURED_DISHES.map((dish, i) => (
          <motion.div
            key={dish.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.08 + 0.06 * i, duration: 0.3 }}
            className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card"
          >
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-warning/20 via-warning/5 to-white text-warning">
              <Utensils size={28} strokeWidth={1.5} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-[13px] font-bold text-neutral-900">
                    {dish.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-neutral-500">
                    {dish.desc}
                  </p>
                </div>
                {dish.badge && (
                  <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-warning">
                    {dish.badge}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Clock size={10} strokeWidth={2} />
                    {dish.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={10} strokeWidth={2} className="fill-warning text-warning" />
                    {dish.rating}
                  </span>
                </div>
                <p className="font-display text-[14px] font-bold text-brand">
                  R$ {dish.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DishDetailView() {
  return (
    <motion.div
      data-tour="cd-detail"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-5 py-4"
    >
      <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-warning/30 via-warning/10 to-brand-ghost shadow-card">
        <Utensils size={56} strokeWidth={1.25} className="text-warning/80" />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[20px] font-bold leading-tight text-neutral-900">
            Penne ao molho funghi
          </h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-card"
          >
            <Heart size={14} strokeWidth={2} />
          </button>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">
          Massa fresca com molho de funghi porcini, parmesão envelhecido 24 meses
          e finalização com azeite trufado.
        </p>

        <div className="mt-3 flex items-center gap-4 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock size={11} strokeWidth={2} className="text-brand" />
            18 min
          </span>
          <span className="flex items-center gap-1">
            <Flame size={11} strokeWidth={2} className="text-warning" />
            580 kcal
          </span>
          <span className="flex items-center gap-1">
            <Leaf size={11} strokeWidth={2} className="text-success" />
            Vegetariano
          </span>
          <span className="flex items-center gap-1">
            <Star size={11} strokeWidth={2} className="fill-warning text-warning" />
            4.8 · 247 avaliações
          </span>
        </div>
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Personalize
      </p>
      <div className="mt-2 space-y-1.5">
        {[
          { label: "Parmesão extra", price: 4.0, selected: true },
          { label: "Trufa adicional", price: 8.5, selected: false },
          { label: "Sem cebola", price: 0, selected: false },
          { label: "Sem alho", price: 0, selected: false },
        ].map((add) => (
          <button
            key={add.label}
            type="button"
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[12px]",
              add.selected
                ? "border-brand bg-brand-ghost text-brand"
                : "border-brand/10 bg-white text-neutral-700",
            )}
          >
            <span className="flex items-center gap-2 font-semibold">
              {add.selected ? (
                <CheckCircle2 size={14} strokeWidth={2.5} />
              ) : (
                <Plus size={14} strokeWidth={2} />
              )}
              {add.label}
            </span>
            <span className="font-display font-bold">
              {add.price > 0
                ? `+ R$ ${add.price.toFixed(2).replace(".", ",")}`
                : "Grátis"}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex w-full items-center justify-between rounded-2xl bg-brand p-3.5 text-white shadow-brand"
      >
        <span className="font-display text-[14px] font-bold">Adicionar</span>
        <span className="font-display text-[16px] font-bold tabular-nums">
          R$ 46,00
        </span>
      </button>
    </motion.div>
  );
}

function CartView() {
  return (
    <motion.div
      data-tour="cd-cart"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-5 py-4"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Seu pedido · Mesa 12
        </p>
        <h2 className="font-display text-[18px] font-bold text-neutral-900">
          1 item no carrinho
        </h2>
      </div>

      <div className="mt-3 flex-1 space-y-2.5">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-warning/20 to-white text-warning">
            <Utensils size={22} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-display text-[13px] font-bold text-neutral-900">
              Penne ao molho funghi
            </p>
            <p className="text-[10px] text-neutral-500">
              + Parmesão extra
            </p>
            <div className="mt-1 flex items-center gap-1 rounded-md bg-surface-raised px-2 py-0.5 w-fit text-[10px] font-bold text-neutral-700">
              <button>−</button>
              <span className="px-1.5 tabular-nums">1x</span>
              <button className="text-brand">+</button>
            </div>
          </div>
          <p className="font-display text-[14px] font-bold text-neutral-900 tabular-nums">
            R$ 46,00
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-brand/30 bg-brand-ghost/40 p-3 text-center">
          <p className="text-[11px] font-medium text-brand">
            <Plus size={11} className="mr-1 inline" strokeWidth={2.5} />
            Adicionar bebida ou sobremesa?
          </p>
        </div>
      </div>

      <div className="space-y-1.5 rounded-2xl bg-white p-4 shadow-card">
        <div className="flex justify-between text-[12px] text-neutral-500">
          <span>Subtotal</span>
          <span className="tabular-nums">R$ 46,00</span>
        </div>
        <div className="flex justify-between text-[12px] text-neutral-500">
          <span>Taxa de serviço (10%)</span>
          <span className="tabular-nums">R$ 4,60</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-neutral-200 pt-2">
          <span className="font-display text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Total
          </span>
          <span className="font-display text-[22px] font-bold text-brand tabular-nums">
            R$ 50,60
          </span>
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-[13px] font-bold uppercase tracking-wider text-white shadow-brand"
        >
          Confirmar pedido
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmView() {
  return (
    <motion.div
      data-tour="cd-confirm"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-success/20"
        />
        <CheckCircle2 size={54} strokeWidth={2.25} />
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-5 text-center font-display text-[22px] font-bold text-neutral-900"
      >
        Pedido enviado!
      </motion.h2>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-1 text-center text-[12px] text-neutral-500"
      >
        A cozinha já recebeu seu pedido
      </motion.p>

      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6 rounded-2xl border-2 border-dashed border-success/30 bg-success/5 px-6 py-3 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-success">
          Número do pedido
        </p>
        <p className="font-display text-[26px] font-bold leading-none text-success tabular-nums">
          #C1247
        </p>
        <p className="mt-2 text-[11px] text-neutral-600">
          Mesa 12 · R$ 50,60
        </p>
      </motion.div>
    </motion.div>
  );
}

function KitchenStatusView() {
  return (
    <div className="flex flex-1 flex-col px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
            Pedido #C1247 · Mesa 12
          </p>
          <h2 className="font-display text-[16px] font-bold text-neutral-900">
            Acompanhe seu pedido
          </h2>
        </div>
        <span className="rounded-full bg-warning/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
          Em preparo
        </span>
      </div>

      <div data-tour="cd-kitchen" className="flex-1 rounded-2xl bg-white p-4 shadow-card">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px border-l-2 border-dashed border-neutral-200"
          />
          <div className="space-y-4">
            {[
              {
                Icon: CheckCircle2,
                label: "Pedido recebido",
                time: "Há 4 minutos",
                done: true,
              },
              {
                Icon: ChefHat,
                label: "Em preparo na cozinha",
                time: "Estimado: 18 min",
                active: true,
              },
              {
                Icon: Utensils,
                label: "Pronto para entrega",
                time: "Aguardando",
              },
              {
                Icon: Bell,
                label: "Entregue na mesa",
                time: "Aguardando",
              },
            ].map((item, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <span
                  className={cn(
                    "relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full",
                    item.done && "bg-success text-white shadow-brand",
                    item.active && "bg-brand text-white shadow-brand",
                    !item.done && !item.active && "bg-neutral-100 text-neutral-400",
                  )}
                >
                  <item.Icon size={18} strokeWidth={2} />
                  {item.active && (
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 rounded-full ring-2 ring-brand/40"
                    />
                  )}
                </span>
                <div className="flex-1">
                  <p className="font-display text-[12px] font-bold text-neutral-900">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-neutral-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-ghost px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock size={14} strokeWidth={2.25} className="text-brand" />
          <span className="font-display text-[11px] font-bold text-brand">
            Tempo estimado
          </span>
        </div>
        <span className="font-display text-[16px] font-bold text-brand tabular-nums">
          14 min
        </span>
      </div>
    </div>
  );
}
