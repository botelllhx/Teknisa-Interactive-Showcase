"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Package,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Briefcase,
  Users,
  Bell,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  Calendar,
  Save,
  RotateCw,
  CheckCircle2,
  Send,
  Download,
  Trophy,
  ArrowDownToLine,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { Button } from "@/components/ui/shadcn";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { AreaChart, Sparkline } from "@/components/ui/charts";

interface MercadumProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

type CotacaoStatus = "proposta-aceita" | "pendente" | "negociando" | "finalizada";

interface Cotacao {
  id: string;
  cliente: string;
  status: CotacaoStatus;
  validade: string;
  prazo: string;
  responsavel: string;
  produtos: string;
}

const COTACOES: Cotacao[] = [
  { id: "RFQ-2024-001", cliente: "Grupo Alimentos Brasil", status: "proposta-aceita", validade: "01/08/2025 - 31/08/2025", prazo: "01/08/2025 23:59:00", responsavel: "Bruno Sampaio", produtos: "0/10" },
  { id: "RFQ-2024-002", cliente: "Indústria São Paulo", status: "proposta-aceita", validade: "01/08/2025 - 31/08/2025", prazo: "01/08/2025 23:59:00", responsavel: "Carla Teixeira", produtos: "2/10" },
  { id: "RFQ-2024-003", cliente: "Grupo Alimentos Brasil", status: "negociando", validade: "01/08/2025 - 31/08/2025", prazo: "01/08/2025 23:59:00", responsavel: "Ricardo Nobre", produtos: "4/10" },
  { id: "RFQ-2024-004", cliente: "Indústria São Paulo", status: "pendente", validade: "01/08/2025 - 31/08/2025", prazo: "01/08/2025 23:59:00", responsavel: "Sofia Mendonça", produtos: "0/10" },
  { id: "RFQ-2024-005", cliente: "Grupo Alimentos Brasil", status: "finalizada", validade: "01/08/2025 - 31/08/2025", prazo: "01/08/2025 23:59:00", responsavel: "Philippos Propodis", produtos: "10/10" },
];

const STATUS_TONE: Record<
  CotacaoStatus,
  { label: string; bg: string; color: string }
> = {
  "proposta-aceita": { label: "Proposta aceita", bg: "rgba(22,163,74,0.15)", color: "#16a34a" },
  pendente: { label: "Pendente", bg: "rgba(217,119,6,0.18)", color: "#d97706" },
  negociando: { label: "Negociando", bg: "rgba(217,119,6,0.10)", color: "#d97706" },
  finalizada: { label: "Finalizada", bg: "rgba(107,114,128,0.18)", color: "#6b7280" },
};

interface Produto {
  id: string;
  nome: string;
  unidade: "UN" | "KG";
  marca: string;
  qntdComprar: number;
  qntdDisponivel: number;
  valorObjetivo: number;
  ultimaCotacao: number;
  valorCotacao: number;
  posicao: number;
  variacao: number;
  variacaoPct: number;
  menor: number;
  menorData: string;
  destaque?: boolean;
}

const PRODUTOS: Produto[] = [
  {
    id: "arroz",
    nome: "Arroz Branco Polido Tipo 1- 5kg",
    unidade: "UN",
    marca: "Camil",
    qntdComprar: 10_000_000,
    qntdDisponivel: 1000,
    valorObjetivo: 20,
    ultimaCotacao: 35,
    valorCotacao: 22.0,
    posicao: 5,
    variacao: 13,
    variacaoPct: 62.9,
    menor: 18,
    menorData: "02/08/25 09:00",
  },
  {
    id: "feijao",
    nome: "Feijão Preto - 5kg",
    unidade: "KG",
    marca: "Camil",
    qntdComprar: 10_000_000,
    qntdDisponivel: 1000,
    valorObjetivo: 20,
    ultimaCotacao: 35,
    valorCotacao: 36.0,
    posicao: 4,
    variacao: 1,
    variacaoPct: 97.3,
    menor: 18,
    menorData: "02/08/25 09:00",
  },
  {
    id: "soja",
    nome: "Proteína Texturizada de Soja Escura - 5kg",
    unidade: "UN",
    marca: "Camil",
    qntdComprar: 1000,
    qntdDisponivel: 1000,
    valorObjetivo: 20,
    ultimaCotacao: 25,
    valorCotacao: 22.0,
    posicao: 1,
    variacao: 3,
    variacaoPct: 88,
    menor: 22,
    menorData: "02/08/25 09:00",
    destaque: true,
  },
  {
    id: "grao",
    nome: "Grão de Bico - 5kg",
    unidade: "UN",
    marca: "Camil",
    qntdComprar: 1000,
    qntdDisponivel: 1000,
    valorObjetivo: 20,
    ultimaCotacao: 0,
    valorCotacao: 22.0,
    posicao: 2,
    variacao: 22,
    variacaoPct: 2200,
    menor: 18,
    menorData: "02/08/25 09:00",
  },
];

interface ChatMessage {
  id: string;
  text: string;
  author: "you" | "them";
  authorName?: string;
  time: string;
}

const CHAT_INITIAL: ChatMessage[] = [
  {
    id: "m1",
    text: "Olá! Recebemos a sua proposta de R$ 4.250,00. Gostaríamos de negociar um desconto para quantidade.",
    author: "you",
    time: "Hoje, 09:30",
  },
  {
    id: "m2",
    text: "Bom dia! Para quantidade de 3 unidades, posso oferecer um desconto de 5%. Valor final seria R$ 4.037,50.",
    author: "them",
    authorName: "Mariana Silva",
    time: "Hoje, 09:30",
  },
  {
    id: "m3",
    text: "Excelente! Consegue manter a garantia de 12 meses e incluir treinamento para 2 operadores?",
    author: "you",
    time: "Hoje, 09:30",
  },
  {
    id: "m4",
    text: "Sim, sem problemas! Garantia de 12 meses e treinamento para 2 operadores inclusos no valor.",
    author: "them",
    authorName: "Mariana Silva",
    time: "Hoje, 09:30",
  },
];

interface Fornecedor {
  id: string;
  cnpj: string;
  razao: string;
  fantasia: string;
  cadastro: string;
}

const FORNECEDORES: Fornecedor[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `f${i}`,
  cnpj: "55.555.555/5555-55",
  razao: ["Camil Alimentos S.A.", "Brasfoods Distribuidora", "Pão & Cia", "Fortaleza Cereais", "Grão Real"][i],
  fantasia: ["Camil Alimentos", "Brasfoods", "Pão & Cia", "Fortaleza", "Grão Real"][i],
  cadastro: "25/03/2025",
}));

// ============================================================================
// Component
// ============================================================================

type View = "cotacoes" | "cotacao-detail" | "chat" | "fornecedores";

export function MercadumMockup({ step }: MercadumProps) {
  void step;
  const [view, setView] = useState<View>("cotacoes");
  const [activeCotacao, setActiveCotacao] = useState<Cotacao>(COTACOES[0]);
  const [selectedProdutos, setSelectedProdutos] = useState<Set<string>>(
    new Set(["soja"]),
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      mcView: view,
      mcCotacaoId: activeCotacao.id,
      mcCliente: activeCotacao.cliente,
      mcSelected: Array.from(selectedProdutos).length,
    });
  }, [view, activeCotacao, selectedProdutos, patchLive]);

  const toggleProduto = (id: string) =>
    setSelectedProdutos((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f6f7fb] font-ui text-neutral-800">
      <Sidebar view={view} onPick={setView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar view={view} cotacao={activeCotacao} />
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            {view === "cotacoes" && (
              <CotacoesListView
                key="list"
                onOpen={(c) => {
                  setActiveCotacao(c);
                  setView("cotacao-detail");
                }}
              />
            )}
            {view === "cotacao-detail" && (
              <CotacaoDetailView
                key="det"
                cotacao={activeCotacao}
                selected={selectedProdutos}
                onToggle={toggleProduto}
                onOpenChat={() => setView("chat")}
              />
            )}
            {view === "chat" && (
              <ChatView
                key="chat"
                cotacao={activeCotacao}
                onBack={() => setView("cotacao-detail")}
              />
            )}
            {view === "fornecedores" && <FornecedoresView key="forn" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// Sidebar (icons column)
// ============================================================================

function Sidebar({
  view,
  onPick,
}: {
  view: View;
  onPick: (v: View) => void;
}) {
  const items = [
    { id: "home" as const, view: "cotacoes" as View, Icon: Home, label: "Início" },
    { id: "pack", view: "cotacoes" as View, Icon: Package, label: "Estoque" },
    { id: "money", view: "cotacoes" as View, Icon: DollarSign, label: "Financeiro" },
    { id: "cart", view: "cotacoes" as View, Icon: ShoppingCart, label: "Cotações", target: true },
    { id: "chat", view: "chat" as View, Icon: MessageSquare, label: "Negociação" },
    { id: "brief", view: "cotacoes" as View, Icon: Briefcase, label: "Pedidos" },
    { id: "users", view: "fornecedores" as View, Icon: Users, label: "Fornecedores" },
  ];
  return (
    <aside
      data-tour="mc-sidebar"
      className="flex w-[64px] flex-col items-center gap-1 border-r border-neutral-200 bg-white py-3"
    >
      <button
        type="button"
        aria-label="Menu"
        className="mb-1 flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>
      {items.map((it) => {
        const active =
          (it.view === view) ||
          (it.id === "cart" && (view === "cotacoes" || view === "cotacao-detail")) ||
          (it.id === "users" && view === "fornecedores") ||
          (it.id === "chat" && view === "chat");
        return (
          <motion.button
            key={it.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onPick(it.view)}
            data-tour={it.id === "cart" ? "mc-sidebar-cart" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-brand-ghost text-brand"
                : "text-neutral-400 hover:bg-neutral-50 hover:text-brand",
            )}
          >
            <it.Icon size={18} strokeWidth={2} />
          </motion.button>
        );
      })}
    </aside>
  );
}

// ============================================================================
// Top bar
// ============================================================================

function TopBar({ view, cotacao }: { view: View; cotacao: Cotacao }) {
  const title =
    view === "cotacoes"
      ? "Cotação"
      : view === "cotacao-detail"
        ? `Cotação - ${cotacao.id}`
        : view === "chat"
          ? `Chat - ${cotacao.id}`
          : "Fornecedor";
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
            boxShadow:
              "0 3px 8px rgba(2,7,136,0.30), inset 0 1px 0 rgba(255,255,255,0.20)",
          }}
        >
          <Package size={14} strokeWidth={2.25} />
        </div>
        <p
          className="font-display text-[18px] font-bold text-brand"
          style={{ letterSpacing: "-0.022em" }}
        >
          {title}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notificações"
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-50"
        >
          <Bell size={16} strokeWidth={2} className="text-brand" />
          <span
            className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[7.5px] font-bold tabular-nums text-white"
            style={{
              boxShadow: "0 0 0 1.5px white",
            }}
          >
            1
          </span>
        </button>
        <div
          className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1"
          style={{
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <span className="text-right leading-tight">
            <span
              className="block font-ui text-[11.5px] font-bold text-brand"
              style={{ letterSpacing: "-0.005em" }}
            >
              Alexa Rawles Grahamson
            </span>
            <span
              className="inline-block rounded-full bg-brand-ghost px-1.5 py-0 font-ui text-[10px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.12em" }}
            >
              Master
            </span>
          </span>
          <ChevronDown size={12} strokeWidth={2.5} className="text-brand" />
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// Cotações list
// ============================================================================

function KPITile({
  icon,
  tone,
  label,
  value,
  delta,
  trend,
}: {
  icon: React.ReactElement;
  tone: "brand" | "success" | "teal" | "warning";
  label: string;
  value: string;
  delta: string;
  trend?: number[];
}) {
  const sparkColor =
    tone === "success"
      ? "#16a34a"
      : tone === "teal"
        ? "#0d9488"
        : tone === "warning"
          ? "#d97706"
          : "#020788";
  return (
    <div
      className="rounded-xl bg-white/90 px-3 py-2.5 backdrop-blur"
      style={{ border: "1px solid rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-2.5">
        <GradientIcon icon={icon} tone={tone} size={32} />
        <div className="min-w-0 flex-1">
          <p
            className="font-ui text-[10.5px] font-bold uppercase text-neutral-500"
            style={{ letterSpacing: "0.16em" }}
          >
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display text-[18px] font-bold tabular-nums leading-none text-neutral-900"
              style={{ letterSpacing: "-0.025em" }}
            >
              {value}
            </span>
            <span
              className={cn(
                "font-ui text-[10px] font-bold tabular-nums",
                delta.startsWith("+") ? "text-success" : "text-danger",
              )}
            >
              {delta}
            </span>
          </div>
        </div>
      </div>
      {trend && (
        <div className="-mt-1 -mb-1.5">
          <Sparkline
            data={trend}
            color={sparkColor}
            width={140}
            height={20}
            fill
          />
        </div>
      )}
    </div>
  );
}

function CotacoesListView({ onOpen }: { onOpen: (c: Cotacao) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Breadcrumb path={["Dashboard", "Cotações"]} />

      {/* KPI hero — economia, cotações abertas, fornecedores ativos */}
      <div
        className="mt-3 grid grid-cols-[1fr_1fr_1fr_1.4fr] gap-3 rounded-2xl bg-ai-soft p-3.5"
        style={{ border: "1px solid rgba(2,7,136,0.08)" }}
      >
        <KPITile
          icon={<Briefcase />}
          tone="brand"
          label="Cotações abertas"
          value="47"
          delta="+8,6%"
          trend={[34, 36, 38, 40, 42, 45, 47]}
        />
        <KPITile
          icon={<DollarSign />}
          tone="success"
          label="Economia do mês"
          value="R$ 84,2k"
          delta="+22,7%"
          trend={[62, 65, 70, 74, 78, 81, 84]}
        />
        <KPITile
          icon={<Users />}
          tone="teal"
          label="Fornecedores ativos"
          value="128"
          delta="+4,4%"
          trend={[120, 122, 124, 125, 126, 127, 128]}
        />
        <div
          className="rounded-xl bg-white/80 px-3 py-2 backdrop-blur"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <p
            className="font-ui text-[10.5px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.10em" }}
          >
            Economia 7d
          </p>
          <div className="mt-0.5 -mb-2">
            <AreaChart
              data={[
                { x: "S", y: 42 },
                { x: "T", y: 48 },
                { x: "Q", y: 54 },
                { x: "Q", y: 60 },
                { x: "S", y: 68 },
                { x: "S", y: 76 },
                { x: "D", y: 84 },
              ]}
              color="#16a34a"
              showXLabels={false}
              highlightLast={true}
              grid={false}
              aspectRatio="16/4"
              formatY={(v) => `R$ ${v.toFixed(0)}k`}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <Search size={14} strokeWidth={2.25} className="text-neutral-400" />
          <span className="font-ui text-[12px] text-neutral-400">Pesquisar</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-ghost px-3 py-2 font-ui text-[12px] font-bold text-brand"
        >
          <Download size={13} strokeWidth={2.25} />
          Exportar
          <ChevronDown size={11} strokeWidth={2.5} />
        </button>
        <IconButton Icon={Filter} />
        <IconButton Icon={RefreshCw} />
        <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-2 font-ui text-[11px] font-medium text-neutral-500">
          Exibir: 10 <ChevronDown size={10} strokeWidth={2.5} className="ml-1 inline" />
        </span>
      </div>

      {/* Table */}
      <div
        data-tour="mc-cotacao-table"
        className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <div className="grid grid-cols-[1.1fr_1.4fr_1.2fr_1.4fr_1.4fr_1.4fr_0.6fr] items-center border-b border-neutral-200 bg-neutral-100 px-4 py-2 font-ui text-[11px] font-bold text-brand">
          <span>Código</span>
          <span>Cliente</span>
          <span>Status</span>
          <span>Data de Validade</span>
          <span>Prazo da Proposta</span>
          <span>Responsável</span>
          <span className="text-right">Produtos</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {COTACOES.map((c, i) => {
            const tone = STATUS_TONE[c.status];
            return (
              <motion.button
                key={c.id + i}
                type="button"
                whileTap={{ scale: 0.998 }}
                onClick={() => onOpen(c)}
                data-tour={i === 0 ? "mc-row-open" : undefined}
                className="grid w-full grid-cols-[1.1fr_1.4fr_1.2fr_1.4fr_1.4fr_1.4fr_0.6fr] items-center px-4 py-2.5 text-left text-[12px] transition-colors hover:bg-neutral-50"
              >
                <span className="font-ui font-bold text-neutral-700">{c.id}</span>
                <span className="text-neutral-700">{c.cliente}</span>
                <span>
                  <span
                    className="inline-block rounded-md px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: tone.bg, color: tone.color }}
                  >
                    {tone.label}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-600 tabular-nums">
                  <Calendar size={11} strokeWidth={2.25} className="text-neutral-400" />
                  {c.validade}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-600 tabular-nums">
                  <Calendar size={11} strokeWidth={2.25} className="text-neutral-400" />
                  {c.prazo}
                </span>
                <span className="text-neutral-700">{c.responsavel}</span>
                <span className="text-right text-[12px] font-medium text-neutral-700 tabular-nums">
                  {c.produtos}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[12px]">
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100">
          <ChevronLeft size={13} strokeWidth={2.25} />
        </button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md font-ui font-bold",
              n === 1
                ? "bg-brand text-white"
                : "text-neutral-500 hover:bg-neutral-100",
            )}
          >
            {n}
          </button>
        ))}
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-brand hover:bg-neutral-100">
          <ChevronLeft size={13} strokeWidth={2.25} className="rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Cotação detail
// ============================================================================

function CotacaoDetailView({
  cotacao,
  selected,
  onToggle,
  onOpenChat,
}: {
  cotacao: Cotacao;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onOpenChat: () => void;
}) {
  const variacaoTotal = useMemo(
    () =>
      Array.from(selected).reduce((sum, id) => {
        const p = PRODUTOS.find((x) => x.id === id);
        return sum + (p ? p.valorCotacao - p.valorObjetivo : 0);
      }, 0),
    [selected],
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Breadcrumb path={["Dashboard", "Cotações", `Cotação - ${cotacao.id}`]} />

      {/* Info card */}
      <div
        data-tour="mc-info-card"
        className="mt-3 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <p className="font-ui text-[14px] font-bold text-brand">
          Informação da Cotação
        </p>
        <div className="mt-3 grid grid-cols-5 gap-4 text-[11px]">
          <InfoCol label="Cliente" value={cotacao.cliente} />
          <InfoCol label="Localização da Entrega" value="São Paulo, SP" />
          <InfoCol label="Data de Validade" value="01/08/2025 - 31/08/2025" />
          <InfoCol label="Valor mínimo do Pedido" value="R$ 5.000,00" />
          <InfoCol label="Produtos Cotados" value="2/10" highlight />
          <InfoCol label="Responsável" value="Bruno Sampaio" />
          <InfoCol label="E-mail" value="bruno.sampaio@email.com" />
          <InfoCol label="Total de Lances" value="5" />
          <InfoCol
            label="Queda de Valores"
            value={`R$ ${variacaoTotal < 0 ? "" : "-"}${Math.abs(variacaoTotal).toFixed(2).replace(".", ",")}`}
            tone="#16a34a"
          />
          <InfoCol
            label="Notas do comprador"
            value="“Preferência por arroz tipo 1, em pacotes de 5kg”"
          />
        </div>
      </div>

      {/* Detail table */}
      <p className="mt-4 font-ui text-[14px] font-bold uppercase tracking-wider text-brand">
        Detalhes da Cotação
      </p>
      <p className="text-[11px] text-neutral-500">
        Camil S.A. - Unidade São Paulo
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <Search size={13} strokeWidth={2.25} className="text-neutral-400" />
          <span className="font-ui text-[11px] text-neutral-400">Pesquisar</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-ghost px-3 py-2 font-ui text-[11px] font-bold text-brand"
        >
          <RotateCw size={12} strokeWidth={2.25} />
          Repetir cotação anterior
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-ghost px-3 py-2 font-ui text-[11px] font-bold text-brand"
        >
          <RefreshCw size={12} strokeWidth={2.25} />
          Repetir e ajustar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 font-ui text-[11px] font-bold text-neutral-500 ring-1 ring-neutral-200"
        >
          <ArrowDownToLine size={12} strokeWidth={2.25} className="rotate-180" />
          Descartar
        </button>
        <button
          type="button"
          data-tour="mc-save"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-2 font-ui text-[11px] font-bold text-white shadow-brand"
        >
          <Save size={12} strokeWidth={2.25} />
          Salvar
        </button>
        <IconButton Icon={Filter} />
        <IconButton Icon={RefreshCw} />
        <IconButton Icon={MoreVertical} />
        <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-2 font-ui text-[11px] font-medium text-neutral-500">
          Exibir: 4 <ChevronDown size={10} strokeWidth={2.5} className="ml-1 inline" />
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="grid grid-cols-[28px_2fr_50px_1fr_0.9fr_0.9fr_1.1fr_1.1fr_1fr_1.2fr_1.2fr] items-center border-b border-neutral-200 bg-neutral-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-brand">
          <span></span>
          <span>Produto</span>
          <span>Unid.</span>
          <span>Marca</span>
          <span className="text-right">Qntd<br/>A Comprar</span>
          <span className="text-right">Qntd<br/>Disponível</span>
          <span className="text-right">Valor<br/>Objetivo (R$)</span>
          <span className="text-right">Última<br/>Cotação (R$)</span>
          <span className="text-right">Valor<br/>Cotação (R$)</span>
          <span className="text-right">Variação<br/>R$ / %</span>
          <span className="text-right">Menor Cotação<br/>Mercadum (R$)</span>
        </div>
        <div data-tour="mc-products-table" className="divide-y divide-neutral-100">
          {PRODUTOS.map((p) => (
            <motion.div
              key={p.id}
              layout
              className={cn(
                "grid grid-cols-[28px_2fr_50px_1fr_0.9fr_0.9fr_1.1fr_1.1fr_1fr_1.2fr_1.2fr] items-center px-3 py-3 text-[11px] transition-colors hover:bg-neutral-50",
                selected.has(p.id) && "bg-brand-ghost/40",
              )}
            >
              <button
                type="button"
                onClick={() => onToggle(p.id)}
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border-2",
                  selected.has(p.id)
                    ? "border-brand bg-brand"
                    : "border-neutral-300 bg-white",
                )}
              >
                {selected.has(p.id) && (
                  <CheckCircle2 size={9} strokeWidth={3} className="text-white" />
                )}
              </button>
              <span className="font-ui font-bold text-neutral-700">{p.nome}</span>
              <span className="font-medium text-neutral-600">{p.unidade}</span>
              <span className="text-neutral-600">{p.marca}</span>
              <span className="text-right tabular-nums text-neutral-700">
                {p.qntdComprar.toLocaleString("pt-BR")}
              </span>
              <span className="text-right tabular-nums text-neutral-600">
                {p.qntdDisponivel.toLocaleString("pt-BR")}
              </span>
              <span className="text-right tabular-nums text-neutral-700">
                {p.valorObjetivo.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-right tabular-nums text-neutral-600">
                {p.ultimaCotacao > 0
                  ? p.ultimaCotacao.toFixed(2).replace(".", ",")
                  : "—"}
              </span>
              <span className="text-right tabular-nums">
                <span
                  className={cn(
                    "inline-block rounded-md px-2 py-1 font-ui font-bold",
                    p.destaque
                      ? "bg-brand text-white shadow-brand"
                      : "bg-neutral-100 text-neutral-700",
                  )}
                >
                  {p.valorCotacao.toFixed(2).replace(".", ",")}
                </span>
                <span className="block text-[10.5px] text-neutral-500 mt-0.5">
                  {p.posicao}ª Posição
                </span>
              </span>
              <span className="text-right">
                <span className="flex items-center justify-end gap-1">
                  <span
                    className={cn(
                      "flex h-3 w-3 items-center justify-center rounded-full text-white",
                      p.variacao > 0 && p.variacao < 10
                        ? "bg-success"
                        : p.variacao >= 10 && p.variacao < 100
                          ? "bg-success"
                          : "bg-danger",
                    )}
                  >
                    <ChevronLeft
                      size={8}
                      strokeWidth={2.5}
                      className={p.variacao > 0 ? "rotate-90" : "-rotate-90"}
                    />
                  </span>
                  <span className="font-ui font-bold text-neutral-700 tabular-nums">
                    {p.variacao.toFixed(2).replace(".", ",")}
                  </span>
                </span>
                <span className="block text-[10.5px] text-neutral-500 tabular-nums">
                  {p.variacaoPct.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 3 })}%
                </span>
              </span>
              <span className="text-right">
                <span className="flex items-center justify-end gap-1 tabular-nums text-neutral-700">
                  {p.destaque && (
                    <Trophy
                      size={11}
                      strokeWidth={2.25}
                      className="text-warning"
                    />
                  )}
                  {p.menor.toFixed(2).replace(".", ",")}
                </span>
                <span className="block text-[10.5px] text-neutral-500 tabular-nums">
                  {p.menorData}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onOpenChat}
          data-tour="mc-open-chat"
        >
          <MessageSquare size={14} strokeWidth={2.25} />
          Abrir negociação
        </Button>
      </div>
    </motion.div>
  );
}

function InfoCol({
  label,
  value,
  highlight,
  tone,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium text-neutral-500">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-ui font-bold",
          highlight ? "text-brand text-[12px]" : "text-neutral-700 text-[11px]",
        )}
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// Chat (negotiation)
// ============================================================================

function ChatView({
  cotacao,
  onBack,
}: {
  cotacao: Cotacao;
  onBack: () => void;
}) {
  void cotacao;
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_INITIAL);
  const [pulse, setPulse] = useState(0);
  const [proposalAccepted, setProposalAccepted] = useState<boolean | null>(null);
  const [quickReplies] = useState([
    "Aceitamos a proposta de R$ 4.037,50.",
    "Pode incluir frete CIF?",
    "Precisamos do prazo em 30 dias.",
  ]);

  const send = (text: string) => {
    setMessages((p) => [
      ...p,
      {
        id: `you-${p.length}`,
        text,
        author: "you",
        time: "Hoje, agora",
      },
    ]);
    setPulse((n) => n + 1);
    // Simulate supplier response
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: `them-${p.length}`,
          text: "Anotado! Vou ajustar a proposta com isso e te retorno em instantes.",
          author: "them",
          authorName: "Mariana Silva",
          time: "Hoje, agora",
        },
      ]);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="grid h-full grid-cols-[1fr_320px] gap-4"
    >
      <div className="flex h-full flex-col">
        <Breadcrumb path={["Dashboard", "Cotações", "Chat"]} onBack={onBack} />

        <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="font-ui text-[14px] font-bold text-brand">Chat</p>
          </div>
          <div
            data-tour="mc-chat"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
          </div>

          <div className="border-t border-neutral-100 px-4 py-2 flex flex-wrap gap-1.5">
            {quickReplies.map((q) => (
              <motion.button
                key={q}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => send(q)}
                className="rounded-full border border-brand/20 bg-brand-ghost px-2.5 py-1 font-ui text-[11px] font-medium text-brand hover:bg-brand-subtle"
              >
                {q}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-100 bg-neutral-50 p-3">
            <div className="flex flex-1 items-center rounded-lg bg-white px-3 py-2 ring-1 ring-neutral-200">
              <span className="font-ui text-[12px] text-neutral-400">
                Toque numa resposta rápida para enviar
              </span>
            </div>
            <motion.button
              key={pulse}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.4 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white shadow-brand"
            >
              <Send size={15} strokeWidth={2.25} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Proposta panel */}
      <aside className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <button className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 font-ui text-[12px] font-bold text-brand">
            + Catálogo do Produto
          </button>
          <button className="flex-1 rounded-md bg-brand px-3 py-2 font-ui text-[12px] font-bold text-white shadow-brand">
            ↓ Baixar proposta
          </button>
        </div>

        <div
          data-tour="mc-proposal-panel"
          className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4"
        >
          <p className="font-ui text-[14px] font-bold text-brand">
            Proposta Atual
          </p>
          <div className="space-y-2 border-b border-neutral-100 pb-3 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Valor Original:</span>
              <span className="font-ui font-bold text-neutral-700 tabular-nums">
                R$ 4.250,00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-ui font-bold text-success">Desconto:</span>
              <span className="font-ui font-bold text-success tabular-nums">
                5% (212,50)
              </span>
            </div>
          </div>
          <div className="space-y-2 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="font-ui font-bold text-success">Valor Final</span>
              <span className="font-ui text-[16px] font-bold text-success tabular-nums">
                R$ 4.037,50
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Prazo:</span>
              <span className="font-ui font-bold text-neutral-700 tabular-nums">
                15 dias
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Garantia:</span>
              <span className="font-ui font-bold text-neutral-700">
                12 meses
              </span>
            </div>
          </div>

          <div
            data-tour="mc-proposal-actions"
            className="mt-2 flex flex-col gap-2"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setProposalAccepted(true)}
              disabled={proposalAccepted !== null}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-md py-2.5 font-ui text-[12px] font-bold text-white shadow",
                proposalAccepted === true
                  ? "bg-success/70"
                  : "bg-success hover:bg-success/90",
              )}
            >
              <CheckCircle2 size={13} strokeWidth={2.5} />
              {proposalAccepted === true ? "Aceita!" : "Aceitar Proposta"}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setProposalAccepted(false)}
              disabled={proposalAccepted !== null}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-md border-2 py-2.5 font-ui text-[12px] font-bold",
                proposalAccepted === false
                  ? "border-danger/40 bg-danger/10 text-danger"
                  : "border-danger text-danger hover:bg-danger/5",
              )}
            >
              <ArrowDownToLine size={13} strokeWidth={2.5} className="rotate-180" />
              {proposalAccepted === false ? "Declinada" : "Declinar Proposta"}
            </motion.button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white py-2.5 font-ui text-[12px] font-bold text-neutral-700"
            >
              <MessageSquare size={13} strokeWidth={2.25} />
              Contra Proposta
            </button>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isYou = message.author === "you";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex items-start gap-2", isYou && "flex-row-reverse")}
    >
      <span
        className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: isYou ? "#020788" : "#d97706" }}
      >
        {isYou ? "EU" : "MS"}
      </span>
      <div className={cn(isYou && "items-end text-right", "max-w-[70%] flex flex-col")}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-[12px] leading-snug",
            isYou
              ? "bg-brand-ghost text-brand"
              : "bg-neutral-100 text-neutral-700",
          )}
        >
          {message.text}
        </div>
        <p
          className={cn(
            "mt-1 text-[10px] text-neutral-400",
            isYou && "text-right",
          )}
        >
          {message.authorName ? `${message.authorName} - ` : "Você - "}
          {message.time}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Fornecedores
// ============================================================================

function FornecedoresView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Breadcrumb path={["Dashboard", "Fornecedor"]} />
      <p className="mt-3 font-ui text-[14px] font-bold uppercase tracking-wider text-brand">
        FORNECEDOR
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
          <Search size={14} strokeWidth={2.25} className="text-neutral-400" />
          <span className="font-ui text-[12px] text-neutral-400">Pesquisar</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-2 font-ui text-[12px] font-bold text-white shadow-brand"
        >
          <Plus size={13} strokeWidth={2.5} />
          Adicionar
        </motion.button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-ghost px-3 py-2 font-ui text-[12px] font-bold text-brand"
        >
          <Download size={13} strokeWidth={2.25} />
          Exportar
          <ChevronDown size={11} strokeWidth={2.5} />
        </button>
        <IconButton Icon={Filter} />
        <IconButton Icon={RefreshCw} />
        <span className="rounded-md border border-neutral-200 bg-white px-2.5 py-2 font-ui text-[11px] font-medium text-neutral-500">
          Exibir: 5
        </span>
      </div>

      <div
        data-tour="mc-fornecedores"
        className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <div className="grid grid-cols-[1.5fr_2fr_1.6fr_1fr_60px] items-center border-b border-neutral-200 bg-neutral-100 px-4 py-2 text-[11px] font-bold text-brand">
          <span className="text-right">CNPJ</span>
          <span>Razão Social</span>
          <span>Nome Fantasia</span>
          <span className="text-right">Data de Cadastro</span>
          <span className="text-right">Ação</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {FORNECEDORES.map((f) => (
            <div
              key={f.id}
              className="grid grid-cols-[1.5fr_2fr_1.6fr_1fr_60px] items-center px-4 py-3 text-[12px] transition-colors hover:bg-neutral-50"
            >
              <span className="text-right font-ui font-medium text-neutral-700 tabular-nums">
                {f.cnpj}
              </span>
              <span className="font-ui font-bold text-neutral-700">{f.razao}</span>
              <span className="text-neutral-600">{f.fantasia}</span>
              <span className="text-right tabular-nums text-neutral-600">
                {f.cadastro}
              </span>
              <span className="flex justify-end">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md text-danger hover:bg-danger/10"
                  aria-label="Remover"
                >
                  <Trash2 />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Shared bits
// ============================================================================

function Trash2() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function Breadcrumb({
  path,
  onBack,
}: {
  path: string[];
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
      <button
        type="button"
        onClick={onBack}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-white text-brand hover:bg-brand-ghost"
        aria-label="Voltar"
      >
        <ChevronLeft size={13} strokeWidth={2.5} />
      </button>
      {path.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-ui",
              i === path.length - 1
                ? "font-bold text-brand uppercase tracking-wider text-[10px]"
                : "text-neutral-500",
            )}
          >
            {p}
          </span>
          {i < path.length - 1 && (
            <span className="text-neutral-300">›</span>
          )}
        </span>
      ))}
    </div>
  );
}

function IconButton({ Icon }: { Icon: typeof Filter }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-brand hover:bg-brand-ghost"
    >
      <Icon size={13} strokeWidth={2.25} />
    </button>
  );
}
