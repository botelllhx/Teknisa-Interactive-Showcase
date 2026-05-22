"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  ShoppingBasket,
  ScrollText,
  FileSpreadsheet,
  Check,
  X,
  Filter,
  Search,
  MessageSquare,
  Paperclip,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
  delta: number; // diff from previous (positive = increase)
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
      "Pedido de reposição do estoque mensal do CD Berrini. Fornecedor escolhido pela cotação RFQ-2024-001 com 13% abaixo da última compra.",
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
      "Renovação do contrato anual com desconto de 3% sobre o valor original. Garantia mantida em 12 meses.",
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
  pendente: {
    label: "Pendente",
    bg: "rgba(217,119,6,0.15)",
    color: "#d97706",
    Icon: Clock,
  },
  aprovada: {
    label: "Aprovada",
    bg: "rgba(22,163,74,0.15)",
    color: "#16a34a",
    Icon: CheckCircle2,
  },
  reprovada: {
    label: "Reprovada",
    bg: "rgba(220,38,38,0.15)",
    color: "#dc2626",
    Icon: XCircle,
  },
};

// ============================================================================
// Component
// ============================================================================

export function ApproveMockup({ step }: ApproveProps) {
  void step;
  const [tab, setTab] = useState<ReqStatus>("pendente");
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<Request[]>(REQUESTS);

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

  // Auto-open the first request when switching tab if nothing selected.
  useEffect(() => {
    if (list[0] && !list.find((r) => r.id === openId)) {
      setOpenId(list[0].id);
    }
  }, [list, openId]);

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
    });
  }, [tab, openId, open?.title, counts.pendente, counts.aprovada, patchLive]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <Header pending={counts.pendente} />

      <main className="grid flex-1 grid-cols-[320px_1fr] overflow-hidden">
        <aside className="flex flex-col overflow-hidden border-r border-neutral-200 bg-white">
          <TabsRow tab={tab} counts={counts} onPick={setTab} />
          <SearchRow />
          <PendingList list={list} openId={openId} onOpen={setOpenId} />
        </aside>

        <section className="flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {open ? (
              <DetailView
                key={open.id}
                request={open}
                onDecide={decide}
              />
            ) : (
              <EmptyDetail key="empty" />
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// ============================================================================
// Header
// ============================================================================

function Header({ pending }: { pending: number }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={84} height={16} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white"
            style={{ background: "#020788" }}
          >
            <BadgeCheck size={14} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-ui text-[14px] font-bold text-neutral-900">
              Approve
            </p>
            <p className="font-ui text-[11px] text-neutral-500">
              Aprovações de compras, contratos e pedidos
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 font-ui text-[11px] font-bold text-warning">
          <AlertCircle size={11} strokeWidth={2.5} />
          {pending} pendentes
        </span>
        <span className="flex h-9 items-center gap-2 rounded-full bg-neutral-50 px-2.5 py-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
            MS
          </span>
          <span className="leading-tight">
            <span className="block font-ui text-[12px] font-bold text-brand">
              Mateus Souza
            </span>
            <span className="block text-[9px] text-neutral-500">
              Diretor de Compras
            </span>
          </span>
        </span>
      </div>
    </header>
  );
}

// ============================================================================
// Tabs
// ============================================================================

function TabsRow({
  tab,
  counts,
  onPick,
}: {
  tab: ReqStatus;
  counts: Record<ReqStatus, number>;
  onPick: (t: ReqStatus) => void;
}) {
  const items: { id: ReqStatus; label: string; color: string }[] = [
    { id: "pendente", label: "Pendentes", color: "#d97706" },
    { id: "aprovada", label: "Aprovadas", color: "#16a34a" },
    { id: "reprovada", label: "Reprovadas", color: "#dc2626" },
  ];
  return (
    <div
      data-tour="ap-tabs"
      className="flex border-b border-neutral-200"
    >
      {items.map((it) => {
        const active = it.id === tab;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className="relative flex flex-1 flex-col items-center justify-center py-3"
          >
            <span
              className={cn(
                "font-ui text-[12px] font-bold",
                active ? "text-brand" : "text-neutral-400",
              )}
            >
              {it.label}
            </span>
            <span
              className="mt-0.5 inline-flex items-center justify-center rounded-full px-1.5 py-0 text-[9px] font-bold"
              style={{
                background: active ? `${it.color}25` : "transparent",
                color: active ? it.color : "#9ca3af",
              }}
            >
              {counts[it.id]}
            </span>
            {active && (
              <motion.span
                layoutId="ap-tab-underline"
                className="absolute inset-x-4 bottom-0 h-0.5 rounded-full"
                style={{ background: it.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function SearchRow() {
  return (
    <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
      <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 ring-1 ring-neutral-200">
        <Search size={12} strokeWidth={2.25} className="text-neutral-400" />
        <span className="font-ui text-[11px] text-neutral-400">Pesquisar</span>
      </div>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand ring-1 ring-neutral-200 hover:bg-brand-ghost"
      >
        <Filter size={12} strokeWidth={2.25} />
      </button>
    </div>
  );
}

// ============================================================================
// Pending list
// ============================================================================

function PendingList({
  list,
  openId,
  onOpen,
}: {
  list: Request[];
  openId: string | null;
  onOpen: (id: string) => void;
}) {
  return (
    <div
      data-tour="ap-pending-list"
      className="flex-1 overflow-y-auto"
    >
      {list.length === 0 ? (
        <p className="px-3 py-8 text-center text-[12px] italic text-neutral-400">
          Sem solicitações nesta aba.
        </p>
      ) : (
        list.map((r, i) => {
          const meta = TYPE_META[r.type];
          const stat = STATUS_META[r.status];
          const active = r.id === openId;
          return (
            <motion.button
              key={r.id}
              type="button"
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              data-tour={i === 0 ? "ap-first-card" : undefined}
              onClick={() => onOpen(r.id)}
              className={cn(
                "flex w-full flex-col gap-1.5 border-b border-neutral-100 p-3 text-left transition-colors",
                active ? "bg-brand-ghost" : "hover:bg-neutral-50",
              )}
              style={{
                borderLeft: active ? `3px solid #020788` : "3px solid transparent",
              }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-white"
                  style={{ background: meta.color }}
                >
                  <meta.Icon size={14} strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="font-ui text-[12px] font-bold text-neutral-900 line-clamp-2">
                      {r.title}
                    </p>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                      style={{ background: stat.bg, color: stat.color }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-neutral-500">
                    {r.id} · {meta.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[9px] font-bold text-neutral-600">
                    {r.byInitials}
                  </span>
                  {r.by} · {r.when}
                </span>
                <span className="font-ui font-bold text-brand tabular-nums">
                  R${" "}
                  {r.amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </motion.button>
          );
        })
      )}
    </div>
  );
}

// ============================================================================
// Detail
// ============================================================================

function DetailView({
  request,
  onDecide,
}: {
  request: Request;
  onDecide: (id: string, status: ReqStatus) => void;
}) {
  const meta = TYPE_META[request.type];
  const [comment, setComment] = useState<string>("");
  const presetComments = [
    "Aprovado dentro da política.",
    "Aguardando 2ª cotação.",
    "Pode aprovar após ajuste do prazo.",
  ];

  return (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex h-full flex-col overflow-y-auto bg-white"
    >
      {/* Hero */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 flex-none items-center justify-center rounded-md text-white"
            style={{ background: meta.color }}
          >
            <meta.Icon size={20} strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
              {meta.label} · {request.id}
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
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            background: STATUS_META[request.status].bg,
            color: STATUS_META[request.status].color,
          }}
        >
          {(() => {
            const I = STATUS_META[request.status].Icon;
            return <I size={11} strokeWidth={2.5} />;
          })()}
          {STATUS_META[request.status].label}
        </span>
      </div>

      {/* Amount diff */}
      <div className="grid grid-cols-3 gap-3 border-b border-neutral-100 px-5 py-4">
        <Stat label="Valor" value={`R$ ${request.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
        <Stat
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
        <Stat
          label="Anexos · Comentários"
          value={`${request.attachments} arquivos · ${request.comments} mensagens`}
        />
      </div>

      {/* Description */}
      <div className="px-5 py-4">
        <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
          Descrição
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-700">
          {request.description}
        </p>
      </div>

      {/* Diff card */}
      <div className="mx-5 mb-4 rounded-xl border border-brand/8 bg-brand-ghost/40 p-4">
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
      </div>

      {/* Comment chips */}
      <div className="px-5 pb-4">
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
                  "rounded-full border-2 px-3 py-1 font-ui text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand/30",
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
      </div>

      {/* Action bar */}
      <div
        data-tour="ap-actions"
        className="mt-auto flex items-center justify-between border-t border-neutral-100 bg-white px-5 py-4"
      >
        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <Paperclip size={12} strokeWidth={2.25} className="text-neutral-400" />
          {request.attachments} anexos
        </div>
        {request.status === "pendente" ? (
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onDecide(request.id, "reprovada")}
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-danger px-4 py-2.5 font-ui text-[12px] font-bold text-danger hover:bg-danger/5"
            >
              <X size={13} strokeWidth={2.5} />
              Reprovar
            </motion.button>
            <motion.button
              type="button"
              data-tour="ap-approve-button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onDecide(request.id, "aprovada")}
              className="inline-flex items-center gap-1.5 rounded-md bg-success px-4 py-2.5 font-ui text-[12px] font-bold text-white shadow-brand hover:bg-success/90"
            >
              <Check size={13} strokeWidth={2.5} />
              Aprovar
            </motion.button>
          </div>
        ) : (
          <div data-tour="ap-notified" className="inline-flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-[11px] font-bold text-success">
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Solicitante notificado por push + e-mail
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  accent,
  tone,
  Icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: string;
  Icon?: typeof TrendingUp;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 font-ui text-[14px] font-bold tabular-nums",
          accent && "text-brand",
        )}
        style={tone ? { color: tone } : undefined}
      >
        {Icon && <Icon size={13} strokeWidth={2.25} />}
        {value}
      </p>
    </div>
  );
}

function EmptyDetail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 bg-neutral-50 text-center"
    >
      <BadgeCheck size={36} strokeWidth={1.5} className="text-neutral-300" />
      <p className="font-ui text-[12px] text-neutral-400">
        Selecione uma solicitação ao lado para revisar.
      </p>
    </motion.div>
  );
}
