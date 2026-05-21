"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  Building2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/cn";

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
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          App Comercial
        </p>
        <p className="text-[8px] text-neutral-500">
          Lucas P. · Representante Sul
        </p>
      </header>

      {step === 0 && <DashboardView />}
      {step === 1 && <ClientView />}
      {step === 2 && <ProductsView />}
      {step === 3 && <SummaryView />}
      {step >= 4 && <SentView />}
    </div>
  );
}

function DashboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="rounded-md bg-brand p-3 text-white shadow-brand">
        <p className="text-[8px] font-medium uppercase tracking-wider opacity-80">
          Meta do mês
        </p>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="font-display text-[16px] font-bold tabular-nums">
            R$ 142k
          </p>
          <span className="text-[8px] opacity-90">/ R$ 180k</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "79%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="block h-full rounded-full bg-white"
          />
        </div>
        <p className="mt-1 text-[7px] opacity-90">79% atingido · 10 dias restantes</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {[
          { Icon: TrendingUp, label: "Vendas hoje", value: "R$ 8,2k" },
          { Icon: Target, label: "Pedidos", value: "12" },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className="rounded-md border border-brand/10 bg-white p-2 shadow-card"
          >
            <div className="flex items-center gap-1">
              <Icon size={10} strokeWidth={2} className="text-brand" />
              <span className="text-[7px] uppercase text-neutral-500">
                {label}
              </span>
            </div>
            <p className="mt-0.5 font-display text-[11px] font-bold text-neutral-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1 rounded-md bg-brand py-2 text-[10px] font-bold text-white shadow-brand"
      >
        <Plus size={12} strokeWidth={2.5} />
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
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="flex items-center gap-2 rounded-md bg-surface-raised px-2 py-1.5">
        <Search size={10} strokeWidth={2} className="text-neutral-400" />
        <span className="text-[9px] text-neutral-500">Buscar cliente</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {CLIENTS.map((c, i) => (
          <motion.button
            key={c.cnpj}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md p-2 text-left",
              c.active
                ? "border-2 border-brand bg-brand-ghost shadow-card"
                : "border border-brand/10 bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
                c.active
                  ? "bg-brand text-white shadow-brand"
                  : "bg-brand-subtle text-brand",
              )}
            >
              <Building2 size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-neutral-900">
                {c.name}
              </p>
              <p className="text-[7px] text-neutral-500">{c.cnpj}</p>
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
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="rounded-md bg-surface-raised p-1.5">
        <p className="text-[7px] uppercase text-neutral-500">Cliente</p>
        <p className="text-[9px] font-semibold text-neutral-900">
          Restaurante Bella Mesa
        </p>
      </div>

      <p className="mt-2 text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Produtos sugeridos
      </p>
      <div className="mt-1 space-y-1">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-2 rounded-md border border-brand/10 bg-white p-1.5 shadow-card"
          >
            <div className="h-7 w-7 flex-none rounded bg-brand-subtle" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-neutral-900">
                {p.name}
              </p>
              <p className="text-[8px] font-bold text-brand">
                R$ {p.price.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                "flex h-6 w-6 flex-none items-center justify-center rounded-full",
                i === 0
                  ? "bg-brand text-white shadow-brand"
                  : "border border-brand/30 text-brand",
              )}
            >
              {i === 0 ? (
                <CheckCircle2 size={12} strokeWidth={2.5} />
              ) : (
                <Plus size={12} strokeWidth={2.5} />
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
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="rounded-md bg-surface-raised p-2">
        <p className="text-[7px] uppercase text-neutral-500">Cliente</p>
        <p className="text-[10px] font-semibold text-neutral-900">
          Restaurante Bella Mesa
        </p>
      </div>

      <div className="mt-2 rounded-md bg-white p-2 shadow-card">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
          Resumo do pedido
        </p>
        <div className="mt-2 space-y-1 text-[8px]">
          {[
            { name: "Mix de massas frescas", value: 184.0 },
            { name: "Linha premium azeites", value: 320.5 },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <span className="text-neutral-700">{p.name}</span>
              <span className="font-semibold tabular-nums text-neutral-900">
                R$ {p.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-neutral-200 pt-1">
          <span className="text-[7px] font-bold uppercase tracking-wider text-neutral-500">
            Total
          </span>
          <span className="font-display text-[14px] font-bold text-brand tabular-nums">
            R$ 504,50
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1 rounded-md bg-brand py-2 text-[10px] font-bold text-white shadow-brand"
      >
        <Send size={12} strokeWidth={2} />
        Confirmar pedido
      </button>
    </motion.div>
  );
}

function SentView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-brand">
        <CheckCircle2 size={32} strokeWidth={2} />
      </div>
      <p className="font-display text-[12px] font-bold text-neutral-900">
        Pedido enviado
      </p>
      <div className="rounded-md border border-dashed border-success/30 bg-success/5 px-3 py-1.5 text-center">
        <p className="text-[8px] text-neutral-500">Pedido</p>
        <p className="font-display text-[12px] font-bold text-success">
          #PED-2026-08471
        </p>
      </div>
      <p className="text-center text-[8px] text-neutral-500">
        Pedido transmitido ao ERP · Confirmação por e-mail
      </p>
    </motion.div>
  );
}
