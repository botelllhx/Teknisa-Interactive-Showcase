"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ChevronDown,
  Minus,
  Square,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PDVNovoProps {
  step: number;
}

// Categories with the exact color coding from the Teknisa reference
const CATEGORIES = [
  { id: "pizzas", label: "Pizzas", bg: "#f97316", text: "white", active: true },
  { id: "bebidas", label: "Bebidas", bg: "#e8eaf3", text: "#020788" },
  { id: "sobremesas", label: "Sobremesas", bg: "#f3e8f0", text: "#020788" },
  { id: "hamburguer", label: "Hambúrguer", bg: "#fde8e8", text: "#020788" },
  { id: "porcoes", label: "Porções", bg: "#e8eaf3", text: "#020788" },
  { id: "combos", label: "Combos", bg: "#e6f5e7", text: "#020788" },
];

const PRODUCTS = [
  { id: "marguerita", name: "Marguerita", code: "PR-0084" },
  { id: "frango", name: "Frango com\nRequeijão", code: "PR-0112" },
  { id: "calabresa", name: "Calabresa", code: "PR-0034" },
  { id: "portuguesa", name: "Portuguesa", code: "PR-0058" },
];

// Right-side function keys (compact list of the most relevant ones)
const FUNCTION_KEYS = [
  { label: "VENDA MESA", shortcut: "ALT+M", tone: "blue" },
  { label: "VENDA COMANDA", shortcut: "ALT+C", tone: "blue" },
  { label: "VENDA DELIVERY", shortcut: "ALT+D", tone: "blue" },
  { label: "FUNÇÕES GERAIS", shortcut: "F9", tone: "blue" },
  { label: "DUPLICAR PEDIDO", shortcut: "F2", tone: "rose" },
  { label: "MULTIPLICAR", shortcut: "F3", tone: "rose" },
  { label: "CONSULTAR PREÇO", shortcut: "F5", tone: "blue" },
  { label: "BUSCAR PRODUTO", shortcut: "F6", tone: "blue" },
  { label: "ANULAR PRODUTO", shortcut: "F8", tone: "blue" },
  { label: "OBS. DO PEDIDO", shortcut: "F10", tone: "blue" },
  { label: "CANCELAR CUPOM", shortcut: "F7", tone: "muted" },
  { label: "UNIR PRODUTOS", shortcut: "F11", tone: "blue" },
] as const;

const KEY_STYLES: Record<
  "blue" | "rose" | "muted",
  { bg: string; text: string }
> = {
  blue: { bg: "#dee3f2", text: "#020788" },
  rose: { bg: "#fde8e8", text: "#020788" },
  muted: { bg: "#ececec", text: "#9ca3af" },
};

export function PDVNovoMockup({ step }: PDVNovoProps) {
  const hasCart = step >= 1;
  const hasDiscount = step >= 2;
  const showPaymentSelected = step >= 3;
  const completed = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-[#f5f6f8] text-neutral-800">
      <WindowBar />
      <Toolbar />
      <main className="grid flex-1 grid-cols-[180px_1fr_180px] overflow-hidden">
        <ComandaPanel
          hasCart={hasCart}
          hasDiscount={hasDiscount}
          showPaymentSelected={showPaymentSelected}
        />
        <CenterColumn showPaymentSelected={showPaymentSelected} />
        <FunctionKeysColumn />
      </main>
      <FooterBar />
      <StatusBar />

      <AnimatePresence>
        {completed && <SuccessOverlay />}
      </AnimatePresence>
    </div>
  );
}

function WindowBar() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-neutral-200 bg-white px-3">
      <div className="flex items-center gap-1.5">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-brand">
          <span className="text-[8px] font-bold text-white">P</span>
        </div>
        <span className="text-[9px] font-bold text-neutral-500">RETAIL</span>
        <span className="font-display text-[12px] font-bold text-brand">
          PDV
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] font-semibold text-neutral-700"
        >
          Ajuda
          <ChevronDown size={10} strokeWidth={2.25} />
        </button>
        <div className="ml-1 flex items-center">
          <button className="flex h-6 w-6 items-center justify-center text-neutral-500 hover:bg-neutral-100">
            <Minus size={12} strokeWidth={2} />
          </button>
          <button className="flex h-6 w-6 items-center justify-center text-neutral-500 hover:bg-neutral-100">
            <Square size={10} strokeWidth={2} />
          </button>
          <button className="flex h-6 w-6 items-center justify-center bg-danger text-white">
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex h-9 items-center justify-between border-b border-neutral-200 bg-white px-3">
      <div className="flex items-center gap-1">
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft size={13} strokeWidth={2} />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <ArrowRight size={13} strokeWidth={2} />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <RotateCw size={11} strokeWidth={2} />
        </button>
        <span className="ml-3 font-display text-[11px] font-bold tracking-wider text-neutral-700">
          CAIXA
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1">
        <span className="text-[10px] text-neutral-400">Buscar</span>
        <Search size={11} strokeWidth={2} className="text-neutral-400" />
      </div>
    </div>
  );
}

function ComandaPanel({
  hasCart,
  hasDiscount,
  showPaymentSelected,
}: {
  hasCart: boolean;
  hasDiscount: boolean;
  showPaymentSelected: boolean;
}) {
  const items = hasCart
    ? [
        { name: "Pizza Marguerita", qty: 1, price: 58.0, code: "545262151" },
      ]
    : [];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = hasDiscount ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <aside className="flex flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 bg-[#eef0f7] px-2 py-1.5">
        <p className="font-mono text-[9px] tabular-nums text-neutral-600">
          📅 01/01/2000 - 17:32:00
        </p>
      </div>

      <div data-tour="pdv-cart" className="flex-1 overflow-hidden">
        <AnimatePresence>
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center px-3">
              <p className="text-center text-[9px] italic text-neutral-400">
                Toque em um produto
              </p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 border-b border-neutral-100 px-2 py-2"
              >
                <div className="flex h-7 w-7 flex-none items-center justify-center rounded bg-[#eef0f7]">
                  <span className="text-[7px] font-bold text-brand">PZ</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-display text-[10px] font-bold text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-[8px] text-neutral-500">
                    x0{item.qty} (R$ {item.price.toFixed(2).replace(".", ",")})
                  </p>
                  <p className="font-mono text-[8px] text-neutral-400">
                    {item.code}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <button className="text-neutral-400">
                    <X size={10} strokeWidth={2} />
                  </button>
                  <span className="font-display text-[9px] font-bold text-neutral-900">
                    R$ {(item.qty * item.price).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-[8px] text-neutral-400">17:52</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-2 py-1.5 text-[10px]">
          <span className="text-neutral-600">Número de Pessoas</span>
          <span className="font-display font-bold text-neutral-900">01</span>
        </div>
        <div className="flex items-center justify-between border-b border-neutral-100 px-2 py-1.5 text-[10px]">
          <span className="text-neutral-600">Quantidade</span>
          <span className="font-display font-bold text-neutral-900">
            0{items.length || 1}
          </span>
        </div>
        <motion.div
          data-tour="pdv-discount"
          animate={
            hasDiscount && !showPaymentSelected
              ? { backgroundColor: ["#fff", "#fef3c7", "#fff"] }
              : undefined
          }
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex items-center justify-between px-2 py-2"
        >
          <span className="font-display text-[12px] font-bold text-neutral-800">
            Valor
          </span>
          <span className="font-display text-[18px] font-bold text-success tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </motion.div>
        {hasDiscount && (
          <div className="border-t border-dashed border-neutral-200 px-2 py-1 text-[9px] text-success">
            ↓ Desconto fidelidade R$ {discount.toFixed(2).replace(".", ",")}
          </div>
        )}
      </div>
    </aside>
  );
}

function CenterColumn({
  showPaymentSelected,
}: {
  showPaymentSelected: boolean;
}) {
  return (
    <section className="flex flex-col overflow-hidden bg-white p-2">
      {/* Categories */}
      <div className="grid grid-cols-3 gap-1.5">
        {CATEGORIES.map((c) => (
          <div
            key={c.id}
            className="flex h-12 items-center justify-center rounded-md px-2 text-center font-display text-[11px] font-bold"
            style={{ background: c.bg, color: c.text }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Products grid */}
      <div className="mt-2 grid flex-1 grid-cols-3 content-start gap-1.5">
        {PRODUCTS.map((p, i) => {
          const highlight = i === 0;
          return (
            <motion.button
              key={p.id}
              data-tour={highlight ? "pdv-first-product" : undefined}
              type="button"
              animate={highlight ? { scale: [1, 1.02, 1] } : undefined}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "flex h-20 flex-col items-center justify-center gap-1.5 rounded-md border-2 bg-[#eef0f7] p-2 text-center transition-shadow",
                highlight ? "border-brand shadow-brand" : "border-transparent",
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white">
                <span className="font-display text-[8px] font-bold text-brand">
                  PZ
                </span>
              </div>
              <span className="whitespace-pre-line font-display text-[10px] font-bold leading-tight text-brand">
                {p.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Payment row */}
      <div data-tour="pdv-payment" className="mt-2 grid grid-cols-4 gap-1.5">
        {["Crédito", "Débito", "PIX", "Dinheiro"].map((label, i) => {
          const active = showPaymentSelected && i === 2;
          return (
            <button
              key={label}
              type="button"
              className={cn(
                "flex h-9 items-center justify-center rounded-md font-display text-[10px] font-bold transition-colors",
                active
                  ? "bg-brand text-white shadow-brand"
                  : "border border-brand/20 bg-white text-brand",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FunctionKeysColumn() {
  return (
    <aside className="flex flex-col gap-1 overflow-y-auto border-l border-neutral-200 bg-white p-1.5">
      {FUNCTION_KEYS.map((k) => {
        const style = KEY_STYLES[k.tone];
        return (
          <button
            key={k.label}
            type="button"
            className="flex flex-col items-center justify-center rounded-md py-1.5 text-center font-display"
            style={{ background: style.bg }}
          >
            <span
              className="text-[8.5px] font-bold leading-tight"
              style={{ color: style.text }}
            >
              {k.label}
            </span>
            <span
              className="text-[7px] font-medium opacity-70"
              style={{ color: style.text }}
            >
              {k.shortcut}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

function FooterBar() {
  return (
    <div className="flex items-stretch border-t border-neutral-200 bg-white text-[8px]">
      <div className="flex flex-1 items-center gap-3 px-2 py-1.5">
        <FooterField label="FILIAL" value="002 - Filial Teknisa Services" />
        <FooterField label="LOJA" value="002 - Loja Integrada Retail PDV FOS" />
        <FooterField label="CAIXA" value="002 - Caixa/Balcão 001" />
        <FooterField label="OPERADOR" value="002 - Operador Teknisa Services" />
        <FooterField label="COMANDA" value="000001 / Jorge" />
        <div className="ml-auto flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Ticket Médio dia por Loja</span>
            <span className="font-display font-bold text-neutral-700">
              R$ 6,00
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Cupons Concluídos dia por loja</span>
            <span className="font-display font-bold text-neutral-700">
              R$ 6,00
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="flex w-44 items-center justify-center bg-success px-4 font-display text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-success/90"
      >
        Finalizar Venda
      </button>
    </div>
  );
}

function FooterField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-[8px] font-bold uppercase text-brand">
        {label}
      </span>
      <span className="text-[8px] text-neutral-500">{value}</span>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-6 items-center justify-between border-t border-neutral-200 bg-white px-3 text-[8.5px] text-neutral-500">
      <div className="flex items-center gap-3">
        <span>FOS 2025.0000</span>
        <span>v 01.222.000.0</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Online
        </span>
        <span>Caixa Livre</span>
        <span>Vendedor Padrão I</span>
      </div>
    </div>
  );
}

function SuccessOverlay() {
  return (
    <motion.div
      data-tour="pdv-receipt"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 backdrop-blur"
    >
      <motion.div
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="flex w-72 flex-col items-center rounded-2xl border-2 border-success/30 bg-white p-6 shadow-frame"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-brand">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>
        <p className="mt-3 font-display text-[16px] font-bold text-neutral-900">
          Venda concluída
        </p>
        <p className="text-[10px] text-neutral-500">Comanda 000001 · Jorge</p>

        <div className="mt-3 w-full rounded-xl bg-surface-raised p-3 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            Total
          </p>
          <p className="font-display text-[24px] font-bold text-success tabular-nums">
            R$ 52,20
          </p>
          <p className="mt-1 text-[9px] text-neutral-500">
            PIX · aprovado em 2s
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
