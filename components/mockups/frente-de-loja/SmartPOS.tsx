"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  Home,
  ShoppingBasket,
  DollarSign,
  Settings,
  Plus,
  Minus,
  Trash2,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface SmartPOSProps {
  step: number;
}

const CATEGORIES = [
  { id: "ref", label: "REFRIGERANTES", bg: "#ef4444", text: "white" },
  { id: "sucos", label: "SUCOS", bg: "#ef4444", text: "white" },
  { id: "combos", label: "COMBOS", bg: "#ef4444", text: "white" },
  { id: "pizzas", label: "PIZZAS", bg: "white", text: "#16a34a", border: "#16a34a" },
  { id: "hamb", label: "HAMBURGUERS", bg: "#16a34a", text: "white" },
  { id: "sobre", label: "SOBREMESAS", bg: "#16a34a", text: "white" },
  { id: "kg", label: "PRODUTOS NO KG", bg: "#16a34a", text: "white" },
  { id: "g9", label: "GRUPO 9", bg: "#7d8aa3", text: "white" },
];

const OBS_OPTIONS = ["CORTE TRADICIONAL", "CORTE PETISCOS (CUBINHOS)"];
const ADD_OPTIONS = [
  { id: "queijo", label: "+ QUEIJO", price: 4.0 },
  { id: "bacon", label: "+ BACON", price: 5.0 },
];

export function SmartPOSMockup({ step }: SmartPOSProps) {
  return (
    <div className="flex h-full w-full flex-col bg-[#f5f6f8] text-neutral-800">
      {step === 0 && <CategoryGrid />}
      {step === 1 && <ProductDetailView />}
      {step === 2 && <CartView />}
      {step === 3 && <PaymentTapView />}
      {step >= 4 && <SuccessScreen />}
      {step !== 4 && <BottomNav step={step} />}
    </div>
  );
}

function CategoryGrid() {
  const [selected, setSelected] = useState<string>("pizzas");

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-3">
      <div className="grid flex-1 grid-cols-2 gap-2 content-start">
        {CATEGORIES.map((c) => {
          const active = c.id === selected;
          const isPizzaTarget = c.id === "pizzas";
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(c.id)}
              data-tour={isPizzaTarget ? "smartpos-catalog-item" : undefined}
              className="flex h-14 items-center justify-center rounded-md font-display text-[12px] font-bold text-center px-2 transition-shadow"
              style={{
                background: active && c.bg === "white" ? "#f0fdf4" : c.bg,
                color: c.text,
                border: c.border ? `2px solid ${c.border}` : active && c.bg !== "white" ? "2px solid white" : "none",
                boxShadow: active
                  ? "0 4px 12px rgba(0,0,0,0.10), inset 0 0 0 2px rgba(255,255,255,0.2)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {c.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-white text-brand shadow-card hover:bg-brand-ghost">
          <span className="grid h-3 w-3 grid-cols-2 gap-px">
            <span className="bg-brand" />
            <span className="bg-brand" />
            <span className="bg-brand" />
            <span className="bg-brand" />
          </span>
          <span className="font-display text-[12px] font-bold">TODOS</span>
        </button>
        <button className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-white text-brand shadow-card hover:bg-brand-ghost">
          <span className="font-display text-[12px] font-bold">PRÓXIMO</span>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function ProductDetailView() {
  const [obs, setObs] = useState<string>(OBS_OPTIONS[0]);
  const [addons, setAddons] = useState<Set<string>>(new Set(["queijo"]));
  const [retirar, setRetirar] = useState<Set<string>>(new Set());
  const [qty, setQty] = useState(1);

  const toggleAddon = (id: string) => {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleRetirar = (l: string) => {
    setRetirar((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  };

  const base = 32.0;
  const addonTotal = ADD_OPTIONS.filter((a) => addons.has(a.id)).reduce(
    (s, a) => s + a.price,
    0,
  );
  const total = (base + addonTotal) * qty;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-10 items-center justify-center bg-brand">
        <p className="font-display text-[13px] font-bold tracking-wider text-white">
          PIZZA A MODA P
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Observações
        </p>
        <div data-tour="smartpos-qty" className="mt-1.5 grid grid-cols-2 gap-2">
          {OBS_OPTIONS.map((o) => {
            const active = o === obs;
            return (
              <motion.button
                key={o}
                whileTap={{ scale: 0.96 }}
                onClick={() => setObs(o)}
                className={cn(
                  "flex h-12 items-center justify-center rounded-md px-1.5 text-center font-display text-[10px] font-bold leading-tight transition-colors",
                  active
                    ? "bg-brand text-white shadow-brand"
                    : "border-2 border-brand bg-white text-brand hover:bg-brand-ghost",
                )}
              >
                {o}
              </motion.button>
            );
          })}
        </div>

        <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Adicionais
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {ADD_OPTIONS.map((a) => {
            const active = addons.has(a.id);
            return (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleAddon(a.id)}
                className={cn(
                  "flex h-10 items-center justify-center gap-1.5 rounded-md font-display text-[11px] font-bold transition-colors",
                  active
                    ? "bg-brand text-white shadow-brand"
                    : "border-2 border-brand bg-white text-brand hover:bg-brand-ghost",
                )}
              >
                {a.label}
                <span className="text-[9px] opacity-80">
                  +R${a.price.toFixed(2).replace(".", ",")}
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Personalização
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {["RETIRAR 1", "RETIRAR 2", "RETIRAR 3"].map((l) => {
            const active = retirar.has(l);
            return (
              <motion.button
                key={l}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleRetirar(l)}
                className={cn(
                  "flex h-10 items-center justify-center rounded-md font-display text-[11px] font-bold transition-colors",
                  active
                    ? "bg-brand text-white shadow-brand"
                    : "bg-[#9aa3b3] text-white hover:bg-[#7d8aa3]",
                )}
              >
                {l}
              </motion.button>
            );
          })}
        </div>

        <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Observação
        </p>
        <input
          type="text"
          placeholder="Digite aqui a observação"
          className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-neutral-700"
        />
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-100 bg-white p-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white"
          >
            <Minus size={12} strokeWidth={2.5} />
          </button>
          <motion.span
            key={qty}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-5 text-center font-display text-[12px] font-bold"
          >
            {qty}
          </motion.span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white"
          >
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </div>
        <button
          type="button"
          className="flex flex-1 items-center justify-between rounded-md bg-brand px-3 py-2 text-white shadow-brand"
        >
          <span className="font-display text-[11px] font-bold">
            Adicionar ao carrinho
          </span>
          <span className="font-display text-[12px] font-bold tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

interface CartItem {
  id: string;
  name: string;
  unit: number;
  qty: number;
  obs?: string;
  extras?: string[];
}

const INITIAL_CART: CartItem[] = [
  {
    id: "suco",
    name: "Suco de laranja Jarra UN",
    unit: 6.5,
    qty: 1,
    extras: ["+ Açúcar", "+ Gelo"],
  },
  {
    id: "combo",
    name: "Combo X-Tudo + Fritas G + Coca-Zero 2L",
    unit: 36.5,
    qty: 2,
    extras: ["+ Bacon", "Mal Passado"],
    obs: "Carne Vegetariana",
  },
];

function CartView() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const totalAmount = items.reduce((s, i) => s + i.unit * i.qty, 0);

  return (
    <motion.div
      data-tour="smartpos-payment-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-10 items-center justify-center bg-brand">
        <p className="font-display text-[13px] font-bold tracking-wider text-white">
          CARRINHO
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="py-8 text-center text-[11px] italic text-neutral-400">
            Carrinho vazio
          </p>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ x: 8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-white p-3 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-[12px] font-bold text-neutral-900">
                  {item.name}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-neutral-400 hover:text-danger"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
              <p className="text-[10px] text-neutral-500">
                Unidade: R$ {item.unit.toFixed(2).replace(".", ",")}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-display text-[16px] font-bold text-neutral-900 tabular-nums">
                  R$ {(item.qty * item.unit).toFixed(2).replace(".", ",")}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-light"
                  >
                    <Minus size={11} strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center font-display text-[12px] font-bold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-light"
                  >
                    <Plus size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              {item.obs && (
                <p className="mt-2 text-[10px]">
                  <span className="font-bold text-neutral-900">Observação:</span>{" "}
                  <span className="text-neutral-600">{item.obs}</span>
                </p>
              )}
              {item.extras && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.extras.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-brand/15 bg-brand-ghost/50 px-2 py-0.5 text-[9px] font-medium text-brand"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div
        data-tour="smartpos-tap"
        className="border-t border-neutral-200 bg-white p-3"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBasket
              size={28}
              strokeWidth={1.75}
              className="text-brand"
            />
            <motion.span
              key={totalCount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white"
            >
              {totalCount}
            </motion.span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium text-brand">
              Total da compra:
            </p>
            <p className="font-display text-[14px] font-bold text-brand tabular-nums">
              R$ {totalAmount.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-brand px-6 py-2.5 font-display text-[12px] font-bold text-white shadow-brand hover:bg-brand-light"
          >
            Pagar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentTapView() {
  return (
    <motion.div
      data-tour="smartpos-tap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <Image
        src="/logo-teknisa.svg"
        alt="Teknisa"
        width={100}
        height={19}
        className="select-none"
      />
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        RETAIL POS
      </p>

      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="mt-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
      >
        <DollarSign size={48} strokeWidth={2} />
      </motion.div>
      <p className="mt-5 text-center font-display text-[16px] font-bold text-brand">
        Processando pagamento
      </p>
      <p className="mt-1 text-center text-[11px] text-neutral-500">
        VISA ****4128 · R$ 79,50
      </p>
    </motion.div>
  );
}

function SuccessScreen() {
  return (
    <motion.div
      data-tour="smartpos-approved"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full items-center justify-center bg-[#16a34a]"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="flex h-32 w-32 items-center justify-center rounded-full bg-white"
      >
        <Check size={80} strokeWidth={3} className="text-[#16a34a]" />
      </motion.div>
    </motion.div>
  );
}

function BottomNav({ step }: { step: number }) {
  const items = [
    { Icon: Home, label: "Início", active: step === 0 },
    { Icon: ShoppingBasket, label: "Carrinho", active: step === 2 },
    { Icon: DollarSign, label: "Pagamento", active: step === 3 },
    { Icon: Settings, label: "Opções", active: false },
  ];
  return (
    <nav className="flex items-center justify-around border-t border-neutral-100 bg-white py-2">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={cn(
            "flex flex-col items-center gap-0.5",
            item.active ? "text-brand" : "text-neutral-400",
          )}
        >
          <item.Icon
            size={20}
            strokeWidth={item.active ? 2.5 : 2}
            fill={item.active && item.label !== "Início" ? "currentColor" : "none"}
          />
          <span className="font-display text-[10px] font-semibold">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
