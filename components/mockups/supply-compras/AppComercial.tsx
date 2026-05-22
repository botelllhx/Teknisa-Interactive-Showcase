"use client";

import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  Building2,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/shadcn";

interface AppComercialProps {
  step: number;
}

const CLIENTS = [
  { name: "Restaurante Bella Mesa", cnpj: "12.847.302/0001-44", active: true },
  { name: "Padaria Aurora", cnpj: "23.918.475/0001-12" },
  { name: "Buffet Estrela", cnpj: "34.029.586/0001-89" },
];

const PRODUCTS = [
  { name: "Mix de massas frescas", price: 184.0 },
  { name: "Linha premium azeites", price: 320.5 },
  { name: "Carnes nobres · cx 5kg", price: 412.9 },
];

export function AppComercialMockup({ step }: AppComercialProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <header className="border-b border-brand/8 px-4 pb-2 pt-3">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          App Comercial
        </p>
        <p className="font-ui text-[10px] text-neutral-500">
          Lucas P. · Representante Sul
        </p>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {step === 0 && <DashboardView />}
        {step === 1 && <ClientView />}
        {step === 2 && <ProductsView />}
        {step === 3 && <SummaryView />}
        {step >= 4 && <SentView />}
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      <div
        data-tour="ac-goal"
        className="rounded-2xl bg-gradient-to-br from-brand via-brand-light to-[#3b42c4] p-4 text-white shadow-brand"
      >
        <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] opacity-85">
          Meta do mês
        </p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <p className="font-ui text-[28px] font-bold leading-none tabular-nums">
            R$ 142k
          </p>
          <span className="font-ui text-[11px] opacity-90">/ R$ 180k</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "79%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="block h-full rounded-full bg-white"
          />
        </div>
        <p className="mt-1.5 font-ui text-[10px] opacity-90">
          79% atingido · 10 dias restantes
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { Icon: TrendingUp, label: "Vendas hoje", value: "R$ 8,2k" },
          { Icon: Target, label: "Pedidos", value: "12" },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-brand/8 bg-white p-3 shadow-card"
          >
            <div className="flex items-center gap-1.5">
              <Icon size={11} strokeWidth={2.25} className="text-brand" />
              <span className="font-ui text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                {label}
              </span>
            </div>
            <p className="mt-1 font-ui text-[18px] font-bold tabular-nums text-neutral-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-brand py-3 font-ui text-[13px] font-bold text-white shadow-brand transition-all hover:-translate-y-[1px] active:scale-[0.98]"
      >
        <Plus size={14} strokeWidth={2.5} />
        Novo pedido
      </button>
    </motion.div>
  );
}

function ClientView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
    >
      <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5">
        <Search size={13} strokeWidth={2} className="text-neutral-400" />
        <span className="font-ui text-[11px] text-neutral-400">
          Buscar cliente
        </span>
      </div>
      <div className="mt-1 space-y-2">
        {CLIENTS.map((c, i) => (
          <motion.button
            key={c.cnpj}
            data-tour={c.active ? "ac-client" : undefined}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-colors",
              c.active
                ? "border-2 border-brand bg-brand-ghost shadow-card"
                : "border border-brand/10 bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 flex-none items-center justify-center rounded-xl",
                c.active
                  ? "bg-brand text-white shadow-brand"
                  : "bg-brand-subtle text-brand",
              )}
            >
              <Building2 size={16} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-ui text-[12px] font-bold text-neutral-900">
                {c.name}
              </p>
              <p className="font-ui text-[10px] tabular-nums text-neutral-500">
                {c.cnpj}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ProductsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
    >
      <div className="rounded-xl bg-brand-ghost px-3 py-2">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
          Cliente
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          Restaurante Bella Mesa
        </p>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
          Produtos sugeridos
        </p>
        <Badge variant="ai">
          <Sparkles size={9} strokeWidth={2.5} />
          IA
        </Badge>
      </div>
      <div className="space-y-2">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            data-tour={i === 0 ? "ac-product-suggested" : undefined}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
            className="flex items-center gap-2.5 rounded-xl border border-brand/8 bg-white p-2.5 shadow-card"
          >
            <div className="h-10 w-10 flex-none rounded-lg bg-gradient-to-br from-brand-ghost to-brand-subtle" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-ui text-[12px] font-bold text-neutral-900">
                {p.name}
              </p>
              <p className="font-ui text-[11px] font-bold tabular-nums text-brand">
                R$ {p.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                "flex h-9 w-9 flex-none items-center justify-center rounded-full transition-transform active:scale-95",
                i === 0
                  ? "bg-brand text-white shadow-brand"
                  : "border border-brand/30 text-brand hover:bg-brand-ghost",
              )}
            >
              {i === 0 ? (
                <CheckCircle2 size={14} strokeWidth={2.5} />
              ) : (
                <Plus size={14} strokeWidth={2.5} />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SummaryView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      <div className="rounded-xl bg-brand-ghost px-3 py-2">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
          Cliente
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          Restaurante Bella Mesa
        </p>
      </div>

      <div
        data-tour="ac-summary"
        className="rounded-2xl border border-brand/8 bg-white p-3 shadow-card"
      >
        <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand">
          Resumo do pedido
        </p>
        <div className="mt-2.5 space-y-1.5 font-ui text-[11px]">
          {[
            { name: "Mix de massas frescas", value: 184.0 },
            { name: "Linha premium azeites", value: 320.5 },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <span className="text-neutral-700">{p.name}</span>
              <span className="font-bold tabular-nums text-neutral-900">
                R$ {p.value.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-neutral-200 pt-2">
          <span className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
            Total
          </span>
          <span className="font-ui text-[20px] font-bold tabular-nums text-brand">
            R$ 504,50
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-brand py-3 font-ui text-[13px] font-bold text-white shadow-brand transition-all hover:-translate-y-[1px] active:scale-[0.98]"
      >
        <Send size={14} strokeWidth={2.25} />
        Confirmar pedido
      </button>
    </motion.div>
  );
}

function SentView() {
  return (
    <motion.div
      data-tour="ac-sent"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-6"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-[0_8px_30px_rgba(22,163,74,0.35)]"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <CheckCircle2 size={40} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[15px] font-bold text-neutral-900">
        Pedido enviado
      </p>
      <div className="rounded-xl border-2 border-dashed border-success/30 bg-success/5 px-4 py-2 text-center">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
          Pedido
        </p>
        <p className="font-ui text-[16px] font-bold tabular-nums text-success">
          #PED-2026-08471
        </p>
      </div>
      <p className="text-center font-ui text-[11px] leading-snug text-neutral-500">
        Pedido transmitido ao ERP
        <br />
        Confirmação por e-mail
      </p>
    </motion.div>
  );
}
