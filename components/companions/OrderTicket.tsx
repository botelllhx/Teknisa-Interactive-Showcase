"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
  { name: "X-Burguer Artesanal + Fritas", qty: 1, price: 38.9 },
  { name: "Frango Grelhado c/ Legumes", qty: 1, price: 24.9 },
  { name: "Suco de Laranja 400ml", qty: 1, price: 9.9 },
];

export function OrderTicket({
  items = DEFAULT_ITEMS,
  orderNumber = "A1247",
  store = "Restaurante Central",
  approved = false,
}: OrderTicketProps) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{
        background: "#fffef9",
        borderRadius: 12,
        padding: "20px 18px",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
        border: "1px solid #f0ede4",
        fontFamily: '"Courier New", ui-monospace, monospace',
        width: 260,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#020788",
          }}
        >
          TEKNISA PDV
        </div>
        <div style={{ fontSize: 10, color: "#8a8a8a", marginTop: 3 }}>
          {store}
        </div>
        <div style={{ fontSize: 10, color: "#8a8a8a", marginTop: 1 }}>
          Pedido #{orderNumber} · {time}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px dashed #d0cfca",
          borderBottom: "1px dashed #d0cfca",
          padding: "10px 0",
          margin: "10px 0",
        }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              fontSize: 11,
              marginBottom: 6,
              gap: 8,
            }}
          >
            <span style={{ color: "#333", flex: 1 }}>
              {item.qty}x {item.name}
            </span>
            <span style={{ color: "#333", fontWeight: 700 }}>
              R$ {(item.qty * item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          fontWeight: 700,
          marginTop: 10,
        }}
      >
        <span>TOTAL</span>
        <span style={{ color: "#020788" }}>R$ {total.toFixed(2)}</span>
      </div>

      {approved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 14,
            paddingTop: 10,
            borderTop: "1px dashed #d0cfca",
            fontSize: 11,
            color: "#16a34a",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          <CheckCircle2 size={14} strokeWidth={2.5} />
          PAGAMENTO APROVADO
        </motion.div>
      )}
    </motion.div>
  );
}
