"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChefHat,
  ShoppingBasket,
  CalendarClock,
  MessageSquare,
  Check,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface ApproveProps {
  step: number;
}

const REQUESTS = [
  {
    type: "Cardápio" as const,
    title: "Cardápio · Semana 22",
    by: "Maria Eduarda",
    when: "há 12 min",
    Icon: ChefHat,
    pending: true,
  },
  {
    type: "Compra" as const,
    title: "Compra: 80kg arroz integral",
    by: "João Pedro",
    when: "há 1h",
    Icon: ShoppingBasket,
  },
  {
    type: "Escala" as const,
    title: "Escala extra · Sábado 25/05",
    by: "Ana Beatriz",
    when: "há 2h",
    Icon: CalendarClock,
  },
];

export function ApproveMockup({ step }: ApproveProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-3 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <BadgeCheck size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Approve
            </p>
            <p className="text-[8px] text-neutral-500">3 pendências</p>
          </div>
        </div>
        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[8px] font-semibold text-warning">
          Aguardando você
        </span>
      </header>

      {step === 0 && <PendingListView />}
      {step >= 1 && step <= 2 && <DetailView showComment={step === 2} />}
      {step === 3 && <ApprovingView />}
      {step >= 4 && <NotifiedView />}
    </div>
  );
}

function PendingListView() {
  return (
    <div className="flex-1 px-3 py-2">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Pendentes
      </p>
      <div data-tour="ap-pending-list" className="mt-2 space-y-1.5">
        {REQUESTS.map((req, i) => (
          <motion.button
            key={req.title}
            type="button"
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex w-full items-center gap-2 rounded-md p-2 text-left shadow-card",
              i === 0
                ? "border-2 border-brand bg-brand-ghost"
                : "border border-brand/10 bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 flex-none items-center justify-center rounded-lg",
                i === 0 ? "bg-brand text-white shadow-brand" : "bg-brand-subtle text-brand",
              )}
            >
              <req.Icon size={16} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-neutral-900">
                {req.title}
              </p>
              <p className="text-[8px] text-neutral-500">
                {req.by} · {req.when}
              </p>
            </div>
            {req.pending && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[7px] font-bold uppercase text-warning">
                Novo
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function DetailView({ showComment }: { showComment: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="flex items-start gap-2 rounded-md bg-white p-2 shadow-card">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand text-white shadow-brand">
          <ChefHat size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[10px] font-bold text-neutral-900">
            Cardápio · Semana 22
          </p>
          <p className="text-[8px] text-neutral-500">
            Por Maria Eduarda · 5 unidades afetadas
          </p>
        </div>
      </div>

      <div data-tour="ap-detail" className="mt-2 rounded-md bg-white p-2 shadow-card">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Alterações
        </p>
        <ul className="mt-1 space-y-1 text-[9px]">
          <li className="flex items-center justify-between">
            <span className="text-neutral-700">Sobremesa adicionada</span>
            <span className="font-bold text-success">+ 1 prato</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-neutral-700">Trocado: frango → tilápia</span>
            <span className="font-bold text-warning">substituição</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-neutral-700">Custo estimado</span>
            <span className="font-bold text-neutral-900">+ R$ 280,00</span>
          </li>
        </ul>
      </div>

      {showComment ? (
        <motion.div
          data-tour="ap-comment"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-md border-2 border-brand bg-white p-2"
        >
          <p className="flex items-center gap-1 text-[8px] font-semibold text-brand">
            <MessageSquare size={9} strokeWidth={2.5} />
            Comentário
          </p>
          <p className="mt-1 text-[9px] text-neutral-700">
            &ldquo;Aprovado, dentro do limite previsto.&rdquo;
          </p>
        </motion.div>
      ) : (
        <div className="mt-2 rounded-md border border-dashed border-brand/30 bg-white p-2 text-[8px] text-neutral-500">
          <span className="flex items-center gap-1">
            <MessageSquare size={9} strokeWidth={2} />
            Adicionar comentário
          </span>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2">
        <button
          type="button"
          className="flex items-center justify-center gap-1 rounded-md border border-danger/30 bg-white py-1.5 text-[9px] font-bold text-danger"
        >
          <X size={11} strokeWidth={2.5} />
          Reprovar
        </button>
        <button
          type="button"
          data-tour="ap-approve-button"
          className="flex items-center justify-center gap-1 rounded-md bg-brand py-1.5 text-[9px] font-bold text-white shadow-brand"
        >
          <Check size={11} strokeWidth={2.5} />
          Aprovar
        </button>
      </div>
    </motion.div>
  );
}

function ApprovingView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <Send size={26} strokeWidth={2} />
      </motion.div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Enviando aprovação
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Notificando Maria Eduarda…
      </p>
    </motion.div>
  );
}

function NotifiedView() {
  return (
    <motion.div
      data-tour="ap-notified"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
        <Check size={28} strokeWidth={3} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Solicitação aprovada
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Maria Eduarda foi notificada
      </p>
    </motion.div>
  );
}
