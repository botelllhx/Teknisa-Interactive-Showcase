import type { TourStep } from "../solutions";

export const portalGestorFlow: TourStep[] = [
  {
    id: "home",
    targetSelector: '[data-tour="pg-pendentes-tile"]',
    placement: "left",
    title: "Tela inicial · Solicitações Pendentes",
    description:
      "Portal abre na grade de 18 indicadores do gestor: banco de horas, atrasos, atestados, férias a vencer, ausências de registro. O tile Solicitações Pendentes destaca o número aguardando aprovação. Toque nele para entrar na bandeja.",
    requiresInteraction: true,
    actionLabel: "Toque no tile",
  },
  {
    id: "primeira",
    targetSelector: '[data-tour="pg-first-card"]',
    placement: "right",
    title: "Beatriz Santos quer férias",
    description:
      "Gerente de Vendas, 30 dias de saldo, viagem já programada. Toque em Revisar para ver os detalhes.",
    requiresInteraction: true,
    actionLabel: "Toque em Revisar",
  },
  {
    id: "ia",
    targetSelector: '[data-tour="pg-ai-suggestion"]',
    placement: "left",
    title: "IA sugere quem cobre",
    description:
      "Modal abre com perfil, justificativa, histórico — e a IA cruza skill, agenda e SLA da equipe para indicar que Patrícia Oliveira pode assumir sem conflito. Impacto baixo, SLA mantido.",
  },
  {
    id: "aprovar",
    targetSelector: '[data-tour="pg-aprovar"]',
    placement: "left",
    title: "Aprova e tudo se ajusta",
    description:
      "Um toque dispara três coisas em paralelo: notificação no app da Beatriz, escala atualizada, folha de pagamento sincronizada. Auditoria registrada.",
    requiresInteraction: true,
    actionLabel: "Toque em Aprovar",
  },
];

export const portalFuncionarioFlow: TourStep[] = [
  {
    id: "login",
    targetSelector: '[data-tour="pf-login"]',
    placement: "right",
    title: "Acesso do funcionário",
    description:
      "Maria Silva abre o app e entra com seu usuário corporativo. O Portal do Funcionário roda no celular dela, sem precisar passar pelo RH para resetar senha ou pegar acesso.",
    requiresInteraction: true,
    actionLabel: "Entrar",
  },
  {
    id: "registrar",
    targetSelector: '[data-tour="pf-registrar"]',
    placement: "right",
    title: "Tela inicial: registrar ponto",
    description:
      "Logo após o login, a ação mais frequente está bem no topo: botão verde grande de Registrar Ponto, com saldos de banco de horas, ocorrências e última apuração visíveis sem rolar. Toque no botão para começar.",
    requiresInteraction: true,
    actionLabel: "Registrar Ponto",
  },
  {
    id: "camera",
    targetSelector: '[data-tour="pf-camera"]',
    placement: "right",
    title: "Selfie com verificação facial",
    description:
      "A câmera abre em modo frontal para conferir quem está batendo o ponto. Sem fraude, sem ponto de favor, sem necessidade de relógio físico na unidade.",
    requiresInteraction: true,
    actionLabel: "Capturar foto",
  },
  {
    id: "confirmar",
    targetSelector: '[data-tour="pf-ok"]',
    placement: "right",
    title: "Confirmação de entrada",
    description:
      "O app sugere o tipo de marcação a partir do espelho do dia e da hora atual. Maria confirma a entrada das 09:00 com um toque.",
    requiresInteraction: true,
    actionLabel: "OK",
  },
  {
    id: "registrado",
    targetSelector: '[data-tour="pf-apuracao"]',
    placement: "right",
    title: "Ponto sincronizado em segundos",
    description:
      "A entrada das 09:00 já aparece na Última Apuração e o período em curso é atualizado. O gestor recebe o sinal de presença em tempo real, sem planilha intermediária.",
    companions: ["SimulatedNotification"],
  },
];

export const mesaOperacoesFlow: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour="mo-dashboard"]',
    placement: "right",
    title: "Painel operacional do turno",
    description:
      "18 indicadores em tempo real do restaurante: presença, ausências, horas extras, contratos a vencer, ocorrências do dia. O gestor olha e sabe o que precisa de ação.",
  },
  {
    id: "ausencias",
    targetSelector: '[data-tour="mo-ausencias"]',
    placement: "right",
    title: "3 ausências de registro hoje",
    description:
      "Pessoas que estavam escaladas e não bateram ponto. Toque para abrir a grade e ver quem sumiu.",
    requiresInteraction: true,
    actionLabel: "Toque no tile",
  },
  {
    id: "ocorrencias",
    targetSelector: '[data-tour="mo-ocorrencias"]',
    placement: "right",
    title: "Quem está e quem falta, hora a hora",
    description:
      "Cada função tem uma cor: Garçom azul, Cozinheiro laranja, Motoboy verde, Caixa roxo. Bate o olho e sabe imediatamente quem é equivalente a quem. Verde foi, vermelho faltou, laranja o dia inteiro.",
  },
  {
    id: "absent",
    targetSelector: '[data-tour="mo-absent-row"]',
    placement: "right",
    title: "Eloá não bateu ponto",
    description:
      "Cozinheira do turno 16h–23h. Sem ela, a cozinha fica descoberta no jantar. Toque na linha para a Mesa sugerir quem cobre.",
    requiresInteraction: true,
    actionLabel: "Toque na linha",
  },
  {
    id: "cobertura",
    targetSelector: '[data-tour="mo-realocar"]',
    placement: "left",
    title: "Mesma cor cobre mesma cor",
    description:
      "A IA filtrou só os Cozinheiros disponíveis, com horas extras dentro da meta. Kelvin (cozinheiro · 6 anos) está de folga, cobre o turno todo. Toque em Realocar e tudo se ajusta.",
    requiresInteraction: true,
    actionLabel: "Toque em Realocar",
  },
];

export const analisePreditivaFlow: TourStep[] = [
  {
    id: "kpis",
    targetSelector: '[data-tour="ap-kpis"]',
    placement: "bottom",
    title: "Distribuição de risco da equipe",
    description:
      "4 vínculos analisados: 1 em risco baixo, 2 médio, 1 alto. A IA cruza atestados, advertências, horas extras e movimentações para chegar nesse score.",
  },
  {
    id: "tabela",
    targetSelector: '[data-tour="ap-table"]',
    placement: "top",
    title: "Lista completa por pessoa",
    description:
      "Cada vínculo com risco de turnover e probabilidade de processo trabalhista. A coluna Risco está ordenada do mais baixo para o mais alto.",
  },
  {
    id: "selecionar",
    targetSelector: '[data-tour="ap-row-alto"]',
    placement: "left",
    title: "Quem está em risco alto?",
    description:
      "Beatriz Santos, Gerente de Vendas com 5 anos de casa. Toque em VER DETALHES para entender o porquê.",
    requiresInteraction: true,
    actionLabel: "Toque em VER DETALHES",
  },
  {
    id: "detalhe",
    targetSelector: '[data-tour="ap-fatores"]',
    placement: "right",
    title: "Risco alto, 75% de probabilidade",
    description:
      "Modal abre com o nível de risco, probabilidade de processo e a quebra entre fatores negativos e positivos. Tudo numa só tela.",
  },
  {
    id: "fatores",
    targetSelector: '[data-tour="ap-fatores"]',
    placement: "right",
    title: "Os fatores que explicam o score",
    description:
      "15 faltas, 2 advertências, 4 afastamentos, 4 movimentações gerenciais, 20h extras por mês. O RH age com dado, não com achismo.",
  },
];

