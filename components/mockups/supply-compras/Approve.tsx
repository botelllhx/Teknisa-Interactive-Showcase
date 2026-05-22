"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ShoppingBasket,
  ScrollText,
  FileSpreadsheet,
  Check,
  X,
  ChevronLeft,
  Filter,
  Search,
  MessageSquare,
  Paperclip,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface ApproveProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

type ReqStatus = "pendente" | "aprovada" | "reprovada";

interface Request {
  id: string;
  title: string;
  type: "compra" | "contrato" | "pedido";
  by: string;
  byInitials: string;
  when: string;
  amount: number;
  delta: number;
  status: ReqStatus;
  description: string;
  attachments: number;
  comments: number;
}

const REQUESTS: Request[] = [
  {
    id: "PC-2026-0214",
    title: "Compra: 800kg arroz integral 5kg",
    type: "compra",
    by: "Carla Teixeira",
    byInitials: "CT",
    when: "há 12 min",
    amount: 14_320.0,
    delta: 320.0,
    status: "pendente",
    description:
      "Reposição do estoque mensal do CD Berrini. Fornecedor escolhido na cotação RFQ-2024-001, 13% abaixo da última compra.",
    attachments: 3,
    comments: 2,
  },
  {
    id: "CT-2026-0019",
    title: "Contrato: Fornecimento mensal Camil",
    type: "contrato",
    by: "Bruno Sampaio",
    byInitials: "BS",
    when: "há 38 min",
    amount: 86_500.0,
    delta: -2_400.0,
    status: "pendente",
    description:
      "Renovação anual com desconto de 3% sobre o valor original. Garantia mantida em 12 meses.",
    attachments: 5,
    comments: 1,
  },
  {
    id: "PED-2026-08471",
    title: "Pedido especial: Vinhos Reserva",
    type: "pedido",
    by: "Ricardo Nobre",
    byInitials: "RN",
    when: "há 1h 24min",
    amount: 4_037.5,
    delta: -212.5,
    status: "pendente",
    description:
      "Pedido sob demanda para evento corporativo de 22 de junho. Desconto de 5% acordado em negociação.",
    attachments: 2,
    comments: 4,
  },
  {
    id: "PC-2026-0202",
    title: "Compra: Sucos e refrigerantes",
    type: "compra",
    by: "Mariana Silva",
    byInitials: "MS",
    when: "ontem",
    amount: 8_640.0,
    delta: 0,
    status: "aprovada",
    description: "Reposição mensal, dentro da meta.",
    attachments: 1,
    comments: 0,
  },
  {
    id: "PC-2026-0199",
    title: "Compra: Materiais de limpeza",
    type: "compra",
    by: "Sofia Mendonça",
    byInitials: "SM",
    when: "ontem",
    amount: 2_140.0,
    delta: 0,
    status: "aprovada",
    description: "Aprovado dentro da política de gastos correntes.",
    attachments: 2,
    comments: 1,
  },
  {
    id: "CT-2026-0018",
    title: "Contrato: Manutenção elevador",
    type: "contrato",
    by: "Ana Costa",
    byInitials: "AC",
    when: "2 dias",
    amount: 12_400.0,
    delta: 1_900.0,
    status: "reprovada",
    description:
      "Aumento acima da política. Solicitar nova proposta com pelo menos 2 cotações comparativas.",
    attachments: 4,
    comments: 6,
  },
];

const TYPE_META: Record<
  Request["type"],
  { label: string; Icon: typeof ShoppingBasket; color: string }
> = {
  compra: { label: "Compra", Icon: ShoppingBasket, color: "#020788" },
  contrato: { label: "Contrato", Icon: ScrollText, color: "#d97706" },
  pedido: { label: "Pedido", Icon: FileSpreadsheet, color: "#16a34a" },
};

const STATUS_META: Record<
  ReqStatus,
  { label: string; bg: string; color: string; Icon: typeof Clock }
> = {
  pendente: { label: "Pendente", bg: "rgba(217,119,6,0.15)", color: "#d97706", Icon: Clock },
  aprovada: { label: "Aprovada", bg: "rgba(22,163,74,0.15)", color: "#16a34a", Icon: CheckCircle2 },
  reprovada: { label: "Reprovada", bg: "rgba(220,38,38,0.15)", color: "#dc2626", Icon: XCircle },
};

// ============================================================================
// Component
// ============================================================================

export function ApproveMockup({ step }: ApproveProps) {
  const [tab, setTab] = useState<ReqStatus>("pendente");
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<Request[]>(REQUESTS);

  // Sync screen with tour step: step 2 onwards = detail screen open
  useEffect(() => {
    if (step >= 2 && !openId) {
      const firstPending = items.find((r) => r.status === "pendente");
      if (firstPending) setOpenId(firstPending.id);
    }
  }, [step, openId, items]);

  const list = useMemo(
    () => items.filter((r) => r.status === tab),
    [items, tab],
  );

  const counts = useMemo(
    () => ({
      pendente: items.filter((r) => r.status === "pendente").length,
      aprovada: items.filter((r) => r.status === "aprovada").length,
      reprovada: items.filter((r) => r.status === "reprovada").length,
    }),
    [items],
  );

  const open = useMemo(
    () => items.find((r) => r.id === openId) ?? null,
    [items, openId],
  );

  const decide = (id: string, status: ReqStatus) => {
    setItems((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      apTab: tab,
      apOpenId: openId,
      apOpenTitle: open?.title,
      apPendingCount: counts.pendente,
      apApprovedCount: counts.aprovada,
      apRejectedCount: counts.reprovada,
    });
  }, [tab, openId, open?.title, counts, patchLive]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#f5f6fa] font-ui text-neutral-800">
      <StatusBar />

      <AnimatePresence mode="wait">
        {open ? (
          <DetailScreen
            key={`d-${open.id}`}
            request={open}
            onBack={() => setOpenId(null)}
            onDecide={(s) => decide(open.id, s)}
          />
        ) : (
          <ListScreen
            key="list"
            tab={tab}
            counts={counts}
            list={list}
            onTab={setTab}
            onOpen={setOpenId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Mobile chrome
// ============================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-brand px-5 pt-2 pb-1.5 text-white">
      <span className="font-ui text-[12px] font-bold tabular-nums">09:41</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold tracking-wide">5G</span>
        <span className="text-[10px] tabular-nums">96%</span>
      </div>
    </div>
  );
}

// ============================================================================
// List screen (Pendentes / Aprovadas / Reprovadas)
// ============================================================================

function ListScreen({
  tab,
  counts,
  list,
  onTab,
  onOpen,
}: {
  tab: ReqStatus;
  counts: Record<ReqStatus, number>;
  list: Request[];
  onTab: (t: ReqStatus) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      {/* App bar */}
      <header className="flex items-center justify-between bg-brand px-4 pb-3 text-white">
        <button
          type="button"
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
        >
          <span className="flex flex-col gap-0.5">
            <span className="block h-0.5 w-3.5 rounded-full bg-white" />
            <span className="block h-0.5 w-3.5 rounded-full bg-white" />
            <span className="block h-0.5 w-3.5 rounded-full bg-white" />
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/15">
            <BadgeCheck size={14} strokeWidth={2.25} className="text-white" />
          </span>
          <p className="font-ui text-[14px] font-bold">Approve</p>
        </div>
        <button
          type="button"
          aria-label="Notificações"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
        >
          <Bell size={14} strokeWidth={2.25} className="text-white" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-brand" />
        </button>
      </header>

      {/* Greeting + user */}
      <div className="border-b border-brand/8 bg-white px-4 py-3.5">
        <p className="text-[11px] text-neutral-500">Bom dia,</p>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="font-ui text-[18px] font-bold text-neutral-900">
            Mateus Souza
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-ui text-[14px] font-bold text-white">
            MS
          </span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-500">
          {counts.pendente} solicitações aguardando aprovação
        </p>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
          <Search size={14} strokeWidth={2.25} className="text-neutral-400" />
          <span className="font-ui text-[12px] text-neutral-400">Buscar</span>
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
            <Filter size={11} strokeWidth={2.25} />
          </span>
        </div>
      </div>

      {/* Status tabs */}
      <div data-tour="ap-tabs" className="grid grid-cols-3 border-b border-neutral-200 bg-white">
        {(["pendente", "aprovada", "reprovada"] as ReqStatus[]).map((t) => {
          const active = t === tab;
          const meta = STATUS_META[t];
          return (
            <motion.button
              key={t}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onTab(t)}
              className="relative flex flex-col items-center gap-0.5 py-3"
            >
              <span
                className={cn(
                  "font-ui text-[12px] font-bold",
                  active ? "text-brand" : "text-neutral-400",
                )}
              >
                {meta.label.replace("Pendente", "Pendentes").replace(
                  "Aprovada",
                  "Aprovadas",
                ).replace("Reprovada", "Reprovadas")}
              </span>
              <span
                className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold"
                style={{
                  background: active ? meta.bg : "transparent",
                  color: active ? meta.color : "#9ca3af",
                }}
              >
                {counts[t]}
              </span>
              {active && (
                <motion.span
                  layoutId="ap-tab"
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* List */}
      <div
        data-tour="ap-pending-list"
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        {list.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <Check size={32} strokeWidth={1.5} className="text-neutral-300" />
            <p className="mt-2 text-[13px] italic text-neutral-400">
              Sem solicitações nesta aba.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((r, i) => (
              <RequestCard
                key={r.id}
                request={r}
                onOpen={() => onOpen(r.id)}
                delay={i * 0.05}
                target={i === 0}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RequestCard({
  request,
  onOpen,
  delay,
  target,
}: {
  request: Request;
  onOpen: () => void;
  delay: number;
  target: boolean;
}) {
  const meta = TYPE_META[request.type];
  const stat = STATUS_META[request.status];
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      onClick={onOpen}
      data-tour={target ? "ap-first-card" : undefined}
      className="flex w-full flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-3.5 text-left shadow-card"
    >
      <div className="flex items-start gap-2.5">
        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-white"
          style={{ background: meta.color }}
        >
          <meta.Icon size={15} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-ui text-[13px] font-bold leading-tight text-neutral-900 line-clamp-2">
              {request.title}
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.label}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            {request.id} · {meta.label}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-2 text-[12px]">
        <span className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600">
            {request.byInitials}
          </span>
          <span className="text-neutral-700">{request.by}</span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-400">{request.when}</span>
        </span>
        <span className="font-ui font-bold text-brand tabular-nums">
          R$ {request.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Detail screen
// ============================================================================

function DetailScreen({
  request,
  onBack,
  onDecide,
}: {
  request: Request;
  onBack: () => void;
  onDecide: (status: ReqStatus) => void;
}) {
  const meta = TYPE_META[request.type];
  const stat = STATUS_META[request.status];
  const [comment, setComment] = useState<string>("");
  const presetComments = [
    "Aprovado dentro da política.",
    "Aguardando 2ª cotação.",
    "Pode aprovar após ajuste do prazo.",
  ];

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 30, opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      {/* App bar */}
      <header className="flex items-center justify-between bg-brand px-4 pb-3 text-white">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
        >
          <ChevronLeft size={16} strokeWidth={2.25} />
        </button>
        <p className="font-ui text-[14px] font-bold">{request.id}</p>
        <button
          type="button"
          aria-label="Mais"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
        >
          <MoreVertical size={14} strokeWidth={2.25} />
        </button>
      </header>

      {/* Hero */}
      <div className="border-b border-neutral-100 bg-white px-5 pb-4 pt-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-white"
            style={{ background: meta.color }}
          >
            <meta.Icon size={18} strokeWidth={2} />
          </span>
          <div className="flex-1">
            <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
              {meta.label}
            </p>
            <h2
              data-tour="ap-detail"
              className="mt-0.5 font-ui text-[17px] font-bold leading-tight text-neutral-900"
            >
              {request.title}
            </h2>
            <p className="mt-1 text-[11px] text-neutral-500">
              Solicitada por {request.by} · {request.when}
            </p>
          </div>
        </div>
        <span
          className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: stat.bg, color: stat.color }}
        >
          <stat.Icon size={11} strokeWidth={2.5} />
          {stat.label}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Amount diff cards */}
        <div className="grid grid-cols-3 gap-2">
          <MiniStat
            label="Valor"
            value={`R$ ${request.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            tone="#020788"
            bold
          />
          <MiniStat
            label="Variação"
            value={
              request.delta === 0
                ? "Sem variação"
                : `${request.delta > 0 ? "+" : "−"} R$ ${Math.abs(
                    request.delta,
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            }
            tone={request.delta > 0 ? "#d97706" : "#16a34a"}
            Icon={request.delta > 0 ? TrendingUp : TrendingDown}
          />
          <MiniStat
            label="Anexos"
            value={`${request.attachments}`}
            tone="#020788"
            Icon={Paperclip}
          />
        </div>

        {/* Descrição (matching reference) */}
        <section className="mt-4">
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
            Descrição
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-700">
            {request.description}
          </p>
        </section>

        {/* Diff */}
        <section className="mt-4 rounded-2xl border border-brand/8 bg-brand-ghost/40 p-3.5">
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
            Diff vs. baseline
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <p className="text-[10px] text-neutral-500">Antes</p>
              <p className="font-ui font-bold text-neutral-700 tabular-nums">
                R${" "}
                {(request.amount - request.delta).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-500">Agora</p>
              <p
                className="font-ui font-bold tabular-nums"
                style={{
                  color: request.delta > 0 ? "#d97706" : "#16a34a",
                }}
              >
                R${" "}
                {request.amount.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Comment chips */}
        <section className="mt-4">
          <p
            data-tour="ap-comment"
            className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand"
          >
            Comentário (opcional)
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presetComments.map((c) => {
              const active = comment === c;
              return (
                <motion.button
                  key={c}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setComment(active ? "" : c)}
                  className={cn(
                    "rounded-full border-2 px-2.5 py-1 font-ui text-[11px] font-medium transition-colors",
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-neutral-200 bg-white text-neutral-600",
                  )}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>
          {comment && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-start gap-2 rounded-md bg-brand-ghost px-3 py-2 text-[11px] text-brand"
            >
              <MessageSquare size={12} strokeWidth={2.25} className="mt-0.5" />
              {comment}
            </motion.div>
          )}
        </section>
      </div>

      {/* Sticky action bar */}
      {request.status === "pendente" ? (
        <div
          data-tour="ap-actions"
          className="flex items-center gap-2 border-t border-neutral-100 bg-white px-4 py-3.5"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onDecide("reprovada")}
            className="flex-1 rounded-xl border-2 border-danger py-3 font-ui text-[13px] font-bold text-danger"
          >
            <X size={14} strokeWidth={2.5} className="mr-1 inline" />
            Reprovar
          </motion.button>
          <motion.button
            type="button"
            data-tour="ap-approve-button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onDecide("aprovada")}
            className="flex-[1.4] rounded-xl bg-success py-3 font-ui text-[13px] font-bold text-white shadow-brand"
          >
            <Check size={14} strokeWidth={2.5} className="mr-1 inline" />
            Aprovar
          </motion.button>
        </div>
      ) : (
        <div
          data-tour="ap-notified"
          className="flex items-center gap-2 border-t border-neutral-100 bg-success/5 px-4 py-3 text-[12px] font-bold text-success"
        >
          <CheckCircle2 size={14} strokeWidth={2.5} />
          Solicitante notificado por push e e-mail
        </div>
      )}
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
  tone,
  bold,
  Icon,
}: {
  label: string;
  value: string;
  tone: string;
  bold?: boolean;
  Icon?: typeof TrendingUp;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-2.5 text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center justify-center gap-1 font-ui tabular-nums",
          bold ? "text-[14px] font-bold" : "text-[12px] font-bold",
        )}
        style={{ color: tone }}
      >
        {Icon && <Icon size={11} strokeWidth={2.25} />}
        {value}
      </p>
    </div>
  );
}
