"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  ChefHat,
  Utensils,
  Pizza,
  Salad,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CardapioDigitalProps {
  step: number;
}

const CATEGORIES = [
  { Icon: Utensils, label: "Pratos" },
  { Icon: Pizza, label: "Lanches" },
  { Icon: Salad, label: "Saladas" },
  { Icon: Coffee, label: "Bebidas" },
];

const DISHES = [
  { name: "Penne ao molho funghi", price: 42.0, time: "18 min" },
  { name: "Salmão grelhado", price: 58.9, time: "22 min" },
  { name: "Risoto camarão", price: 64.0, time: "25 min" },
];

export function CardapioDigitalMockup({ step }: CardapioDigitalProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-3 py-2 shadow-card">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
            Mesa 12 · Cardápio
          </p>
          <p className="font-display text-[10px] font-bold text-neutral-900">
            Boa noite, Sr. Carlos
          </p>
        </div>
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-brand-subtle text-brand">
          <ShoppingCart size={14} strokeWidth={2} />
          {step >= 2 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-brand text-[7px] font-bold text-white">
              1
            </span>
          )}
        </div>
      </header>

      {step === 0 && <CategoriesView />}
      {step === 1 && <DishDetailView />}
      {step === 2 && <CartView />}
      {step === 3 && <ConfirmView />}
      {step >= 4 && <KitchenStatusView />}
    </div>
  );
}

function CategoriesView() {
  return (
    <div className="flex-1 px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Categorias
      </p>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {CATEGORIES.map(({ Icon, label }, i) => (
          <motion.button
            key={label}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md py-2",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <Icon size={14} strokeWidth={1.75} />
            <span className="text-[8px] font-semibold">{label}</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Em destaque
      </p>
      <div className="mt-1.5 space-y-1.5">
        {DISHES.slice(0, 2).map((dish, i) => (
          <motion.div
            key={dish.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.08 + 0.06 * i }}
            className="flex items-center gap-2 rounded-md bg-white p-2 shadow-card"
          >
            <div className="h-8 w-10 flex-none rounded bg-brand-subtle" />
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-neutral-900">
                {dish.name}
              </p>
              <p className="text-[8px] text-neutral-500">{dish.time}</p>
            </div>
            <span className="text-[9px] font-bold text-brand">
              {brl(dish.price)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DishDetailView() {
  return (
    <div className="flex-1 px-3 py-2">
      <div className="h-20 w-full rounded-md bg-gradient-to-br from-brand-subtle via-brand-ghost to-white" />
      <h3 className="mt-2 font-display text-[12px] font-bold text-neutral-900">
        Penne ao molho funghi
      </h3>
      <p className="text-[8px] text-neutral-500">
        Massa fresca com molho de funghi porcini, parmesão e azeite trufado.
      </p>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Adicionais
      </p>
      <div className="mt-1 space-y-1">
        {[
          { label: "Parmesão extra", price: 4.0 },
          { label: "Sem cebola", price: 0 },
        ].map((add) => (
          <div
            key={add.label}
            className="flex items-center justify-between rounded border border-brand/10 bg-white px-2 py-1"
          >
            <span className="text-[9px] text-neutral-800">{add.label}</span>
            <span className="text-[8px] font-bold text-brand">
              {add.price > 0 ? `+ ${brl(add.price)}` : "Grátis"}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-md bg-brand p-2 text-white shadow-brand"
      >
        <span className="text-[10px] font-bold">Adicionar</span>
        <span className="font-display text-[11px] font-bold">{brl(42.0)}</span>
      </button>
    </div>
  );
}

function CartView() {
  return (
    <div className="flex flex-1 flex-col px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Seu pedido
      </p>
      <div className="mt-2 flex-1 space-y-1.5">
        <div className="flex items-start gap-2 rounded-md bg-white p-2 shadow-card">
          <div className="h-8 w-8 flex-none rounded bg-brand-subtle" />
          <div className="flex-1">
            <p className="text-[9px] font-semibold text-neutral-900">
              Penne ao molho funghi
            </p>
            <p className="text-[8px] text-neutral-500">Parmesão extra</p>
          </div>
          <span className="text-[9px] font-bold tabular-nums">
            {brl(46.0)}
          </span>
        </div>
      </div>
      <div className="border-t border-dashed border-neutral-200 pt-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[9px] text-neutral-500">Total</span>
          <span className="font-display text-[14px] font-bold text-brand">
            {brl(46.0)}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}

function ConfirmView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={26} strokeWidth={2} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Pedido enviado
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Mesa 12 · Pedido #C1247
      </p>
    </motion.div>
  );
}

function KitchenStatusView() {
  return (
    <div className="flex-1 px-3 py-3">
      <div className="rounded-md bg-white p-3 shadow-card">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
          Status do pedido
        </p>
        <div className="mt-2 space-y-2">
          <Status
            Icon={CheckCircle2}
            label="Pedido recebido"
            done
            time="agora"
          />
          <Status
            Icon={ChefHat}
            label="Em preparo na cozinha"
            active
            time="3 min"
          />
          <Status
            Icon={Utensils}
            label="A caminho da mesa"
            time="estimado: 15 min"
          />
        </div>
        <div className="mt-3 flex items-center justify-between rounded bg-brand-ghost px-2 py-1.5">
          <span className="flex items-center gap-1 text-[8px] font-medium text-brand">
            <Clock size={10} strokeWidth={2.25} />
            Tempo estimado
          </span>
          <span className="font-display text-[11px] font-bold text-brand">
            18 min
          </span>
        </div>
      </div>
    </div>
  );
}

function Status({
  Icon,
  label,
  done,
  active,
  time,
}: {
  Icon: typeof CheckCircle2;
  label: string;
  done?: boolean;
  active?: boolean;
  time?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-6 w-6 flex-none items-center justify-center rounded-full",
          done && "bg-success text-white",
          active && "bg-brand text-white shadow-brand",
          !done && !active && "bg-neutral-100 text-neutral-400",
        )}
      >
        <Icon size={11} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold text-neutral-900">{label}</p>
        {time && <p className="text-[7px] text-neutral-500">{time}</p>}
      </div>
      {active && (
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="h-2 w-2 rounded-full bg-brand"
        />
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
