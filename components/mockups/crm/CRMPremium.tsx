"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Star,
  Heart,
  Home,
  Wallet,
  UserRound,
  ChevronLeft,
  Wifi,
  ShoppingBasket,
  GlassWater,
  Store,
  LayoutGrid,
} from "lucide-react";
import { useTourLive } from "@/lib/tourState";

interface CRMPremiumProps {
  step: number;
}

// ============================================================================
// Premium Club is the mobile app of CRM Premium. Dark theme + amber accent
// reproducidos da referência (PREMIUM CLUB). Mantemos navy como apoio.
// ============================================================================

const COLORS = {
  bg: "#0d0e14",
  bgLayer: "#1a1d29",
  bgCard: "#22253a",
  amber: "#f59e0b",
  amberSoft: "rgba(245,158,11,0.15)",
  textMuted: "#9aa0b4",
};

interface Establishment {
  id: string;
  name: string;
  category: "Restaurante" | "Bar" | "Mercado";
  rating: number; // 0..5
  distance: string;
  bg: string;
  initial: string;
  cashbackPct: number;
}

const ESTABLISHMENTS: Establishment[] = [
  {
    id: "kharina",
    name: "Kharina",
    category: "Restaurante",
    rating: 4.6,
    distance: "320 m",
    bg: "linear-gradient(135deg, #d97706 0%, #92400e 60%, #451a03 100%)",
    initial: "K",
    cashbackPct: 10,
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
  },
];

interface Promo {
  id: string;
  store: string;
  storeId: string;
  name: string;
  desc: string;
  oldPrice: number;
  price: number;
  bg: string;
}

const PROMOS: Promo[] = [
  {
    id: "p1",
    store: "Kharina",
    storeId: "kharina",
    name: "Combo Cheese Frango",
    desc: "Filé crocante, batata gourmet, suco",
    oldPrice: 62.5,
    price: 48.0,
    bg: "linear-gradient(135deg, #fbbf24 0%, #b45309 60%, #451a03 100%)",
  },
  {
    id: "p2",
    store: "Madero",
    storeId: "madero",
    name: "Combo Madero Bacon + Coca Cola",
    desc: "Burger artesanal, fritas e refrigerante",
    oldPrice: 58.9,
    price: 46.0,
    bg: "linear-gradient(135deg, #c2410c 0%, #7c2d12 60%, #422006 100%)",
  },
  {
    id: "p3",
    store: "Madero",
    storeId: "madero",
    name: "Batata Strogonoff de Frango",
    desc: "Receita assinada com pimenta-do-reino",
    oldPrice: 42.9,
    price: 36.0,
    bg: "linear-gradient(135deg, #b45309 0%, #78350f 60%, #422006 100%)",
  },
];

interface CashbackEntry {
  id: string;
  store: string;
  date: string;
  amount: number; // positivo: ganho; negativo: usado
  purchase?: number;
}

const HISTORY: CashbackEntry[] = [
  { id: "h1", store: "Kharina", date: "10/05/2026", amount: 12.0, purchase: 120.0 },
  { id: "h2", store: "Madero", date: "08/05/2026", amount: 6.5, purchase: 65.0 },
  { id: "h3", store: "Baked Potato", date: "04/05/2026", amount: -10.0 },
  { id: "h4", store: "Baked Potato", date: "29/04/2026", amount: 18.0, purchase: 180.0 },
];

// ============================================================================
// Component
// ============================================================================

type Tab = "inicio" | "parceiros" | "saldo" | "perfil";

export function CRMPremiumMockup({ step }: CRMPremiumProps) {
  void step;
  const [tab, setTab] = useState<Tab>("inicio");
  const [openStore, setOpenStore] = useState<Establishment | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["kharina"]));
  const [cashbackDetail, setCashbackDetail] = useState<CashbackEntry | null>(null);

  const toggleFav = (id: string) =>
    setFavorites((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalCashback = useMemo(
    () => HISTORY.reduce((s, h) => s + h.amount, 0),
    [],
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      crmTab: tab,
      crmStoreOpen: openStore?.name ?? null,
      crmFavCount: favorites.size,
      crmCashbackTotal: totalCashback,
    });
  }, [tab, openStore, favorites.size, totalCashback, patchLive]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden font-ui"
      style={{ background: COLORS.bg, color: "white" }}
    >
      <StatusBar />

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "inicio" && (
            <InicioView
              key="inicio"
              favorites={favorites}
              onToggleFav={toggleFav}
              onOpenStore={setOpenStore}
              totalCashback={totalCashback}
            />
          )}
          {tab === "parceiros" && (
            <ParceirosView
              key="parc"
              favorites={favorites}
              onToggleFav={toggleFav}
              onOpenStore={setOpenStore}
            />
          )}
          {tab === "saldo" && (
            <SaldoView
              key="saldo"
              history={HISTORY}
              total={totalCashback}
              onOpenDetail={setCashbackDetail}
            />
          )}
          {tab === "perfil" && <PerfilView key="perfil" total={totalCashback} />}
        </AnimatePresence>
      </main>

      <BottomNav tab={tab} onPick={setTab} />

      <AnimatePresence>
        {openStore && (
          <StoreDetailModal
            store={openStore}
            isFav={favorites.has(openStore.id)}
            onToggleFav={() => toggleFav(openStore.id)}
            onClose={() => setOpenStore(null)}
          />
        )}
        {cashbackDetail && (
          <CashbackDetailSheet
            entry={cashbackDetail}
            onClose={() => setCashbackDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Status bar + header
// ============================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-white">
      <span className="font-ui text-[12px] font-bold tabular-nums">12:30</span>
      <div className="flex items-center gap-1.5">
        <Wifi size={11} strokeWidth={2.5} className="opacity-80" />
        <span className="text-[10px] font-bold tabular-nums opacity-80">50%</span>
      </div>
    </div>
  );
}

// ============================================================================
// Início — main app screen
// ============================================================================

function InicioView({
  favorites,
  onToggleFav,
  onOpenStore,
  totalCashback,
}: {
  favorites: Set<string>;
  onToggleFav: (id: string) => void;
  onOpenStore: (s: Establishment) => void;
  totalCashback: number;
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
            className="font-ui text-[22px] font-bold tracking-wider"
            style={{ color: COLORS.amber }}
          >
            PREMIUM<span className="ml-1 font-light text-white">CLUB</span>
          </p>
          <Image
            src="/logo-teknisa-white.svg"
            alt="Teknisa"
            width={50}
            height={9}
            className="mt-1 opacity-60"
          />
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: COLORS.bgLayer }}
        >
          <UserRound size={18} strokeWidth={2} style={{ color: COLORS.amber }} />
        </button>
      </div>

      <p className="mt-4 px-5 font-ui text-[18px] font-medium">Olá, Thomas</p>

      {/* Search */}
      <div className="mx-5 mt-3" data-tour="crm-search">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-3"
          style={{ background: COLORS.bgLayer }}
        >
          <Search size={14} strokeWidth={2.25} className="opacity-50" />
          <span className="font-ui text-[13px] opacity-60">
            Procure por bares, restaurantes, ofertas
          </span>
        </div>
      </div>

      {/* Cashback card */}
      <div className="mx-5 mt-4" data-tour="crm-cashback-card">
        <CashbackCard total={totalCashback} />
      </div>

      {/* Categories */}
      <div className="mx-5 mt-4">
        <p className="font-ui text-[14px] font-bold text-white">
          O que você está procurando?
        </p>
        <div data-tour="crm-categories" className="mt-2 grid grid-cols-4 gap-2">
          {[
            { id: "todos", label: "Todos", Icon: LayoutGrid },
            { id: "rest", label: "Restaurantes", Icon: GlassWater },
            { id: "bar", label: "Bares", Icon: GlassWater },
            { id: "merc", label: "Mercados", Icon: ShoppingBasket },
          ].map((c) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1 rounded-xl py-2.5"
              style={{ background: COLORS.bgLayer }}
            >
              <c.Icon
                size={18}
                strokeWidth={1.75}
                style={{ color: COLORS.amber }}
              />
              <span className="font-ui text-[10px] font-medium text-white">
                {c.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Próximos de você */}
      <div className="mx-5 mt-4">
        <p className="font-ui text-[14px] font-bold text-white">
          Próximos de você
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ESTABLISHMENTS.slice(0, 4).map((e) => (
            <EstablishmentCard
              key={e.id}
              store={e}
              isFav={favorites.has(e.id)}
              onToggleFav={() => onToggleFav(e.id)}
              onOpen={() => onOpenStore(e)}
            />
          ))}
        </div>
      </div>

      {/* Promoções */}
      <div className="mx-5 mt-4">
        <p className="font-ui text-[14px] font-bold text-white">
          Promoções imperdíveis
        </p>
        <div data-tour="crm-promos" className="mt-2 grid grid-cols-3 gap-2 pb-3">
          {PROMOS.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              className="overflow-hidden rounded-xl text-left"
              style={{ background: COLORS.bgLayer }}
            >
              <div className="relative h-14 w-full" style={{ background: p.bg }} />
              <div className="p-1.5">
                <p className="font-ui text-[10px] font-bold leading-tight text-white line-clamp-2">
                  {p.name}
                </p>
                <p
                  className="mt-0.5 font-ui text-[9px]"
                  style={{ color: COLORS.textMuted }}
                >
                  {p.store}
                </p>
                <p
                  className="mt-1 text-[9px] line-through"
                  style={{ color: COLORS.textMuted }}
                >
                  R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                </p>
                <p
                  className="font-ui text-[12px] font-bold tabular-nums"
                  style={{ color: COLORS.amber }}
                >
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Cashback hero card
// ============================================================================

function CashbackCard({ total }: { total: number }) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
      }}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="font-ui text-[12px] font-bold uppercase tracking-[3px] text-white/80"
          >
            BAKED POTATO
          </p>
          <p className="mt-3 font-ui text-[12px] text-white/80">
            Cashback acumulado
          </p>
          <motion.p
            key={total}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-0.5 font-ui text-[26px] font-bold tabular-nums text-white"
          >
            R$ {total.toFixed(2).replace(".", ",")}
          </motion.p>
        </div>
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <span className="font-ui text-[10px] font-bold uppercase text-white">
            Ver ofertas
          </span>
        </motion.span>
      </div>

      {/* dots indicator */}
      <div className="relative mt-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1 rounded-full"
            style={{
              width: i === 0 ? 16 : 6,
              background: i === 0 ? "white" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* decorative pulses */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.08, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
        }}
      />
    </motion.div>
  );
}

// ============================================================================
// Establishment card (mini)
// ============================================================================

function EstablishmentCard({
  store,
  isFav,
  onToggleFav,
  onOpen,
}: {
  store: Establishment;
  isFav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden rounded-xl"
      style={{ background: COLORS.bgLayer }}
    >
      <button
        type="button"
        data-tour={store.id === "kharina" ? "crm-store-card" : undefined}
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div className="relative h-14 w-full" style={{ background: store.bg }}>
          <div className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-black/30 text-white">
            <span className="font-ui text-[12px] font-bold">{store.initial}</span>
          </div>
        </div>
        <div className="p-2">
          <p className="font-ui text-[12px] font-bold text-white line-clamp-1">
            {store.name}
          </p>
          <p
            className="font-ui text-[10px]"
            style={{ color: COLORS.textMuted }}
          >
            {store.category}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={9}
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
              className="font-ui text-[10px] font-bold tabular-nums"
              style={{ color: COLORS.amber }}
            >
              {store.cashbackPct}%
            </span>
          </div>
        </div>
      </button>
      <button
        type="button"
        aria-label="Favoritar"
        onClick={onToggleFav}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 backdrop-blur"
      >
        <Heart
          size={12}
          strokeWidth={2.25}
          style={{ color: isFav ? "#ef4444" : "white" }}
          className={isFav ? "fill-red-500" : ""}
        />
      </button>
    </motion.div>
  );
}

// ============================================================================
// Parceiros tab
// ============================================================================

function ParceirosView({
  favorites,
  onToggleFav,
  onOpenStore,
}: {
  favorites: Set<string>;
  onToggleFav: (id: string) => void;
  onOpenStore: (s: Establishment) => void;
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
      <p
        className="mt-1 font-ui text-[12px]"
        style={{ color: COLORS.textMuted }}
      >
        {ESTABLISHMENTS.length} estabelecimentos com cashback ativo
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 pb-3">
        {ESTABLISHMENTS.map((e) => (
          <EstablishmentCard
            key={e.id}
            store={e}
            isFav={favorites.has(e.id)}
            onToggleFav={() => onToggleFav(e.id)}
            onOpen={() => onOpenStore(e)}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Saldo tab
// ============================================================================

function SaldoView({
  history,
  total,
  onOpenDetail,
}: {
  history: CashbackEntry[];
  total: number;
  onOpenDetail: (h: CashbackEntry) => void;
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
        <p className="mt-1 font-ui text-[28px] font-bold tabular-nums text-white">
          R$ {total.toFixed(2).replace(".", ",")}
        </p>
        <p
          className="mt-1 font-ui text-[10px]"
          style={{ color: COLORS.textMuted }}
        >
          Pode ser usado em qualquer parceiro do Premium Club.
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
            <motion.button
              key={h.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-tour={i === 0 ? "crm-history-item" : undefined}
              onClick={() => onOpenDetail(h)}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left"
              style={{ background: COLORS.bgLayer }}
            >
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
                style={{
                  background: positive
                    ? "rgba(22,163,74,0.15)"
                    : "rgba(239,68,68,0.15)",
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
                  className="text-[10px]"
                  style={{ color: COLORS.textMuted }}
                >
                  {h.date}
                </p>
              </div>
              <p
                className="font-ui text-[13px] font-bold tabular-nums"
                style={{ color: positive ? "#22c55e" : "#ef4444" }}
              >
                {positive ? "+" : "−"} R${" "}
                {Math.abs(h.amount).toFixed(2).replace(".", ",")}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Perfil tab
// ============================================================================

function PerfilView({ total }: { total: number }) {
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
          <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
            Cashback total
          </p>
          <p
            className="mt-1 font-ui text-[16px] font-bold tabular-nums"
            style={{ color: COLORS.amber }}
          >
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: COLORS.bgLayer }}>
          <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
            Compras
          </p>
          <p className="mt-1 font-ui text-[16px] font-bold tabular-nums text-white">
            32
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Store detail modal — Cashback / Promoções / Sobre
// ============================================================================

function StoreDetailModal({
  store,
  isFav,
  onToggleFav,
  onClose,
}: {
  store: Establishment;
  isFav: boolean;
  onToggleFav: () => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"cashback" | "promocoes" | "sobre">(
    "promocoes",
  );
  const storePromos = PROMOS.filter((p) => p.storeId === store.id);
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: COLORS.bg }}
    >
      <div className="relative h-36 w-full" style={{ background: store.bg }}>
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onToggleFav}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur"
        >
          <Heart
            size={14}
            strokeWidth={2.25}
            style={{ color: isFav ? "#ef4444" : "white" }}
            className={isFav ? "fill-red-500" : ""}
          />
        </button>
      </div>

      <div className="-mt-6 mx-4 flex items-center gap-3 rounded-xl p-3" style={{ background: COLORS.bgCard }}>
        <span
          className="flex h-12 w-12 flex-none items-center justify-center rounded-md"
          style={{ background: COLORS.bg }}
        >
          <span className="font-ui text-[18px] font-bold text-white">
            {store.initial}
          </span>
        </span>
        <div>
          <p className="font-ui text-[14px] font-bold text-white">{store.name}</p>
          <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
            {store.category}
          </p>
          <span className="mt-0.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={10}
                strokeWidth={2}
                className={n <= Math.round(store.rating) ? "" : "opacity-30"}
                style={{
                  color: COLORS.amber,
                  fill: n <= Math.round(store.rating) ? COLORS.amber : "none",
                }}
              />
            ))}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-3 flex border-b border-white/10 px-4">
        {(
          [
            { id: "cashback", label: "Cashback" },
            { id: "promocoes", label: "Promoções" },
            { id: "sobre", label: "Sobre" },
          ] as const
        ).map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="relative flex-1 py-2 text-center font-ui text-[12px] font-bold"
              style={{
                color: active ? COLORS.amber : COLORS.textMuted,
              }}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="store-tab"
                  className="absolute inset-x-3 bottom-0 h-0.5"
                  style={{ background: COLORS.amber }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "promocoes" && (
          <>
            {/* Banner */}
            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative overflow-hidden rounded-xl p-3"
              style={{ background: COLORS.bgLayer }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-ui text-[14px] font-bold text-white">
                    Dia das Mães no {store.name}
                  </p>
                  <p
                    className="mt-1 text-[10px]"
                    style={{ color: COLORS.textMuted }}
                  >
                    Combos selecionados, válido até 31/05.
                  </p>
                  <button
                    type="button"
                    className="mt-2 rounded-md px-3 py-1.5 font-ui text-[10px] font-bold text-black"
                    style={{ background: COLORS.amber }}
                  >
                    Confira as unidades mais próximas
                  </button>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                  style={{ background: COLORS.amber, color: "#000" }}
                >
                  {store.cashbackPct}% Cashback
                </span>
              </div>
            </motion.div>

            {/* Promos grid */}
            <p
              className="mt-4 font-ui text-[11px] font-bold uppercase tracking-wider"
              style={{ color: COLORS.textMuted }}
            >
              Promoções com o Premium Club
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 pb-3">
              {storePromos.length === 0 ? (
                <p
                  className="col-span-2 py-6 text-center text-[11px] italic"
                  style={{ color: COLORS.textMuted }}
                >
                  Sem promoções ativas no momento.
                </p>
              ) : (
                storePromos.concat(storePromos).slice(0, 6).map((p, i) => (
                  <motion.div
                    key={`${p.id}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="overflow-hidden rounded-xl"
                    style={{ background: COLORS.bgLayer }}
                  >
                    <div
                      className="h-16 w-full"
                      style={{ background: p.bg }}
                    />
                    <div className="p-2">
                      <p className="font-ui text-[11px] font-bold leading-tight text-white">
                        {p.name}
                      </p>
                      <p
                        className="mt-0.5 text-[9px]"
                        style={{ color: COLORS.textMuted }}
                      >
                        {p.desc}
                      </p>
                      <p
                        className="mt-1 font-ui text-[12px] font-bold tabular-nums"
                        style={{ color: COLORS.amber }}
                      >
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "cashback" && (
          <CashbackStoreList store={store} />
        )}

        {tab === "sobre" && <StoreAbout store={store} />}
      </div>
    </motion.div>
  );
}

function CashbackStoreList({ store }: { store: Establishment }) {
  const storeHistory = HISTORY.filter((h) => h.store === store.name);
  return (
    <>
      <p
        className="font-ui text-[11px] font-bold uppercase tracking-wider"
        style={{ color: COLORS.textMuted }}
      >
        Movimentações no {store.name}
      </p>
      <div className="mt-2 space-y-2 pb-3">
        {storeHistory.length === 0 ? (
          <p
            className="py-6 text-center text-[11px] italic"
            style={{ color: COLORS.textMuted }}
          >
            Sem movimentações neste parceiro.
          </p>
        ) : (
          storeHistory.map((h, i) => {
            const positive = h.amount > 0;
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-3 gap-2 rounded-xl p-2"
                style={{ background: COLORS.bgLayer }}
              >
                <span
                  className="font-ui text-[12px] font-bold tabular-nums"
                  style={{ color: positive ? "#22c55e" : "#ef4444" }}
                >
                  {positive ? "+" : "−"} R${" "}
                  {Math.abs(h.amount).toFixed(2).replace(".", ",")}
                </span>
                <span
                  className="text-center font-ui text-[12px] font-bold tabular-nums text-white"
                >
                  {h.purchase
                    ? `R$ ${h.purchase.toFixed(2).replace(".", ",")}`
                    : "—"}
                </span>
                <span
                  className="text-right text-[11px] tabular-nums"
                  style={{ color: COLORS.textMuted }}
                >
                  {h.date}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}

function StoreAbout({ store }: { store: Establishment }) {
  return (
    <div
      className="space-y-3 text-[12px]"
      style={{ color: COLORS.textMuted }}
    >
      <p>
        {store.name} é um {store.category.toLowerCase()} parceiro do Premium
        Club. Ao consumir aqui, você acumula {store.cashbackPct}% de cashback
        para usar em qualquer parceiro.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Box label="Distância" value={store.distance} />
        <Box label="Avaliação" value={`${store.rating.toFixed(1)} / 5`} />
        <Box label="Cashback" value={`${store.cashbackPct}%`} accent />
        <Box label="Unidades" value="3" />
      </div>
    </div>
  );
}

function Box({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl p-2" style={{ background: COLORS.bgLayer }}>
      <p className="text-[9px]" style={{ color: COLORS.textMuted }}>
        {label}
      </p>
      <p
        className="font-ui text-[14px] font-bold tabular-nums"
        style={{ color: accent ? COLORS.amber : "white" }}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// Cashback detail bottom sheet (matches detalhamento-cashback.png)
// ============================================================================

function CashbackDetailSheet({
  entry,
  onClose,
}: {
  entry: CashbackEntry;
  onClose: () => void;
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
          Sobre o Cashback
        </p>

        <div className="mt-4 space-y-2 text-[12px]">
          <Row label="Estabelecimento da compra" value={entry.store} />
          {entry.purchase && (
            <Row
              label="Valor da compra"
              value={`R$ ${entry.purchase.toFixed(2).replace(".", ",")}`}
            />
          )}
          <Row
            label={entry.amount > 0 ? "Cashback recebido" : "Cashback utilizado"}
            value={`${entry.amount > 0 ? "+" : "−"} R$ ${Math.abs(entry.amount).toFixed(2).replace(".", ",")}`}
            tint={entry.amount > 0 ? "#22c55e" : "#ef4444"}
          />
          <Row label="Validade do cashback" value="10/06/2026" />
        </div>

        <p className="mt-4 font-ui text-[12px] font-bold text-white">
          O que acontece após a validade do cashback?
        </p>
        <p
          className="mt-1 text-[11px] leading-snug"
          style={{ color: COLORS.textMuted }}
        >
          O cashback tem validade de 180 dias após a data da compra. Após esse
          período o valor não utilizado será expirado e não estará disponível
          para uso.
        </p>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="mt-4 w-full rounded-xl py-3 font-ui text-[14px] font-bold text-black"
          style={{ background: COLORS.amber }}
        >
          Voltar
        </motion.button>
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
              className="font-ui text-[10px] font-bold"
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
