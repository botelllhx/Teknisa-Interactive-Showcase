"use client";

import { motion } from "framer-motion";
import { QrCode, Wallet, Coffee, Sun, Utensils, ShieldCheck } from "lucide-react";
import { CompanionShell } from "./CompanionShell";

interface Benefit {
  Icon: typeof Coffee;
  label: string;
  used: number;
  total: number;
}

interface EmployeeCardProps {
  name?: string;
  initials?: string;
  matricula?: string;
  unit?: string;
  role?: string;
  balance?: number;
  benefits?: Benefit[];
  showBalance?: boolean;
}

const DEFAULT_BENEFITS: Benefit[] = [
  { Icon: Utensils, label: "Refeição", used: 10, total: 22 },
  { Icon: Coffee, label: "Café", used: 12, total: 22 },
  { Icon: Sun, label: "Lanche", used: 14, total: 22 },
];

export function EmployeeCard({
  name = "Mariana Costa",
  initials = "MC",
  matricula = "28471",
  unit = "Restaurante Central",
  role = "Departamento de TI",
  balance = 72.9,
  benefits = DEFAULT_BENEFITS,
  showBalance = true,
}: EmployeeCardProps) {
  return (
    <CompanionShell label="Crachá digital" sublabel="QuickPass" live pulse>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          background:
            "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)",
          borderRadius: 22,
          padding: 4,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Hanging lanyard strap */}
        <div className="flex h-3 items-center justify-center gap-1">
          <span
            aria-hidden
            className="h-2 w-8 rounded-full"
            style={{ background: "rgba(0,0,0,0.10)" }}
          />
        </div>

        {/* Card body */}
        <div
          style={{
            background: "linear-gradient(160deg, #020788 0%, #1a1fa8 100%)",
            borderRadius: 18,
            padding: 18,
            color: "white",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative glow */}
          <motion.span
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Header: avatar + name */}
          <div className="relative flex items-center gap-3">
            <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <span className="font-display text-[15px] font-bold text-white">
                {initials}
              </span>
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-brand bg-success"
              >
                <ShieldCheck size={7} strokeWidth={3} className="text-white" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[13px] font-bold leading-tight">
                {name}
              </p>
              <p className="text-[10px] opacity-80">{role}</p>
              <p className="mt-0.5 font-mono text-[9px] opacity-70 tabular-nums">
                Mat. {matricula}
              </p>
            </div>
          </div>

          {/* Balance */}
          {showBalance && (
            <motion.div
              key={balance}
              initial={{ scale: 0.96, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative mt-4 rounded-xl bg-white/10 px-3 py-2 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider opacity-80">
                  <Wallet size={10} strokeWidth={2.25} />
                  Saldo
                </span>
                <span className="text-[9px] opacity-80">Recarga 15/Jun</span>
              </div>
              <p className="mt-0.5 font-display text-[22px] font-bold leading-none tabular-nums">
                R$ {balance.toFixed(2).replace(".", ",")}
              </p>
            </motion.div>
          )}

          {/* Benefits */}
          <div className="relative mt-3 grid grid-cols-3 gap-1.5">
            {benefits.map((b) => {
              const pct = (b.used / b.total) * 100;
              return (
                <div
                  key={b.label}
                  className="rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur"
                >
                  <b.Icon size={11} strokeWidth={2.25} className="opacity-80" />
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider opacity-80">
                    {b.label}
                  </p>
                  <p className="font-display text-[10px] font-bold leading-none tabular-nums">
                    {b.used}/{b.total}
                  </p>
                  <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-white/20">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className="block h-full rounded-full bg-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer: unit + QR */}
          <div className="relative mt-3 flex items-center justify-between border-t border-white/15 pt-3">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider opacity-70">
                Unidade
              </p>
              <p className="font-display text-[10px] font-bold">{unit}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <QrCode size={26} strokeWidth={1.5} className="text-brand" />
            </div>
          </div>
        </div>

        {/* Card slot */}
        <div className="mt-3 mb-1 flex items-center justify-center">
          <span
            aria-hidden
            className="h-1 w-20 rounded-full"
            style={{ background: "rgba(0,0,0,0.10)" }}
          />
        </div>
      </motion.div>
    </CompanionShell>
  );
}
