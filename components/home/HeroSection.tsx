"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

// v13.3: Hero refinado para Noteflow-airy. Product Sans (font local) + eyebrow
// labels tight tracked, contadores mais elegantes (52px), tag chips com hover
// soft brand. Bloco esquerdo recebe um orb gradient discreto atrás da logo
// para dar profundidade sem competir com a tipografia.

interface Stat {
  value: number;
  format: (n: number) => string;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: 36, format: (n) => Math.round(n).toString(), label: "anos de mercado", suffix: "+" },
  { value: 6, format: (n) => Math.round(n).toString(), label: "países" },
  { value: 20, format: (n) => Math.round(n).toString(), label: "mil instalações", suffix: "k+" },
];

const TAGS = ["Food Service", "Refeições Coletivas", "ERP & HCM"];

export function HeroSection() {
  return (
    <header className="relative flex items-end justify-between gap-16 px-12 pb-10 pt-10">
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full opacity-60 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(59,66,196,0.20), rgba(2,7,136,0.10) 60%, transparent 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col gap-6"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo-teknisa.svg"
            alt="Teknisa"
            width={280}
            height={53}
            priority
            className="select-none"
          />
        </div>
        <div className="flex flex-col gap-3">
          <span
            className="font-ui text-[10.5px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.22em" }}
          >
            Plataforma 2026
          </span>
          <div className="flex items-stretch gap-4">
            <motion.span
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
              className="w-[3px] rounded-full bg-gradient-to-b from-brand via-brand-light to-brand-lighter"
              aria-hidden
            />
            <p
              className="max-w-[24ch] font-display text-[28px] font-bold leading-[1.1] text-neutral-900"
              style={{ letterSpacing: "-0.025em" }}
            >
              Tecnologia que transforma{" "}
              <span className="text-brand">o food service</span>.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-end gap-6"
      >
        <div className="flex items-end gap-12">
          {STATS.map((stat, i) => (
            <CountUpStat key={stat.label} stat={stat} delay={0.2 + i * 0.12} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-full border border-brand/12 bg-white px-3.5 py-1.5 font-ui text-[13px] font-medium text-brand shadow-subtle"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </header>
  );
}

function CountUpStat({ stat, delay }: { stat: Stat; delay: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => stat.format(latest));

  useEffect(() => {
    const controls = animate(motionValue, stat.value, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [motionValue, stat.value, delay]);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-baseline">
        <motion.span
          className="font-display font-bold leading-none text-brand tabular-nums"
          style={{ fontSize: 56, letterSpacing: "-0.035em" }}
        >
          {rounded}
        </motion.span>
        {stat.suffix && (
          <span
            className="ml-0.5 font-display font-bold leading-none text-brand"
            style={{ fontSize: 36, letterSpacing: "-0.03em" }}
          >
            {stat.suffix}
          </span>
        )}
      </div>
      <span
        className="mt-2 font-ui text-[12px] font-semibold uppercase text-neutral-500"
        style={{ letterSpacing: "0.10em" }}
      >
        {stat.label}
      </span>
    </div>
  );
}
