import type { TourStep } from "../solutions";
import { brl } from "../../lib/tourState";

const fmtMoney = (v?: number) =>
  typeof v === "number" ? brl(v) : "R$ 0,00";

// ===== Cardápio Inteligente ==============================================
// Tour focado na experiência IA: planner → trigger → full-screen brain
// animation → reveal → approve → publish.
export const cardapioInteligenteFlow: TourStep[] = [
  {
    id: "semana",
    targetSelector: '[data-tour="ci-week-grid"]',
    placement: "bottom",
    title: (live) =>
      live.activeDayLabel
        ? `Planejando ${live.activeDayLabel}`
        : "Planejamento semanal",
    description:
      "Visão da semana inteira em 5 abas. Cada barra indica quantos pratos já estão definidos para o dia. Mas o atalho mais poderoso é deixar a IA montar tudo.",
    actionLabel: "Mostrar a IA",
    companions: ["MiniDashboard"],
  },
  {
    id: "gerar",
    targetSelector: '[data-tour="ci-generate-ai"]',
    placement: "bottom",
    title: "Gerar cardápio com IA",
    description:
      "Toque em Gerar cardápio com IA. O sistema vai cruzar histórico de 4 unidades, restrições contratuais, fichas técnicas e custos para montar a semana inteira em segundos.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "animation",
    targetSelector: '[data-tour="ci-ai-brain"]',
    placement: "left",
    title: "IA pensando ao vivo",
    description:
      "Três fases visíveis no topo: Reunir dados → Confirmar parâmetros → Gerar cardápio. O núcleo neural pulsa, anéis rotacionam, partículas orbitam e linhas de circuito disparam entre os nós.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "nutricional",
    targetSelector: '[data-tour="ci-nutrition"]',
    placement: "left",
    title: (live) =>
      live.dayBalanced
        ? "Cardápio gerado · balanceado"
        : "Análise nutricional",
    description: (live) =>
      live.dayBalanced
        ? `Calorias, proteína, carboidratos e fibras dentro das metas. Custo médio por refeição: ${fmtMoney(live.dayTotalsCost as number)}.`
        : `Calorias atuais ${(live.dayTotalsCalories as number) ?? 0} kcal. Os indicadores acendem em verde quando o dia fica dentro das metas.`,
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "aprovacao",
    targetSelector: '[data-tour="ci-approve"]',
    placement: "bottom",
    title: "Aprovação da nutricionista",
    description:
      "Toque em Aprovar. O cardápio passa pelo workflow oficial e libera a publicação.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "publicado",
    targetSelector: '[data-tour="ci-publish"]',
    placement: "bottom",
    title: "Publicar para as unidades",
    description:
      "Toque em Publicar. O cardápio aprovado vai direto para o MyMenu de cada funcionário e para o painel das cozinhas. Sem planilha paralela.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
];

// ===== MyQuest (TAA de reservas corporativas) ============================
export const myQuestFlow: TourStep[] = [
  {
    id: "identifica",
    targetSelector: '[data-tour="mq-checkin"]',
    placement: "right",
    title: "Identifique-se no totem",
    description:
      "MyQuest é o totem de autoatendimento dos refeitórios corporativos. Toque para começar como Mariana Costa (matrícula 28471).",
    requiresInteraction: true,
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "monta",
    targetSelector: '[data-tour="mq-pick"]',
    placement: "right",
    title: "Monte seu prato",
    description:
      "Cardápio do dia separado por prato principal, guarnição, salada e sobremesa. Toque nas opções para escolher.",
    actionLabel: "Continuar",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "horario",
    targetSelector: '[data-tour="mq-schedule"]',
    placement: "left",
    title: (live) =>
      live.mqSelectedSlot
        ? `Horário ${live.mqSelectedSlot} reservado`
        : "Escolha o horário",
    description: (live) =>
      `As reservas mostram a lotação em tempo real. O sistema sugere ${live.mqSelectedSlot ?? "o horário com pico baixo"} para evitar a fila. Pode trocar quantas vezes quiser.`,
    actionLabel: "Confirmar reserva",
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "confirma",
    targetSelector: '[data-tour="mq-confirm"]',
    placement: "top",
    title: "Confirmar reserva",
    description:
      "Toque em Confirmar reserva. A senha é gerada na hora e o QR de acesso fica pronto para o refeitório.",
    requiresInteraction: true,
    companions: ["RestaurantQueueBoard"],
  },
  {
    id: "senha",
    targetSelector: '[data-tour="mq-result"]',
    placement: "left",
    title: "Senha emitida",
    description: (live) =>
      `Senha ${live.mqPassword ?? "B247"} para o horário ${live.mqSelectedSlot ?? "12:30"}. Apresentar no totem do refeitório para liberar o acesso.`,
    actionLabel: "Concluir",
    companions: ["RestaurantQueueBoard"],
  },
];

// ===== MyMenu (cardápio + reserva + opinião) ============================
export const myMenuFlow: TourStep[] = [
  {
    id: "abas",
    targetSelector: '[data-tour="mm-tabs"]',
    placement: "bottom",
    title: "Três pilares do MyMenu",
    description:
      "Cardápio para ver o que vai ser servido em qualquer data, Reservar para garantir lugar, Opinião para feedback. Use as abas para alternar.",
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "data",
    targetSelector: '[data-tour="mm-date-picker"]',
    placement: "bottom",
    title: (live) =>
      live.mmDate
        ? `Cardápio de ${live.mmWeekday ?? "hoje"} ${live.mmDate}`
        : "Cardápio por data",
    description: (live) =>
      `Use as setas ou as pílulas para navegar entre os dias. Destaque do dia: ${live.mmHighlight ?? "prato principal"}.`,
    actionLabel: "Continuar",
    companions: ["MiniDashboard"],
  },
  {
    id: "reservar",
    targetSelector: '[data-tour="mm-reserve"]',
    placement: "left",
    title: (live) =>
      live.mmReservedSlot
        ? `Reservado para ${live.mmReservedSlot}`
        : "Reservar refeição",
    description: (live) =>
      live.mmReservedSlot
        ? "Reserva confirmada e QR de acesso gerado. Apresente no totem do refeitório."
        : "Cada horário mostra o pico esperado. O sistema sugere o slot mais tranquilo. Toque em um horário para reservar.",
    actionLabel: "Ir para opinião",
    companions: ["MiniDashboard"],
  },
  {
    id: "feedback-tab",
    targetSelector: '[data-tour="mm-tab-feedback"]',
    placement: "top",
    title: "Sua opinião conta",
    description:
      "A aba Opinião concentra elogios, reclamações e sugestões. Toque para entrar.",
    requiresInteraction: true,
    companions: ["MiniDashboard"],
  },
  {
    id: "enviar",
    targetSelector: '[data-tour="mm-send-feedback"]',
    placement: "top",
    title: (live) =>
      live.mmFeedbackSent ? "Feedback enviado" : "Avalie + escolha tipo",
    description: (live) =>
      live.mmFeedbackSent
        ? "Pronto. Sua opinião agora alimenta o Cardápio Inteligente para os próximos planejamentos."
        : `Toque nas estrelas (${live.mmRating ?? 0}/5), escolha entre elogio, reclamação ou sugestão e selecione uma opção pré-pronta. Sem teclado.`,
    actionLabel: "Concluir",
    companions: ["MiniDashboard"],
  },
];

// ===== WasteControl ======================================================
export const wasteControlFlow: TourStep[] = [
  {
    id: "tabs",
    targetSelector: '[data-tour="wc-top-tabs"]',
    placement: "bottom",
    title: "Registrar e ver histórico",
    description:
      "Duas abas: Registros para criar uma medição agora, Histórico para auditar tudo o que já foi registrado e exportar para a supervisão.",
    actionLabel: "Continuar",
    companions: ["StockIndicator"],
  },
  {
    id: "categoria",
    targetSelector: '[data-tour="wc-kind-tabs"]',
    placement: "bottom",
    title: (live) =>
      live.wcKindLabel
        ? `Categoria ativa: ${live.wcKindLabel}`
        : "Tipo de desperdício",
    description:
      "Sobra limpa (cuba), Resto ingesto (servido e não consumido), Produção (total) e Excesso (produzido além da meta). Cada categoria tem sua meta.",
    actionLabel: "Continuar",
    companions: ["StockIndicator"],
  },
  {
    id: "prato",
    targetSelector: '[data-tour="wc-form-prato"]',
    placement: "right",
    title: (live) =>
      live.wcPrato
        ? `Registrando ${live.wcPrato}`
        : "Escolha o prato",
    description:
      "Lista de pratos comuns como chips. Toca pra escolher, sem teclado. Quantidade ajusta com stepper + presets.",
    actionLabel: "Continuar",
    companions: ["StockIndicator"],
  },
  {
    id: "registrar",
    targetSelector: '[data-tour="wc-submit"]',
    placement: "top",
    title: (live) =>
      live.wcAboveGoal
        ? "Atenção: acima da meta"
        : "Registrar agora",
    description: (live) =>
      live.wcAboveGoal
        ? `Você está prestes a registrar ${live.wcQuantidade ?? 0} kg, acima da meta de ${live.wcKindLabel ?? "categoria"}. Um alerta será disparado ao gestor.`
        : `Toque em Registrar ${(live.wcKindLabel as string)?.toLowerCase() ?? "agora"} para gravar a medição. Entra no histórico imediatamente.`,
    requiresInteraction: true,
    companions: ["StockIndicator"],
  },
  {
    id: "historico",
    targetSelector: '[data-tour="wc-top-tabs"]',
    placement: "bottom",
    title: (live) =>
      `${live.wcHistoricoCount ?? 0} registros no histórico`,
    description: (live) =>
      `Total já medido: ${typeof live.wcTotalKg === "number" ? (live.wcTotalKg as number).toFixed(1) : "0"} kg na semana. Toque em Histórico para ver tudo, filtrar por tipo/serviço/data e exportar.`,
    actionLabel: "Concluir",
    companions: ["StockIndicator"],
  },
];
