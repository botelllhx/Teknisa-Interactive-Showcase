import type { TourStep } from "../solutions";

export const rotinaFiscalFlow: TourStep[] = [
  {
    id: "painel",
    targetSelector: '[data-tour="rf-obligations"]',
    placement: "right",
    title: "Painel de obrigações fiscais",
    description:
      "Header mostra '1 de 4 entregue' com um gauge radial de progresso e próximo vencimento em destaque. Lista completa logo abaixo: SPED Fiscal, EFD-Reinf, DCTFWeb e SPED Contribuições, cada uma com status colorido e data. Zero dispersão.",
    companions: ["FiscalBadge"],
  },
  {
    id: "reforma",
    targetSelector: '[data-tour="rf-reform-card"]',
    placement: "right",
    title: "Preparado para a Reforma 2026",
    description:
      "Estrutura IBS, CBS, IS e Split Payment já configurada. A Teknisa absorve a mudança regulatória sem você precisar refazer cadastros.",
    companions: ["FiscalBadge"],
  },
  {
    id: "validacao",
    targetSelector: '[data-tour="rf-validation"]',
    placement: "right",
    title: "Validação automática de notas",
    description:
      "1.842 notas validadas, 12 com inconsistência, sinalizadas para correção pontual. Sem revisar uma a uma manualmente.",
    companions: ["FiscalBadge"],
  },
  {
    id: "apuracao",
    targetSelector: '[data-tour="rf-comparison"]',
    placement: "left",
    title: "Comparativo regime atual vs novo",
    description:
      "Apuração paralela: regime atual R$ 84,2k vs novo R$ 79,4k. Veja impacto da Reforma na sua operação antes de 2026.",
    companions: ["FiscalBadge", "MiniDashboard"],
  },
  {
    id: "declaracao",
    targetSelector: '[data-tour="rf-send"]',
    placement: "top",
    title: "SPED gerado e transmitido",
    description:
      "Um toque envia a declaração ao SEFAZ. Confirmação chega no painel, auditoria fica com tudo registrado.",
    requiresInteraction: true,
    actionLabel: "Transmitir",
    companions: ["FiscalBadge", "SimulatedNotification"],
  },
];

export const rotinaRastreabilidadeFlow: TourStep[] = [
  {
    id: "busca",
    targetSelector: '[data-tour="rr-search"]',
    placement: "bottom",
    title: "Busca por lote",
    description:
      "Toque na busca para localizar um lote pelo código. O sistema entrega o histórico completo em segundos.",
  },
  {
    id: "timeline",
    targetSelector: '[data-tour="rr-timeline"]',
    placement: "right",
    title: "Linha do tempo de movimentações",
    description:
      "Trajeto completo do lote em milestones horizontais (recebimento → conferência → transferência → saída), cada etapa com ícone, data/hora, responsável e indicação visual de concluído, em andamento ou pendente. Sem inconsistências detectadas.",
    companions: ["StockIndicator"],
  },
  {
    id: "origem",
    targetSelector: '[data-tour="rr-chain"]',
    placement: "left",
    title: "Cadeia de origem completa",
    description:
      "Do produtor à sua filial, origem, distribuidor, CD, unidade. Compliance e segurança alimentar sem caixa-preta.",
    companions: ["StockIndicator"],
  },
  {
    id: "recall",
    targetSelector: '[data-tour="rr-recall"]',
    placement: "left",
    title: "Alerta de recall ativado",
    description:
      "Em caso de problema, todas as unidades que receberam o lote são notificadas imediatamente para suspender o uso.",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "relatorio",
    targetSelector: '[data-tour="rr-report"]',
    placement: "left",
    title: "Relatório de rastreabilidade",
    description:
      "Documento pronto para auditoria sanitária. PDF assinado digitalmente, sem montagem manual de dossiê.",
    companions: ["StockIndicator"],
  },
];

export const appRotinasEstoqueFlow: TourStep[] = [
  {
    id: "tarefas",
    targetSelector: '[data-tour="ae-task-list"]',
    placement: "bottom",
    title: "Tarefas de estoque do dia",
    description:
      "Hero do dia com 3 KPIs (pendentes, concluídas, itens a contar) e a lista de tarefas por setor logo abaixo: contagem, validade, conferência, distribuídas conforme escala. Mobile pensado para uso no chão de loja.",
    companions: ["StockIndicator"],
  },
  {
    id: "contagem",
    targetSelector: '[data-tour="ae-counter"]',
    placement: "bottom",
    title: "Contagem direto no mobile",
    description:
      "Stepper grande, sem digitar números pequenos. Cada item conta em segundos.",
    requiresInteraction: true,
    actionLabel: "Ajuste a quantidade",
    companions: ["StockIndicator"],
  },
  {
    id: "divergencia",
    targetSelector: '[data-tour="ae-divergence"]',
    placement: "top",
    title: "Divergência detectada na hora",
    description:
      "Sistema esperava 22 kg, contagem deu 18,4. Divergência aparece imediatamente, sem esperar fechar inventário.",
    companions: ["StockIndicator", "SimulatedNotification"],
  },
  {
    id: "justificativa",
    targetSelector: '[data-tour="ae-justification"]',
    placement: "top",
    title: "Justificativa rastreável",
    description:
      "Perda, erro de etiquetagem, transferência não registrada, opções pré-definidas + campo livre vinculado a documento.",
    companions: ["StockIndicator"],
  },
  {
    id: "sincronizado",
    targetSelector: '[data-tour="ae-sync"]',
    placement: "top",
    title: "Sincronizado com o ERP",
    description:
      "Contagem entra no ERP em tempo real. Estoque atualizado, divergência registrada, tudo pronto para conciliação.",
    companions: ["StockIndicator"],
  },
];
