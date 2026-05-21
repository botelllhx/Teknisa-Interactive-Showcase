"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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

interface QuickPassProps {
  step: number;
}

// QuickPass = fast-service web app for events / stadiums.
// Flow: 0 catálogo → 1 produto → 2 carrinho com cupom → 3 pagamento (Cartão/Pix) → 4 retirada com QR
// Runs inside the mobile browser (Safari chrome bottom).

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
  // Free interactive cart shared across steps
  const [cart, setCart] = useState<Record<string, number>>({
    "burger-classic": 1,
    coca: 1,
  });
  const [detailQty, setDetailQty] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix">("cartao");

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce(
        (s, [id, qty]) => s + (PRODUCT_BY_ID[id]?.price ?? 0) * qty,
        0,
      ),
    [cart],
  );
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

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
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <StatusBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <CatalogView
              key="catalog"
              cart={cart}
              onAdd={addItem}
            />
          )}
          {step === 1 && (
            <ProductDetailView
              key="detail"
              qty={detailQty}
              onUpdateQty={(d) => setDetailQty(Math.max(1, detailQty + d))}
              onAdd={() => {
                addItem("burger-bacon", detailQty);
                setDetailQty(1);
              }}
            />
          )}
          {step === 2 && (
            <CartView
              key="cart"
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              total={total}
              coupon={coupon}
              couponApplied={couponApplied}
              onUpdateQty={updateQty}
              onRemove={removeItem}
              onCouponChange={setCoupon}
              onApplyCoupon={() => setCouponApplied(true)}
            />
          )}
          {step === 3 && (
            <PaymentView
              key="payment"
              method={paymentMethod}
              total={total}
              onChangeMethod={setPaymentMethod}
            />
          )}
          {step >= 4 && (
            <SuccessView key="success" total={total} method={paymentMethod} />
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
      <span className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
        21:08
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <span className="text-[10px] font-bold tracking-wide">5G</span>
        <span className="text-[10px] tabular-nums">82%</span>
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
    <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-3 py-2">
      <div className="flex items-center gap-1.5">
        {showBack && (
          <button className="text-brand">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        )}
        <Image
          src="/logo-teknisa.svg"
          alt="Teknisa"
          width={42}
          height={8}
          className="select-none"
        />
      </div>
      {title ? (
        <span className="font-display text-[12px] font-bold text-brand">
          {title}
        </span>
      ) : (
        <div className="flex items-center gap-1">
          <span className="font-display text-[10px] font-bold italic text-red-700">
            HELL&apos;S
          </span>
          <span className="font-display text-[10px] font-bold tracking-wider text-neutral-900">
            BURGERS
          </span>
        </div>
      )}
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-ghost px-2 py-0.5 text-[9px] font-bold text-brand">
        <Zap size={9} strokeWidth={2.5} />
        QuickPass
      </span>
    </div>
  );
}

function VenueBanner() {
  return (
    <div className="px-3 pt-3">
      <div
        className="relative overflow-hidden rounded-xl p-3 text-white"
        style={{
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-white/70">
              Hoje · Show ao vivo
            </p>
            <p className="mt-0.5 font-display text-[14px] font-bold leading-tight">
              Hell&apos;s Burgers
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/85">
              <MapPin size={10} strokeWidth={2.25} />
              Allianz Parque · Setor B · Loja 12
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur">
            <Clock size={9} strokeWidth={2.5} />
            Pronto em 4 min
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur">
          <Zap size={11} strokeWidth={2.5} className="text-yellow-300" />
          <p className="text-[10px] leading-snug">
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

        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
          <Search size={13} strokeWidth={2.25} className="text-neutral-400" />
          <input
            disabled
            placeholder="Buscar lanches, bebidas..."
            className="flex-1 bg-transparent text-[11px] text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>

        <div className="mx-3 mt-3 flex items-center justify-between">
          <h2 className="font-display text-[13px] font-bold text-brand">
            Cardápio do evento
          </h2>
          <span className="text-[10px] font-medium text-neutral-500">
            {PRODUCTS.length} itens
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 px-3" data-tour="qp-catalog">
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
                  className="relative h-20 w-full"
                  style={{ background: p.gradient }}
                >
                  {p.tag && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-bold text-brand">
                      {p.tag}
                    </span>
                  )}
                  {inCart > 0 && (
                    <motion.span
                      key={inCart}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="absolute right-1.5 top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-brand shadow"
                    >
                      ×{inCart}
                    </motion.span>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-display text-[11px] font-bold leading-snug text-neutral-900 line-clamp-1">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[9px] leading-snug text-neutral-500 line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-display text-[12px] font-bold text-brand tabular-nums">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
                      <Plus size={11} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sticky cart pill */}
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
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <ShoppingBag size={13} strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <p className="font-display text-[11px] font-bold leading-tight">
                  {cartCount} {cartCount === 1 ? "item" : "itens"} no carrinho
                </p>
                <p className="text-[9px] text-white/75">
                  Toque para revisar e pagar
                </p>
              </div>
              <span className="font-display text-[11px] font-bold tabular-nums">
                Ver →
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProductDetailView({
  qty,
  onUpdateQty,
  onAdd,
}: {
  qty: number;
  onUpdateQty: (delta: number) => void;
  onAdd: () => void;
}) {
  const product = PRODUCT_BY_ID["burger-bacon"];
  const total = product.price * qty;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader showBack title="Detalhes" />

      <div
        className="relative h-32 w-full"
        style={{ background: product.gradient }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.18),transparent_60%)]" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3">
        <h2 className="font-display text-[16px] font-bold text-brand">
          {product.name}
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
          {product.desc}. Servido com batatas rústicas e molho da casa. Pronto em
          até 5 minutos.
        </p>
        <p className="mt-2 font-display text-[16px] font-bold text-brand tabular-nums">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>

        <div className="mt-4 rounded-lg bg-brand-ghost px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
            Pronto em
          </p>
          <p className="font-display text-[12px] font-bold text-neutral-900">
            ~5 minutos · retirada no balcão
          </p>
        </div>
      </div>

      <div
        data-tour="qp-detail-add"
        className="flex items-center gap-2 border-t border-neutral-100 bg-white px-3 py-2.5"
      >
        <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-1">
          <button
            type="button"
            onClick={() => onUpdateQty(-1)}
            disabled={qty <= 1}
            className={cn(
              "flex h-7 w-7 items-center justify-center text-neutral-500",
              qty <= 1 && "opacity-30",
            )}
          >
            <Minus size={12} strokeWidth={2.25} />
          </button>
          <motion.span
            key={qty}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-5 text-center font-display text-[13px] font-bold text-neutral-900 tabular-nums"
          >
            {qty}
          </motion.span>
          <button
            type="button"
            onClick={() => onUpdateQty(1)}
            className="flex h-7 w-7 items-center justify-center text-brand"
          >
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="flex flex-1 items-center justify-between rounded-md bg-brand px-3 py-2 text-white shadow-brand"
        >
          <span className="font-display text-[11px] font-bold">
            Adicionar ao carrinho
          </span>
          <span className="font-display text-[12px] font-bold tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function CartView({
  cart,
  subtotal,
  discount,
  total,
  coupon,
  couponApplied,
  onUpdateQty,
  onRemove,
  onCouponChange,
  onApplyCoupon,
}: {
  cart: Record<string, number>;
  subtotal: number;
  discount: number;
  total: number;
  coupon: string;
  couponApplied: boolean;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
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
        <div className="border-b border-neutral-100 bg-brand-ghost px-3 py-1.5 text-[10px] text-brand">
          <span className="font-bold">Hell&apos;s Burgers</span> · Allianz Parque
          · Setor B
        </div>

        <div className="space-y-2 px-3 py-2">
          {entries.length === 0 && (
            <p className="py-8 text-center text-[12px] text-neutral-500">
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
                className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-white p-2"
              >
                <div
                  className="h-12 w-12 flex-none rounded-md"
                  style={{ background: p.gradient }}
                />
                <div className="flex-1">
                  <p className="font-display text-[11px] font-bold text-neutral-900">
                    {p.name}
                  </p>
                  <p className="text-[9px] text-neutral-500">{p.desc}</p>
                  <p className="mt-0.5 font-display text-[12px] font-bold text-brand tabular-nums">
                    R$ {(p.price * qty).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="text-neutral-400 hover:text-danger"
                  >
                    <Trash2 size={11} strokeWidth={2} />
                  </button>
                  <div className="flex items-center gap-1 rounded-md border border-neutral-200 px-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(id, -1)}
                      className="flex h-6 w-6 items-center justify-center text-neutral-500"
                    >
                      <Minus size={10} strokeWidth={2.25} />
                    </button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-4 text-center font-display text-[11px] font-bold text-neutral-900 tabular-nums"
                    >
                      {qty}
                    </motion.span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(id, 1)}
                      className="flex h-6 w-6 items-center justify-center text-brand"
                    >
                      <Plus size={10} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          data-tour="qp-coupon"
          className="mx-3 mt-2 rounded-lg border border-dashed border-brand/30 bg-brand-ghost p-2"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
            <Tag size={11} strokeWidth={2.25} />
            CUPOM DE DESCONTO
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <input
              value={coupon}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              placeholder="Ex.: FAN10"
              disabled={couponApplied}
              className={cn(
                "flex-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-bold tracking-wider text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none",
                couponApplied && "border-success/40 bg-success/5 text-success",
              )}
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onApplyCoupon}
              disabled={couponApplied || coupon.length === 0}
              className={cn(
                "rounded-md px-3 py-1.5 font-display text-[10px] font-bold",
                couponApplied
                  ? "bg-success text-white"
                  : coupon.length === 0
                    ? "bg-neutral-200 text-neutral-400"
                    : "bg-brand text-white shadow-brand",
              )}
            >
              {couponApplied ? "Aplicado" : "Aplicar"}
            </motion.button>
          </div>
          {couponApplied && (
            <p className="mt-1 text-[9px] font-medium text-success">
              ✓ 10% de desconto aplicado
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-white px-3 py-2">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-600">
            <span>Subtotal</span>
            <span className="tabular-nums">
              R$ {subtotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-[10px] text-success">
              <span>Desconto (FAN10)</span>
              <span className="tabular-nums">
                − R$ {discount.toFixed(2).replace(".", ",")}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-[12px] font-bold text-neutral-800">
              Total
            </span>
            <span className="font-display text-[16px] font-bold text-brand tabular-nums">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
        <motion.button
          type="button"
          data-tour="qp-checkout"
          whileTap={{ scale: 0.98 }}
          className="mt-2 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
        >
          Ir para pagamento
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

      <div className="border-b border-neutral-100 bg-brand-ghost px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-[12px] font-bold text-brand">
            Total a pagar
          </span>
          <span className="font-display text-[18px] font-bold text-brand tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div data-tour="qp-payment-tabs" className="grid grid-cols-2">
        <button
          onClick={() => onChangeMethod("cartao")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-3 font-display text-[12px] font-bold transition-colors",
            method === "cartao"
              ? "border-b-2 border-brand text-brand"
              : "border-b border-neutral-200 text-neutral-500",
          )}
        >
          <CreditCard size={13} strokeWidth={2.25} />
          Cartão
        </button>
        <button
          onClick={() => onChangeMethod("pix")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-3 font-display text-[12px] font-bold transition-colors",
            method === "pix"
              ? "border-b-2 border-brand text-brand"
              : "border-b border-neutral-200 text-neutral-500",
          )}
        >
          <Smartphone size={13} strokeWidth={2.25} />
          Pix
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
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
                className="relative overflow-hidden rounded-xl p-3 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
                }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[2px] text-white/70">
                  Cartão salvo
                </p>
                <p className="mt-2 font-mono text-[14px] tracking-[3px] tabular-nums">
                  •••• •••• •••• 4218
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[8px] uppercase text-white/60">
                      Titular
                    </p>
                    <p className="font-display text-[10px] font-bold">
                      MATEUS SOUZA
                    </p>
                  </div>
                  <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider backdrop-blur">
                    VISA
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <Field label="Parcelas" value="1x sem juros" />
                <Field label="Cobrança" value={`R$ ${total.toFixed(2).replace(".", ",")}`} />
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
              >
                Pagar R$ {total.toFixed(2).replace(".", ",")}
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
              <div className="mx-auto mt-1 flex h-36 w-36 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white">
                <QrCode size={120} strokeWidth={0.5} className="text-neutral-900" />
              </div>
              <p className="mt-2 text-[11px] text-neutral-600">
                Aponte o app do banco para o QR
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full rounded-md border border-brand bg-white py-2 text-center font-display text-[11px] font-bold text-brand"
              >
                Copiar código Pix
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                className="mt-1.5 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
              >
                Já paguei
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
    <div className="flex items-center justify-between rounded-md bg-neutral-50 px-2.5 py-2">
      <span className="text-[10px] text-neutral-500">{label}</span>
      <span className="font-display text-[11px] font-bold text-neutral-900 tabular-nums">
        {value}
      </span>
    </div>
  );
}

function SuccessView({
  total,
  method,
}: {
  total: number;
  method: "cartao" | "pix";
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
          className="rounded-2xl bg-success/10 p-3 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
            <CheckCircle2 size={26} strokeWidth={2.5} />
          </div>
          <p className="mt-2 font-display text-[14px] font-bold text-success">
            Pagamento aprovado
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-600">
            {method === "cartao"
              ? "Cartão final 4218 · 1x"
              : "Pix · confirmado em 2s"}
          </p>
        </motion.div>

        <div
          data-tour="qp-retirada-qr"
          className="mt-3 rounded-2xl border-2 border-brand/20 bg-white p-3 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-24 w-24 flex-none items-center justify-center rounded-md bg-white p-1.5 ring-1 ring-neutral-200">
              <QrCode size={84} strokeWidth={0.5} className="text-neutral-900" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-brand">
                Retirada no balcão
              </p>
              <p className="mt-0.5 font-display text-[14px] font-bold text-neutral-900">
                Pedido #{"320108"}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-neutral-600">
                Apresente este QR no balcão da Hell&apos;s Burgers · Setor B.
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warning">
                <Clock size={9} strokeWidth={2.5} />
                Pronto em ~4 min
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1 rounded-lg bg-neutral-50 px-3 py-2.5 text-[10px] text-neutral-600">
          <div className="flex items-center justify-between">
            <span>Total pago</span>
            <span className="font-display font-bold text-neutral-900 tabular-nums">
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
          className="mt-3 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
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
