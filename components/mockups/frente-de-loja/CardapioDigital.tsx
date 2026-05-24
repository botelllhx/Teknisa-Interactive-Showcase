"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useTourLive } from "@/lib/tourState";
import { food, venues, pexels } from "@/lib/photos";

// Only verified-match photos. Add new entries only after curl-viewing the
// actual Pexels image. See lib/photos.ts §VERIFICATION RULE.
const DISH_PHOTO_ID: Record<string, number> = {
  marguerita: food.pizza.id, // pizza fatiada real (verified)
  frango: food.chickenRoasted.id, // frango assado com legumes (verified)
  sobremesa: food.chocolateCake.id, // bolo de chocolate (verified)
};
import {
  Home,
  BookOpen,
  ShoppingBag,
  User,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Edit3,
  CheckCircle2,
  ChefHat,
  Clock,
  Bell,
  Lock,
  ChevronLeft as Back,
  ChevronRight as Fwd,
  Share,
  BookOpen as Library,
  Copy,
  Type as Aa,
  Search,
  Star,
  Pizza,
  IceCream,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CardapioDigitalProps {
  step: number;
}

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  imageStyle: React.CSSProperties;
  Icon: LucideIcon;
}

// Refined, cohesive imagery — soft single-direction gradients with a tinted glow,
// no rainbow transitions, brand-conscious palette.
const IMG_MARGUERITA: React.CSSProperties = {
  background:
    "radial-gradient(circle at 30% 30%, #fde68a 0%, #fbbf24 35%, #d97706 70%, #92400e 100%)",
};
const IMG_FRANGO: React.CSSProperties = {
  background:
    "radial-gradient(circle at 30% 30%, #fef3c7 0%, #fcd34d 30%, #f59e0b 65%, #b45309 100%)",
};
const IMG_SOBREMESA: React.CSSProperties = {
  background:
    "radial-gradient(circle at 30% 30%, #fce7f3 0%, #fbcfe8 35%, #f9a8d4 70%, #be185d 100%)",
};

const ADDONS = [
  { id: "bacon", label: "Bacon crocante", price: 3.5 },
  { id: "queijo", label: "Queijo extra", price: 3.0 },
  { id: "calabresa", label: "Calabresa premium", price: 5.5 },
];

const ITEMS: Record<string, MenuItem> = {
  marguerita: {
    id: "marguerita",
    name: "Pizza Marguerita P",
    desc: "Molho de tomate, muçarela e manjericão",
    price: 19.9,
    tag: "Chef's pick",
    imageStyle: IMG_MARGUERITA,
    Icon: Pizza,
  },
  frango: {
    id: "frango",
    name: "Combo Frango Simples",
    desc: "Frango grelhado, arroz, feijão e salada",
    price: 20.0,
    oldPrice: 30.0,
    tag: "Promo",
    imageStyle: IMG_FRANGO,
    Icon: ChefHat,
  },
  sobremesa: {
    id: "sobremesa",
    name: "Sonho de Morango",
    desc: "Massa fofa, morangos frescos e creme",
    price: 12.0,
    oldPrice: 18.0,
    tag: "Promo",
    imageStyle: IMG_SOBREMESA,
    Icon: IceCream,
  },
};

export function CardapioDigitalMockup({ step }: CardapioDigitalProps) {
  // Shared free interactivity across steps
  const [cart, setCart] = useState<Record<string, number>>({
    marguerita: 1,
    frango: 1,
    sobremesa: 1,
  });
  const [addonQty, setAddonQty] = useState<Record<string, number>>({
    bacon: 1,
  });
  const [dishQty, setDishQty] = useState(1);

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce(
        (s, [id, qty]) => s + (ITEMS[id]?.price ?? 0) * qty,
        0,
      ),
    [cart],
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const itemList = Object.entries(cart).map(([id, qty]) => ({
      id,
      qty,
      name: ITEMS[id]?.name ?? id,
      price: ITEMS[id]?.price ?? 0,
    }));
    const cartCount = itemList.reduce((s, i) => s + i.qty, 0);
    const selectedAddonsList = Object.entries(addonQty)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => {
        const a = ADDONS.find((x) => x.id === id);
        return a ? `${q}× ${a.label}` : id;
      });
    patchLive({
      cartItems: itemList,
      cartCount,
      cartTotal: subtotal,
      cartSubtotal: subtotal,
      // DetailView shows the marguerita hardcoded, so the tour tooltip's
      // "personalize a {selectedItemName}" must always say Marguerita — not
      // the last item added to the cart (which made it say "Sonho de Morango"
      // when the detail screen was clearly showing pizza).
      selectedItemName: ITEMS.marguerita.name,
      selectedAddons: selectedAddonsList,
      dishQty,
    });
  }, [cart, subtotal, addonQty, dishQty, patchLive]);

  const updateAddon = (id: string, delta: number) => {
    setAddonQty((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const addToCart = (id: string, qty = 1) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }));
  };
  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const nextQty = (next[id] ?? 0) + delta;
      if (nextQty <= 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };
  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white text-neutral-800">
      <StatusBar />
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && <HomeView key="home" cart={cart} onAdd={addToCart} />}
          {step === 1 && (
            <DetailView
              key="detail"
              addonQty={addonQty}
              dishQty={dishQty}
              onUpdateAddon={updateAddon}
              onUpdateDish={(d) => setDishQty(Math.max(1, dishQty + d))}
            />
          )}
          {step === 2 && (
            <CartView
              key="cart"
              cart={cart}
              subtotal={subtotal}
              onUpdateQty={updateCartQty}
              onRemove={removeFromCart}
            />
          )}
          {step === 3 && <ConfirmView key="confirm" subtotal={subtotal} />}
          {step >= 4 && <KitchenStatusView key="kitchen" />}
        </AnimatePresence>
      </main>
      <BottomNav step={step} />
      <SafariBottomBar />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-1 pb-0.5">
      <span className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
        12:34
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <span className="text-[10px] font-bold tracking-wide">5G</span>
        <span className="text-[10px] tabular-nums">94%</span>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
      <Image
        src="/logo-teknisa.svg"
        alt="Teknisa"
        width={42}
        height={8}
        className="select-none"
      />
      <div className="flex items-center gap-1.5">
        <span className="font-display text-[11px] font-bold italic text-neutral-800">
          MUNDO
        </span>
        <span className="font-display text-[11px] font-bold tracking-wider text-neutral-900">
          ANIMAL
        </span>
      </div>
      <button className="text-neutral-400 hover:text-brand">
        <MoreVertical size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}

function HomeView({
  cart,
  onAdd,
}: {
  cart: Record<string, number>;
  onAdd: (id: string, qty?: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      {/* Restaurant cover — real photo with brand-tint overlay */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={pexels(venues.restaurantInterior.id, { w: 600, h: 320, fit: "crop" })}
          alt="Restaurante Mundo Animal"
          fill
          unoptimized
          sizes="320px"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(2,7,136,0.55) 0%, rgba(2,7,136,0.18) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-3 bottom-2.5 flex items-end justify-between">
          <div>
            <p className="font-display text-[20px] font-bold uppercase tracking-[5px] text-white drop-shadow">
              Mundo
            </p>
            <p className="font-display text-[10px] font-bold tracking-[7px] text-white/85">
              ANIMAL
            </p>
          </div>
          <span className="rounded-full bg-white/95 px-2 py-1 font-ui text-[10px] font-bold uppercase tracking-wider text-brand shadow-card backdrop-blur">
            Mesa 10
          </span>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="px-4 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-[16px] font-bold text-brand">
              Mundo Animal
            </h1>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500">
              <Star
                size={10}
                strokeWidth={2.25}
                className="fill-warning text-warning"
              />
              <span className="font-bold text-neutral-700">4,8</span>
              <span>· 320+ avaliações</span>
            </p>
          </div>
          <span className="rounded-md bg-brand-ghost px-2 py-1 font-display text-[10px] font-bold text-brand">
            Mesa 10
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-block rounded-md bg-success/15 px-2 py-0.5 text-[9px] font-bold text-success">
            Aberto · 14:00 às 17:00
          </span>
          <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-600">
            Tempo médio · 18 min
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
        <Search size={13} strokeWidth={2.25} className="text-neutral-400" />
        <input
          disabled
          placeholder="Buscar pratos, bebidas..."
          className="flex-1 bg-transparent text-[11px] text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      {/* Categories shortcut */}
      <div className="mx-4 mt-3">
        <motion.button
          data-tour="cd-categories"
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center gap-3 rounded-xl border border-brand/15 bg-brand-ghost p-3.5 text-left transition-shadow hover:shadow-card"
        >
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-brand">
            <BookOpen size={18} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-brand/70">
              Veja todas as opções
            </p>
            <p className="font-display text-[14px] font-bold text-brand">
              Cardápio completo
            </p>
          </div>
          <ChevronRight size={14} strokeWidth={2.5} className="text-brand" />
        </motion.button>
      </div>

      {/* Promoções */}
      <div className="mt-3 flex-1 px-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 font-display text-[13px] font-bold text-brand">
            <Sparkles size={12} strokeWidth={2.25} className="text-warning" />
            Promoções de hoje
          </h2>
          <button className="flex items-center gap-0.5 text-[10px] font-medium text-brand">
            Ver todas
            <ChevronRight size={11} strokeWidth={2.25} />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {[ITEMS.frango, ITEMS.sobremesa].map((p) => {
            const inCart = cart[p.id] ?? 0;
            return (
              <motion.div
                key={p.id}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white p-2"
              >
                <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg">
                  {DISH_PHOTO_ID[p.id] ? (
                    <Image
                      src={pexels(DISH_PHOTO_ID[p.id], { w: 112, h: 112, fit: "crop" })}
                      alt={p.name}
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0" style={p.imageStyle}>
                      <p.Icon
                        size={28}
                        strokeWidth={1.5}
                        className="absolute inset-0 m-auto text-white/40"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-[12px] font-bold text-neutral-900 leading-tight">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-neutral-500 leading-tight">
                    {p.desc}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-500">
                    {p.oldPrice && (
                      <span className="line-through">
                        R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}{" "}
                    <span className="font-display font-bold text-success">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </span>
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onAdd(p.id)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white shadow-brand"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  {inCart > 0 && (
                    <motion.span
                      key={inCart}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-success px-1 text-[8px] font-bold text-white"
                    >
                      {inCart}
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function DetailView({
  addonQty,
  dishQty,
  onUpdateAddon,
  onUpdateDish,
}: {
  addonQty: Record<string, number>;
  dishQty: number;
  onUpdateAddon: (id: string, delta: number) => void;
  onUpdateDish: (delta: number) => void;
}) {
  const item = ITEMS.marguerita;
  const selectedCount = Object.values(addonQty).reduce((s, q) => s + q, 0);
  const addonsTotal = ADDONS.reduce(
    (s, a) => s + a.price * (addonQty[a.id] ?? 0),
    0,
  );
  const total = (item.price + addonsTotal) * dishQty;

  return (
    <motion.div
      data-tour="cd-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-start gap-2 px-4 pt-2">
        <button className="text-brand hover:bg-brand-ghost rounded">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-[18px] font-bold text-brand leading-tight">
            {item.name}
          </h1>
          <p className="font-display text-[12px] font-bold text-brand">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      <div className="relative mx-4 mt-3 h-32 overflow-hidden rounded-2xl">
        {DISH_PHOTO_ID[item.id] ? (
          <Image
            src={pexels(DISH_PHOTO_ID[item.id], { w: 600, h: 400, fit: "crop" })}
            alt={item.name}
            fill
            unoptimized
            sizes="280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center" style={item.imageStyle}>
            <Pizza size={56} strokeWidth={1} className="text-white/50" />
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"
        />
      </div>

      <p className="mt-3 px-4 text-[11px] leading-relaxed text-neutral-600">
        Molho de tomate, muçarela derretida, rodelas de tomate fresco, toque de
        manjericão e um fio de azeite para finalizar.
      </p>

      <div className="mt-2 flex items-center justify-between bg-brand-ghost px-4 py-1.5">
        <p className="font-display text-[12px] font-bold text-brand">
          Acréscimos
        </p>
        <span className="text-[9px] font-medium text-neutral-500">
          {selectedCount} selecionado(s)
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-1.5">
        <div className="space-y-1">
          {ADDONS.map((add) => {
            const qty = addonQty[add.id] ?? 0;
            const active = qty > 0;
            return (
              <div
                key={add.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-2 py-1.5 transition-colors",
                  active
                    ? "border-brand/30 bg-brand-ghost"
                    : "border-neutral-100 bg-white",
                )}
              >
                <div>
                  <p className="font-display text-[12px] font-bold text-neutral-900">
                    {add.label}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    + R$ {add.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateAddon(add.id, -1)}
                    disabled={qty === 0}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md",
                      qty === 0
                        ? "bg-neutral-100 text-neutral-300"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
                    )}
                  >
                    <Minus size={11} strokeWidth={2.25} />
                  </button>
                  <motion.span
                    key={qty}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-4 text-center font-display text-[12px] font-bold text-neutral-700 tabular-nums"
                  >
                    {qty}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => onUpdateAddon(add.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-light"
                  >
                    <Plus size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-100 px-3 py-2">
        <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-1">
          <button
            type="button"
            onClick={() => onUpdateDish(-1)}
            disabled={dishQty <= 1}
            className={cn(
              "flex h-7 w-7 items-center justify-center text-neutral-500",
              dishQty <= 1 && "opacity-30",
            )}
          >
            <Minus size={11} strokeWidth={2.25} />
          </button>
          <span className="w-5 text-center font-display text-[12px] font-bold text-neutral-900 tabular-nums">
            {dishQty}
          </span>
          <button
            type="button"
            onClick={() => onUpdateDish(1)}
            className="flex h-7 w-7 items-center justify-center text-brand"
          >
            <Plus size={11} strokeWidth={2.5} />
          </button>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="flex flex-1 items-center justify-between rounded-md bg-brand px-3 py-2 text-white shadow-brand"
        >
          <span className="font-display text-[11px] font-bold">
            Adicionar ao pedido
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
  onUpdateQty,
  onRemove,
}: {
  cart: Record<string, number>;
  subtotal: number;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const entries = Object.entries(cart);
  return (
    <motion.div
      data-tour="cd-cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between px-4 pt-2">
        <h1 className="font-display text-[18px] font-bold text-brand">
          Seu pedido
        </h1>
        <span className="rounded-md bg-brand-ghost px-2 py-1 text-[10px] font-bold text-brand">
          Mesa 10
        </span>
      </div>

      <p className="px-4 text-[10px] text-neutral-500">
        Mundo Animal · {entries.length} item(s)
      </p>

      <div className="mt-2 flex-1 space-y-1.5 px-4 py-1">
        {entries.length === 0 && (
          <p className="py-8 text-center text-[12px] text-neutral-500">
            Seu pedido está vazio.
          </p>
        )}
        {entries.map(([id, qty]) => {
          const p = ITEMS[id];
          if (!p) return null;
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-white p-2"
            >
              <div
                className="relative h-12 w-12 flex-none overflow-hidden rounded-md"
                style={p.imageStyle}
              >
                <p.Icon
                  size={22}
                  strokeWidth={1.5}
                  className="absolute inset-0 m-auto text-white/40"
                />
              </div>
              <div className="flex-1">
                <p className="font-display text-[11px] font-bold text-neutral-900">
                  {p.name}
                </p>
                <button className="mt-0.5 flex items-center gap-1 rounded-md bg-brand-ghost px-1.5 py-0.5 text-[9px] font-medium text-brand">
                  <Edit3 size={9} strokeWidth={2.25} />
                  Editar
                </button>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display text-[12px] font-bold text-brand tabular-nums">
                  R$ {(p.price * qty).toFixed(2).replace(".", ",")}
                </span>
                <div className="flex items-center gap-1 rounded-md border border-neutral-200 px-1">
                  <button
                    type="button"
                    onClick={() => (qty === 1 ? onRemove(id) : onUpdateQty(id, -1))}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center",
                      qty === 1 ? "text-neutral-400" : "text-neutral-500",
                    )}
                  >
                    {qty === 1 ? (
                      <Trash2 size={10} strokeWidth={2} />
                    ) : (
                      <Minus size={10} strokeWidth={2.25} />
                    )}
                  </button>
                  <motion.span
                    key={qty}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-4 text-center font-display text-[11px] font-bold tabular-nums"
                  >
                    {qty}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(id, 1)}
                    className="flex h-5 w-5 items-center justify-center text-brand"
                  >
                    <Plus size={10} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-neutral-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-[13px] font-bold text-neutral-800">
            Total
          </span>
          <span className="font-display text-[18px] font-bold text-brand tabular-nums">
            R$ {subtotal.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <motion.button
          type="button"
          whileTap={entries.length > 0 ? { scale: 0.98 } : undefined}
          disabled={entries.length === 0 || subtotal === 0}
          className={cn(
            "mt-2 w-full rounded-md py-2.5 text-center font-display text-[12px] font-bold transition-colors",
            entries.length === 0 || subtotal === 0
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-brand text-white shadow-brand hover:bg-brand-light",
          )}
        >
          {entries.length === 0
            ? "Adicione itens primeiro"
            : "Enviar para a cozinha"}
        </motion.button>
        <button
          type="button"
          className="mt-1.5 w-full rounded-md border border-brand bg-white py-2 text-center font-display text-[11px] font-bold text-brand"
        >
          Adicionar mais itens
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmView({ subtotal }: { subtotal: number }) {
  return (
    <motion.div
      data-tour="cd-confirm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex h-full flex-col items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(22,163,74,0.06), transparent 55%), radial-gradient(ellipse at bottom, rgba(2,7,136,0.04), transparent 60%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full text-white"
        style={{
          background:
            "linear-gradient(135deg, #16a34a 0%, #15803d 60%, #047857 100%)",
          boxShadow:
            "0 12px 32px rgba(22,163,74,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 4px rgba(22,163,74,0.30)" }}
        />
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </motion.div>
      <h2
        className="mt-5 font-display text-[20px] font-bold text-neutral-900"
        style={{ letterSpacing: "-0.022em" }}
      >
        Pedido enviado!
      </h2>
      <p
        className="mt-1.5 text-center font-ui text-[12px] leading-snug text-neutral-500"
        style={{ letterSpacing: "-0.005em" }}
      >
        A cozinha já recebeu o pedido no{" "}
        <span className="font-bold text-neutral-700">KDS</span>.
      </p>
      <div
        className="mt-5 rounded-2xl px-7 py-4 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(22,163,74,0.06) 0%, rgba(22,163,74,0.02) 100%)",
          border: "1.5px dashed rgba(22,163,74,0.30)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <p
          className="font-ui text-[8.5px] font-bold uppercase text-success"
          style={{ letterSpacing: "0.18em" }}
        >
          Número do pedido
        </p>
        <p
          className="mt-1 font-display text-[28px] font-bold leading-none text-success tabular-nums"
          style={{ letterSpacing: "-0.030em" }}
        >
          #C1247
        </p>
        <p className="mt-2 font-ui text-[10px] text-neutral-600 tabular-nums">
          Mesa 10 · R$ {subtotal.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </motion.div>
  );
}

function KitchenStatusView() {
  return (
    <div data-tour="cd-kitchen" className="flex h-full flex-col px-4 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-brand">
            Pedido #C1247 · Mesa 10
          </p>
          <h2 className="font-display text-[14px] font-bold text-brand">
            Acompanhe seu pedido
          </h2>
        </div>
        <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warning">
          Em preparo
        </span>
      </div>

      <div className="rounded-2xl border border-brand/10 bg-brand-ghost p-3">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-[17px] top-2 bottom-2 w-px border-l-2 border-dashed border-brand/20"
          />
          <div className="space-y-2.5">
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
                Icon: Bell,
                label: "Pronto na mesa",
                time: "Aguardando",
              },
            ].map((item, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full",
                    item.done && "bg-success text-white",
                    item.active && "bg-brand text-white shadow-brand",
                    !item.done && !item.active && "bg-white text-neutral-400",
                  )}
                >
                  <item.Icon size={16} strokeWidth={2} />
                  {item.active && (
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 rounded-full ring-2 ring-brand/40"
                    />
                  )}
                </span>
                <div className="flex-1">
                  <p className="font-display text-[11px] font-bold text-neutral-900">
                    {item.label}
                  </p>
                  <p className="text-[9px] text-neutral-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-xl bg-brand-ghost px-3 py-2">
        <div className="flex items-center gap-2">
          <Clock size={13} strokeWidth={2.25} className="text-brand" />
          <span className="font-display text-[11px] font-bold text-brand">
            Tempo estimado
          </span>
        </div>
        <span className="font-display text-[14px] font-bold text-brand tabular-nums">
          14 min
        </span>
      </div>
    </div>
  );
}

function BottomNav({ step }: { step: number }) {
  const items = [
    { id: "home", Icon: Home, label: "Início", active: step === 0 },
    { id: "menu", Icon: BookOpen, label: "Cardápio", active: step === 1 },
    {
      id: "orders",
      Icon: ShoppingBag,
      label: "Pedidos",
      active: step >= 2,
    },
    { id: "account", Icon: User, label: "Conta", active: false },
  ];
  return (
    <nav
      className="relative flex items-center justify-around border-t border-neutral-100 bg-white py-1"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), 0 -1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "relative flex flex-col items-center gap-0.5 px-3 py-1",
            item.active ? "text-brand" : "text-neutral-400",
          )}
        >
          {item.active && (
            <motion.span
              layoutId="cd-nav-active"
              className="absolute -top-1 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          )}
          <item.Icon size={18} strokeWidth={item.active ? 2.5 : 2} />
          <span
            className="font-ui text-[9.5px] font-bold"
            style={{ letterSpacing: "-0.005em" }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
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
          mundoanimal.cardapio.teknisa.com
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
