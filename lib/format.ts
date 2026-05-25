/**
 * Formatadores de moeda BRL para os mockups.
 * Centraliza a regra `R$ X,YY` que estava reimplementada inline em ~65 lugares.
 */

const brlNumber = (value: number) =>
  value.toFixed(2).replace(".", ",");

/** `R$ 12,34` — usado em totals, preços, kpis. */
export const brl = (value: number): string =>
  `R$ ${brlNumber(value)}`;

/** Só o número, sem prefixo `R$ ` (para casos onde o símbolo é renderizado separado). */
export const brlAmount = (value: number): string => brlNumber(value);

/** `+R$ 12,34` / `−R$ 12,34` — para variações, cashback, descontos sinalizados. */
export const brlSigned = (value: number): string =>
  value >= 0
    ? `+R$ ${brlNumber(value)}`
    : `−R$ ${brlNumber(Math.abs(value))}`;

/**
 * Versão safe usada pelos flows: aceita `undefined` e devolve `R$ 0,00`
 * em vez de quebrar. Substitui as 4 cópias inline em `data/flows/*.ts`.
 */
export const fmtMoney = (v?: number): string =>
  typeof v === "number" && Number.isFinite(v) ? brl(v) : "R$ 0,00";

/**
 * Renderiza `[{qty,name}, ...]` como string legível.
 * Tolera tipos errados sem crashar (usado em descrições dinâmicas de tour).
 */
export const fmtItemList = (items?: unknown): string => {
  if (!Array.isArray(items) || items.length === 0) return "—";
  return items
    .filter(
      (it): it is { qty: number; name: string } =>
        !!it &&
        typeof it === "object" &&
        typeof (it as { qty?: unknown }).qty === "number" &&
        typeof (it as { name?: unknown }).name === "string",
    )
    .map((it) => `${it.qty}× ${it.name}`)
    .join(", ");
};
