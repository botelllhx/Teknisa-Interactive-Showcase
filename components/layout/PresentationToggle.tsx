"use client";

import { useEffect, useState } from "react";
import { Monitor, MonitorOff } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "teknisa-presentation-mode";

export function PresentationToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) === "true";
    setEnabled(stored);
    document.body.classList.toggle("presentation-mode", stored);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    document.body.classList.toggle("presentation-mode", next);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      title={
        enabled
          ? "Modo apresentação ativo (sem cursor) — clique para sair"
          : "Modo desenvolvimento (com cursor) — clique para ativar apresentação"
      }
      aria-label="Alternar modo apresentação"
      className={cn(
        "fixed bottom-4 right-4 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white/95 shadow-card backdrop-blur transition-colors hover:bg-brand-ghost",
        enabled && "border-brand/30 bg-brand text-white hover:bg-brand-light",
      )}
    >
      {enabled ? (
        <MonitorOff size={16} strokeWidth={2} />
      ) : (
        <Monitor size={16} strokeWidth={2} className="text-neutral-600" />
      )}
    </button>
  );
}
