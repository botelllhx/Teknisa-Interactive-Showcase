import type { FlowStep } from "../solutions";

export const mercadumFlow: FlowStep[] = [
  {
    id: "cotacao",
    label: "Cotação",
    tooltip: "Lista de insumos para cotar",
    highlightArea: { x: 6, y: 22, width: 88, height: 30 },
  },
  {
    id: "comparativo",
    label: "Comparativo",
    tooltip: "Compare fornecedores",
    highlightArea: { x: 6, y: 52, width: 88, height: 36 },
    companions: ["MiniDashboard"],
  },
  {
    id: "selecao",
    label: "Seleção",
    tooltip: "Escolha automática por critério",
    highlightArea: { x: 40, y: 60, width: 54, height: 22 },
    companions: ["MiniDashboard"],
  },
  {
    id: "pedido",
    label: "Pedido",
    tooltip: "Gere o pedido de compra",
    highlightArea: { x: 6, y: 80, width: 88, height: 12 },
    companions: ["MiniDashboard"],
  },
  {
    id: "enviado",
    label: "Enviado",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

export const appComercialFlow: FlowStep[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    tooltip: "Pedidos do dia e meta",
    highlightArea: { x: 6, y: 22, width: 88, height: 40 },
    companions: ["MiniDashboard"],
  },
  {
    id: "cliente",
    label: "Cliente",
    tooltip: "Selecione um cliente",
    highlightArea: { x: 6, y: 60, width: 88, height: 22 },
    companions: ["MiniDashboard"],
  },
  {
    id: "produtos",
    label: "Produtos",
    tooltip: "Adicione produtos ao pedido",
    highlightArea: { x: 6, y: 30, width: 88, height: 50 },
    companions: ["MiniDashboard"],
  },
  {
    id: "resumo",
    label: "Resumo",
    tooltip: "Confirme o pedido",
    highlightArea: { x: 6, y: 60, width: 88, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "enviado",
    label: "Enviado",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];
