"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Send,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Package,
  Users,
  Mic,
  Paperclip,
  ChevronDown,
  Check,
  Bot,
  Lightbulb,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { Badge } from "@/components/ui/shadcn";
import { AreaChart, HorizontalBars } from "@/components/ui/charts";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { people } from "@/lib/photos";

interface ISAProps {
  step: number;
}

/**
 * ISA — ChatBot Helper. Chat-first interface with the AI copilot.
 * Conversation reveals progressively as `step` advances. Each AI response
 * can render inline data cards: KPIs, charts, action buttons.
 *
 * Steps:
 *   0 → empty state with suggested prompts
 *   1 → user asks "como estão minhas vendas hoje?"; AI responds with KPI + chart
 *   2 → user asks about waste; AI responds with prediction + action
 *   3 → user asks for an action; AI applies + confirmation
 *   4 → closing summary
 */
export function ISAMockup({ step }: ISAProps) {
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({ isaStep: step });
  }, [step, patchLive]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <Header />
      <main className="grid flex-1 grid-cols-[240px_1fr] overflow-hidden">
        <Sidebar />
        <ChatPanel step={step} />
      </main>
    </div>
  );
}

// ============================================================================
// Header
// ============================================================================

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(124,58,237,0)",
                "0 0 0 6px rgba(124,58,237,0.10)",
                "0 0 0 0 rgba(124,58,237,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
            }}
          >
            <Bot size={15} strokeWidth={2.25} className="text-white" />
          </motion.span>
          <div className="leading-tight">
            <p
              className="font-ui text-[13px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.005em" }}
            >
              ISA
            </p>
            <p className="font-ui text-[10px] text-neutral-500">
              Copiloto Teknisa · GPT-T 4o
            </p>
          </div>
        </div>
        <Badge variant="ai" className="gap-1">
          <Sparkles size={10} strokeWidth={2.5} />
          Online
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 font-ui text-[10px] font-medium text-neutral-500">
          <RefreshCw size={11} strokeWidth={2.25} />
          Aprendendo com 24 meses
        </span>
        <PersonAvatar
          photo={people.joao}
          name="João Costa"
          size={28}
          status="online"
        />
      </div>
    </header>
  );
}

// ============================================================================
// Sidebar — recent conversations + quick actions
// ============================================================================

function Sidebar() {
  return (
    <aside className="flex flex-col gap-3 overflow-y-auto border-r border-brand/8 bg-gradient-to-b from-white to-brand-ghost/30 p-3">
      <div className="flex items-center justify-between">
        <p
          className="font-ui text-[9px] font-bold uppercase text-brand"
          style={{ letterSpacing: "0.10em" }}
        >
          Conversas
        </p>
        <button
          type="button"
          className="rounded-md bg-gradient-to-r from-brand via-brand-light to-[#7c3aed] px-2 py-0.5 font-ui text-[9px] font-bold text-white shadow-brand"
        >
          + Nova
        </button>
      </div>
      <div className="space-y-1">
        {[
          { id: 1, label: "Vendas de hoje", time: "agora", active: true },
          { id: 2, label: "Previsão para sexta", time: "Há 2h" },
          { id: 3, label: "Comparar Filial Centro vs Norte", time: "Ontem" },
          { id: 4, label: "Reduzir desperdício de arroz", time: "3 dias" },
          { id: 5, label: "Análise de cardápio Quinta", time: "Semana" },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            className={cn(
              "w-full rounded-lg px-2 py-1.5 text-left transition-colors",
              c.active
                ? "bg-white shadow-subtle"
                : "hover:bg-white/60",
            )}
            style={{
              border: c.active ? "1px solid rgba(2,7,136,0.10)" : undefined,
            }}
          >
            <p
              className={cn(
                "font-ui text-[10.5px] font-bold leading-tight",
                c.active ? "text-neutral-900" : "text-neutral-700",
              )}
            >
              {c.label}
            </p>
            <p className="mt-0.5 font-ui text-[9px] text-neutral-400">
              {c.time}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-2">
        <p
          className="font-ui text-[9px] font-bold uppercase text-neutral-500"
          style={{ letterSpacing: "0.10em" }}
        >
          Atalhos
        </p>
        <div className="mt-1.5 space-y-1">
          {[
            { Icon: Lightbulb, label: "Insights do dia", tone: "amber" as const },
            { Icon: Zap, label: "Ações automáticas", tone: "brand" as const },
            { Icon: TrendingUp, label: "Forecast 7d", tone: "teal" as const },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/60"
            >
              <GradientIcon icon={<a.Icon />} tone={a.tone} size={20} />
              <span className="font-ui text-[10.5px] font-medium text-neutral-700">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ============================================================================
// Chat panel — main conversation
// ============================================================================

function ChatPanel({ step }: { step: number }) {
  return (
    <section className="relative flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto flex max-w-[680px] flex-col gap-4">
          {step === 0 && <EmptyState />}
          {step >= 1 && <UserMsg text="Como estão minhas vendas hoje em relação à meta?" />}
          {step >= 1 && <ISASalesResponse animate={step === 1} />}
          {step >= 2 && (
            <UserMsg text="E o desperdício? Vamos ter pico nesta sexta?" />
          )}
          {step >= 2 && <ISAWasteResponse animate={step === 2} />}
          {step >= 3 && (
            <UserMsg text="Aplica a recomendação automaticamente." />
          )}
          {step >= 3 && <ISAActionResponse animate={step === 3} />}
        </div>
      </div>
      <ChatInput />
    </section>
  );
}

// ============================================================================
// Empty state
// ============================================================================

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4 pt-6 text-center"
    >
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle, rgba(124,58,237,0.35), rgba(2,7,136,0.10) 50%, transparent 70%)",
            "radial-gradient(circle, rgba(2,7,136,0.35), rgba(124,58,237,0.10) 50%, transparent 70%)",
            "radial-gradient(circle, rgba(124,58,237,0.35), rgba(2,7,136,0.10) 50%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #020788, #7c3aed, #16a34a, #020788)",
            opacity: 0.25,
            filter: "blur(8px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-brand"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
          }}
        >
          <Bot size={26} strokeWidth={2} />
        </motion.div>
      </motion.div>
      <div>
        <h1
          className="font-ui text-[22px] font-bold text-neutral-900"
          style={{ letterSpacing: "-0.02em" }}
        >
          Oi João, posso ajudar com o quê?
        </h1>
        <p className="mt-1 font-ui text-[12px] text-neutral-500">
          Sua copiloto entende vendas, custo, escala e estoque. Pergunte em
          português, sem comandos.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { Icon: TrendingUp, label: "Como estão as vendas hoje?", tone: "brand" as const },
          { Icon: Package, label: "Previsão de desperdício", tone: "warning" as const },
          { Icon: Users, label: "Escala da semana", tone: "teal" as const },
          { Icon: Sparkles, label: "Aplicar plano IA", tone: "ai" as const },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            className="flex flex-col items-start gap-2 rounded-xl bg-white p-3 text-left transition-all hover:-translate-y-[1px] hover:shadow-elevated"
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <GradientIcon icon={<p.Icon />} tone={p.tone} size={28} />
            <p
              className="font-ui text-[11px] font-bold leading-tight text-neutral-700"
              style={{ letterSpacing: "-0.005em" }}
            >
              {p.label}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// User + ISA message bubbles
// ============================================================================

function UserMsg({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-end gap-2 self-end"
    >
      <div
        className="max-w-[420px] rounded-2xl rounded-br-sm bg-gradient-to-br from-brand via-brand-light to-brand-light px-3.5 py-2 text-white shadow-subtle"
      >
        <p
          className="font-ui text-[12.5px] leading-snug"
          style={{ letterSpacing: "-0.005em" }}
        >
          {text}
        </p>
      </div>
      <PersonAvatar photo={people.joao} name="João Costa" size={28} />
    </motion.div>
  );
}

function ISABubble({
  children,
  animate,
  thinking,
}: {
  children: React.ReactNode;
  animate?: boolean;
  thinking?: boolean;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animate ? 0.15 : 0 }}
      className="flex items-start gap-2.5"
    >
      <motion.span
        animate={
          thinking
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(124,58,237,0.4)",
                  "0 0 0 8px rgba(124,58,237,0)",
                ],
              }
            : undefined
        }
        transition={
          thinking
            ? { duration: 1.5, repeat: Infinity, ease: "easeOut" }
            : undefined
        }
        className="flex h-7 w-7 flex-none items-center justify-center rounded-xl text-white"
        style={{
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
        }}
      >
        <Bot size={13} strokeWidth={2.25} />
      </motion.span>
      <div className="min-w-0 flex-1 space-y-2">{children}</div>
    </motion.div>
  );
}

// ============================================================================
// ISA responses with inline data cards
// ============================================================================

function ISASalesResponse({ animate }: { animate?: boolean }) {
  const series = [
    { x: "Seg", y: 18.2 },
    { x: "Ter", y: 19.8 },
    { x: "Qua", y: 21.5 },
    { x: "Qui", y: 20.1 },
    { x: "Sex", y: 23.6 },
    { x: "Sáb", y: 26.4 },
    { x: "Hoje", y: 24.5 },
  ];
  return (
    <ISABubble animate={animate}>
      <p
        className="font-ui text-[12.5px] leading-relaxed text-neutral-800"
        style={{ letterSpacing: "-0.005em" }}
      >
        Você fechou{" "}
        <span className="font-bold text-brand">R$ 24,5k</span> hoje — está{" "}
        <span className="font-bold text-success">+12%</span> vs ontem e{" "}
        <span className="font-bold text-success">95%</span> da meta diária.
        Aqui está sua semana:
      </p>

      {/* Inline KPIs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Vendas hoje", v: "R$ 24,5k", d: "+12%", tone: "success" as const },
          { l: "Meta", v: "95%", d: "R$ 1,3k restante", tone: "brand" as const },
          { l: "Ticket médio", v: "R$ 38,90", d: "+4,1%", tone: "success" as const },
        ].map((k) => (
          <div
            key={k.l}
            className="rounded-xl bg-white p-2.5"
            style={{
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <p
              className="font-ui text-[8.5px] font-bold uppercase text-neutral-500"
              style={{ letterSpacing: "0.08em" }}
            >
              {k.l}
            </p>
            <p
              className="mt-0.5 font-ui text-[15px] font-bold tabular-nums leading-none text-neutral-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              {k.v}
            </p>
            <p
              className={cn(
                "mt-0.5 font-ui text-[9px] font-bold tabular-nums",
                k.tone === "success" && "text-success",
                k.tone === "brand" && "text-brand",
              )}
            >
              {k.d}
            </p>
          </div>
        ))}
      </div>

      {/* Inline chart card */}
      <div
        className="rounded-xl bg-white p-3"
        style={{
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <p
          className="font-ui text-[10px] font-bold uppercase text-brand"
          style={{ letterSpacing: "0.10em" }}
        >
          Vendas últimos 7 dias
        </p>
        <div className="mt-1">
          <AreaChart
            data={series}
            color="#7c3aed"
            yMin={15}
            yMax={28}
            aspectRatio="16/4"
            formatY={(v) => `R$ ${v.toFixed(1)}k`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <SuggestionPill label="Comparar com a semana passada" />
        <SuggestionPill label="Quebrar por unidade" />
        <SuggestionPill label="Top 5 pratos hoje" />
      </div>
    </ISABubble>
  );
}

function ISAWasteResponse({ animate }: { animate?: boolean }) {
  return (
    <ISABubble animate={animate} thinking={animate}>
      <p
        className="font-ui text-[12.5px] leading-relaxed text-neutral-800"
        style={{ letterSpacing: "-0.005em" }}
      >
        Cruzei o seu padrão de 7 dias com o calendário e clima. Sim, sexta
        deve ter pico:{" "}
        <span className="font-bold text-warning">+14kg</span> acima da meta,
        principalmente no almoço.
      </p>
      <div
        className="rounded-xl bg-gradient-to-br from-warning/5 via-white to-warning/8 p-3"
        style={{ border: "1px solid rgba(217,119,6,0.20)" }}
      >
        <div className="flex items-center justify-between">
          <p
            className="font-ui text-[10px] font-bold uppercase text-warning"
            style={{ letterSpacing: "0.08em" }}
          >
            Previsão · sexta, 24/05
          </p>
          <Badge variant="warning" className="text-[9px]">
            <Sparkles size={9} strokeWidth={2.5} />
            Modelo XGBoost · 87% acurácia
          </Badge>
        </div>
        <div className="mt-2">
          <HorizontalBars
            bars={[
              { label: "Arroz branco", value: 6.2, color: "#f59e0b", meta: "kg" },
              { label: "Feijão carioca", value: 4.1, color: "#f59e0b", meta: "kg" },
              { label: "Carne moída", value: 2.4, color: "#d97706", meta: "kg" },
              { label: "Salada de folhas", value: 1.3, color: "#d97706", meta: "kg" },
            ]}
            showValue
          />
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-3 py-2">
          <div>
            <p className="font-ui text-[10px] font-medium text-neutral-500">
              Recomendação
            </p>
            <p
              className="mt-0.5 font-ui text-[12px] font-bold leading-tight text-neutral-900"
              style={{ letterSpacing: "-0.005em" }}
            >
              Reduzir produção de arroz em 8% e feijão em 12%
            </p>
          </div>
          <span className="flex items-center gap-1 font-ui text-[10px] font-bold text-success">
            <TrendingDown size={11} strokeWidth={2.5} />
            -R$ 187/dia
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <SuggestionPill label="Aplica a recomendação automaticamente." emphasis />
        <SuggestionPill label="Detalhar por unidade" />
        <SuggestionPill label="Comparar com sextas anteriores" />
      </div>
    </ISABubble>
  );
}

function ISAActionResponse({ animate }: { animate?: boolean }) {
  return (
    <ISABubble animate={animate}>
      <p
        className="font-ui text-[12.5px] leading-relaxed text-neutral-800"
        style={{ letterSpacing: "-0.005em" }}
      >
        Feito. Apliquei o plano em <span className="font-bold text-brand">3 unidades</span>{" "}
        e notifiquei os responsáveis. Resumo:
      </p>
      <div
        className="space-y-1.5 rounded-xl bg-white p-3"
        style={{
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        {[
          {
            who: "Filial Centro",
            action: "Produção de arroz reduzida 8% (40kg → 36,8kg)",
            ok: true,
          },
          {
            who: "Unidade Norte",
            action: "Produção de feijão reduzida 12% (25kg → 22kg)",
            ok: true,
          },
          {
            who: "Unidade Sul",
            action: "Notificação enviada para nutricionista revisar",
            ok: true,
          },
        ].map((a, i) => (
          <motion.div
            key={a.who}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + 0.08 * i, duration: 0.25 }}
            className="flex items-start gap-2 rounded-lg bg-success/5 px-2.5 py-1.5"
          >
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-success text-white">
              <Check size={11} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-ui text-[10.5px] font-bold text-neutral-900">
                {a.who}
              </p>
              <p className="font-ui text-[10px] text-neutral-600">{a.action}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
        }}
      >
        <Sparkles size={14} strokeWidth={2.25} />
        <p
          className="font-ui text-[11px] leading-snug"
          style={{ letterSpacing: "-0.005em" }}
        >
          Acompanhamento ligado. Eu mesma valido o resultado domingo à noite
          e te aviso se algo desviar.
        </p>
      </div>
    </ISABubble>
  );
}

// ============================================================================
// Suggestion pills + Chat input
// ============================================================================

function SuggestionPill({
  label,
  emphasis,
}: {
  label: string;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-ui text-[10.5px] font-medium transition-all hover:-translate-y-[1px]",
        emphasis
          ? "bg-gradient-to-r from-brand via-brand-light to-[#7c3aed] text-white shadow-brand"
          : "bg-brand-ghost text-brand hover:bg-brand-subtle",
      )}
    >
      {emphasis && <Sparkles size={9} strokeWidth={2.5} />}
      {label}
      <ArrowRight size={9} strokeWidth={2.5} />
    </button>
  );
}

function ChatInput() {
  return (
    <div className="border-t border-brand/8 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="mx-auto max-w-[680px]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-2xl bg-white p-2"
            style={{
              border: "1px solid rgba(2,7,136,0.10)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
              aria-label="Anexar"
            >
              <Paperclip size={14} strokeWidth={2.25} />
            </button>
            <div
              className="flex-1 font-ui text-[12.5px] text-neutral-400"
              style={{ letterSpacing: "-0.005em" }}
            >
              Pergunte algo ao ISA…
            </div>
            <span className="flex items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-0.5 font-ui text-[9px] font-bold text-neutral-500">
              ⌘
              <ChevronDown size={9} strokeWidth={2.5} />K
            </span>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
              aria-label="Voz"
            >
              <Mic size={14} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              data-tour="isa-send"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[#7c3aed] text-white shadow-brand"
              aria-label="Enviar"
            >
              <Send size={14} strokeWidth={2.25} />
            </button>
          </motion.div>
        </AnimatePresence>
        <p className="mt-1.5 text-center font-ui text-[9px] text-neutral-400">
          ISA aprende com seus dados e nunca compartilha com terceiros · v4.2
        </p>
      </div>
    </div>
  );
}
