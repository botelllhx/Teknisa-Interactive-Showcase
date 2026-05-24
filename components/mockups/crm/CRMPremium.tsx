"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  Home,
  Wallet,
  UserRound,
  ChevronLeft,
  Wifi,
  Bell,
  ShoppingBasket,
  GlassWater,
  Store,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useTourLive } from "@/lib/tourState";
import { food, venues, pexels } from "@/lib/photos";

interface CRMPremiumProps {
  step: number;
}

// ============================================================================
// Premium Club mobile app. Dark theme + amber accent (própria identidade
// do programa de fidelidade). Narrativa: cliente abre o app, vê o saldo,
// escolhe um parceiro próximo, simula uma compra e o cashback é creditado
// em tempo real com animação e push notification. Não é "chat com IA",
// é uma experiência de fidelidade que de fato funciona.
// ============================================================================

const COLORS = {
  bg: "#0d0e14",
  bgLayer: "#1a1d29",
  bgCard: "#22253a",
  amber: "#f59e0b",
  amberSoft: "rgba(245,158,11,0.15)",
  textMuted: "#9aa0b4",
  brand: "#020788",
  brandLight: "#3b42c4",
};

interface Establishment {
  id: string;
  name: string;
  category: "Restaurante" | "Bar" | "Mercado";
  rating: number;
  distance: string;
  bg: string;
  initial: string;
  cashbackPct: number;
  banner?: string;
  photoId?: number;
}

const STORES: Establishment[] = [
  {
    id: "kharina",
    name: "Kharina",
    category: "Restaurante",
    rating: 4.6,
    distance: "320 m",
    bg: "linear-gradient(135deg, #d97706 0%, #92400e 60%, #451a03 100%)",
    initial: "K",
    cashbackPct: 10,
    banner: "Dia das Mães · 10% de cashback",
    photoId: food.beefSteak.id, // restaurante de carnes
  },
  {
    id: "madero",
    name: "Madero",
    category: "Restaurante",
    rating: 4.4,
    distance: "650 m",
    bg: "linear-gradient(135deg, #c2410c 0%, #7c2d12 60%, #431407 100%)",
    initial: "M",
    cashbackPct: 8,
    photoId: food.burgerCheese.id, // Madero é hamburgueria
  },
  {
    id: "baked",
    name: "Baked Potato",
    category: "Restaurante",
    rating: 4.7,
    distance: "1,2 km",
    bg: "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
    initial: "B",
    cashbackPct: 12,
    photoId: venues.restaurantModern.id, // interior moderno (verified)
  },
  {
    id: "publico",
    name: "Público Bar",
    category: "Bar",
    rating: 4.3,
    distance: "800 m",
    bg: "linear-gradient(135deg, #92400e 0%, #422006 60%, #1c1207 100%)",
    initial: "P",
    cashbackPct: 5,
    photoId: venues.coffeeShop.id, // ambiente de café/bar (verified)
  },
];

interface Promo {
  id: string;
  storeId: string;
  name: string;
  desc: string;
  price: number;
  bg: string;
  photoId?: number;
  oldPrice?: number;
}

const PROMOS: Promo[] = [
  {
    id: "p1",
    storeId: "kharina",
    name: "Combo Cheese Frango",
    desc: "Filé crocante, batata gourmet, suco natural",
    price: 48.0,
    oldPrice: 56.0,
    bg: "linear-gradient(135deg, #fbbf24 0%, #b45309 60%, #451a03 100%)",
    photoId: food.chickenRoasted.id,
  },
  {
    id: "p2",
    storeId: "kharina",
    name: "Combo Família",
    desc: "4 lanches + 4 bebidas + porção de fritas G",
    price: 89.0,
    oldPrice: 104.0,
    bg: "linear-gradient(135deg, #f59e0b 0%, #92400e 60%, #422006 100%)",
    photoId: food.burgerCheese.id,
  },
  {
    id: "p3",
    storeId: "kharina",
    name: "Combo Light",
    desc: "Wrap de frango, salada quinoa, suco verde",
    price: 36.0,
    bg: "linear-gradient(135deg, #fde68a 0%, #ca8a04 60%, #713f12 100%)",
    photoId: food.saladBowl.id,
  },
];

interface CashbackEntry {
  id: string;
  store: string;
  date: string;
  amount: number;
  purchase?: number;
  isNew?: boolean;
}

const HISTORY_INITIAL: CashbackEntry[] = [
  { id: "h1", store: "Kharina", date: "10/05/2026", amount: 12.0, purchase: 120.0 },
  { id: "h2", store: "Madero", date: "08/05/2026", amount: 6.5, purchase: 65.0 },
  { id: "h3", store: "Baked Potato", date: "04/05/2026", amount: -10.0 },
  {
    id: "h4",
    store: "Baked Potato",
    date: "29/04/2026",
    amount: 18.0,
    purchase: 180.0,
  },
];

// ============================================================================
// Component
// ============================================================================

type Tab = "inicio" | "parceiros" | "saldo" | "perfil";
type CheckoutStage = "idle" | "review" | "processing" | "success";

export function CRMPremiumMockup({ step }: CRMPremiumProps) {
  const [tab, setTab] = useState<Tab>("inicio");
  const [openStore, setOpenStore] = useState<Establishment | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promo>(PROMOS[1]);
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>("idle");
  const [balance, setBalance] = useState<number>(26.5); // starts net of history
  const [history, setHistory] = useState<CashbackEntry[]>(HISTORY_INITIAL);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Tour-driven screen transitions. Only triggers on step entry, doesn't
  // fight user back actions (the effect ignores other state changes).
  //
  // Step 5 is "push": SuccessOverlay is still celebrating + the toast
  // slides in. We must NOT close the store/checkout here — that would kill
  // the celebration. Only at step 6 (histórico) do we navigate to Saldo.
  useEffect(() => {
    if (step === 1) {
      setOpenStore(null);
      setTab("inicio");
    } else if (step === 2) {
      setOpenStore(STORES[0]);
      setCheckoutStage("idle");
    } else if (step >= 6) {
      setTab("saldo");
      setOpenStore(null);
      setCheckoutStage("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Confirm payment: animates balance, adds history entry, fires notification
  const confirmPayment = () => {
    setCheckoutStage("processing");
    setTimeout(() => {
      const cashback = +(selectedPromo.price * (openStore?.cashbackPct ?? 10) / 100).toFixed(2);
      const newEntry: CashbackEntry = {
        id: `new-${Date.now()}`,
        store: openStore?.name ?? "Kharina",
        date: "22/05/2026",
        amount: cashback,
        purchase: selectedPromo.price,
        isNew: true,
      };
      setHistory((p) => [newEntry, ...p]);
      setBalance((b) => +(b + cashback).toFixed(2));
      setCheckoutStage("success");
      setTimeout(() => setNotificationVisible(true), 600);
    }, 1300);
  };

  const lastCashback = useMemo(
    () =>
      +(selectedPromo.price * (openStore?.cashbackPct ?? 10) / 100).toFixed(2),
    [selectedPromo, openStore],
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      crmTab: tab,
      crmStoreOpen: openStore?.name ?? null,
      crmCashbackTotal: balance,
      crmCheckoutStage: checkoutStage,
      crmLastCashback: lastCashback,
      crmHistoryCount: history.length,
    });
  }, [tab, openStore, balance, checkoutStage, lastCashback, history.length, patchLive]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden font-ui"
      style={{ background: COLORS.bg, color: "white" }}
    >
      <StatusBar />

      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!openStore && tab === "inicio" && (
            <HomeScreen
              key="home"
              balance={balance}
              onOpen={setOpenStore}
            />
          )}
          {!openStore && tab === "parceiros" && (
            <ParceirosScreen key="parc" onOpen={setOpenStore} />
          )}
          {!openStore && tab === "saldo" && (
            <SaldoScreen
              key="saldo"
              balance={balance}
              history={history}
            />
          )}
          {!openStore && tab === "perfil" && (
            <PerfilScreen key="perfil" total={balance} historyLen={history.length} />
          )}
          {openStore && (
            <StoreScreen
              key={`store-${openStore.id}`}
              store={openStore}
              selectedPromo={selectedPromo}
              onPickPromo={setSelectedPromo}
              onCheckout={() => setCheckoutStage("review")}
              onBack={() => setOpenStore(null)}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomNav tab={tab} onPick={(t) => { setTab(t); setOpenStore(null); }} />

      {/* Push notification */}
      <AnimatePresence>
        {notificationVisible && (
          <PushNotification
            cashback={lastCashback}
            store={openStore?.name ?? "Kharina"}
            onClose={() => setNotificationVisible(false)}
          />
        )}
      </AnimatePresence>

      {/* Checkout sheet & success overlay */}
      <AnimatePresence>
        {checkoutStage === "review" && openStore && (
          <CheckoutSheet
            store={openStore}
            promo={selectedPromo}
            cashback={lastCashback}
            onClose={() => setCheckoutStage("idle")}
            onConfirm={confirmPayment}
          />
        )}
        {checkoutStage === "processing" && <ProcessingOverlay />}
        {checkoutStage === "success" && (
          <SuccessOverlay
            cashback={lastCashback}
            balance={balance}
            onClose={() => setCheckoutStage("idle")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Status bar
// ============================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-white">
      <span className="font-ui text-[12px] font-bold tabular-nums">12:30</span>
      <div className="flex items-center gap-1.5">
        <Wifi size={11} strokeWidth={2.5} className="opacity-80" />
        <span className="text-[10.5px] font-bold tabular-nums opacity-80">62%</span>
      </div>
    </div>
  );
}

// ============================================================================
// Home screen
// ============================================================================

function HomeScreen({
  balance,
  onOpen,
}: {
  balance: number;
  onOpen: (s: Establishment) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-3">
        <div className="leading-tight">
          <p
            className="font-display text-[22px] font-bold"
            style={{
              color: COLORS.amber,
              letterSpacing: "0.10em",
            }}
          >
            PREMIUM
            <span
              className="ml-1.5 font-light text-white"
              style={{ letterSpacing: "0.14em" }}
            >
              CLUB
            </span>
          </p>
          <Image
            src="/logo-teknisa-white.svg"
            alt="Teknisa"
            width={50}
            height={9}
            className="mt-1.5 opacity-60"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: COLORS.bgLayer,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.18)",
          }}
        >
          <UserRound
            size={18}
            strokeWidth={2.25}
            style={{ color: COLORS.amber }}
          />
        </button>
      </div>

      <p
        className="mt-4 px-5 font-display text-[20px] font-bold text-white"
        style={{ letterSpacing: "-0.022em" }}
      >
        Olá, <span style={{ color: COLORS.amber }}>Thomas</span>
      </p>

      <div className="mx-5 mt-3">
        <CashbackCard balance={balance} />
      </div>

      <div className="mx-5 mt-4">
        <p className="font-ui text-[14px] font-bold text-white">
          O que você está procurando?
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[
            { id: "todos", label: "Todos", Icon: LayoutGrid },
            { id: "rest", label: "Restaurantes", Icon: GlassWater, active: true },
            { id: "bar", label: "Bares", Icon: GlassWater },
            { id: "merc", label: "Mercados", Icon: ShoppingBasket },
          ].map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 rounded-xl py-2.5"
              style={{
                background: c.active ? COLORS.amberSoft : COLORS.bgLayer,
                border: c.active ? `1px solid ${COLORS.amber}40` : "1px solid transparent",
              }}
            >
              <c.Icon
                size={18}
                strokeWidth={1.75}
                style={{ color: COLORS.amber }}
              />
              <span className="font-ui text-[10.5px] font-medium text-white">
                {c.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-4 pb-2" data-tour="crm-stores">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[14px] font-bold text-white">
            Próximos de você
          </p>
          <span className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
            {STORES.length} parceiros
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {STORES.slice(0, 4).map((s, i) => (
            <StoreCard
              key={s.id}
              store={s}
              onOpen={() => onOpen(s)}
              delay={i * 0.06}
              target={s.id === "kharina"}
            />
          ))}
        </div>
      </div>

      {/* Promoções imperdíveis — food product cards (referência /public CRM Premium home) */}
      <div className="mx-5 mt-3 pb-4">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[14px] font-bold text-white">
            Promoções imperdíveis
          </p>
          <button
            type="button"
            className="text-[10.5px] font-medium"
            style={{ color: COLORS.amber }}
          >
            Ver todas →
          </button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PROMOS.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.22 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const store = STORES.find((s) => s.id === p.storeId);
                if (store) onOpen(store);
              }}
              className="overflow-hidden rounded-xl text-left"
              style={{ background: COLORS.bgLayer }}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {p.photoId ? (
                  <Image
                    src={pexels(p.photoId, { w: 200, h: 200, fit: "crop" })}
                    alt={p.name}
                    fill
                    unoptimized
                    sizes="108px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: p.bg }} />
                )}
                {p.oldPrice && (
                  <span
                    className="absolute right-1 top-1 rounded-full px-1 py-px text-[7px] font-bold uppercase text-black shadow"
                    style={{ background: COLORS.amber }}
                  >
                    {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-1.5">
                <p className="font-ui text-[10.5px] font-bold leading-tight text-white line-clamp-2">
                  {p.name}
                </p>
                <div className="mt-0.5 flex items-baseline gap-1">
                  {p.oldPrice && (
                    <span
                      className="text-[7px] tabular-nums line-through"
                      style={{ color: COLORS.textMuted }}
                    >
                      R${p.oldPrice.toFixed(0)}
                    </span>
                  )}
                  <span
                    className="font-ui text-[10.5px] font-bold tabular-nums"
                    style={{ color: COLORS.amber }}
                  >
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CashbackCard({ balance }: { balance: number }) {
  return (
    <motion.div
      data-tour="crm-cashback-card"
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
      }}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[1.5px] text-white/75">
            Saldo Premium Club
          </p>
          <p className="mt-3 text-[12px] text-white/70">
            Disponível agora
          </p>
          <motion.p
            key={balance}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mt-0.5 font-ui text-[30px] font-bold tabular-nums text-white"
          >
            R${" "}
            {balance.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </motion.p>
        </div>
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(245,158,11,0.25)", color: COLORS.amber }}
        >
          <Sparkles size={18} strokeWidth={2.25} />
        </motion.span>
      </div>

      <div className="relative mt-3 flex items-center justify-between">
        <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.7)" }}>
          Use em qualquer parceiro do Premium Club
        </p>
        <p
          className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider"
          style={{ background: COLORS.amber, color: "#000" }}
        >
          +10% no Kharina hoje
        </p>
      </div>

      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.08, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.30), transparent 70%)",
        }}
      />
    </motion.div>
  );
}

function StoreCard({
  store,
  onOpen,
  delay,
  target,
}: {
  store: Establishment;
  onOpen: () => void;
  delay: number;
  target: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onOpen}
      data-tour={target ? "crm-store-kharina" : undefined}
      className="relative overflow-hidden rounded-xl text-left"
      style={{ background: COLORS.bgLayer }}
    >
      <div className="relative h-20 w-full overflow-hidden">
        {store.photoId ? (
          <Image
            src={pexels(store.photoId, { w: 320, h: 200, fit: "crop" })}
            alt={store.name}
            fill
            unoptimized
            sizes="160px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: store.bg }} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
        />
        <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-brand shadow-card backdrop-blur">
          <span className="font-ui text-[14px] font-bold">{store.initial}</span>
        </div>
        {target && (
          <motion.span
            animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10.5px] font-bold text-black"
            style={{ background: COLORS.amber }}
          >
            10% CASHBACK
          </motion.span>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-ui text-[13px] font-bold text-white">{store.name}</p>
        <p
          className="text-[10.5px]"
          style={{ color: COLORS.textMuted }}
        >
          {store.category} · {store.distance}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={10}
                strokeWidth={2}
                className={
                  n <= Math.round(store.rating) ? "" : "opacity-30"
                }
                style={{
                  color: COLORS.amber,
                  fill: n <= Math.round(store.rating) ? COLORS.amber : "none",
                }}
              />
            ))}
          </span>
          <span
            className="font-ui text-[11px] font-bold tabular-nums"
            style={{ color: COLORS.amber }}
          >
            {store.cashbackPct}%
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Store screen
// ============================================================================

function StoreScreen({
  store,
  selectedPromo,
  onPickPromo,
  onCheckout,
  onBack,
}: {
  store: Establishment;
  selectedPromo: Promo;
  onPickPromo: (p: Promo) => void;
  onCheckout: () => void;
  onBack: () => void;
}) {
  const promos = PROMOS.filter((p) => p.storeId === store.id);
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Hero photo */}
      <div className="relative h-32 w-full flex-none overflow-hidden">
        {store.photoId ? (
          <Image
            src={pexels(store.photoId, { w: 600, h: 400, fit: "crop" })}
            alt={store.name}
            fill
            unoptimized
            sizes="320px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0" style={{ background: store.bg }} />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
        />
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label="Favoritar"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur"
        >
          <Heart size={14} strokeWidth={2.25} className="fill-red-500 text-red-500" />
        </button>
      </div>

      {/* Store info */}
      <div
        className="-mt-6 mx-4 mb-3 flex items-center gap-3 rounded-xl p-3"
        style={{ background: COLORS.bgCard }}
      >
        <span
          className="flex h-12 w-12 flex-none items-center justify-center rounded-md"
          style={{ background: COLORS.bg }}
        >
          <span className="font-ui text-[18px] font-bold text-white">
            {store.initial}
          </span>
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-ui text-[15px] font-bold text-white">{store.name}</p>
          <p className="flex items-center gap-1 text-[10.5px]" style={{ color: COLORS.textMuted }}>
            <MapPin size={9} strokeWidth={2.25} />
            {store.category} · {store.distance}
          </p>
          <span className="mt-1 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={9}
                strokeWidth={2}
                className={n <= Math.round(store.rating) ? "" : "opacity-30"}
                style={{
                  color: COLORS.amber,
                  fill: n <= Math.round(store.rating) ? COLORS.amber : "none",
                }}
              />
            ))}
            <span className="ml-1 text-[10.5px] text-white/65">
              {store.rating.toFixed(1)}
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3">
        {/* Promo banner */}
        {store.banner && (
          <motion.div
            data-tour="crm-promo-banner"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="relative overflow-hidden rounded-xl p-3.5"
            style={{ background: COLORS.amberSoft, border: `1px solid ${COLORS.amber}30` }}
          >
            <div className="flex items-start gap-2.5">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full"
                style={{ background: COLORS.amber, color: "#000" }}
              >
                <Sparkles size={16} strokeWidth={2.25} />
              </motion.span>
              <div>
                <p
                  className="font-ui text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: COLORS.amber }}
                >
                  Oferta exclusiva
                </p>
                <p className="font-ui text-[14px] font-bold text-white">
                  {store.banner}
                </p>
                <p className="mt-0.5 text-[11px] text-white/70">
                  Válido só hoje · Combos selecionados
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Promotions */}
        <p className="mt-4 font-ui text-[12px] font-bold uppercase tracking-wider text-white/65">
          Promoções com Premium Club
        </p>
        <div data-tour="crm-promo-pick" className="mt-2 space-y-2">
          {promos.map((p) => {
            const active = p.id === selectedPromo.id;
            const cashback = +(p.price * store.cashbackPct / 100).toFixed(2);
            return (
              <motion.button
                key={p.id}
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => onPickPromo(p)}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all"
                style={{
                  background: active ? COLORS.amberSoft : COLORS.bgLayer,
                  border: active
                    ? `2px solid ${COLORS.amber}`
                    : "2px solid transparent",
                }}
              >
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg">
                  {p.photoId ? (
                    <Image
                      src={pexels(p.photoId, { w: 128, h: 128, fit: "crop" })}
                      alt={p.name}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: p.bg }} />
                  )}
                  {p.oldPrice && (
                    <span
                      className="absolute left-1 top-1 rounded-full px-1 py-px text-[7px] font-bold uppercase tracking-wider text-black shadow"
                      style={{ background: COLORS.amber }}
                    >
                      {Math.round(
                        ((p.oldPrice - p.price) / p.oldPrice) * 100,
                      )}
                      % off
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-[12px] font-bold leading-tight text-white">
                    {p.name}
                  </p>
                  <p
                    className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug"
                    style={{ color: COLORS.textMuted }}
                  >
                    {p.desc}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span
                      className="font-ui text-[14px] font-bold tabular-nums"
                      style={{ color: COLORS.amber }}
                    >
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </span>
                    {p.oldPrice && (
                      <span
                        className="font-ui text-[10.5px] tabular-nums line-through"
                        style={{ color: COLORS.textMuted }}
                      >
                        R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <p
                    className="font-ui text-[10.5px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS.textMuted }}
                  >
                    Cashback
                  </p>
                  <p
                    className="font-ui text-[13px] font-bold tabular-nums"
                    style={{ color: "#22c55e" }}
                  >
                    +R$ {cashback.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sticky checkout */}
      <div
        data-tour="crm-checkout-cta"
        className="flex items-center justify-between gap-3 border-t border-white/8 px-4 py-3"
        style={{ background: COLORS.bg }}
      >
        <div className="leading-tight">
          <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
            Total selecionado
          </p>
          <p className="font-ui text-[17px] font-bold tabular-nums text-white">
            R$ {selectedPromo.price.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onCheckout}
          className="flex-1 rounded-xl py-3 font-ui text-[14px] font-bold text-black"
          style={{ background: COLORS.amber }}
        >
          Simular pagamento
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Checkout sheet
// ============================================================================

function CheckoutSheet({
  store,
  promo,
  cashback,
  onClose,
  onConfirm,
}: {
  store: Establishment;
  promo: Promo;
  cashback: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-40 flex flex-col justify-end bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-t-2xl px-5 pb-5 pt-3"
        style={{ background: COLORS.bg }}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20" />
        <p className="font-ui text-[16px] font-bold text-white">
          Confirmar pagamento
        </p>
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: COLORS.textMuted }}
        >
          {store.name} · {store.category}
        </p>

        <div
          className="mt-4 flex items-center gap-3 rounded-xl p-3"
          style={{ background: COLORS.bgLayer }}
        >
          <div
            className="h-12 w-12 flex-none rounded-md"
            style={{ background: promo.bg }}
          />
          <div className="flex-1">
            <p className="font-ui text-[12px] font-bold text-white">
              {promo.name}
            </p>
            <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
              {promo.desc}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-[12px]">
          <Row label="Valor da compra" value={`R$ ${promo.price.toFixed(2).replace(".", ",")}`} />
          <Row label={`Cashback ${store.cashbackPct}%`} value={`+ R$ ${cashback.toFixed(2).replace(".", ",")}`} tint="#22c55e" />
          <div className="my-2 h-px bg-white/10" />
          <div className="flex items-center justify-between">
            <span className="font-ui text-[13px] font-bold text-white">
              Total
            </span>
            <span className="font-ui text-[18px] font-bold tabular-nums text-white">
              R$ {promo.price.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div
          className="mt-3 flex items-start gap-2 rounded-md px-3 py-2 text-[11px]"
          style={{ background: COLORS.amberSoft, color: COLORS.amber }}
        >
          <Sparkles size={12} strokeWidth={2.25} className="mt-0.5" />
          Você vai receber {`R$ ${cashback.toFixed(2).replace(".", ",")}`} de cashback ao confirmar.
        </div>

        <motion.button
          type="button"
          data-tour="crm-confirm-payment"
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          className="mt-4 w-full rounded-xl py-3 font-ui text-[14px] font-bold text-black"
          style={{ background: COLORS.amber }}
        >
          Confirmar pagamento
        </motion.button>
        <button
          type="button"
          onClick={onClose}
          className="mt-1.5 w-full rounded-xl py-2.5 font-ui text-[12px] font-medium text-white/70"
        >
          Cancelar
        </button>
      </motion.div>
    </motion.div>
  );
}

function Row({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: COLORS.textMuted }}>{label}</span>
      <span
        className="font-ui font-bold tabular-nums"
        style={{ color: tint ?? "white" }}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================================
// Processing overlay
// ============================================================================

function ProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-md"
      style={{ background: "rgba(13,14,20,0.85)" }}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            border: `3px solid ${COLORS.amber}40`,
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            border: `3px solid transparent`,
            borderTopColor: COLORS.amber,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.35), transparent 70%)",
            filter: "blur(4px)",
          }}
        />
      </div>
      <p className="font-ui text-[14px] font-bold text-white">
        Processando pagamento...
      </p>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-[11px]"
        style={{ color: COLORS.textMuted }}
      >
        Confirmando com o parceiro
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// Success overlay with confetti + counter animation
// ============================================================================

function SuccessOverlay({
  cashback,
  balance,
  onClose,
}: {
  cashback: number;
  balance: number;
  onClose: () => void;
}) {
  // Auto dismiss after 4s
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-md"
      style={{ background: "rgba(13,14,20,0.85)" }}
      onClick={onClose}
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full text-black"
        style={{
          background: COLORS.amber,
          boxShadow: `0 0 40px ${COLORS.amber}80, 0 0 80px ${COLORS.amber}40`,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ background: COLORS.amber }}
        />
        <CheckCircle2 size={40} strokeWidth={2.5} />
      </motion.div>

      <p className="font-ui text-[18px] font-bold text-white">
        Pagamento aprovado
      </p>
      <motion.p
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 16 }}
        className="font-ui text-[28px] font-bold tabular-nums"
        style={{ color: COLORS.amber }}
      >
        +R$ {cashback.toFixed(2).replace(".", ",")}
      </motion.p>
      <p className="text-[12px]" style={{ color: COLORS.textMuted }}>
        creditados no seu Premium Club
      </p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 rounded-xl px-4 py-2 text-center"
        style={{ background: COLORS.bgLayer, border: `1px solid ${COLORS.amber}40` }}
      >
        <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
          Novo saldo
        </p>
        <p
          className="font-ui text-[20px] font-bold tabular-nums"
          style={{ color: "white" }}
        >
          R${" "}
          {balance.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}

function Confetti() {
  // Deterministic particles flying out
  const parts = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const a = ((seed / 233280) * 360 * Math.PI) / 180;
        const r = ((seed * 1664525) % 233280) / 233280;
        const c = ["#f59e0b", "#fbbf24", "#fde68a", "#a4b1ff"][i % 4];
        return {
          dx: Math.cos(a) * (120 + r * 100),
          dy: Math.sin(a) * (120 + r * 100),
          delay: r * 0.3,
          color: c,
          size: 4 + r * 4,
        };
      }),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 block rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Push notification
// ============================================================================

function PushNotification({
  cashback,
  store,
  onClose,
}: {
  cashback: number;
  store: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 6500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      data-tour="crm-push"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="absolute inset-x-4 top-4 z-[60] flex items-start gap-2.5 overflow-hidden rounded-xl p-3 backdrop-blur"
      style={{
        background: "rgba(26,29,41,0.95)",
        border: `1px solid ${COLORS.amber}40`,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
      }}
    >
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-md"
        style={{ background: COLORS.amber, color: "#000" }}
      >
        <Bell size={15} strokeWidth={2.25} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider" style={{ color: COLORS.amber }}>
          Premium Club
          <span className="text-white/40">·</span>
          <span className="text-white/50">agora</span>
        </p>
        <p className="mt-0.5 font-ui text-[12px] font-bold text-white">
          Você ganhou R$ {cashback.toFixed(2).replace(".", ",")} em cashback!
        </p>
        <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
          {store} · vence em 180 dias
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Parceiros / Saldo / Perfil tabs
// ============================================================================

function ParceirosScreen({
  onOpen,
}: {
  onOpen: (s: Establishment) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto px-5 pt-3"
    >
      <p
        className="font-ui text-[20px] font-bold tracking-wider"
        style={{ color: COLORS.amber }}
      >
        Parceiros
      </p>
      <p className="mt-1 text-[12px]" style={{ color: COLORS.textMuted }}>
        {STORES.length} estabelecimentos com cashback ativo
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 pb-3">
        {STORES.map((s, i) => (
          <StoreCard
            key={s.id}
            store={s}
            onOpen={() => onOpen(s)}
            delay={i * 0.05}
            target={false}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SaldoScreen({
  balance,
  history,
}: {
  balance: number;
  history: CashbackEntry[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto px-5 pt-3"
    >
      <p
        className="font-ui text-[20px] font-bold tracking-wider"
        style={{ color: COLORS.amber }}
      >
        Saldo
      </p>

      <div className="mt-3 rounded-2xl p-4" style={{ background: COLORS.bgLayer }}>
        <p
          className="font-ui text-[12px] font-medium"
          style={{ color: COLORS.textMuted }}
        >
          Saldo disponível
        </p>
        <motion.p
          key={balance}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mt-1 font-ui text-[30px] font-bold tabular-nums text-white"
        >
          R${" "}
          {balance.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </motion.p>
        <p
          className="mt-1 font-ui text-[10.5px]"
          style={{ color: COLORS.textMuted }}
        >
          Use em qualquer parceiro do Premium Club.
        </p>
      </div>

      <p
        className="mt-4 font-ui text-[12px] font-bold uppercase tracking-wider"
        style={{ color: COLORS.amber }}
      >
        Movimentações
      </p>
      <div data-tour="crm-history" className="mt-2 space-y-2 pb-3">
        {history.map((h, i) => {
          const positive = h.amount > 0;
          return (
            <motion.div
              key={h.id}
              layout
              initial={
                h.isNew
                  ? { opacity: 0, x: -12, scale: 0.96 }
                  : { opacity: 0, y: 4 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={
                h.isNew
                  ? { type: "spring", stiffness: 220, damping: 18 }
                  : { delay: i * 0.04 }
              }
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                background: h.isNew ? COLORS.amberSoft : COLORS.bgLayer,
                border: h.isNew
                  ? `1px solid ${COLORS.amber}`
                  : "1px solid transparent",
                position: "relative",
              }}
            >
              {h.isNew && (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider"
                  style={{ background: COLORS.amber, color: "#000" }}
                >
                  Novo
                </motion.span>
              )}
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-bold"
                style={{
                  background: positive
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.18)",
                  color: positive ? "#22c55e" : "#ef4444",
                }}
              >
                {positive ? "+" : "−"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-ui text-[12px] font-bold text-white">
                  {h.store}
                </p>
                <p
                  className="text-[10.5px]"
                  style={{ color: COLORS.textMuted }}
                >
                  {h.date}
                  {h.purchase
                    ? ` · compra R$ ${h.purchase.toFixed(2).replace(".", ",")}`
                    : ""}
                </p>
              </div>
              <p
                className="font-ui text-[14px] font-bold tabular-nums"
                style={{ color: positive ? "#22c55e" : "#ef4444" }}
              >
                {positive ? "+" : "−"} R${" "}
                {Math.abs(h.amount).toFixed(2).replace(".", ",")}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function PerfilScreen({
  total,
  historyLen,
}: {
  total: number;
  historyLen: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto px-5 pt-3"
    >
      <p
        className="font-ui text-[20px] font-bold tracking-wider"
        style={{ color: COLORS.amber }}
      >
        Perfil
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: COLORS.amberSoft, color: COLORS.amber }}
        >
          <span className="font-ui text-[22px] font-bold">T</span>
        </span>
        <div>
          <p className="font-ui text-[16px] font-bold text-white">
            Thomas Rocha
          </p>
          <p
            className="text-[11px]"
            style={{ color: COLORS.textMuted }}
          >
            Membro Premium desde 2024
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: COLORS.bgLayer }}>
          <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
            Cashback disponível
          </p>
          <p
            className="mt-1 font-ui text-[16px] font-bold tabular-nums"
            style={{ color: COLORS.amber }}
          >
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: COLORS.bgLayer }}>
          <p className="text-[10.5px]" style={{ color: COLORS.textMuted }}>
            Compras
          </p>
          <p className="mt-1 font-ui text-[16px] font-bold tabular-nums text-white">
            {historyLen}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Bottom nav
// ============================================================================

function BottomNav({
  tab,
  onPick,
}: {
  tab: Tab;
  onPick: (t: Tab) => void;
}) {
  const items: { id: Tab; label: string; Icon: typeof Home }[] = [
    { id: "inicio", label: "Início", Icon: Home },
    { id: "parceiros", label: "Parceiros", Icon: Store },
    { id: "saldo", label: "Saldo", Icon: Wallet },
    { id: "perfil", label: "Perfil", Icon: UserRound },
  ];
  return (
    <nav
      data-tour="crm-nav"
      className="relative grid grid-cols-4 border-t border-white/10"
      style={{ background: COLORS.bg }}
    >
      {items.map((it) => {
        const active = it.id === tab;
        return (
          <motion.button
            key={it.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            data-tour={it.id === "saldo" ? "crm-nav-saldo" : undefined}
            onClick={() => onPick(it.id)}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5"
          >
            <it.Icon
              size={18}
              strokeWidth={active ? 2.5 : 2}
              style={{ color: active ? COLORS.amber : COLORS.textMuted }}
            />
            <span
              className="font-ui text-[10.5px] font-bold"
              style={{ color: active ? COLORS.amber : COLORS.textMuted }}
            >
              {it.label}
            </span>
            {active && (
              <motion.span
                layoutId="crm-tab-pill"
                className="absolute bottom-0 h-0.5 w-12 rounded-full"
                style={{ background: COLORS.amber }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
