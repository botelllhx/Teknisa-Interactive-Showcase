/**
 * Métodos de pagamento usados nos mockups de Frente de Loja.
 * Centraliza o que estava reimplementado em PDVNovo, SmartPOS, QuickPass,
 * POSCardReader (com variações inconsistentes).
 */

export type PaymentMethod =
  | "cartao"
  | "credito"
  | "debito"
  | "pix"
  | "dinheiro";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cartao: "Cartão",
  credito: "Crédito",
  debito: "Débito",
  pix: "Pix",
  dinheiro: "Dinheiro",
};
