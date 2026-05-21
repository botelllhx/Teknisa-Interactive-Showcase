import type { FlowStep } from "../solutions";

export const crmPremiumFlow: FlowStep[] = [
  {
    id: "dashboard",
    label: "Visão geral",
    tooltip: "Métricas de fidelidade",
    highlightArea: { x: 6, y: 22, width: 88, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "perfil",
    label: "Perfil",
    tooltip: "Histórico e preferências",
    highlightArea: { x: 6, y: 52, width: 88, height: 36 },
    companions: ["MiniDashboard"],
  },
  {
    id: "campanha",
    label: "Campanha",
    tooltip: "Crie uma campanha de fidelidade",
    highlightArea: { x: 6, y: 22, width: 88, height: 60 },
    companions: ["MiniDashboard"],
  },
  {
    id: "oferta",
    label: "Oferta",
    tooltip: "Configure desconto personalizado",
    highlightArea: { x: 6, y: 40, width: 88, height: 38 },
    companions: ["MiniDashboard"],
  },
  {
    id: "ativada",
    label: "Ativada",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];
