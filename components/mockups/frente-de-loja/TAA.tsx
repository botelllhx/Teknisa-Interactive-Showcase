"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Tag,
  Fish,
  Utensils,
  IceCream,
  Coffee,
  Soup,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  Pizza,
  UserRound,
  Wallet,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface TAAProps {
  step: number;
}

// ---------------------------------------------------------------------------
// White-label skins — same TAA, different commerce brand. The skin toggle is
// the "pulo do gato" the client wants showcased: Teknisa (default navy) and
// Astrobox (red themed cosmic pizzaria) using identical UI scaffolding.
// ---------------------------------------------------------------------------

interface Skin {
  id: "teknisa" | "astrobox";
  name: string;
  brand: string;
  brandSoft: string;
  brandDark: string;
  accent: string;
  buttonText: string;
  // welcome screen
  tagline: string;
  taglineSecondary: string;
  // header banner inside home
  bannerTitle: string;
  bannerSubtitle: string;
}

const SKINS: Record<"teknisa" | "astrobox", Skin> = {
  teknisa: {
    id: "teknisa",
    name: "Sapore",
    brand: "#020788",
    brandSoft: "#e8e9f8",
    brandDark: "#01055e",
    accent: "#1a1fa8",
    buttonText: "#ffffff",
    tagline: "Bem-vindo ao Sapore",
    taglineSecondary: "Toque na tela para começar",
    bannerTitle: "Economize na sua",
    bannerSubtitle: "próxima compra",
  },
  astrobox: {
    id: "astrobox",
    name: "Astrobox",
    brand: "#c8102e",
    brandSoft: "#fde8eb",
    brandDark: "#8b0a1f",
    accent: "#e62848",
    buttonText: "#ffffff",
    tagline: "fly me to the pizza!",
    taglineSecondary: "Toque na tela para iniciar",
    bannerTitle: "Complemente",
    bannerSubtitle: "seu pedido",
  },
};

// ---------------------------------------------------------------------------
// Categories + products (mirror the reference layout)
// ---------------------------------------------------------------------------

interface Category {
  id: string;
  label: string;
  Icon: typeof Tag;
  promo?: boolean;
}

const CATEGORIES: Category[] = [
  { id: "cupom", label: "CUPOM", Icon: Tag, promo: true },
  { id: "promo", label: "Promoções", Icon: Pizza },
  { id: "sushi", label: "Sushi", Icon: Fish },
  { id: "peixes", label: "Peixes", Icon: Fish },
  { id: "massas", label: "Massas", Icon: Utensils },
  { id: "sobremesas", label: "Sobremesas", Icon: IceCream },
  { id: "bebidas", label: "Bebidas", Icon: Coffee },
];

interface Product {
  id: string;
  name: string;
  desc: string;
  oldPrice: number;
  price: number;
  emoji: string;
  bg: string;
}

const PRODUCTS_TEKNISA: Product[] = [
  {
    id: "carne",
    name: "Carne de Boi",
    desc: "Prato feito montado com arroz, feijão, batata frita, salada",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍛",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #d97706 100%)",
  },
  {
    id: "frango-aceb",
    name: "Frango Acebolado",
    desc: "Prato feito montado com arroz, feijão, batata, salada",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍗",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #b45309 100%)",
  },
  {
    id: "costela",
    name: "Costela de Boi",
    desc: "Prato feito montado com arroz, feijão, salada",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🥩",
    bg: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #92400e 100%)",
  },
  {
    id: "frango-grelhado",
    name: "Frango Grelhado",
    desc: "Filé suculento, arroz integral e legumes",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍗",
    bg: "linear-gradient(135deg, #fef9c3 0%, #facc15 50%, #a16207 100%)",
  },
  {
    id: "file",
    name: "Filé Mignon",
    desc: "Corte nobre com risoto de parmesão",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🥩",
    bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #b91c1c 100%)",
  },
];

const PRODUCTS_ASTROBOX: Product[] = [
  {
    id: "calabresa",
    name: "Calabresa Cósmica",
    desc: "Fatias generosas de calabresa com cebola e um toque especial de temperos",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍕",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #b45309 100%)",
  },
  {
    id: "frango-estelar",
    name: "Frango Estelar",
    desc: "Pedaços de frango grelhado com mussarela em massa fina",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍕",
    bg: "linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #92400e 100%)",
  },
  {
    id: "combo-astrobox",
    name: "Combo Astrobox",
    desc: "Uma experiência completa: pizza + fritas + bebida",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🌌",
    bg: "linear-gradient(135deg, #fecaca 0%, #f87171 50%, #7f1d1d 100%)",
  },
  {
    id: "combo-basico",
    name: "Combo Básico",
    desc: "A opção perfeita para quem quer um combo completo",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🥤",
    bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #991b1b 100%)",
  },
  {
    id: "marguerita",
    name: "Marguerita Magnética",
    desc: "Mussarela, manjericão e molho de tomate fresco",
    oldPrice: 29.9,
    price: 29.9,
    emoji: "🍕",
    bg: "linear-gradient(135deg, #fef9c3 0%, #fcd34d 50%, #b45309 100%)",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TAAMockup({ step }: TAAProps) {
  const [skinId, setSkinId] = useState<"teknisa" | "astrobox">("teknisa");
  const skin = SKINS[skinId];
  const products = skinId === "teknisa" ? PRODUCTS_TEKNISA : PRODUCTS_ASTROBOX;

  const [cart, setCart] = useState<Record<string, number>>({});
  const [, setOrderType] = useState<"local" | "viagem" | null>(null);
  const [payment, setPayment] = useState<"credito" | "debito" | "pix" | null>(
    null,
  );

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce(
        (s, [id, qty]) => s + (products.find((p) => p.id === id)?.price ?? 0) * qty,
        0,
      ),
    [cart, products],
  );
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const addItem = (id: string) =>
    setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  const removeItem = (id: string) =>
    setCart((p) => {
      const n = { ...p };
      if ((n[id] ?? 0) > 1) n[id] -= 1;
      else delete n[id];
      return n;
    });

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return { id, qty, name: p?.name ?? id, price: p?.price ?? 0 };
    });
    patchLive({
      cartItems: items,
      cartCount,
      cartTotal: subtotal,
      cartSubtotal: subtotal,
      selectedItemName: items[items.length - 1]?.name,
      paymentMethod: payment ?? undefined,
      paymentLabel:
        payment === "credito"
          ? "Crédito"
          : payment === "debito"
            ? "Débito/Voucher"
            : payment === "pix"
              ? "Pix"
              : undefined,
      skinName: skin.name,
    });
  }, [cart, cartCount, subtotal, payment, skin.name, products, patchLive]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-white font-ui"
      style={{ color: "#1f2330" }}
    >
      <BrandStripe skin={skin} />
      <SkinToggle skinId={skinId} onChange={setSkinId} />

      <main className="relative flex-1 overflow-hidden">
        <HomeView
          skin={skin}
          products={products}
          cart={cart}
          subtotal={subtotal}
          step={step}
        />

        {/* Modals & overlays per step */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <OrderTypeModal
              key="order-type"
              skin={skin}
              onPick={(t) => setOrderType(t)}
            />
          )}
          {step === 2 && (
            <ItemDetailModal
              key="item-detail"
              skin={skin}
              products={products}
              cart={cart}
              onAdd={addItem}
              onRemove={removeItem}
            />
          )}
          {step === 3 && (
            <PaymentModal
              key="payment"
              skin={skin}
              total={subtotal || 162.9}
              selected={payment}
              onPick={setPayment}
            />
          )}
          {step >= 4 && (
            <ProcessingDoneOverlay
              key="done"
              skin={skin}
              total={subtotal || 162.9}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomTotalBar skin={skin} total={subtotal || 162.9} cartCount={cartCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top brand stripe (status bar style + commerce name)
// ---------------------------------------------------------------------------

function BrandStripe({ skin }: { skin: Skin }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 text-white"
      style={{ background: skin.brand }}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logo-teknisa-white.svg"
          alt="Teknisa"
          width={62}
          height={11}
          className="select-none opacity-95"
        />
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-80">
          {skin.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Search size={11} strokeWidth={2.25} className="opacity-80" />
        <span className="flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold">
          <Wifi size={9} strokeWidth={2.5} />
          ON
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skin toggle — the white-label hero of this demo
// ---------------------------------------------------------------------------

function SkinToggle({
  skinId,
  onChange,
}: {
  skinId: "teknisa" | "astrobox";
  onChange: (id: "teknisa" | "astrobox") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-1.5">
      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        White-label
      </span>
      <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-0.5 shadow-sm">
        {(["teknisa", "astrobox"] as const).map((id) => {
          const active = skinId === id;
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(id)}
              className={cn(
                "rounded-full px-2.5 py-1 font-ui text-[10px] font-bold transition-colors",
                active ? "text-white" : "text-neutral-500",
              )}
              style={{
                background: active ? SKINS[id].brand : "transparent",
              }}
            >
              {SKINS[id].name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home — sidebar + promo banner + product grid (matches "início.png")
// ---------------------------------------------------------------------------

function HomeView({
  skin,
  products,
  cart,
}: {
  skin: Skin;
  products: Product[];
  cart: Record<string, number>;
  subtotal: number;
  step: number;
}) {
  const [activeCategory, setActiveCategory] = useState("promo");

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <aside
        className="flex w-[78px] flex-col border-r border-neutral-200 bg-white"
        data-tour="taa-cat-lanches"
      >
        {CATEGORIES.map((c) => {
          const active = c.id === activeCategory;
          return (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(c.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                active ? "" : "hover:bg-neutral-50",
              )}
              style={{
                background: active ? skin.brandSoft : undefined,
                color: active ? skin.brand : c.promo ? skin.brand : "#6b7280",
                borderLeft: active
                  ? `3px solid ${skin.brand}`
                  : "3px solid transparent",
              }}
            >
              <c.Icon
                size={c.promo ? 14 : 18}
                strokeWidth={c.promo ? 2.5 : 1.75}
              />
              <span
                className={cn(
                  "font-ui leading-tight",
                  c.promo ? "text-[9px] font-bold tracking-wider" : "text-[9px] font-medium",
                )}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Promo banner */}
        <div
          className="m-2.5 mb-2 flex items-center gap-2 overflow-hidden rounded-2xl p-3 text-white"
          style={{
            background: `linear-gradient(135deg, ${skin.brandDark} 0%, ${skin.brand} 60%, ${skin.accent} 100%)`,
          }}
        >
          <div className="flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">
              {skin.bannerTitle}
            </p>
            <p className="mt-0.5 font-ui text-[13px] font-bold leading-tight">
              {skin.bannerSubtitle}
            </p>
            <p className="mt-1.5 font-ui text-[18px] font-bold tabular-nums">
              R$ 25,00
            </p>
          </div>
          <div className="relative flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            {skin.id === "astrobox" ? (
              <Pizza size={26} strokeWidth={1.5} />
            ) : (
              <Soup size={26} strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between px-2.5 pb-1">
          <h2 className="font-ui text-[13px] font-bold text-neutral-900">
            Promoções
          </h2>
          <span className="text-[9px] font-medium text-neutral-400">
            {products.length} itens
          </span>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => {
              const inCart = cart[p.id] ?? 0;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden rounded-xl bg-white text-left shadow-card transition-shadow hover:shadow-card-hover"
                  style={{ border: "1px solid #e5e7eb" }}
                >
                  <div
                    className="relative flex h-16 items-center justify-center text-[22px]"
                    style={{ background: p.bg }}
                  >
                    <span aria-hidden>{p.emoji}</span>
                    {inCart > 0 && (
                      <motion.span
                        key={inCart}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="absolute right-1 top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold shadow"
                        style={{ color: skin.brand }}
                      >
                        ×{inCart}
                      </motion.span>
                    )}
                  </div>
                  <div className="p-1.5">
                    <p className="font-ui text-[10px] font-bold leading-tight text-neutral-900 line-clamp-1">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-[8px] leading-tight text-neutral-500 line-clamp-2">
                      {p.desc}
                    </p>
                    <p className="mt-1 text-[9px] text-neutral-400 line-through tabular-nums">
                      R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                    </p>
                    <p
                      className="font-ui text-[11px] font-bold tabular-nums"
                      style={{ color: "#16a34a" }}
                    >
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order type modal — "Seu pedido é para: Comer aqui / Para Viagem"
// ---------------------------------------------------------------------------

function OrderTypeModal({
  skin,
  onPick,
}: {
  skin: Skin;
  onPick: (t: "local" | "viagem") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 px-5 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full max-w-[320px]"
      >
        <p className="text-center font-ui text-[14px] font-medium text-neutral-700">
          Seu pedido é para:
        </p>
        <motion.button
          data-tour="taa-eat-here"
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onPick("local")}
          className="mt-3 flex w-full items-center justify-between rounded-2xl px-5 py-5 text-left text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          <span className="font-ui text-[18px] font-bold">Comer aqui</span>
          <Utensils size={36} strokeWidth={1.5} className="opacity-60" />
        </motion.button>
        <button
          type="button"
          onClick={() => onPick("viagem")}
          className="mt-2.5 flex w-full items-center justify-between rounded-2xl px-5 py-5 text-left text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          <span className="font-ui text-[18px] font-bold">Para Viagem</span>
          <ShoppingBag size={36} strokeWidth={1.5} className="opacity-60" />
        </button>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-[10px] font-medium text-neutral-500 underline"
        >
          <UserRound size={11} strokeWidth={2.25} />
          Identifique-se com CPF
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Item detail modal — "personalizar item.png"
// ---------------------------------------------------------------------------

function ItemDetailModal({
  skin,
  products,
  cart,
  onAdd,
  onRemove,
}: {
  skin: Skin;
  products: Product[];
  cart: Record<string, number>;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  // Spotlight the first product as the demo "current item"
  const product = products[0];
  const [pizza, setPizza] = useState("Calabresa Cósmica");
  const [batataM, setBatataM] = useState(0);
  const [batataG, setBatataG] = useState(0);
  const PIZZA_OPTIONS = [
    "Bacon Astronômico",
    "Calabresa Cósmica",
    "Frango Estelar",
    "Lombo Galático",
    "Marguerita Magnética",
    "Pepperoni Marciano",
  ];

  const qty = cart[product.id] ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex flex-col bg-white"
    >
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl text-[28px]"
            style={{ background: product.bg }}
          >
            <span aria-hidden>{product.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-ui text-[15px] font-bold leading-tight text-neutral-900">
              {product.name}
            </p>
            <p className="mt-1 text-[10px] leading-snug text-neutral-500">
              {product.desc}
            </p>
          </div>
        </div>

        <Section title="Escolha sua pizza" required="0/1" skin={skin}>
          <div className="grid grid-cols-2 gap-1.5">
            {PIZZA_OPTIONS.map((opt) => {
              const active = opt === pizza;
              return (
                <motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPizza(opt)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border-2 px-1.5 py-1.5 text-left transition-colors",
                  )}
                  style={{
                    borderColor: active ? skin.brand : "#e5e7eb",
                    background: active ? skin.brandSoft : "white",
                  }}
                >
                  <span
                    className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: active ? skin.brand : "#cbd5e1",
                      background: active ? skin.brand : "white",
                    }}
                  >
                    {active && (
                      <span className="h-1 w-1 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-ui text-[9px] font-medium text-neutral-900 line-clamp-1">
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Section>

        <Section title="Escolha sua batata" required="0/3" extra="(+R$ 0,00)" skin={skin}>
          <Stepper
            label="Batata M"
            extraLabel="+ R$ 2,00"
            value={batataM}
            onChange={setBatataM}
            skin={skin}
          />
          <Stepper
            label="Batata G"
            extraLabel="+ R$ 5,00"
            value={batataG}
            onChange={setBatataG}
            skin={skin}
          />
        </Section>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] text-neutral-400 line-through tabular-nums">
              R$ 29,90
            </span>
            <span
              className="font-ui text-[16px] font-bold tabular-nums"
              style={{ color: "#16a34a" }}
            >
              R$ 29,90
            </span>
          </div>
          <Stepper
            value={qty}
            onChange={(v) => {
              if (v > qty) onAdd(product.id);
              else onRemove(product.id);
            }}
            skin={skin}
            compact
          />
        </div>
      </div>

      <div className="flex gap-2 border-t border-neutral-100 bg-white p-3">
        <button
          type="button"
          className="flex-1 rounded-md border-2 py-2.5 font-ui text-[12px] font-bold"
          style={{ borderColor: skin.brand, color: skin.brand }}
        >
          Cancelar
        </button>
        <motion.button
          type="button"
          data-tour="taa-combo-burger"
          whileTap={{ scale: 0.97 }}
          onClick={() => onAdd(product.id)}
          className="flex-[1.4] rounded-md py-2.5 font-ui text-[12px] font-bold text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          Adicionar ao carrinho
        </motion.button>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  required,
  extra,
  children,
  skin,
}: {
  title: string;
  required?: string;
  extra?: string;
  children: React.ReactNode;
  skin: Skin;
}) {
  return (
    <div className="mt-3">
      <div
        className="-mx-3 flex items-center justify-between px-3 py-1.5"
        style={{ background: skin.brandSoft }}
      >
        <p
          className="font-ui text-[11px] font-bold"
          style={{ color: skin.brand }}
        >
          {title}
        </p>
        <p
          className="font-ui text-[10px] font-medium"
          style={{ color: skin.brand }}
        >
          {required} {extra && <span className="opacity-70">{extra}</span>}
        </p>
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

function Stepper({
  label,
  extraLabel,
  value,
  onChange,
  skin,
  compact,
}: {
  label?: string;
  extraLabel?: string;
  value: number;
  onChange: (v: number) => void;
  skin: Skin;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 rounded-md border px-1 py-0.5"
        style={{ borderColor: skin.brand }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-6 w-6 items-center justify-center"
          style={{ color: skin.brand }}
        >
          <Minus size={11} strokeWidth={2.5} />
        </button>
        <motion.span
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-4 text-center font-ui text-[12px] font-bold tabular-nums"
        >
          {value}
        </motion.span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-6 w-6 items-center justify-center"
          style={{ color: skin.brand }}
        >
          <Plus size={11} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-2 py-1.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <Pizza size={12} strokeWidth={1.75} />
        </div>
        <span className="font-ui text-[10px] font-medium text-neutral-700">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-neutral-700 tabular-nums">
          {extraLabel}
        </span>
        <Stepper value={value} onChange={onChange} skin={skin} compact />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment modal — list of methods + NFC card prompt when selected
// ---------------------------------------------------------------------------

function PaymentModal({
  skin,
  total,
  selected,
  onPick,
}: {
  skin: Skin;
  total: number;
  selected: "credito" | "debito" | "pix" | null;
  onPick: (m: "credito" | "debito" | "pix") => void;
}) {
  const methods: {
    id: "credito" | "debito" | "pix";
    label: string;
    Icon: typeof CreditCard;
  }[] = [
    { id: "credito", label: "Crédito", Icon: CreditCard },
    { id: "debito", label: "Débito/Voucher", Icon: CreditCard },
    { id: "pix", label: "Pix", Icon: Wallet },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 z-30 flex flex-col bg-white"
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-3">
        <span
          aria-hidden
          className="mx-auto mb-3 h-1 w-12 rounded-full"
          style={{ background: skin.brandSoft }}
        />
        <h2 className="font-ui text-[18px] font-bold text-neutral-900">
          Pagamento
        </h2>

        {!selected && (
          <>
            <p className="mt-2 text-[12px] text-neutral-700">
              Escolha uma forma de pagamento:
            </p>
            <div className="mt-3 space-y-2">
              {methods.map((m) => (
                <motion.button
                  key={m.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  data-tour={m.id === "pix" ? "taa-pix-button" : undefined}
                  onClick={() => onPick(m.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                  style={{ background: skin.brandSoft }}
                >
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-white"
                    style={{ background: skin.brand }}
                  >
                    <m.Icon size={16} strokeWidth={2} />
                  </span>
                  <span
                    className="flex-1 font-ui text-[14px] font-bold"
                    style={{ color: skin.brand }}
                  >
                    {m.label}
                  </span>
                  <ChevronRight
                    size={16}
                    strokeWidth={2.25}
                    style={{ color: skin.brand }}
                  />
                </motion.button>
              ))}
            </div>
          </>
        )}

        {selected && (
          <div className="mt-3 space-y-3">
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-3"
              style={{ background: skin.brandSoft }}
            >
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-white"
                style={{ background: skin.brand }}
              >
                <CreditCard size={16} strokeWidth={2} />
              </span>
              <span
                className="flex-1 font-ui text-[14px] font-bold"
                style={{ color: skin.brand }}
              >
                {methods.find((m) => m.id === selected)?.label}
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl p-3 text-white"
              style={{ background: skin.brand }}
            >
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white"
                style={{ color: skin.brand }}
              >
                <Wifi size={24} strokeWidth={2.25} />
              </motion.span>
              <p className="font-ui text-[11px] leading-snug">
                Insira ou aproxime seu cartão da maquininha para realizar o
                pagamento
              </p>
            </motion.div>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between gap-2 px-3 py-3 text-white"
        style={{ background: skin.brand }}
      >
        <div>
          <p className="text-[10px] opacity-80">Total:</p>
          <p className="font-ui text-[16px] font-bold tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="rounded-md border border-white px-2.5 py-2 font-ui text-[10px] font-bold text-white"
          >
            Continuar Comprando
          </button>
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-2 font-ui text-[10px] font-bold"
            style={{ color: skin.brand }}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Done overlay — processing → confirmed with senha
// ---------------------------------------------------------------------------

function ProcessingDoneOverlay({
  skin,
  total,
}: {
  skin: Skin;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white px-6"
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full text-white"
        style={{ background: "#16a34a" }}
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2"
          style={{ borderColor: "#16a34a" }}
        />
        <CheckCircle2 size={54} strokeWidth={2} />
      </motion.div>

      <div className="text-center">
        <h2 className="font-ui text-[20px] font-bold text-neutral-900">
          Pedido confirmado
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500">
          Acompanhe sua senha no painel da retirada
        </p>
      </div>

      <div
        data-tour="taa-senha-card"
        className="rounded-2xl border-2 border-dashed px-8 py-4 text-center"
        style={{ borderColor: skin.brand, background: skin.brandSoft }}
      >
        <p
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: skin.brand }}
        >
          Sua senha
        </p>
        <p
          className="mt-1 font-ui text-[40px] font-bold leading-none tabular-nums"
          style={{ color: skin.brand }}
        >
          A1247
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
          <Clock size={11} strokeWidth={2.25} />
          Tempo estimado
          <span className="font-bold text-neutral-700">8 min</span>
        </p>
      </div>

      <p className="text-center text-[11px] text-neutral-500">
        Total pago{" "}
        <span className="font-ui font-bold text-neutral-700 tabular-nums">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Footer total bar matching the reference (dark + total + cta)
// ---------------------------------------------------------------------------

function BottomTotalBar({
  skin,
  total,
  cartCount,
}: {
  skin: Skin;
  total: number;
  cartCount: number;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2.5 text-white"
      style={{ background: skin.brand }}
    >
      <Image
        src="/logo-teknisa-white.svg"
        alt="Teknisa"
        width={62}
        height={11}
        className="select-none opacity-90"
      />
      <div className="flex items-center gap-2 text-right">
        <div>
          <p className="text-[9px] opacity-75">Total:</p>
          <p className="font-ui text-[14px] font-bold tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-2 font-ui text-[10px] font-bold"
          style={{ color: skin.brand }}
        >
          <ShoppingBag size={11} strokeWidth={2.5} />
          Ver Carrinho{cartCount > 0 ? ` · ${cartCount}` : ""}
        </motion.button>
      </div>
    </div>
  );
}

