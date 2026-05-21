import type { FlowStep } from "../solutions";

export const portalGestorFlow: FlowStep[] = [
  {
    id: "dashboard",
    label: "Equipe",
    tooltip: "Indicadores de presença e escala",
    highlightArea: { x: 6, y: 22, width: 88, height: 30 },
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "escala",
    label: "Escala",
    tooltip: "Edite a escala da semana",
    highlightArea: { x: 6, y: 52, width: 88, height: 30 },
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "ponto",
    label: "Ponto",
    tooltip: "Aprove marcações e hora extra",
    highlightArea: { x: 6, y: 22, width: 88, height: 60 },
    companions: ["EmployeeCard"],
  },
  {
    id: "solicitacoes",
    label: "Solicitações",
    tooltip: "Pendências da equipe",
    highlightArea: { x: 6, y: 22, width: 88, height: 60 },
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "exportar",
    label: "Relatório",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

export const portalFuncionarioFlow: FlowStep[] = [
  {
    id: "boas-vindas",
    label: "Olá",
    tooltip: "Entre no aplicativo",
    highlightArea: { x: 16, y: 70, width: 68, height: 12 },
  },
  {
    id: "ponto",
    label: "Ponto",
    tooltip: "Espelho de ponto do mês",
    highlightArea: { x: 6, y: 22, width: 88, height: 56 },
  },
  {
    id: "ferias",
    label: "Solicitar férias",
    tooltip: "Solicite seu período",
    highlightArea: { x: 16, y: 80, width: 68, height: 12 },
  },
  {
    id: "status",
    label: "Status",
    companions: ["SimulatedNotification"],
  },
  {
    id: "holerite",
    label: "Holerite",
    companions: ["SimulatedNotification"],
  },
];

export const mesaOperacoesFlow: FlowStep[] = [
  {
    id: "visao-geral",
    label: "Visão geral",
    tooltip: "Visão consolidada das unidades",
    highlightArea: { x: 6, y: 18, width: 88, height: 64 },
    companions: ["MiniDashboard"],
  },
  {
    id: "alerta",
    label: "Alerta",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
  {
    id: "realocacao",
    label: "Realocação",
    tooltip: "Realoque um funcionário",
    highlightArea: { x: 40, y: 40, width: 54, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "confirmacao",
    label: "Atualizado",
    companions: ["MiniDashboard"],
  },
  {
    id: "log",
    label: "Log registrado",
    companions: ["MiniDashboard"],
  },
];

export const analisePreditivaFlow: FlowStep[] = [
  {
    id: "dashboard",
    label: "Indicadores",
    tooltip: "Painel preditivo de RH",
    highlightArea: { x: 6, y: 22, width: 88, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "mapa-risco",
    label: "Mapa de risco",
    tooltip: "Funcionários por risco",
    highlightArea: { x: 6, y: 52, width: 88, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "identificacao",
    label: "Em risco",
    tooltip: "Selecione um perfil",
    highlightArea: { x: 6, y: 52, width: 50, height: 30 },
    companions: ["MiniDashboard"],
  },
  {
    id: "sugestao",
    label: "Sugestão IA",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
  {
    id: "simulacao",
    label: "Impacto",
    companions: ["MiniDashboard"],
  },
];

export const assistenteRegrasFlow: FlowStep[] = [
  {
    id: "regras",
    label: "Regras",
    tooltip: "Toque para criar nova",
    highlightArea: { x: 60, y: 18, width: 34, height: 12 },
  },
  {
    id: "wizard",
    label: "Wizard IA",
    tooltip: "Descreva a regra desejada",
    highlightArea: { x: 6, y: 32, width: 88, height: 30 },
  },
  {
    id: "condicoes",
    label: "Condições",
    tooltip: "Configure os critérios",
    highlightArea: { x: 6, y: 32, width: 88, height: 50 },
  },
  {
    id: "preview",
    label: "Preview",
    tooltip: "Confira o resultado",
    highlightArea: { x: 6, y: 50, width: 88, height: 32 },
  },
  {
    id: "ativacao",
    label: "Ativada",
    companions: ["SimulatedNotification"],
  },
];
