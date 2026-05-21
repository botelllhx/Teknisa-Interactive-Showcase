"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Receipt } from "lucide-react";

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
}: OrderTicketProps) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const empty = items.length === 0;
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      style={{
        background: "#fffef9",
        borderRadius: 14,
        padding: "22px 20px",
        boxShadow:
          "0 6px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
        border: "1px solid #f0ede4",
        fontFamily: '"Courier New", ui-monospace, monospace',
        width: "100%",
        maxWidth: 280,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#020788",
          }}
        >
          TEKNISA PDV
        </div>
        <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 3 }}>
          {store}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#8a8a8a",
            marginTop: 2,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Pedido #{orderNumber} · {time}
        </div>
      </div>

      <TearLine />

      <div style={{ padding: "12px 0", minHeight: 100 }}>
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
                padding: "16px 0",
                color: "#b8b8b8",
              }}
            >
              <Receipt size={28} strokeWidth={1.5} />
              <span style={{ fontSize: 11 }}>Aguardando primeiro item…</span>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {items.map((item, i) => (
                <motion.div
                  key={`${item.name}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    fontSize: 12,
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#333", flex: 1, lineHeight: 1.35 }}>
                    {item.qty}x {item.name}
                  </span>
                  <span
                    style={{
                      color: "#333",
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
          fontSize: 14,
          fontWeight: 700,
          marginTop: 10,
        }}
      >
        <span>TOTAL</span>
        <span
          style={{
            color: "#020788",
            fontSize: 18,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <AnimatePresence>
        {approved && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px dashed #d0cfca",
              fontSize: 12,
              color: "#16a34a",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            <CheckCircle2 size={15} strokeWidth={2.5} />
            PAGAMENTO APROVADO
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TearLine() {
  return (
    <div
      aria-hidden
      style={{
        borderTop: "1px dashed #d0cfca",
        margin: "0",
      }}
    />
  );
}
