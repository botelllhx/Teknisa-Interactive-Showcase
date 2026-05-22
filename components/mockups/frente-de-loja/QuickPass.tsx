"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Lock,
  ChevronLeft as Back,
  ChevronRight as Fwd,
  Share,
  BookOpen as Library,
  Copy,
  CheckCircle2,
  Type as Aa,
  Search,
  MapPin,
  Tag,
  CreditCard,
  Smartphone,
  Clock,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface QuickPassProps {
  step: number;
}

interface Coupon {
  code: string;
  label: string;
  pct: number;
}

const COUPONS: Coupon[] = [
  { code: "FAN10", label: "Fã clube", pct: 0.1 },
  { code: "EVENTO20", label: "Promo do dia", pct: 0.2 },
];

// QuickPass = fast-service web app for events / stadiums.
// 4 views, 4 tour steps:
//   step 0  catalog       (add items from vendor's menu)
//   step 1  cart          (review + apply coupon)
//   step 2  payment       (choose method)
//   step 3+ confirmation  (QR retirada)

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag?: string;
  gradient: string;
}

const PRODUCTS: Product[] = [
  {
    id: "burger-classic",
    name: "Hell's Classic Burger",
    desc: "Blend 180g, cheddar, picles e molho da casa",
    price: 32.0,
    tag: "Mais vendido",
    gradient: "linear-gradient(135deg, #d97706 0%, #c2410c 50%, #7c2d12 100%)",
  },
  {
    id: "burger-bacon",
    name: "Bacon Maravilha",
    desc: "Blend duplo, bacon crocante, cheddar fundido",
    price: 38.0,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 60%, #78350f 100%)",
  },
  {
    id: "coca",
    name: "Coca-Cola Zero 350ml",
    desc: "Lata gelada",
    price: 7.0,
    gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 60%, #7f1d1d 100%)",
  },
  {
    id: "fritas",
    name: "Fritas Rústicas G",
    desc: "Porção grande, cheddar e bacon",
    price: 22.0,
    gradient: "linear-gradient(135deg, #fbbf24 0%, #ca8a04 60%, #854d0e 100%)",
  },
];

const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export function QuickPassMockup({ step }: QuickPassProps) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix">("cartao");

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce(
        (s, [id, qty]) => s + (PRODUCT_BY_ID[id]?.price ?? 0) * qty,
        0,
      ),
    [cart],
  );
  const discount = appliedCoupon ? subtotal * appliedCoupon.pct : 0;
  const total = subtotal - discount;
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  // Push live selections into the tour state so tooltips can reference them.
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const items = Object.entries(cart).map(([id, qty]) => ({
      id,
      qty,
      name: PRODUCT_BY_ID[id]?.name ?? id,
      price: PRODUCT_BY_ID[id]?.price ?? 0,
    }));
    const lastName = items[items.length - 1]?.name;
    patchLive({
      cartItems: items,
      cartCount,
      cartTotal: total,
      cartSubtotal: subtotal,
      discountValue: discount,
      couponApplied: appliedCoupon !== null,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      selectedItemName: lastName,
    });
  }, [
    cart,
    cartCount,
    total,
    subtotal,
    discount,
    appliedCoupon,
    paymentMethod,
    patchLive,
  ]);

  const addItem = (id: string, qty = 1) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }));
  };
  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const nextQty = (next[id] ?? 0) + delta;
      if (nextQty <= 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };
  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800 font-ui">
      <StatusBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <CatalogView key="catalog" cart={cart} onAdd={addItem} />
          )}
          {step === 1 && (
            <CartView
              key="cart"
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              total={total}
              appliedCoupon={appliedCoupon}
              onUpdateQty={updateQty}
              onRemove={removeItem}
              onApplyCoupon={setAppliedCoupon}
            />
          )}
          {step === 2 && (
            <PaymentView
              key="payment"
              method={paymentMethod}
              total={total}
              onChangeMethod={setPaymentMethod}
            />
          )}
          {step >= 3 && (
            <SuccessView
              key="success"
              total={total}
              method={paymentMethod}
              cartItems={Object.entries(cart).map(([id, qty]) => ({
                id,
                qty,
                name: PRODUCT_BY_ID[id]?.name ?? id,
              }))}
            />
          )}
        </AnimatePresence>
      </main>
      <SafariBottomBar />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-1.5 pb-1">
      <span className="font-ui text-[13px] font-bold text-neutral-900 tabular-nums">
        21:08
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <span className="text-[11px] font-bold tracking-wide">5G</span>
        <span className="text-[11px] tabular-nums">82%</span>
      </div>
    </div>
  );
}

function AppHeader({
  showBack = false,
  title,
}: {
  showBack?: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {showBack && (
          <button className="text-brand">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}
        <Image
          src="/logo-teknisa.svg"
          alt="Teknisa"
          width={50}
          height={10}
          className="select-none"
        />
      </div>
      {title ? (
        <span className="font-ui text-[14px] font-bold text-brand">{title}</span>
      ) : (
        <div className="flex items-center gap-1">
          <span className="font-ui text-[12px] font-bold italic text-red-700">
            HELL&apos;S
          </span>
          <span className="font-ui text-[12px] font-bold tracking-wider text-neutral-900">
            BURGERS
          </span>
        </div>
      )}
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-ghost px-2 py-0.5 text-[10px] font-bold text-brand">
        <Zap size={10} strokeWidth={2.5} />
        QuickPass
      </span>
    </div>
  );
}

function VenueBanner() {
  return (
    <div className="px-3 pt-3">
      <div
        className="relative overflow-hidden rounded-xl p-3.5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/75">
              Hoje · show ao vivo
            </p>
            <p className="mt-0.5 font-ui text-[16px] font-bold leading-tight">
              Hell&apos;s Burgers
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/90">
              <MapPin size={11} strokeWidth={2.25} />
              Allianz Parque · setor B · loja 12
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            <Clock size={10} strokeWidth={2.5} />
            Pronto em 4 min
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-2 backdrop-blur">
          <Zap size={13} strokeWidth={2.5} className="text-yellow-300" />
          <p className="text-[11px] leading-snug">
            <span className="font-bold">Pule a fila.</span> Peça aqui, pague no
            celular e retire com QR.
          </p>
        </div>
      </div>
    </div>
  );
}

function CatalogView({
  cart,
  onAdd,
}: {
  cart: Record<string, number>;
  onAdd: (id: string, qty?: number) => void;
}) {
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader />
      <div className="flex-1 overflow-y-auto pb-2">
        <VenueBanner />

        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
          <Search size={14} strokeWidth={2.25} className="text-neutral-400" />
          <input
            disabled
            placeholder="Buscar lanches, bebidas..."
            className="flex-1 bg-transparent text-[12px] text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>

        <div className="mx-3 mt-3 flex items-center justify-between">
          <h2 className="font-ui text-[14px] font-bold text-brand">
            Cardápio do evento
          </h2>
          <span className="text-[11px] font-medium text-neutral-500">
            {PRODUCTS.length} itens
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2.5 px-3" data-tour="qp-catalog">
          {PRODUCTS.map((p) => {
            const inCart = cart[p.id] ?? 0;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onAdd(p.id)}
                data-tour={p.id === "fritas" ? "qp-add-fritas" : undefined}
                className="group relative overflow-hidden rounded-xl bg-white text-left shadow-card transition-shadow hover:shadow-card-hover"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div
                  className="relative h-24 w-full"
                  style={{ background: p.gradient }}
                >
                  {p.tag && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-brand">
                      {p.tag}
                    </span>
                  )}
                  {inCart > 0 && (
                    <motion.span
                      key={inCart}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="absolute right-1.5 top-1.5 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-brand shadow"
                    >
                      ×{inCart}
                    </motion.span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="font-ui text-[12px] font-bold leading-snug text-neutral-900 line-clamp-1">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-neutral-500 line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-ui text-[13px] font-bold text-brand tabular-nums">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
                      <Plus size={13} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="border-t border-neutral-100 bg-white px-3 py-2"
          >
            <div className="flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-white shadow-brand">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <ShoppingBag size={15} strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <p className="font-ui text-[12px] font-bold leading-tight">
                  {cartCount} {cartCount === 1 ? "item" : "itens"} no carrinho
                </p>
                <p className="text-[10px] text-white/80">
                  Toque em revisar para continuar
                </p>
              </div>
              <span className="font-ui text-[12px] font-bold tabular-nums">
                Ver →
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CartView({
  cart,
  subtotal,
  discount,
  total,
  appliedCoupon,
  onUpdateQty,
  onRemove,
  onApplyCoupon,
}: {
  cart: Record<string, number>;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onApplyCoupon: (c: Coupon | null) => void;
}) {
  const entries = Object.entries(cart);

  return (
    <motion.div
      data-tour="qp-cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader showBack title="Meu carrinho" />

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-neutral-100 bg-brand-ghost px-3 py-2 text-[11px] text-brand">
          <span className="font-bold">Hell&apos;s Burgers</span> · Allianz
          Parque · setor B
        </div>

        <div className="space-y-2 px-3 py-2">
          {entries.length === 0 && (
            <p className="py-8 text-center text-[13px] text-neutral-500">
              Seu carrinho está vazio.
            </p>
          )}
          {entries.map(([id, qty]) => {
            const p = PRODUCT_BY_ID[id];
            if (!p) return null;
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex items-start gap-2.5 rounded-lg border border-neutral-100 bg-white p-2.5"
              >
                <div
                  className="h-14 w-14 flex-none rounded-md"
                  style={{ background: p.gradient }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-[12px] font-bold text-neutral-900 leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-neutral-500 leading-snug">
                    {p.desc}
                  </p>
                  <p className="mt-1 font-ui text-[13px] font-bold text-brand tabular-nums">
                    R$ {(p.price * qty).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="text-neutral-400 hover:text-danger"
                  >
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                  <div className="flex items-center gap-1 rounded-md border border-neutral-200 px-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(id, -1)}
                      className="flex h-7 w-7 items-center justify-center text-neutral-500"
                    >
                      <Minus size={12} strokeWidth={2.25} />
                    </button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-5 text-center font-ui text-[12px] font-bold text-neutral-900 tabular-nums"
                    >
                      {qty}
                    </motion.span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(id, 1)}
                      className="flex h-7 w-7 items-center justify-center text-brand"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          data-tour="qp-coupon"
          className="mx-3 mt-2 rounded-lg border border-dashed border-brand/30 bg-brand-ghost p-2.5"
        >
          <div className="flex items-center justify-between gap-1.5 text-[11px] font-bold text-brand">
            <span className="flex items-center gap-1.5">
              <Tag size={12} strokeWidth={2.25} />
              CUPONS DISPONÍVEIS
            </span>
            {appliedCoupon && (
              <button
                type="button"
                onClick={() => onApplyCoupon(null)}
                className="text-[10px] font-medium text-neutral-500 underline hover:text-brand"
              >
                Remover
              </button>
            )}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {COUPONS.map((c) => {
              const active = appliedCoupon?.code === c.code;
              return (
                <motion.button
                  key={c.code}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onApplyCoupon(active ? null : c)}
                  className={cn(
                    "flex flex-col items-start rounded-md border-2 px-2.5 py-2 text-left transition-all",
                    active
                      ? "border-success bg-success/10"
                      : "border-neutral-200 bg-white hover:border-brand/40",
                  )}
                >
                  <span className="flex w-full items-center justify-between">
                    <span
                      className={cn(
                        "font-ui text-[12px] font-bold tracking-wider tabular-nums",
                        active ? "text-success" : "text-brand",
                      )}
                    >
                      {c.code}
                    </span>
                    {active && (
                      <CheckCircle2
                        size={13}
                        strokeWidth={2.5}
                        className="text-success"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 text-[10px] text-neutral-500">
                    {c.label} · {Math.round(c.pct * 100)}% off
                  </span>
                </motion.button>
              );
            })}
          </div>
          {appliedCoupon && (
            <p className="mt-1.5 text-[10px] font-medium text-success">
              ✓ {Math.round(appliedCoupon.pct * 100)}% de desconto aplicado
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-white px-3 py-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-600">
            <span>Subtotal</span>
            <span className="tabular-nums">
              R$ {subtotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {discount > 0 && appliedCoupon && (
            <div className="flex items-center justify-between text-[11px] text-success">
              <span>Desconto {appliedCoupon.code}</span>
              <span className="tabular-nums">
                − R$ {discount.toFixed(2).replace(".", ",")}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="font-ui text-[13px] font-bold text-neutral-800">
              Total
            </span>
            <span className="font-ui text-[20px] font-bold text-brand tabular-nums">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
        <motion.button
          type="button"
          data-tour="qp-checkout"
          whileTap={entries.length > 0 ? { scale: 0.98 } : undefined}
          disabled={entries.length === 0 || total === 0}
          className={cn(
            "mt-2 w-full rounded-md py-3 text-center font-ui text-[13px] font-bold transition-colors",
            entries.length === 0 || total === 0
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-brand text-white shadow-brand hover:bg-brand-light",
          )}
        >
          {entries.length === 0 ? "Adicione um item ao carrinho" : "Ir para pagamento"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function PaymentView({
  method,
  total,
  onChangeMethod,
}: {
  method: "cartao" | "pix";
  total: number;
  onChangeMethod: (m: "cartao" | "pix") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader showBack title="Pagamento" />

      <div className="border-b border-neutral-100 bg-brand-ghost px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="font-ui text-[13px] font-bold text-brand">
            Total a pagar
          </span>
          <span className="font-ui text-[20px] font-bold text-brand tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div data-tour="qp-payment-tabs" className="grid grid-cols-2">
        <button
          onClick={() => onChangeMethod("cartao")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-3.5 font-ui text-[13px] font-bold transition-colors",
            method === "cartao"
              ? "border-b-2 border-brand text-brand"
              : "border-b border-neutral-200 text-neutral-500",
          )}
        >
          <CreditCard size={14} strokeWidth={2.25} />
          Cartão
        </button>
        <button
          onClick={() => onChangeMethod("pix")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-3.5 font-ui text-[13px] font-bold transition-colors",
            method === "pix"
              ? "border-b-2 border-brand text-brand"
              : "border-b border-neutral-200 text-neutral-500",
          )}
        >
          <Smartphone size={14} strokeWidth={2.25} />
          Pix
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3.5">
        <AnimatePresence mode="wait">
          {method === "cartao" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div
                className="relative overflow-hidden rounded-xl p-3.5 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/75">
                  Cartão salvo
                </p>
                <p className="mt-2 font-mono text-[16px] tracking-[3px] tabular-nums">
                  •••• •••• •••• 4218
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase text-white/60">
                      Titular
                    </p>
                    <p className="font-ui text-[11px] font-bold">
                      MATEUS SOUZA
                    </p>
                  </div>
                  <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur">
                    VISA
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <Field label="Parcelas" value="1x sem juros" />
                <Field
                  label="Cobrança"
                  value={`R$ ${total.toFixed(2).replace(".", ",")}`}
                />
              </div>

              <motion.button
                type="button"
                whileTap={total > 0 ? { scale: 0.98 } : undefined}
                disabled={total === 0}
                className={cn(
                  "mt-4 w-full rounded-md py-3 text-center font-ui text-[13px] font-bold transition-colors",
                  total === 0
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-brand text-white shadow-brand hover:bg-brand-light",
                )}
              >
                {total > 0
                  ? `Pagar R$ ${total.toFixed(2).replace(".", ",")}`
                  : "Sem itens para pagar"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="pix"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="text-center"
            >
              <div className="mx-auto mt-1 flex h-40 w-40 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white">
                <QrCode
                  size={130}
                  strokeWidth={0.5}
                  className="text-neutral-900"
                />
              </div>
              <p className="mt-2 text-[12px] text-neutral-600">
                Aponte o app do banco para o QR
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full rounded-md border border-brand bg-white py-2.5 text-center font-ui text-[12px] font-bold text-brand"
              >
                Copiar código Pix
              </motion.button>
              <motion.button
                type="button"
                whileTap={total > 0 ? { scale: 0.98 } : undefined}
                disabled={total === 0}
                className={cn(
                  "mt-1.5 w-full rounded-md py-3 text-center font-ui text-[13px] font-bold transition-colors",
                  total === 0
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-brand text-white shadow-brand hover:bg-brand-light",
                )}
              >
                {total > 0 ? "Já paguei" : "Sem itens para pagar"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">
      <span className="text-[11px] text-neutral-500">{label}</span>
      <span className="font-ui text-[12px] font-bold text-neutral-900 tabular-nums">
        {value}
      </span>
    </div>
  );
}

function SuccessView({
  total,
  method,
  cartItems,
}: {
  total: number;
  method: "cartao" | "pix";
  cartItems: { id: string; qty: number; name: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader showBack title="Pedido pago" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="rounded-2xl bg-success/10 p-3.5 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
            <CheckCircle2 size={30} strokeWidth={2.5} />
          </div>
          <p className="mt-2 font-ui text-[15px] font-bold text-success">
            Pagamento aprovado
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-600">
            {method === "cartao"
              ? "Cartão final 4218 · 1x sem juros"
              : "Pix · confirmado em 2s"}
          </p>
        </motion.div>

        <div
          data-tour="qp-retirada-qr"
          className="mt-3.5 rounded-2xl border-2 border-brand/20 bg-white p-3.5 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-28 w-28 flex-none items-center justify-center rounded-md bg-white p-2 ring-1 ring-neutral-200">
              <QrCode size={92} strokeWidth={0.5} className="text-neutral-900" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-brand">
                Retirada no balcão
              </p>
              <p className="mt-0.5 font-ui text-[15px] font-bold text-neutral-900">
                Pedido #320108
              </p>
              <p className="mt-1 text-[11px] leading-snug text-neutral-600">
                Apresente este QR no balcão da Hell&apos;s Burgers · setor B.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
                <Clock size={10} strokeWidth={2.5} />
                Pronto em ~4 min
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <ul className="mt-3 space-y-0.5 border-t border-neutral-100 pt-2 text-[11px] text-neutral-700">
              {cartItems.map((it) => (
                <li key={it.id} className="flex items-center justify-between">
                  <span>
                    <span className="font-bold">{it.qty}×</span> {it.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 space-y-1 rounded-lg bg-neutral-50 px-3 py-2.5 text-[11px] text-neutral-600">
          <div className="flex items-center justify-between">
            <span>Total pago</span>
            <span className="font-ui font-bold text-neutral-900 tabular-nums">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cupom fiscal</span>
            <span className="font-medium text-brand underline">
              Enviado por e-mail
            </span>
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full rounded-md bg-brand py-3 text-center font-ui text-[13px] font-bold text-white shadow-brand"
        >
          Comprar novamente
        </motion.button>
      </div>
    </motion.div>
  );
}

function SafariBottomBar() {
  return (
    <div className="border-t border-neutral-200 bg-[#f5f5f7]">
      <div className="mx-3 my-1.5 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <span className="text-neutral-500">
          <Aa size={13} strokeWidth={2.25} />
        </span>
        <span className="text-neutral-400">
          <Lock size={10} strokeWidth={2.25} />
        </span>
        <span className="flex-1 text-center text-[11px] text-neutral-700">
          quickpass.teknisa.com
        </span>
        <span className="text-neutral-400">
          <Copy size={11} strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex items-center justify-around px-4 pb-2 text-[#007aff]">
        <button>
          <Back size={18} strokeWidth={2} />
        </button>
        <button className="opacity-40">
          <Fwd size={18} strokeWidth={2} />
        </button>
        <button>
          <Share size={16} strokeWidth={2} />
        </button>
        <button>
          <Library size={16} strokeWidth={2} />
        </button>
        <button>
          <span className="grid h-4 w-4 grid-cols-2 gap-px">
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
          </span>
        </button>
      </div>
    </div>
  );
}
