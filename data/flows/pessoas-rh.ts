import type { TourStep } from "../solutions";

export const portalGestorFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="pg-dashboard"]',
    placement: "bottom",
    title: "Dashboard da equipe",
    description:
      "Presença, hora extra, solicitações abertas, todos os indicadores que o gestor precisa em uma única tela.",
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "escala",
    targetSelector: '[data-tour="pg-schedule"]',
    placement: "top",
    title: "Escala da semana",
    description:
      "Edite turnos diretamente na grade. Conflitos e horas extras destacados automaticamente.",
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "ponto",
    targetSelector: '[data-tour="pg-punch"]',
    placement: "right",
    title: "Espelho de ponto consolidado",
    description:
      "Marcações, horas extras, ausências, tudo por colaborador. Ajuste registrado com histórico para auditoria.",
    companions: ["EmployeeCard"],
  },
  {
    id: "solicitacoes",
    targetSelector: '[data-tour="pg-requests"]',
    placement: "right",
    title: "Solicitações pendentes",
    description:
      "Férias, folgas, trocas de turno, o gestor aprova ou recusa sem sair do portal. Sem WhatsApp paralelo.",
    companions: ["EmployeeCard", "MiniDashboard"],
  },
  {
    id: "exportar",
    targetSelector: '[data-tour="pg-export"]',
    placement: "top",
    title: "Relatório consolidado",
    description:
      "Export para o RH corporativo em um toque. Dados padronizados, sem retrabalho de planilha.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
];

export const portalFuncionarioFlow: TourStep[] = [
  {
    id: "boas-vindas",
    targetSelector: '[data-tour="pf-login"]',
    placement: "top",
    title: "Acesso por biometria",
    description:
      "O funcionário acessa direto do celular, sem senha para esquecer, sem ligar para o RH para resetar.",
    requiresInteraction: true,
    actionLabel: "Entrar",
  },
  {
    id: "ponto",
    targetSelector: '[data-tour="pf-punch-sheet"]',
    placement: "right",
    title: "Espelho de ponto pessoal",
    description:
      "App reconhece a Mariana logo no topo (foto, matrícula, unidade) e resume o mês em 4 KPIs: saldo do banco de horas, registro de hoje, saldo de férias e status do holerite. Logo abaixo, as marcações dos últimos dias com horas extras destacadas.",
  },
  {
    id: "ferias",
    targetSelector: '[data-tour="pf-vacation-button"]',
    placement: "top",
    title: "Solicitação de férias em um toque",
    description:
      "Datas, saldo, dias úteis, tudo calculado automaticamente. A solicitação vai direto para o gestor.",
    requiresInteraction: true,
    actionLabel: "Enviar solicitação",
  },
  {
    id: "status",
    targetSelector: '[data-tour="pf-status"]',
    placement: "top",
    title: "Acompanhe a aprovação",
    description:
      "Etapas visíveis: enviada, análise do gestor, aprovação RH. Notificação push em cada mudança.",
    companions: ["SimulatedNotification"],
  },
  {
    id: "holerite",
    targetSelector: '[data-tour="pf-payslip"]',
    placement: "top",
    title: "Holerite no app",
    description:
      "Disponível assim que processado. Detalhamento por verba e download em PDF, sem ir ao RH pegar via papel.",
    companions: ["SimulatedNotification"],
  },
];

export const mesaOperacoesFlow: TourStep[] = [
  {
    id: "visao-geral",
    targetSelector: '[data-tour="mo-grid"]',
    placement: "right",
    title: "Visão consolidada de unidades",
    description:
      "Indicador de presença por unidade em tempo real. Visão de comando para operações multi-loja.",
    companions: ["MiniDashboard"],
  },
  {
    id: "alerta",
    targetSelector: '[data-tour="mo-alert"]',
    placement: "left",
    title: "Alerta de absenteísmo crítico",
    description:
      "Quando uma unidade fica abaixo do crítico, alerta dispara automaticamente. Mesa age antes do problema escalar.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
  {
    id: "realocacao",
    targetSelector: '[data-tour="mo-realloc"]',
    placement: "left",
    title: "Ação imediata: realocação",
    description:
      "Sistema sugere realocação entre unidades. Centro tem 2 disponíveis → Norte precisa cobrir. Um toque confirma.",
    requiresInteraction: true,
    actionLabel: "Confirmar realocação",
    companions: ["MiniDashboard"],
  },
  {
    id: "confirmacao",
    targetSelector: '[data-tour="mo-confirmed"]',
    placement: "left",
    title: "Painel atualizado",
    description:
      "Norte projeta agora 82% de presença. Funcionários realocados recebem push com nova escala.",
    companions: ["MiniDashboard"],
  },
  {
    id: "log",
    targetSelector: '[data-tour="mo-log"]',
    placement: "left",
    title: "Log de operação",
    description:
      "Cada ação fica registrada. Auditoria operacional sem caderno paralelo. Aprendizado para próximos ciclos.",
    companions: ["MiniDashboard"],
  },
];

export const analisePreditivaFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="ip-kpis"]',
    placement: "right",
    title: "Indicadores preditivos de RH",
    description:
      "Turnover atual, predição de 90 dias, risco crítico, IA aplicada nos próprios dados da empresa.",
    companions: ["MiniDashboard"],
  },
  {
    id: "mapa-risco",
    targetSelector: '[data-tour="ip-risk-map"]',
    placement: "right",
    title: "Mapa de risco de turnover",
    description:
      "Cada colaborador com um score de probabilidade nos próximos 90 dias. Priorize quem precisa de conversa de carreira.",
    companions: ["MiniDashboard"],
  },
  {
    id: "identificacao",
    targetSelector: '[data-tour="ip-risk-item"]',
    placement: "right",
    title: "Detalhe por colaborador",
    description:
      "Selecione uma pessoa para entender os fatores que contribuem para o risco, atestados, hora extra, salário vs mercado.",
    requiresInteraction: true,
    actionLabel: "Selecione um perfil",
    companions: ["MiniDashboard"],
  },
  {
    id: "sugestao",
    targetSelector: '[data-tour="ip-suggestion"]',
    placement: "left",
    title: "Plano de retenção sugerido pela IA",
    description:
      "Ações concretas: conversa com gestor, ajuste salarial, mentoria. Cada item com prazo e responsável.",
    companions: ["MiniDashboard", "SimulatedNotification"],
  },
  {
    id: "simulacao",
    targetSelector: '[data-tour="ip-impact"]',
    placement: "left",
    title: "Impacto simulado",
    description:
      "Antes: 87% de risco. Depois da ação: 34%. Tomada de decisão com clareza, sem 'achismo'.",
    companions: ["MiniDashboard"],
  },
];

export const assistenteRegrasFlow: TourStep[] = [
  {
    id: "regras",
    targetSelector: '[data-tour="ar-new-rule"]',
    placement: "bottom-end",
    title: "Regras configuradas",
    description:
      "Toda regra de ponto, escala e benefícios em um único lugar, com toggle de ativação. Toque em Nova regra para criar.",
    requiresInteraction: true,
    actionLabel: "Nova regra",
  },
  {
    id: "wizard",
    targetSelector: '[data-tour="ar-wizard"]',
    placement: "bottom",
    title: "Descreva em linguagem natural",
    description:
      "A IA recebe um pedido em português, como 'quando funcionário fizer hora extra aos sábados, pagar 80% a mais', e estrutura a regra automaticamente.",
  },
  {
    id: "condicoes",
    targetSelector: '[data-tour="ar-conditions"]',
    placement: "right",
    title: "Condições estruturadas",
    description:
      "A IA extrai tokens da frase (Hora extra, Sábado, Adicional 80%, Notifica gestor) como chips removíveis no topo, e os blocos WHEN/AND/THEN/ALSO abaixo. Toque no X de qualquer chip para tirar um critério ou ajuste os blocos antes de ativar.",
  },
  {
    id: "preview",
    targetSelector: '[data-tour="ar-preview"]',
    placement: "left",
    title: "Preview com impacto estimado",
    description:
      "Veja a regra como vai aparecer no sistema. Custo médio mensal calculado: 12 colaboradores, ~R$ 320/mês.",
  },
  {
    id: "ativacao",
    targetSelector: '[data-tour="ar-activated"]',
    placement: "top",
    title: "Regra ativada e sincronizada",
    description:
      "Folha de pagamento e ponto entendem a nova regra imediatamente. Sem precisar de TI ou consultoria.",
    companions: ["SimulatedNotification"],
  },
];
