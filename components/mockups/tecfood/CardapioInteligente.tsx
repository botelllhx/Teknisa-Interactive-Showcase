"use client";

import { motion } from "framer-motion";
import {
  ChefHat,
  Plus,
  Leaf,
  Flame,
  Wheat,
  CheckCircle2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CardapioInteligenteProps {
  step: number;
}

const WEEK = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const DEFAULT_DISHES: Record<string, string[]> = {
  Seg: ["Frango grelhado", "Arroz 7 grãos", "Brócolis"],
  Ter: ["Filé suíno", "Purê de mandioquinha", "Vagem"],
  Qua: ["Tilápia", "Arroz integral", "Salada caesar"],
  Qui: ["Strogonoff de carne", "Batata palha", "Quiabo"],
  Sex: ["Feijoada light", "Couve", "Farofa"],
};

export function CardapioInteligenteMockup({ step }: CardapioInteligenteProps) {
  const showAdded = step >= 1;
  const showNutrition = step >= 2;
  const approved = step >= 3;
  const published = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <ChefHat size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Cardápio Inteligente
            </p>
            <p className="text-[8px] text-neutral-500">Semana 21 · Maio 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[8px] font-semibold text-brand">
            TecFood
          </span>
          {published ? (
            <span data-tour="ci-publish" className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
              <CheckCircle2 size={9} strokeWidth={2.5} />
              Publicado
            </span>
          ) : (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[8px] font-semibold text-warning">
              Rascunho
            </span>
          )}
        </div>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_30%] gap-3 p-3">
        <section className="flex flex-col">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
            Planejamento semanal
          </p>
          <div data-tour="ci-week-grid" className="mt-2 grid flex-1 grid-cols-5 gap-1.5">
            {WEEK.map((day, i) => {
              const dishes = [...DEFAULT_DISHES[day]];
              const highlight = step === 1 && day === "Qua";
              if (showAdded && day === "Qua") {
                dishes.push("Sobremesa do dia");
              }
              return (
                <motion.div
                  key={day}
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className={cn(
                    "flex flex-col rounded-md border bg-white p-1.5",
                    highlight
                      ? "border-brand bg-brand-ghost"
                      : "border-brand/10",
                  )}
                >
                  <p className="text-center font-display text-[9px] font-bold text-brand">
                    {day}
                  </p>
                  <ul className="mt-1 flex-1 space-y-0.5">
                    {dishes.map((dish, j) => (
                      <li
                        key={`${day}-${j}`}
                        className={cn(
                          "rounded bg-surface-raised px-1 py-0.5 text-[7px] text-neutral-700",
                          dish === "Sobremesa do dia" &&
                            "bg-brand text-white",
                        )}
                      >
                        {dish}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    data-tour={day === "Qua" ? "ci-add-dish" : undefined}
                    className={cn(
                      "mt-1 flex items-center justify-center gap-0.5 rounded py-0.5 text-[7px] font-semibold",
                      highlight
                        ? "bg-brand text-white shadow-brand"
                        : "border border-dashed border-brand/30 text-brand",
                    )}
                  >
                    <Plus size={7} strokeWidth={3} />
                    Adicionar
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-2">
          {showNutrition ? (
            <motion.div
              data-tour="ci-nutrition"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="font-display text-[8px] font-bold uppercase text-brand">
                Análise nutricional
              </p>
              <div className="mt-2 space-y-1.5">
                {[
                  { Icon: Flame, label: "Calorias", value: "612 kcal", pct: 72 },
                  { Icon: Wheat, label: "Carbo", value: "78 g", pct: 65 },
                  { Icon: Leaf, label: "Fibras", value: "11 g", pct: 88 },
                ].map(({ Icon, label, value, pct }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <Icon size={9} strokeWidth={2} className="text-brand" />
                        {label}
                      </span>
                      <span className="font-bold text-neutral-900">{value}</span>
                    </div>
                    <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-neutral-100">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="block h-full rounded-full bg-brand"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded bg-success/10 px-2 py-1 text-[8px] font-semibold text-success">
                Dentro das metas da semana
              </div>
            </motion.div>
          ) : (
            <div className="rounded-md border border-dashed border-brand/20 bg-white/50 p-2 text-center">
              <p className="text-[8px] text-neutral-500">
                Selecione um dia para ver análise nutricional
              </p>
            </div>
          )}

          <div data-tour="ci-approve" className="mt-auto rounded-md bg-white p-2 shadow-card">
            <p className="font-display text-[8px] font-bold uppercase text-brand">
              Aprovação
            </p>
            <p className="mt-1 text-[8px] text-neutral-500">
              Maria Eduarda · Nutricionista
            </p>
            <button
              type="button"
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-1 rounded py-1.5 text-[9px] font-bold",
                approved
                  ? "bg-success text-white shadow-brand"
                  : "bg-brand text-white shadow-brand",
              )}
            >
              {approved ? (
                <>
                  <CheckCircle2 size={11} strokeWidth={2.5} />
                  Aprovado
                </>
              ) : (
                <>
                  <Send size={11} strokeWidth={2} />
                  Enviar para aprovação
                </>
              )}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
