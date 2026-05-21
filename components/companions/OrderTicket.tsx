"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Printer, Receipt } from "lucide-react";
import Image from "next/image";
import { CompanionShell } from "./CompanionShell";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderTicketProps {
  items?: OrderItem[];
  orderNumber?: string;
  store?: string;
  approved?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: OrderItem[] = [
  { name: "X-Burguer Artesanal", qty: 1, price: 38.9 },
  { name: "Batata Frita Grande", qty: 1, price: 12.9 },
  { name: "Suco de Laranja 400ml", qty: 1, price: 9.9 },
];

export function OrderTicket({
  items = DEFAULT_ITEMS,
  orderNumber = "A1247",
  store = "Sapore — Berrini",
  approved = false,
  className,
}: OrderTicketProps) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const empty = items.length === 0;
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <CompanionShell
      label="Cupom do cliente"
      sublabel="Impressora térmica"
      live
      pulse={!empty}
      className={className}
    >
      {/* Printer hint above paper */}
      <div className="flex items-center justify-center gap-2 pb-1 text-neutral-400">
        <Printer size={12} strokeWidth={2.25} />
        <motion.div
          animate={{
            opacity: items.length > 0 ? [0.4, 1, 0.4] : 0.4,
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-[3px] w-16 rounded-full bg-neutral-300"
        />
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        style={{
          background:
            "linear-gradient(180deg, #fffef9 0%, #fdfcf4 100%)",
          padding: "22px 22px 24px",
          boxShadow:
            "0 0 0 1px #f0ede4, 0 16px 44px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)",
          fontFamily: '"Courier New", ui-monospace, monospace',
          position: "relative",
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Image
            src="/logo-teknisa.svg"
            alt="Teknisa"
            width={88}
            height={17}
            className="mx-auto select-none"
          />
          <div
            style={{
              fontSize: 10,
              color: "#8a8a8a",
              marginTop: 6,
              letterSpacing: 1,
            }}
          >
            {store}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#8a8a8a",
              marginTop: 2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Pedido #{orderNumber} · {time}
          </div>
        </div>

        <TearLine />

        <div style={{ padding: "12px 0", minHeight: 110 }}>
          <AnimatePresence mode="popLayout">
            {empty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "20px 0",
                  color: "#c8c4b4",
                }}
              >
                <Receipt size={28} strokeWidth={1.5} />
                <span style={{ fontSize: 11, fontStyle: "italic" }}>
                  Aguardando primeiro item…
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.name}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      fontSize: 12,
                      gap: 10,
                    }}
                  >
                    <span style={{ color: "#333", flex: 1, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700 }}>{item.qty}x</span>{" "}
                      {item.name}
                    </span>
                    <span
                      style={{
                        color: "#020788",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      R$ {(item.qty * item.price).toFixed(2).replace(".", ",")}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TearLine />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#333",
              letterSpacing: 1,
            }}
          >
            TOTAL
          </span>
          <motion.span
            key={total}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "#020788",
              fontSize: 22,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            R$ {total.toFixed(2).replace(".", ",")}
          </motion.span>
        </div>

        <AnimatePresence>
          {approved && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px dashed #d0cfca",
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 700,
                letterSpacing: 1.5,
              }}
            >
              <CheckCircle2 size={16} strokeWidth={2.5} />
              PAGAMENTO APROVADO
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom QR-like marker */}
        <div
          aria-hidden
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "center",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: "monospace",
              letterSpacing: "2px",
              color: "#a8a8a8",
            }}
          >
            ║▌║▌█║▌║█║▌║█║▌
          </div>
        </div>
      </motion.div>

      {/* Bottom paper tear */}
      <PaperTear />
    </CompanionShell>
  );
}

function TearLine() {
  return (
    <div
      aria-hidden
      style={{
        borderTop: "1px dashed #d0cfca",
      }}
    />
  );
}

function PaperTear() {
  // Zigzag bottom edge to simulate torn thermal paper
  return (
    <div
      aria-hidden
      style={{
        height: 12,
        background: "linear-gradient(180deg, #fdfcf4 0%, transparent 100%)",
        marginTop: -1,
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="12"
        viewBox="0 0 320 12"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <path
          d="M0,0 L0,4 L8,10 L16,4 L24,10 L32,4 L40,10 L48,4 L56,10 L64,4 L72,10 L80,4 L88,10 L96,4 L104,10 L112,4 L120,10 L128,4 L136,10 L144,4 L152,10 L160,4 L168,10 L176,4 L184,10 L192,4 L200,10 L208,4 L216,10 L224,4 L232,10 L240,4 L248,10 L256,4 L264,10 L272,4 L280,10 L288,4 L296,10 L304,4 L312,10 L320,4 L320,0 Z"
          fill="#fdfcf4"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
        />
      </svg>
    </div>
  );
}
