import type { FlowStep } from "../solutions";

export const rotinaFiscalFlow: FlowStep[] = [
  {
    id: "painel",
    label: "Obrigações",
    tooltip: "Painel de obrigações do mês",
    highlightArea: { x: 6, y: 22, width: 88, height: 28 },
    companions: ["FiscalBadge"],
  },
  {
    id: "reforma",
    label: "Reforma Tributária",
    tooltip: "Nova estrutura IBS/CBS/IS",
    highlightArea: { x: 6, y: 50, width: 88, height: 22 },
    companions: ["FiscalBadge"],
  },
  {
    id: "validacao",
    label: "Validação",
    tooltip: "Validação automática de notas",
    highlightArea: { x: 6, y: 22, width: 88, height: 50 },
    companions: ["FiscalBadge"],
  },
  {
    id: "apuracao",
    label: "Apuração",
    tooltip: "Comparativo regime atual vs. novo",
    highlightArea: { x: 6, y: 22, width: 88, height: 68 },
    companions: ["FiscalBadge", "MiniDashboard"],
  },
  {
    id: "declaracao",
    label: "SPED enviado",
    companions: ["FiscalBadge", "SimulatedNotification"],
  },
];

export const rotinaRastreabilidadeFlow: FlowStep[] = [
  {
    id: "busca",
    label: "Busca",
    tooltip: "Pesquise por lote ou produto",
    highlightArea: { x: 6, y: 18, width: 88, height: 12 },
  },
  {
    id: "timeline",
    label: "Movimentações",
    tooltip: "Linha do tempo do lote",
    highlightArea: { x: 6, y: 30, width: 88, height: 40 },
    companions: ["StockIndicator"],
  },
  {
    id: "origem",
    label: "Origem",
    tooltip: "Fornecedor → estoque → saída",
    highlightArea: { x: 6, y: 70, width: 88, height: 22 },
    companions: ["StockIndicator"],
  },
  {
    id: "recall",
    label: "Alerta de recall",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "relatorio",
    label: "Relatório",
    companions: ["StockIndicator"],
  },
];

export const appRotinasEstoqueFlow: FlowStep[] = [
  {
    id: "tarefas",
    label: "Tarefas",
    tooltip: "Lista de tarefas do dia",
    highlightArea: { x: 6, y: 18, width: 88, height: 60 },
    companions: ["StockIndicator"],
  },
  {
    id: "contagem",
    label: "Contagem",
    tooltip: "Informe a quantidade contada",
    highlightArea: { x: 14, y: 38, width: 72, height: 18 },
    companions: ["StockIndicator"],
  },
  {
    id: "divergencia",
    label: "Divergência",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "justificativa",
    label: "Justificativa",
    tooltip: "Registre a justificativa",
    highlightArea: { x: 6, y: 56, width: 88, height: 26 },
    companions: ["StockIndicator"],
  },
  {
    id: "sincronizado",
    label: "Sincronizado",
    companions: ["StockIndicator"],
  },
];
