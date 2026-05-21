"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface Stat {
  value: number;
  format: (n: number) => string;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: 34, format: (n) => Math.round(n).toString(), label: "anos de mercado", suffix: "+" },
  { value: 6, format: (n) => Math.round(n).toString(), label: "países" },
  { value: 20, format: (n) => Math.round(n).toString(), label: "mil instalações", suffix: "k+" },
];

const TAGS = ["Food Service", "Refeições Coletivas", "ERP & HCM"];

export function HeroSection() {
  return (
    <header className="flex items-start justify-between gap-12 px-12 pb-8 pt-10">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5"
      >
        <Image
          src="/logo-teknisa.svg"
          alt="Teknisa"
          width={300}
          height={57}
          priority
          className="select-none"
        />
        <div className="flex items-stretch gap-5">
          <span className="w-1 rounded-full bg-brand" aria-hidden />
          <p className="max-w-[26ch] font-display text-[26px] font-semibold leading-tight text-neutral-900">
            Tecnologia que transforma o food service.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-end gap-5"
      >
        <div className="flex items-end gap-10">
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
              className="rounded-full bg-brand/5 px-3.5 py-1.5 font-ui text-body-md font-medium text-brand"
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
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => stat.format(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, stat.value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, motionValue, stat.value, delay]);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-baseline">
        <motion.span
          ref={ref}
          className="font-display text-[64px] font-bold leading-none text-brand tabular-nums"
        >
          {rounded}
        </motion.span>
        {stat.suffix && (
          <span className="ml-0.5 font-display text-[40px] font-bold leading-none text-brand">
            {stat.suffix}
          </span>
        )}
      </div>
      <span className="mt-2 font-ui text-body-md font-medium text-neutral-500">
        {stat.label}
      </span>
    </div>
  );
}
