"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const taglines = [
  "Soluções para food service",
  "Soluções para varejo alimentar",
  "Soluções para refeições coletivas",
  "Soluções para ERP e RH",
];

export function HeroSection() {
  return (
    <header className="flex items-center justify-between px-16 py-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center"
      >
        <Image
          src="/teknisa-logo.svg"
          alt="Teknisa"
          width={240}
          height={46}
          priority
          className="select-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span className="font-display text-heading-lg text-neutral-600">
          Toque para explorar
        </span>
        <RotatingTagline />
      </motion.div>
    </header>
  );
}

function RotatingTagline() {
  return (
    <div className="relative h-9 overflow-hidden">
      <motion.div
        animate={{ y: [0, -36, -72, -108, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {taglines.map((line) => (
          <div
            key={line}
            className="flex h-9 items-center font-display text-heading-lg font-semibold text-brand"
          >
            {line}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
