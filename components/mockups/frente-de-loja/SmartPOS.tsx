"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
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
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface SmartPOSProps {
  step: number;
}

interface Category {
  id: string;
  label: string;
  bg: string;
  text: string;
  border?: string;
}

const CATEGORIES: Category[] = [
  { id: "ref", label: "REFRIGERANTES", bg: "#ef4444", text: "white" },
  { id: "sucos", label: "SUCOS", bg: "#ef4444", text: "white" },
  { id: "combos", label: "COMBOS", bg: "#ef4444", text: "white" },
  {
    id: "pizzas",
    label: "PIZZAS",
    bg: "white",
    text: "#16a34a",
    border: "#16a34a",
  },
  { id: "hamb", label: "HAMBURGUERS", bg: "#16a34a", text: "white" },
  { id: "sobre", label: "SOBREMESAS", bg: "#16a34a", text: "white" },
  { id: "kg", label: "PRODUTOS NO KG", bg: "#16a34a", text: "white" },
  { id: "g9", label: "GRUPO 9", bg: "#7d8aa3", text: "white" },
];

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

const PRODUCT_FOR_CATEGORY: Record<string, ProductOption> = {
  pizzas: { id: "pizza-moda", name: "Pizza A Moda P", price: 32.0 },
  ref: { id: "coca", name: "Coca-Cola Zero LT", price: 7.0 },
  sucos: { id: "suco-laranja", name: "Suco de Laranja Jarra", price: 12.5 },
  combos: { id: "combo-xtudo", name: "Combo X-Tudo + Coca-Zero", price: 36.5 },
  hamb: { id: "hamb-classic", name: "X-Burguer Classic", price: 28.0 },
  sobre: { id: "petit", name: "Petit Gateau", price: 19.0 },
  kg: { id: "buffet", name: "Self-service kg", price: 78.9 },
  g9: { id: "extra", name: "Item Avulso G9", price: 12.0 },
};

const ADDONS: ProductOption[] = [
  { id: "queijo", name: "+ Queijo", price: 4.0 },
  { id: "bacon", name: "+ Bacon", price: 5.0 },
];

const OBS_OPTIONS = ["Corte tradicional", "Corte petiscos (cubinhos)"];

interface CartItem {
  id: string;
  name: string;
  unit: number;
  qty: number;
  addons: string[];
  obs: string;
}

type PaymentMethod = "credito" | "debito" | "pix" | "dinheiro";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  credito: "Crédito",
  debito: "Débito",
  pix: "Pix",
  dinheiro: "Dinheiro",
};

export function SmartPOSMockup({ step }: SmartPOSProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("pizzas");
  const [obs, setObs] = useState<string>(OBS_OPTIONS[0]);
  const [addons, setAddons] = useState<Set<string>>(new Set(["queijo"]));
  const [detailQty, setDetailQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<PaymentMethod>("credito");

  const product = PRODUCT_FOR_CATEGORY[selectedCategory] ?? PRODUCT_FOR_CATEGORY.pizzas;
  const addonsTotal = ADDONS.filter((a) => addons.has(a.id)).reduce(
    (s, a) => s + a.price,
    0,
  );
  const unitPrice = product.price + addonsTotal;
  const detailTotal = unitPrice * detailQty;

  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + i.unit * i.qty, 0),
    [cart],
  );
  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart],
  );

  // Sync to tour state so tooltips can reference real choices
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      selectedItemName: product.name,
      selectedItemPrice: unitPrice,
      cartCount,
      cartTotal,
      cartItems: cart,
      paymentMethod: payment,
      paymentLabel: PAYMENT_LABELS[payment],
      selectedAddons: Array.from(addons),
    });
  }, [
    product.name,
    unitPrice,
    cartCount,
    cartTotal,
    cart,
    payment,
    addons,
    patchLive,
  ]);

  const toggleAddon = (id: string) => {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToCart = () => {
    const id = `${product.id}-${Date.now()}`;
    setCart((prev) => [
      ...prev,
      {
        id,
        name: product.name,
        unit: unitPrice,
        qty: detailQty,
        addons: Array.from(addons),
        obs,
      },
    ]);
    setDetailQty(1);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };
  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#f5f6f8] text-neutral-800 font-ui">
      {step === 0 && (
        <CategoryGrid
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}
      {step === 1 && (
        <ProductDetailView
          product={product}
          obs={obs}
          addons={addons}
          qty={detailQty}
          total={detailTotal}
          onSetObs={setObs}
          onToggleAddon={toggleAddon}
          onSetQty={setDetailQty}
          onAddToCart={addToCart}
        />
      )}
      {step === 2 && (
        <CartView
          items={cart}
          total={cartTotal}
          count={cartCount}
          onUpdate={updateCartQty}
          onRemove={removeCartItem}
        />
      )}
      {step === 3 && (
        <PaymentSelectView
          payment={payment}
          onChange={setPayment}
          total={cartTotal}
        />
      )}
      {step >= 4 && (
        <SuccessScreen
          total={cartTotal}
          paymentLabel={PAYMENT_LABELS[payment]}
        />
      )}
      {step !== 4 && <BottomNav step={step} />}
    </div>
  );
}

function CategoryGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
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
              onClick={() => onSelect(c.id)}
              data-tour={isPizzaTarget ? "smartpos-catalog-item" : undefined}
              className="flex h-16 items-center justify-center rounded-md font-ui text-[12px] font-bold text-center px-2 transition-shadow"
              style={{
                background:
                  active && c.bg === "white" ? "#f0fdf4" : c.bg,
                color: c.text,
                border: c.border
                  ? `2px solid ${c.border}`
                  : active && c.bg !== "white"
                    ? "2px solid white"
                    : "none",
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
        <button className="flex h-11 items-center justify-center gap-1.5 rounded-md bg-white text-brand shadow-card hover:bg-brand-ghost">
          <span className="grid h-3 w-3 grid-cols-2 gap-px">
            <span className="bg-brand" />
            <span className="bg-brand" />
            <span className="bg-brand" />
            <span className="bg-brand" />
          </span>
          <span className="font-ui text-[13px] font-bold">TODOS</span>
        </button>
        <button className="flex h-11 items-center justify-center gap-1.5 rounded-md bg-white text-brand shadow-card hover:bg-brand-ghost">
          <span className="font-ui text-[13px] font-bold">PRÓXIMO</span>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function ProductDetailView({
  product,
  obs,
  addons,
  qty,
  total,
  onSetObs,
  onToggleAddon,
  onSetQty,
  onAddToCart,
}: {
  product: ProductOption;
  obs: string;
  addons: Set<string>;
  qty: number;
  total: number;
  onSetObs: (v: string) => void;
  onToggleAddon: (id: string) => void;
  onSetQty: (v: number) => void;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-11 items-center justify-center bg-brand">
        <p className="font-ui text-[14px] font-bold tracking-wider text-white">
          {product.name.toUpperCase()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-neutral-700">
          Observações
        </p>
        <div data-tour="smartpos-qty" className="mt-1.5 grid grid-cols-2 gap-2">
          {OBS_OPTIONS.map((o) => {
            const active = o === obs;
            return (
              <motion.button
                key={o}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSetObs(o)}
                className={cn(
                  "flex h-12 items-center justify-center rounded-md px-1.5 text-center font-ui text-[11px] font-bold leading-tight transition-colors",
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

        <p className="mt-3 font-ui text-[12px] font-bold uppercase tracking-wider text-neutral-700">
          Adicionais
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {ADDONS.map((a) => {
            const active = addons.has(a.id);
            return (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => onToggleAddon(a.id)}
                className={cn(
                  "flex h-11 items-center justify-center gap-1.5 rounded-md font-ui text-[12px] font-bold transition-colors",
                  active
                    ? "bg-brand text-white shadow-brand"
                    : "border-2 border-brand bg-white text-brand hover:bg-brand-ghost",
                )}
              >
                {a.name}
                <span className="text-[10px] opacity-80">
                  +R${a.price.toFixed(2).replace(".", ",")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-100 bg-white p-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSetQty(Math.max(1, qty - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white"
          >
            <Minus size={13} strokeWidth={2.5} />
          </button>
          <motion.span
            key={qty}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-6 text-center font-ui text-[14px] font-bold"
          >
            {qty}
          </motion.span>
          <button
            type="button"
            onClick={() => onSetQty(qty + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white"
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAddToCart}
          className="flex flex-1 items-center justify-between rounded-md bg-brand px-3 py-2.5 text-white shadow-brand"
        >
          <span className="font-ui text-[12px] font-bold">
            Adicionar ao carrinho
          </span>
          <span className="font-ui text-[14px] font-bold tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function CartView({
  items,
  total,
  count,
  onUpdate,
  onRemove,
}: {
  items: CartItem[];
  total: number;
  count: number;
  onUpdate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      data-tour="smartpos-payment-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-11 items-center justify-center bg-brand">
        <p className="font-ui text-[14px] font-bold tracking-wider text-white">
          CARRINHO
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="py-10 text-center text-[12px] italic text-neutral-400">
            Carrinho vazio. Volte ao catálogo para adicionar.
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
                <p className="font-ui text-[13px] font-bold text-neutral-900">
                  {item.name}
                </p>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-neutral-400 hover:text-danger"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
              <p className="text-[11px] text-neutral-500">
                Unidade: R$ {item.unit.toFixed(2).replace(".", ",")}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-ui text-[16px] font-bold text-neutral-900 tabular-nums">
                  R$ {(item.qty * item.unit).toFixed(2).replace(".", ",")}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdate(item.id, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-light"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="w-7 text-center font-ui text-[13px] font-bold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdate(item.id, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-light"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              {item.obs && (
                <p className="mt-2 text-[11px]">
                  <span className="font-bold text-neutral-900">
                    Observação:
                  </span>{" "}
                  <span className="text-neutral-600">{item.obs}</span>
                </p>
              )}
              {item.addons.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.addons.map((id) => {
                    const a = ADDONS.find((x) => x.id === id);
                    if (!a) return null;
                    return (
                      <span
                        key={id}
                        className="rounded-full border border-brand/15 bg-brand-ghost/50 px-2 py-0.5 text-[10px] font-medium text-brand"
                      >
                        {a.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="border-t border-neutral-200 bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBasket size={30} strokeWidth={1.75} className="text-brand" />
            <motion.span
              key={count}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
            >
              {count}
            </motion.span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium text-brand">Total da compra</p>
            <p className="font-ui text-[18px] font-bold text-brand tabular-nums">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            type="button"
            disabled={count === 0 || total === 0}
            className={cn(
              "rounded-md px-7 py-3 font-ui text-[13px] font-bold text-white shadow-brand transition-colors",
              count === 0 || total === 0
                ? "bg-neutral-300 cursor-not-allowed"
                : "bg-brand hover:bg-brand-light",
            )}
          >
            Pagar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentSelectView({
  payment,
  onChange,
  total,
}: {
  payment: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  total: number;
}) {
  const options: { id: PaymentMethod; label: string; Icon: typeof CreditCard }[] = [
    { id: "credito", label: "Crédito", Icon: CreditCard },
    { id: "debito", label: "Débito", Icon: CreditCard },
    { id: "pix", label: "Pix", Icon: Smartphone },
    { id: "dinheiro", label: "Dinheiro", Icon: Banknote },
  ];
  return (
    <motion.div
      data-tour="smartpos-tap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-11 items-center justify-center bg-brand">
        <p className="font-ui text-[14px] font-bold tracking-wider text-white">
          PAGAMENTO
        </p>
      </div>

      <div className="border-b border-neutral-100 bg-white px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Total a pagar
        </p>
        <p className="font-ui text-[28px] font-bold text-brand tabular-nums leading-tight">
          R$ {total.toFixed(2).replace(".", ",")}
        </p>
        {total === 0 && (
          <p className="mt-1 text-[10px] font-medium text-warning">
            Volte ao catálogo e adicione um item para finalizar.
          </p>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-neutral-700">
          Forma de pagamento
        </p>
        {options.map((o) => {
          const active = o.id === payment;
          return (
            <motion.button
              key={o.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(o.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border-2 px-3 py-3 transition-colors",
                active
                  ? "border-brand bg-brand-ghost"
                  : "border-neutral-200 bg-white hover:border-brand/30",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md",
                  active ? "bg-brand text-white" : "bg-neutral-100 text-neutral-500",
                )}
              >
                <o.Icon size={16} strokeWidth={2.25} />
              </span>
              <span
                className={cn(
                  "flex-1 text-left font-ui text-[13px] font-bold",
                  active ? "text-brand" : "text-neutral-700",
                )}
              >
                {o.label}
              </span>
              {active && (
                <Check size={16} strokeWidth={2.5} className="text-brand" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function SuccessScreen({
  total,
  paymentLabel,
}: {
  total: number;
  paymentLabel: string;
}) {
  return (
    <motion.div
      data-tour="smartpos-approved"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-4 bg-[#16a34a] px-4 text-white"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="flex h-28 w-28 items-center justify-center rounded-full bg-white"
      >
        <Check size={64} strokeWidth={3} className="text-[#16a34a]" />
      </motion.div>
      <div className="text-center">
        <p className="font-ui text-[18px] font-bold">Pagamento aprovado</p>
        <p className="mt-1 text-[12px] opacity-90">{paymentLabel} · 1x sem juros</p>
        <p className="mt-3 font-ui text-[32px] font-bold tabular-nums">
          R$ {total.toFixed(2).replace(".", ",")}
        </p>
      </div>
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
          <span className="font-ui text-[11px] font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
