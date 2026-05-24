"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTourLive } from "@/lib/tourState";
import { people } from "@/lib/photos";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
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
  Pizza,
  Coffee,
  IceCream,
  Sandwich,
  Utensils,
  Cookie,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PDVNovoProps {
  step: number;
}

const CATEGORIES = [
  { id: "pizzas", label: "Pizzas", Icon: Pizza, bg: "#f97316", text: "white" },
  {
    id: "bebidas",
    label: "Bebidas",
    Icon: Coffee,
    bg: "#e8eaf3",
    text: "#020788",
  },
  {
    id: "sobremesas",
    label: "Sobremesas",
    Icon: IceCream,
    bg: "#f3e8f0",
    text: "#020788",
  },
  {
    id: "hamburguer",
    label: "Hambúrguer",
    Icon: Sandwich,
    bg: "#fde8e8",
    text: "#020788",
  },
  {
    id: "porcoes",
    label: "Porções",
    Icon: Utensils,
    bg: "#e8eaf3",
    text: "#020788",
  },
  {
    id: "combos",
    label: "Combos",
    Icon: Cookie,
    bg: "#e6f5e7",
    text: "#020788",
  },
];

const PRODUCTS = [
  { id: "marguerita", name: "Marguerita", price: 58.0, code: "545262151" },
  { id: "frango", name: "Frango com Requeijão", price: 62.0, code: "545262152" },
  { id: "calabresa", name: "Calabresa", price: 55.0, code: "545262153" },
  { id: "portuguesa", name: "Portuguesa", price: 65.0, code: "545262154" },
];

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
  { label: "VENDA CONS.", shortcut: "ALT+P", tone: "muted" },
  { label: "CARGA CARTÃO", shortcut: "ALT+E", tone: "muted" },
  { label: "INCLUIR CPF/CNPJ", shortcut: "ALT+F", tone: "muted" },
  { label: "CADASTRA CONS.", shortcut: "ALT+O", tone: "muted" },
] as const;

const KEY_STYLES: Record<
  "blue" | "rose" | "muted",
  { bg: string; text: string }
> = {
  blue: { bg: "#dee3f2", text: "#020788" },
  rose: { bg: "#fde8e8", text: "#020788" },
  muted: { bg: "#ececec", text: "#9ca3af" },
};

interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  code: string;
}

const PAYMENT_LABEL: Record<string, string> = {
  credito: "Crédito",
  debito: "Débito",
  pix: "Pix",
  dinheiro: "Dinheiro",
};

export function PDVNovoMockup({ step }: PDVNovoProps) {
  // Free interactivity: cart state lives here, the tour just NUDGES the user
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("pizzas");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Tour-driven hints
  useEffect(() => {
    // Auto-seed the cart when the tour advances past the first product
    if (step >= 1 && cart.length === 0) {
      addProduct(PRODUCTS[0]);
    }
    if (step >= 2 && !discountApplied) {
      setDiscountApplied(true);
    }
    if (step >= 3 && !selectedPayment) {
      setSelectedPayment("pix");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const addProduct = (product: (typeof PRODUCTS)[number]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, qty: 1, price: product.price, code: product.code },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  // Push live selections to tour state so tooltips reflect real choices
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const lastItem = cart[cart.length - 1];
    patchLive({
      selectedItemName: lastItem?.name ?? PRODUCTS[0].name,
      selectedItemPrice: lastItem?.price ?? PRODUCTS[0].price,
      cartItems: cart,
      cartCount: totalQty,
      cartSubtotal: subtotal,
      discountValue: discount,
      couponApplied: discountApplied,
      cartTotal: total,
      paymentMethod: selectedPayment as
        | "cartao"
        | "pix"
        | "dinheiro"
        | "credito"
        | "debito"
        | undefined,
      paymentLabel: selectedPayment ? PAYMENT_LABEL[selectedPayment] : undefined,
      activeCategoryLabel:
        CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Pizzas",
    });
  }, [
    cart,
    totalQty,
    subtotal,
    discount,
    discountApplied,
    total,
    selectedPayment,
    activeCategory,
    patchLive,
  ]);

  const completed = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-[#f5f6f8] text-neutral-800 text-[12px]">
      <WindowBar />
      <Toolbar />

      <main className="grid flex-1 grid-cols-[260px_1fr_320px] overflow-hidden">
        <ComandaPanel
          cart={cart}
          totalQty={totalQty}
          total={total}
          discount={discount}
          discountApplied={discountApplied}
          onUpdateQty={updateQty}
          onRemoveItem={removeItem}
        />
        <CenterColumn
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onAddProduct={addProduct}
        />
        <FunctionKeysColumn />
      </main>

      <FooterBar
        total={total}
        selectedPayment={selectedPayment}
        onSelectPayment={setSelectedPayment}
      />
      <StatusBar />

      <AnimatePresence>
        {completed && (
          <SuccessOverlay
            total={total}
            paymentLabel={
              selectedPayment ? PAYMENT_LABEL[selectedPayment] : "PIX"
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WindowBar() {
  return (
    <div className="flex h-7 items-center justify-between border-b border-neutral-200 bg-gradient-to-b from-[#fafbfc] to-white px-3">
      <div className="flex items-center gap-2">
        <div
          className="flex h-4 w-4 items-center justify-center rounded text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(2,7,136,0.20)",
          }}
        >
          <span className="text-[8px] font-bold tabular-nums">T</span>
        </div>
        <span
          className="text-[9px] font-bold uppercase text-neutral-500"
          style={{ letterSpacing: "0.14em" }}
        >
          Retail
        </span>
        <span
          className="font-display text-[11px] font-bold text-brand"
          style={{ letterSpacing: "-0.01em" }}
        >
          PDV
        </span>
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5">
          <span className="h-1 w-1 rounded-full bg-success" />
          <span
            className="text-[8px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.10em" }}
          >
            v 01.222
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] font-semibold text-neutral-700 hover:text-brand"
        >
          Ajuda
          <ChevronDown size={10} strokeWidth={2.25} />
        </button>
        <div className="ml-1 flex items-center">
          <button className="flex h-6 w-7 items-center justify-center text-neutral-500 hover:bg-neutral-100">
            <Minus size={11} strokeWidth={2} />
          </button>
          <button className="flex h-6 w-7 items-center justify-center text-neutral-500 hover:bg-neutral-100">
            <Square size={9} strokeWidth={2} />
          </button>
          <button className="flex h-6 w-7 items-center justify-center bg-danger text-white">
            <X size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-neutral-200 bg-white px-3">
      <div className="flex items-center gap-1">
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft size={12} strokeWidth={2} />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <ArrowRight size={12} strokeWidth={2} />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100">
          <RotateCw size={10} strokeWidth={2} />
        </button>
        <span
          className="ml-3 font-display text-[10px] font-bold uppercase text-neutral-700"
          style={{ letterSpacing: "0.14em" }}
        >
          Caixa
        </span>
        <span
          className="ml-1.5 rounded-full bg-brand-ghost px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-brand"
          style={{ letterSpacing: "-0.005em" }}
        >
          #001
        </span>
      </div>
      <div
        className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1"
        style={{ boxShadow: "inset 0 1px 1px rgba(0,0,0,0.03)" }}
      >
        <Search size={11} strokeWidth={2.25} className="text-neutral-400" />
        <span className="text-[10px] text-neutral-400">Buscar produto…</span>
      </div>
    </div>
  );
}

function ComandaPanel({
  cart,
  totalQty,
  total,
  discount,
  discountApplied,
  onUpdateQty,
  onRemoveItem,
}: {
  cart: CartItem[];
  totalQty: number;
  total: number;
  discount: number;
  discountApplied: boolean;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}) {
  return (
    <aside className="flex flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 bg-[#eef0f7] px-2.5 py-1">
        <p className="font-mono text-[10px] tabular-nums text-neutral-600">
          01/01/2025 · 17:32:00
        </p>
      </div>

      <div
        data-tour="pdv-cart"
        className="flex-1 overflow-y-auto"
      >
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="flex h-full items-center justify-center px-3">
              <p className="text-center text-[10px] italic text-neutral-400">
                Toque em um produto<br />no centro
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.code}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="border-b border-neutral-100 px-2 py-2"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 flex-none items-center justify-center rounded bg-[#eef0f7]">
                    <Pizza size={14} strokeWidth={1.75} className="text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-display text-[11px] font-bold text-neutral-900">
                      {item.name}
                    </p>
                    <p className="text-[9px] text-neutral-500">
                      x0{item.qty} (R$ {item.price.toFixed(2).replace(".", ",")})
                    </p>
                    <p className="font-mono text-[8px] text-neutral-400">
                      {item.code}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-neutral-300 hover:text-danger"
                      title="Remover item"
                    >
                      <X size={11} strokeWidth={2} />
                    </button>
                    <span className="font-display text-[10px] font-bold text-neutral-900">
                      R$ {(item.qty * item.price).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[8px] text-neutral-400">17:52</span>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="flex h-5 w-5 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                  >
                    <Minus size={9} strokeWidth={2.5} />
                  </button>
                  <span className="w-5 text-center font-display text-[10px] font-bold text-neutral-700">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-brand text-white"
                  >
                    <ArrowUp size={9} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-2.5 py-1.5 text-[11px]">
          <span className="text-neutral-600">Número de Pessoas</span>
          <span className="font-display font-bold text-neutral-900">01</span>
        </div>
        <div className="flex items-center justify-between border-b border-neutral-100 px-2.5 py-1.5 text-[11px]">
          <span className="text-neutral-600">Quantidade</span>
          <span className="font-display font-bold text-neutral-900 tabular-nums">
            {String(totalQty).padStart(2, "0")}
          </span>
        </div>
        <motion.div
          data-tour="pdv-discount"
          animate={
            discountApplied
              ? { backgroundColor: ["#fff", "#fef3c7", "#fff"] }
              : undefined
          }
          transition={{ duration: 1.2, repeat: discountApplied ? 2 : 0 }}
          className="flex items-center justify-between px-2.5 py-2"
        >
          <span className="font-display text-[14px] font-bold text-neutral-800">
            Valor
          </span>
          <span className="font-display text-[20px] font-bold text-success tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </motion.div>
        {discountApplied && discount > 0 && (
          <div className="border-t border-dashed border-neutral-200 px-2.5 py-1 text-[10px] text-success">
            ↓ Desconto fidelidade R$ {discount.toFixed(2).replace(".", ",")}
          </div>
        )}
        <div className="flex border-t border-neutral-200">
          <button className="flex flex-1 items-center justify-center border-r border-neutral-200 py-1.5 text-neutral-400 hover:bg-neutral-50">
            <ArrowDown size={14} strokeWidth={2} />
          </button>
          <button className="flex flex-1 items-center justify-center py-1.5 text-neutral-400 hover:bg-neutral-50">
            <ArrowUp size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function CenterColumn({
  activeCategory,
  onCategoryChange,
  onAddProduct,
}: {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onAddProduct: (p: (typeof PRODUCTS)[number]) => void;
}) {
  return (
    <section className="flex flex-col overflow-hidden bg-white p-3">
      {/* Categories */}
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((c) => {
          const isActive = c.id === activeCategory;
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCategoryChange(c.id)}
              className={cn(
                "relative flex h-14 items-center justify-center gap-2 rounded-lg px-3 font-display text-[13px] font-bold transition-all",
              )}
              style={{
                background: isActive
                  ? c.bg === "#f97316"
                    ? "linear-gradient(135deg, #fb923c 0%, #f97316 60%, #ea580c 100%)"
                    : c.bg
                  : "#f3f4f8",
                color: isActive
                  ? c.bg === "#f97316"
                    ? "white"
                    : c.text
                  : "#6b7280",
                boxShadow: isActive
                  ? c.bg === "#f97316"
                    ? "0 4px 12px rgba(249,115,22,0.30), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "0 4px 12px rgba(2,7,136,0.08), inset 0 0 0 1px rgba(2,7,136,0.10)"
                  : "0 1px 1px rgba(0,0,0,0.02)",
                letterSpacing: "-0.005em",
              }}
            >
              <c.Icon size={18} strokeWidth={1.75} />
              {c.label}
            </motion.button>
          );
        })}
      </div>

      {/* Products */}
      <div className="mt-3 grid flex-1 grid-cols-4 content-start gap-2">
        {PRODUCTS.map((p, i) => {
          const highlight = i === 0;
          return (
            <motion.button
              key={p.id}
              data-tour={highlight ? "pdv-first-product" : undefined}
              type="button"
              onClick={() => onAddProduct(p)}
              animate={highlight ? { scale: [1, 1.02, 1] } : undefined}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "group relative flex h-24 flex-col items-center justify-center gap-2 rounded-lg bg-white p-2 text-center transition-all",
              )}
              style={{
                border: highlight
                  ? "2px solid #020788"
                  : "1px solid rgba(0,0,0,0.06)",
                boxShadow: highlight
                  ? "0 4px 16px rgba(2,7,136,0.18), 0 0 0 3px rgba(2,7,136,0.10)"
                  : "0 1px 2px rgba(0,0,0,0.03)",
                background: highlight
                  ? "linear-gradient(180deg, #ffffff 0%, #f6f7fc 100%)"
                  : "#ffffff",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: highlight
                    ? "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(2,7,136,0.10) 100%)"
                    : "#eef0f7",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 1px rgba(2,7,136,0.04)",
                }}
              >
                <Pizza size={20} strokeWidth={1.75} className="text-brand" />
              </div>
              <div>
                <span
                  className="block font-display text-[11px] font-bold leading-tight text-brand"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {p.name}
                </span>
                <span
                  className="font-display text-[10.5px] font-bold text-neutral-500 tabular-nums"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function FunctionKeysColumn() {
  return (
    <aside className="grid grid-cols-2 gap-1 overflow-y-auto border-l border-neutral-200 bg-white p-1.5 content-start">
      {FUNCTION_KEYS.map((k) => {
        const style = KEY_STYLES[k.tone];
        const isMuted = k.tone === "muted";
        return (
          <motion.button
            key={k.label}
            type="button"
            whileTap={isMuted ? undefined : { scale: 0.96 }}
            className="flex flex-col items-center justify-center rounded-lg px-1 py-2 text-center font-display min-h-[44px] transition-all"
            style={{
              background: style.bg,
              boxShadow: isMuted
                ? "inset 0 1px 0 rgba(255,255,255,0.4)"
                : "inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 1px rgba(0,0,0,0.03)",
            }}
          >
            <span
              className="text-[9px] font-bold leading-tight"
              style={{
                color: style.text,
                letterSpacing: "0.01em",
              }}
            >
              {k.label}
            </span>
            <span
              className="mt-0.5 text-[8px] font-medium tabular-nums opacity-70"
              style={{
                color: style.text,
                letterSpacing: "0.06em",
              }}
            >
              {k.shortcut}
            </span>
          </motion.button>
        );
      })}
    </aside>
  );
}

function FooterBar({
  total,
  selectedPayment,
  onSelectPayment,
}: {
  total: number;
  selectedPayment: string | null;
  onSelectPayment: (id: string) => void;
}) {
  const payments = [
    { id: "credito", label: "Crédito" },
    { id: "debito", label: "Débito" },
    { id: "pix", label: "PIX" },
    { id: "dinheiro", label: "Dinheiro" },
  ];

  return (
    <div className="flex items-stretch border-t border-neutral-200 bg-white">
      <div className="flex flex-1 items-center gap-4 px-3 py-1.5 text-[9px]">
        <div className="flex items-center gap-2">
          <PersonAvatar photo={people.carlos} name="Carlos Mello" size={28} />
          <div className="flex flex-col leading-tight">
            <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">
              Operador
            </span>
            <span className="font-ui text-[10px] font-bold text-neutral-800">
              Carlos Mello
            </span>
          </div>
        </div>
        <span className="h-7 w-px bg-neutral-200" />
        <FooterField label="FILIAL" value="002 - Filial Teknisa Services" />
        <FooterField label="LOJA" value="002 - Loja Integrada Retail PDV" />
        <FooterField label="CAIXA" value="002 - Caixa/Balcão 001" />
        <FooterField label="COMANDA" value="000001 / Jorge" />
        <div className="ml-auto flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Ticket Médio dia por Loja</span>
            <span className="font-display font-bold text-neutral-700 tabular-nums">
              R$ 38,90
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Cupons Concluídos</span>
            <span className="font-display font-bold text-neutral-700 tabular-nums">
              47
            </span>
          </div>
        </div>
      </div>

      {/* Payment selector */}
      <div data-tour="pdv-payment" className="flex border-l border-neutral-200">
        {payments.map((p) => {
          const active = selectedPayment === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectPayment(p.id)}
              className={cn(
                "relative flex h-full items-center justify-center px-3 font-display text-[10.5px] font-bold border-r border-neutral-200 transition-all",
                active ? "text-white" : "text-brand hover:bg-brand-ghost",
              )}
              style={{
                background: active
                  ? "linear-gradient(180deg, #1a1fa8 0%, #020788 100%)"
                  : "white",
                boxShadow: active
                  ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(2,7,136,0.10)"
                  : undefined,
                letterSpacing: "-0.005em",
              }}
            >
              {p.label}
              {active && (
                <motion.span
                  layoutId="pdv-payment-active"
                  className="absolute inset-x-2 bottom-1 h-[2px] rounded-full bg-white/70"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Finalizar Venda CTA */}
      <motion.button
        type="button"
        disabled={total === 0}
        whileTap={total > 0 ? { scale: 0.98 } : undefined}
        className={cn(
          "flex w-48 items-center justify-center px-4 font-display text-[13px] font-bold uppercase text-white transition-all",
          total === 0 && "cursor-not-allowed",
        )}
        style={{
          background:
            total > 0
              ? "linear-gradient(180deg, #16a34a 0%, #15803d 100%)"
              : "#d1d5db",
          boxShadow:
            total > 0
              ? "inset 0 1px 0 rgba(255,255,255,0.20), 0 -2px 0 rgba(0,0,0,0.06) inset"
              : undefined,
          letterSpacing: "0.06em",
        }}
      >
        Finalizar Venda
      </motion.button>
    </div>
  );
}

function FooterField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-display text-[9px] font-bold uppercase tracking-wider text-brand">
        {label}
      </span>
      <span className="text-[9px] text-neutral-500">{value}</span>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex h-5 items-center justify-between border-t border-neutral-200 bg-white px-3 text-[9px] text-neutral-500">
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

function SuccessOverlay({
  total,
  paymentLabel,
}: {
  total: number;
  paymentLabel: string;
}) {
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
        className="flex w-80 flex-col items-center rounded-2xl border-2 border-success/30 bg-white p-6 shadow-frame"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-brand">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>
        <p className="mt-3 font-display text-[18px] font-bold text-neutral-900">
          Venda concluída
        </p>
        <p className="text-[11px] text-neutral-500">Comanda 000001 · Jorge</p>

        <div className="mt-3 w-full rounded-xl bg-surface-raised p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Total pago
          </p>
          <p className="font-display text-[28px] font-bold text-success tabular-nums">
            R$ {total.toFixed(2).replace(".", ",")}
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            {paymentLabel} · aprovado em 2s
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
