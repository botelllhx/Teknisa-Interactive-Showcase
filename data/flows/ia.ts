import type { TourStep } from "../solutions";

// ===== ISA — ChatBot Helper ============================================
// Conversation reveals progressively. Each step pushes one more
// user+assistant exchange. Final step is the action confirmation.
export const isaChatbotFlow: TourStep[] = [
  {
    id: "boas-vindas",
    targetSelector: '[data-tour="isa-send"]',
    placement: "left",
    title: "Oi, eu sou a ISA",
    description:
      "Copiloto IA da Teknisa. Pergunte qualquer coisa em português — vendas, custo, escala, estoque, desperdício — e eu respondo com dados, gráficos inline e atalhos para acionar de imediato.",
    actionLabel: "Continuar",
  },
  {
    id: "vendas",
    targetSelector: '[data-tour="isa-send"]',
    placement: "left",
    title: "Pergunte sobre vendas",
    description:
      "Primeiro exemplo: pergunta sobre vendas. ISA responde com 3 KPIs (vendas hoje, % da meta, ticket médio) e um gráfico inline de 7 dias. As pílulas no rodapé são próximas perguntas sugeridas.",
    actionLabel: "Continuar",
  },
  {
    id: "previsao",
    targetSelector: '[data-tour="isa-send"]',
    placement: "left",
    title: "Pergunte sobre previsão",
    description:
      "Agora um pedido preditivo: vai ter pico sexta? ISA aciona o modelo XGBoost (87% acurácia), mostra a previsão de desperdício por prato em barras horizontais e calcula o impacto financeiro da recomendação.",
    actionLabel: "Continuar",
  },
  {
    id: "aplica",
    targetSelector: '[data-tour="isa-send"]',
    placement: "left",
    title: "Mande aplicar — ISA executa",
    description:
      "Em vez de você abrir o ERP, mexer em planilha, ligar para cada unidade, basta dizer 'Aplica a recomendação'. ISA executa em 3 unidades, notifica os responsáveis e liga o monitoramento sozinha.",
    actionLabel: "Concluir",
  },
];

// ===== Análise Preditiva (restaurantes) =================================
// Modelo de ML focado em demanda, custo e desperdício para restaurantes.
// Diferente do Análise Preditiva de RH (turnover) que está em pessoas-rh.
export const analisePreditivaIAFlow: TourStep[] = [
  {
    id: "kpis",
    targetSelector: '[data-tour="apia-kpis"]',
    placement: "bottom",
    title: "4 indicadores preditivos do dia",
    description:
      "Demanda prevista (1.847 refeições), risco de desperdício (14,2kg acima da meta), ruptura de estoque em 7 dias (3 itens) e acurácia do modelo (87,4%). Cada KPI é um output do XGBoost.",
    actionLabel: "Continuar",
  },
  {
    id: "forecast",
    targetSelector: '[data-tour="apia-forecast"]',
    placement: "bottom",
    title: "Demanda em 14 dias",
    description:
      "Linha do tempo com 7d de histórico + 7d de previsão. O modelo combina histórico da mesma semana (38%), calendário e feriados (24%), clima previsto (18%) e eventos locais (12%). Tudo visível abaixo do gráfico.",
    actionLabel: "Continuar",
  },
  {
    id: "modelo",
    targetSelector: '[data-tour="apia-model"]',
    placement: "left",
    title: "O modelo ativo",
    description:
      "Card escuro com o XGBoost v4.2.1 rodando agora: acurácia 87,4% (gauge), F1 score 0,84 e erro médio absoluto de ±42 refeições. Sem caixa-preta — métricas e features ficam visíveis.",
    actionLabel: "Continuar",
  },
  {
    id: "agente",
    targetSelector: '[data-tour="apia-agent"]',
    placement: "top",
    title: "Agente preditivo agindo",
    description:
      "Não é dashboard: é ação. Nas últimas 24h o agente gerou 3 pedidos automáticos de compra, disparou 2 alertas de pico e ajustou 2 cardápios para reduzir desperdício. Log completo à direita.",
    actionLabel: "Concluir",
  },
];
