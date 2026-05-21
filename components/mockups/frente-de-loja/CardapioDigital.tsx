"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Home,
  BookOpen,
  ShoppingBag,
  User,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ChefHat,
  Clock,
  Bell,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CardapioDigitalProps {
  step: number;
}

export function CardapioDigitalMockup({ step }: CardapioDigitalProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <StatusBar />
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && <HomeView key="home" />}
          {step === 1 && <DetailView key="detail" />}
          {step === 2 && <CartView key="cart" />}
          {step === 3 && <ConfirmView key="confirm" />}
          {step >= 4 && <KitchenStatusView key="kitchen" />}
        </AnimatePresence>
      </main>
      <BottomNav step={step} />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-1 pb-0.5">
      <span className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
        09:41
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
      <button className="text-neutral-400">
        <MoreVertical size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}

function HomeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      {/* Restaurant banner */}
      <div className="relative h-28 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #4a3a2a 0%, #6b5237 40%, #8a6b48 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-[18px] font-bold uppercase tracking-[3px] text-white drop-shadow">
              Mundo
            </p>
            <p className="font-display text-[10px] font-bold tracking-widest text-white/80">
              ANIMAL
            </p>
          </div>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="px-4 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-[18px] font-bold text-brand">
              Mundo Animal
            </h1>
            <p className="text-[11px] font-medium text-brand underline">
              Ver mais detalhes
            </p>
          </div>
          <span className="rounded-md bg-neutral-100 px-2.5 py-1 font-display text-[11px] font-semibold text-neutral-700">
            Mesa 10
          </span>
        </div>
        <span className="mt-2 inline-block rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
          Aberto · 14:00 às 17:00
        </span>
      </div>

      {/* Cardápio big card */}
      <div className="mx-4 mt-3" data-tour="cd-categories">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-brand/15 bg-[#eef0f7] p-4"
        >
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-white">
            <BookOpen size={24} strokeWidth={1.75} className="text-brand/40" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-medium text-neutral-600">
              Veja todas as opções no
            </p>
            <p className="font-display text-[16px] font-bold text-brand">
              CARDÁPIO
            </p>
          </div>
        </motion.button>
      </div>

      {/* Promoções */}
      <div className="mt-4 flex-1 px-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[14px] font-bold text-brand">
            Promoções
          </h2>
          <button className="flex items-center gap-0.5 text-[11px] font-medium text-brand">
            Ver todos
            <ChevronRight size={12} strokeWidth={2.25} />
          </button>
        </div>

        <div className="mt-2 space-y-2.5">
          {[
            {
              name: "Combo Frango Simples",
              old: 30,
              now: 20,
              gradient: "from-yellow-300 via-orange-400 to-red-500",
            },
            {
              name: "Sonho de Morango com Creme",
              old: 18,
              now: 12,
              gradient: "from-pink-200 via-pink-300 to-red-300",
            },
          ].map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 border-b border-neutral-100 py-2"
            >
              <div
                className={cn(
                  "h-14 w-14 flex-none rounded-lg bg-gradient-to-br",
                  p.gradient,
                )}
              />
              <div className="flex-1">
                <p className="font-display text-[13px] font-bold text-neutral-900">
                  {p.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  De{" "}
                  <span className="line-through">
                    R$ {p.old},00
                  </span>{" "}
                  por{" "}
                  <span className="font-bold text-success">
                    R$ {p.now.toFixed(2).replace(".", ",")}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DetailView() {
  return (
    <motion.div
      data-tour="cd-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* Back + title */}
      <div className="flex items-start gap-2 px-4 pt-2">
        <button className="text-brand">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="font-display text-[20px] font-bold text-brand">
            Pizza Marguerita P
          </h1>
          <p className="font-display text-[12px] font-bold text-brand">
            R$ 19,90
          </p>
        </div>
      </div>

      {/* Photo */}
      <div className="mx-4 mt-3 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-red-300 to-red-500">
        <Utensils size={56} strokeWidth={1} className="text-white/40" />
      </div>

      {/* Description */}
      <p className="mt-3 px-4 text-[12px] leading-relaxed text-neutral-600">
        Uma combinação clássica e irresistível: molho de tomate, muçarela
        derretida, rodelas de tomate fresco, toque de manjericão e um fio de
        azeite para finalizar.
      </p>

      {/* Acréscimo section */}
      <div className="mt-3 bg-[#eef0f7] px-4 py-2">
        <p className="font-display text-[13px] font-bold text-brand">
          Escolha o acréscimo
        </p>
        <p className="text-[10px] text-neutral-500">0 / 3</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {[
            { label: "Bacon", price: 3.5, selected: true },
            { label: "Queijo", price: 3.0 },
            { label: "Calabresa Extra", price: 5.5 },
          ].map((add) => (
            <div
              key={add.label}
              className="flex items-center justify-between border-b border-neutral-100 py-2"
            >
              <div>
                <p className="font-display text-[12px] font-bold text-neutral-900">
                  {add.label}
                </p>
                <p className="font-display text-[12px] font-bold text-neutral-900">
                  R$ {add.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                  <Minus size={12} strokeWidth={2.25} />
                </button>
                <span className="w-4 text-center font-display text-[14px] font-bold text-neutral-700">
                  {add.selected ? 1 : 0}
                </span>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dee3f2] text-brand">
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center gap-2 border-t border-neutral-100 px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button className="text-neutral-400">
            <Trash2 size={14} strokeWidth={2} />
          </button>
          <span className="w-4 text-center font-display text-[12px] font-bold text-neutral-900">
            1
          </span>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dee3f2] text-brand">
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </div>
        <button
          type="button"
          className="flex flex-1 items-center justify-between rounded-md bg-brand px-3 py-2 text-white shadow-brand"
        >
          <span className="font-display text-[11px] font-bold">
            Adicionar aos pedidos
          </span>
          <span className="font-display text-[12px] font-bold tabular-nums">
            R$ 50,00
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function CartView() {
  return (
    <motion.div
      data-tour="cd-cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      <h1 className="px-4 pt-2 font-display text-[20px] font-bold text-brand">
        Pedidos
      </h1>

      {/* Restaurant banner small */}
      <div className="mx-4 mt-2 h-20 overflow-hidden rounded-xl bg-gradient-to-r from-amber-700 via-orange-700 to-red-700" />

      <div className="mt-3 flex items-center justify-between px-4">
        <h2 className="font-display text-[14px] font-bold text-brand">
          Mundo Animal
        </h2>
        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
          Mesa 10
        </span>
      </div>

      <div className="mt-2 flex-1 space-y-2 px-4 py-2">
        {[
          {
            name: "Pizza Marguerita P",
            price: 19.9,
            qty: 1,
            color: "from-amber-300 via-red-400 to-red-500",
          },
          {
            name: "Coca Cola Zero LT 350ml",
            price: 7.0,
            qty: 1,
            color: "from-red-500 via-red-600 to-red-800",
          },
          {
            name: "Combo Frango Simples",
            price: 20.0,
            qty: 1,
            color: "from-yellow-300 via-orange-400 to-red-500",
          },
        ].map((item) => (
          <div key={item.name} className="border-b border-neutral-100 pb-2">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "h-12 w-12 flex-none rounded-lg bg-gradient-to-br",
                  item.color,
                )}
              />
              <div className="flex-1">
                <p className="font-display text-[12px] font-bold text-neutral-900">
                  {item.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-md bg-[#eef0f7] px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                    <Edit3 size={9} strokeWidth={2.25} />
                    Editar
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display text-[13px] font-bold text-brand">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </span>
                <div className="flex items-center gap-1">
                  <button className="text-neutral-400">
                    <Trash2 size={11} strokeWidth={2} />
                  </button>
                  <span className="w-4 text-center font-display text-[11px] font-bold">
                    {item.qty}
                  </span>
                  <button className="flex h-5 w-5 items-center justify-center rounded bg-[#dee3f2] text-brand">
                    <Plus size={9} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total + CTAs */}
      <div className="border-t border-neutral-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-[14px] font-bold text-brand">
            Total a pagar:
          </span>
          <span className="font-display text-[16px] font-bold text-brand tabular-nums">
            R$ 100,00
          </span>
        </div>
        <button
          type="button"
          className="mt-2 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
        >
          Chamar Garçom
        </button>
        <button
          type="button"
          className="mt-1.5 w-full rounded-md border-2 border-brand bg-white py-2 text-center font-display text-[11px] font-bold text-brand"
        >
          Fazer outro pedido
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmView() {
  return (
    <motion.div
      data-tour="cd-confirm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-success/20"
        />
        <CheckCircle2 size={54} strokeWidth={2.25} />
      </motion.div>
      <h2 className="mt-5 font-display text-[22px] font-bold text-brand">
        Pedido enviado!
      </h2>
      <p className="mt-1 text-center text-[12px] text-neutral-500">
        A cozinha já recebeu seu pedido
      </p>
      <div className="mt-6 rounded-2xl border-2 border-dashed border-success/30 bg-success/5 px-6 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-success">
          Número do pedido
        </p>
        <p className="font-display text-[26px] font-bold leading-none text-success tabular-nums">
          #C1247
        </p>
        <p className="mt-2 text-[11px] text-neutral-600">
          Mesa 10 · Mundo Animal · R$ 100,00
        </p>
      </div>
    </motion.div>
  );
}

function KitchenStatusView() {
  return (
    <div data-tour="cd-kitchen" className="flex h-full flex-col px-4 pt-2">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
            Pedido #C1247 · Mesa 10
          </p>
          <h2 className="font-display text-[15px] font-bold text-brand">
            Acompanhe seu pedido
          </h2>
        </div>
        <span className="rounded-full bg-warning/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
          Em preparo
        </span>
      </div>

      <div className="rounded-2xl border-2 border-brand/10 bg-[#eef0f7] p-4">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px border-l-2 border-dashed border-brand/20"
          />
          <div className="space-y-3">
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
                    "relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full",
                    item.done && "bg-success text-white",
                    item.active && "bg-brand text-white shadow-brand",
                    !item.done && !item.active && "bg-white text-neutral-400",
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

function BottomNav({ step }: { step: number }) {
  const items = [
    { Icon: Home, label: "Início", active: step === 0 },
    { Icon: BookOpen, label: "Cardápio", active: step === 1 },
    { Icon: ShoppingBag, label: "Pedidos", active: step >= 2 },
    { Icon: User, label: "Conta", active: false },
  ];
  return (
    <nav className="flex items-center justify-around border-t border-neutral-100 bg-white py-1.5">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={cn(
            "flex flex-col items-center gap-0.5",
            item.active ? "text-brand" : "text-neutral-400",
          )}
        >
          <item.Icon size={18} strokeWidth={2} />
          <span className="font-display text-[9px] font-semibold">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
