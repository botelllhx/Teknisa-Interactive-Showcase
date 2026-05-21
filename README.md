# Teknisa Interactive Showcase

Painel interativo de soluções Teknisa pensado para rodar em **TV touch (1920×1080)** em ambientes de showroom, feira e demonstração comercial. O visitante navega por áreas da operação, escolhe uma solução e interage com um fluxo demonstrativo simulado — telas, transições, tooltips e microinterações que comunicam a proposta de valor sem depender de explicação verbal.

> **Mostrar antes de explicar.** Cada solução comunica seu valor através da experiência, não através de texto descritivo.

---

## O que é

Um produto de marca em forma de painel. **Não é** uma reprodução fiel dos sistemas Teknisa, **não é** um protótipo funcional, **não é** uma apresentação em slides e **não é** um vídeo em loop. É uma vitrine interativa que cabe sobre uma TV touch e leva o visitante por uma jornada guiada de 3 a 5 etapas por solução, com mockups que parecem o produto real, dados realistas e contexto setorial.

## Para quem é

Pensado para uso comercial em showrooms, eventos e visitas de cliente, onde o visitante chega sem briefing, toca e descobre. Touch targets generosos (≥ 56 px), tipografia confortável para a distância de leitura de uma TV, idle reset automático para o próximo visitante achar o painel sempre na HOME.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TypeScript 5 |
| Estilização | Tailwind CSS 3.4 |
| Animações | Framer Motion 11+ |
| Ícones | Lucide React (único sistema permitido) |
| Estado | Zustand |
| Fontes | Sora (display) + Rubik (UI/corpo), via `next/font/google` |
| Utilidades | `clsx`, `tailwind-merge` |

**Não usar:** styled-components, emotion, qualquer biblioteca de ícones além de Lucide, emojis como elementos visuais, react-router-dom, outras libs de animação (GSAP, AOS, animate.css).

---

## Arquitetura

A aplicação é uma única rota (`/`) governada por uma máquina de estados em Zustand com três visões — `home`, `segment`, `solution` — alternadas via `AnimatePresence mode="wait"`. Não usa URL routing por design: o contexto de TV touch dispensa deep links e simplifica o idle reset.

```
[HOME]                                   ← grade 4×2 de grupos
   │  (tocar num grupo)
   ▼
[SEGMENT]                                ← grade de soluções com stagger
   │  (tocar numa solução)
   ▼
[SOLUTION DEMO]
   ├─ StepIndicator (topo)
   ├─ Frame do dispositivo + tela + PulsingDot + LoadingBar
   ├─ Companions ao redor (cards laterais)
   ├─ FlowGuide (rodapé esquerdo)
   ├─ Botões Prev / Próxima (rodapé direito)
   └─ ConfirmationFeedback (overlay ao final)

[IDLE RESET]   90 s sem interação → overlay → 5 s extras → volta animada à HOME
```

### Estados globais (Zustand)

```ts
interface ShowcaseStore {
  view: "home" | "segment" | "solution";
  activeSegment: SolutionSegment | null;
  activeSolution: string | null;
  currentStep: number;
  totalSteps: number;
  isAutoPlaying: boolean;
  showTooltip: boolean;
  idleSeconds: number;

  selectSegment(id): void;
  selectSolution(id, totalSteps): void;
  nextStep(): void; prevStep(): void; setStep(i): void;
  resetFlow(): void;
  goHome(): void; goBack(): void;
  // ...
}
```

### Hooks de domínio

- **`useFlowController(solutionId)`** — resolve o fluxo da solução, expõe `next/prev/goTo/reset`, sinaliza `isFirst/isLast` e o passo corrente.
- **`useIdleTimer({ timeout, graceTimeout, enabled })`** — escuta `pointerdown / pointermove / touchstart / keydown / wheel` e expõe `isIdle` + `shouldReset` para o overlay e o retorno à HOME.

---

## Estrutura do projeto

```
.
├── app/
│   ├── layout.tsx              # Root layout, fontes (Sora + Rubik), viewport 1920
│   ├── page.tsx                # Página única, orquestra HOME / SEGMENT / SOLUTION
│   └── globals.css             # Reset, variáveis CSS, cursor:none, touch-action
├── components/
│   ├── home/                   # HeroSection, SegmentGrid, SolutionGrid
│   ├── layout/                 # ShowcaseNav, BackButton, IdleReset
│   ├── ui/                     # PulsingDot, StepIndicator, FlowGuide,
│   │                           # SimulatedNotification, LoadingBar,
│   │                           # ConfirmationFeedback, SegmentIcon
│   ├── mockups/
│   │   └── frames/             # DesktopFrame, MobileFrame, TabletFrame,
│   │                           # POSTerminalFrame, KioskFrame, SolutionFrame
│   ├── companions/             # POSCardReader, OrderTicket, KitchenDisplay,
│   │                           # MiniDashboard, StockIndicator, EmployeeCard,
│   │                           # FiscalBadge   (Sprint 5)
│   └── demo/                   # SolutionDemoPlaceholder (Sprint 6 → mockups reais)
├── data/
│   ├── solutions.ts            # Catálogo tipado: 21 soluções, 8 grupos
│   └── flows/                  # Fluxos de 3–5 etapas por solução, um arquivo por grupo
├── hooks/
│   ├── useFlowController.ts
│   └── useIdleTimer.ts
├── lib/
│   ├── tokens.ts               # Cores, timing, easings, viewport, spacing
│   ├── animations.ts           # Variantes Framer Motion reutilizáveis
│   ├── store.ts                # Zustand store
│   └── cn.ts                   # clsx + tailwind-merge
└── public/
    └── logo-teknisa.svg
```

---

## Setup e desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar o dev server (http://localhost:3000)
npm run dev

# Build de produção
npm run build && npm start

# Type-check
npx tsc --noEmit

# Lint
npm run lint
```

**Pré-requisitos:** Node 18+ (testado em Node 24). O painel foi pensado para **viewport 1920×1080 em modo paisagem** com cursor desabilitado — em desenvolvimento desktop você pode forçar o tamanho via DevTools (Device Mode) para ver o layout real.

---

## Design system

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `brand` | `#020788` | Azul institucional Teknisa — destaques, ícones ativos, botões primários, linhas de progresso |
| `brand-light` | `#1a1fa8` | Hover de botões e estados ativos |
| `brand-lighter` | `#3b42c4` | Acentos |
| `brand-subtle` | `#e8e9f8` | Backgrounds de chips e ícones em estado idle |
| `brand-ghost` | `#f0f1fc` | Hover de cards |
| `surface-base` | `#ffffff` | Cards, frames, áreas de tela |
| `surface-raised` | `#f8f9fa` | Background da aplicação |
| `frame-body` | `#e2e5ea` | Carcaça dos dispositivos |
| `frame-screen` | `#d0d4db` | Bezel interno dos dispositivos |
| `frame-bezel` | `#c8cdd6` | Detalhes (base de monitor/totem, botões laterais de mobile) |
| `success / warning / info / danger` | `#16a34a / #d97706 / #0284c7 / #dc2626` | Estados semânticos |

### Tipografia

- **Sora** — display, títulos, números
- **Rubik** — UI, corpo, labels

Escala (definida em `tailwind.config.ts`):

| Token | Tamanho / peso | Uso |
|---|---|---|
| `display-2xl` | 4.5rem / 700 | Hero principal |
| `display-xl` | 3.5rem / 700 | Título de segmento |
| `display-lg` | 2.5rem / 600 | Título de solução |
| `heading-xl` | 1.75rem / 600 | Subtítulos |
| `heading-lg` | 1.375rem / 500 | Labels de seção |
| `body-lg` | 1.125rem / 400 | Descrições |
| `body-md` | 1rem / 400 | Corpo padrão |
| `label-sm` | 0.875rem / 500 | Labels, badges |
| `caption` | 0.75rem / 400 | Legendas, hints |

> Mínimo em tela: 16 px (UI), 24 px (títulos de card), 36 px (títulos de segmento) — adequado para a distância de leitura de uma TV.

### Sombras e raios

| Token | Valor |
|---|---|
| `shadow-frame` | `0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)` |
| `shadow-card` | `0 2px 12px rgba(0,0,0,0.06)` |
| `shadow-card-hover` | `0 8px 28px rgba(2,7,136,0.12)` |
| `shadow-brand` | `0 4px 20px rgba(2,7,136,0.25)` |
| `rounded-frame` | 20 px |
| `rounded-frame-inner` | 14 px |
| `rounded-device` | 28 px |

---

## Sistema de animações

Todas as variantes vivem em `lib/animations.ts` e devem ser reutilizadas. Easing padrão para entradas: `[0.16, 1, 0.3, 1]` (spring-like). Saídas usam `easeOut`.

| Variante | Aplicação |
|---|---|
| `fadeIn` / `fadeInUp` / `fadeInDown` | Entradas suaves de elementos |
| `scaleIn` | Cards, badges, ícones |
| `slideFromRight` / `slideFromLeft` / `slideFromTop` / `slideFromBottom` | Companions, toasts, gavetas |
| `staggerContainer` / `staggerContainerSlow` | Grids e listas |
| `pageTransition` | Trocas de visão HOME ↔ SEGMENT ↔ SOLUTION |
| `pulseRing` | Anel pulsante do PulsingDot |
| `cardPress` | Toque em card (`whileTap`, `whileHover`) |

### Durações de referência

- **Micro:** 150–200 ms
- **Transição:** 300–400 ms
- **Entrada de cena:** 500–700 ms
- **Feedback de toque:** < 100 ms

---

## Soluções e fluxos

O painel cobre **8 grupos** (6 ativos + 2 placeholders v2) e **21 soluções** com fluxos de 3 a 5 etapas cada.

### Grupos

| Grupo | Soluções | Status |
|---|---|---|
| **Frente de Loja** | TAA, PDV Novo, SmartPOS, Cardápio Digital, QuickPass | v1 |
| **TecFood** | Cardápio Inteligente, MyQuest, MyMenu, Approve, WasteControl | v1 |
| **ERP Backoffice** | Rotina Fiscal, Rotina Rastreabilidade, App Rotinas de Estoque | v1 |
| **Pessoas e RH** | Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva (IA), Assistente de Criação de Regras (IA) | v1 |
| **Supply e Compras** | Mercadum, App Comercial | v1 |
| **CRM** | CRM Premium | v1 |
| **IA** | — | v2 (placeholder "Em breve" na grade) |
| **Gestão Corporativa** | — | v2 (placeholder "Em breve" na grade) |

### Anatomia de uma solução

```ts
interface Solution {
  id: string;                      // 'pdv-novo'
  segment: SolutionSegment;        // 'frente-de-loja'
  name: string;                    // 'PDV Novo'
  tagline: string;                 // 'Caixa de loja repaginado'
  description: string;             // 2–3 frases
  device: SolutionDevice;          // 'desktop' | 'mobile' | 'tablet' | 'pos-terminal' | 'kiosk'
  icon: string;                    // nome do ícone Lucide
  tags: string[];
  badges?: ('IA' | 'Reforma Tributária' | 'Em breve')[];
  companions?: CompanionType[];
  status: 'ready' | 'in-progress' | 'placeholder';
}
```

### Anatomia de uma etapa de fluxo

```ts
interface FlowStep {
  id: string;
  label: string;                   // exibido no StepIndicator
  tooltip?: string;                // ação esperada → vai no FlowGuide
  highlightArea?: {                // PulsingDot em coordenadas % do device frame
    x: number; y: number;
    width: number; height: number;
  };
  companions?: CompanionType[];    // elementos visuais que entram nessa etapa
  duration?: number;               // ms (autoplay opcional)
}
```

### Destaques setoriais

- **Rotina Fiscal** demonstra explicitamente a preparação para a **Reforma Tributária** (IBS, CBS, IS, Split Payment) com badge dedicada e tela de comparativo regime atual × novo modelo.
- **Análise Preditiva** e **Assistente de Criação de Regras** ficam dentro de Pessoas e RH mas trazem badge `IA` no card e na tela de demo.
- **TAA** usa moldura de totem (`KioskFrame`) e **PDV Novo** usa terminal com leitor de cartão acoplado (`POSTerminalFrame` + companion `POSCardReader`).

---

## Sistema de molduras (device frames)

Cada solução é renderizada dentro do frame correto para o seu contexto. Todos compartilham:

- Carcaça em cinza claro moderno (`#e2e5ea`), sem preto, sem efeito de vidro
- Bezel interno em `#d0d4db`, área de tela `relative` (para posicionamento de PulsingDot por coordenadas %)
- `shadow-frame` para profundidade sem peso

| Frame | Proporção | Características |
|---|---|---|
| `DesktopFrame` | 16:10 | Monitor com base fina, barra de URL simulada |
| `MobileFrame` | 9:19.5 | Botões laterais sutis, câmera frontal discreta |
| `TabletFrame` | 3:4 (portrait) ou 4:3 (landscape) | Bordas finas, câmera no topo |
| `POSTerminalFrame` | 16:10 + teclado | Display + grid 4×3 de teclas numéricas |
| `KioskFrame` | 9:16 | Totem com base de suporte e logo na parte inferior |

Resolução automática via `SolutionFrame device={solution.device}>` ou import direto.

---

## Componentes UI de fluxo

| Componente | Papel |
|---|---|
| `PulsingDot` | Indicador "toque aqui" posicionado em coordenadas % sobre o device frame. Variantes `dot` (só ponto) e `area` (área destacada + ponto). |
| `StepIndicator` | Barra de progresso no topo da demo. Dots com 3 estados (futuro / ativo / concluído), linha de progresso animada, retrocesso clicável. |
| `FlowGuide` | Card fixo com ícone + label da etapa + tooltip + seta animada. Troca de mensagem com `AnimatePresence mode="wait"`. |
| `SimulatedNotification` | Toast simulando notificação do sistema. Tipos `success / warning / info`, auto-dismiss 3 s. Use o wrapper `NotificationStack` para posicionar fixo. |
| `LoadingBar` | Barra fina no topo da tela do frame, simula carregamento entre etapas (400–800 ms). |
| `ConfirmationFeedback` | Tela final com check escalando, ring pulsante e dois CTAs ("Refazer" e "Voltar às soluções"). |

---

## Companions

Elementos visuais que aparecem **ao redor** do device frame para contextualizar a solução. Animam de entrada, nunca sobrepõem o frame e são acionados por etapa via `FlowStep.companions`.

| Componente | Aplicação | Entrada |
|---|---|---|
| `POSCardReader` | PDV, SmartPOS | Slide from right + fade |
| `OrderTicket` | PDV, TAA, Cardápio Digital | Drop + fade |
| `KitchenDisplay` | TecFood, Approve | Slide from top |
| `MiniDashboard` | CRM, ERP, RH | Scale + fade |
| `StockIndicator` | Estoque, WasteControl | Slide from bottom |
| `EmployeeCard` | Portal Gestor, Portal Funcionário | Flip + fade |
| `SimulatedNotification` | Qualquer fluxo com confirmação | Slide from top-right |
| `FiscalBadge` | Rotina Fiscal | Pulse + fade |

---

## Otimização para TV touch

| Métrica | Valor |
|---|---|
| Viewport alvo | 1920×1080 (landscape) |
| Cursor | desabilitado (`cursor: none`) |
| Touch action | `manipulation` em todos os interativos |
| Botão de ação primária | ≥ 64 px de altura, ≥ 160 px de largura |
| Card clicável | ≥ 120 px de altura |
| Botão Voltar | ≥ 56×56 px |
| Idle timeout | 90 s sem interação → overlay; +5 s → volta à HOME |
| Feedback de toque | `active:scale-95` + spring no card |
| Code splitting | mockups carregados com `dynamic()` (Sprint 6+) |

---

## Princípios de implementação

1. **Mostrar, não explicar.** Cada solução comunica por experiência; texto descritivo é exceção.
2. **Diferenciação por solução.** Nenhuma solução pode parecer "o mesmo layout com texto diferente" — varia frame, companions, posição na cena, animação de entrada e ênfase do fluxo.
3. **Dados realistas.** Nomes de pratos reais, valores plausíveis, terminologia correta do setor (food service, fiscal, RH).
4. **Zero emojis.** Todos os ícones são Lucide React.
5. **Fluxos fora dos componentes.** Definidos em `data/flows/*.ts`, nunca embutidos no mockup.
6. **Companions ficam fora do frame.** Sempre `position: absolute` ou em grid lateral.
7. **PulsingDot em coordenadas %.** Sempre relativo ao device frame, nunca em pixels absolutos.
8. **AnimatePresence com `mode="wait"`** em toda transição de página/etapa.
9. **Performance.** Animar `transform` e `opacity` (GPU); evitar animações de `height`/`width`. Imagens via `next/image`.
10. **Acessibilidade mínima.** `aria-label` em todos os botões, focus ring visível, contraste WCAG AA nos textos principais.

---

## Roadmap

O projeto é entregue em sprints incrementais; cada sprint termina com tela navegável.

| Sprint | Entrega | Status |
|---|---|---|
| **1** | Fundação — design tokens, animations, data catalog, store, hooks | ✅ |
| **2** | HOME — grade 4×2 dos 8 grupos, grade de soluções, breadcrumb nav, idle reset | ✅ |
| **3** | Device frames — Desktop, Mobile, Tablet, POSTerminal, Kiosk | ✅ |
| **4** | UI de fluxo — PulsingDot, StepIndicator, FlowGuide, SimulatedNotification, LoadingBar, ConfirmationFeedback | ✅ |
| **5** | Companions — POSCardReader, OrderTicket, KitchenDisplay, MiniDashboard, StockIndicator, EmployeeCard, FiscalBadge | ✅ |
| **6** | Mockups por grupo (21 soluções: Frente de Loja, TecFood, ERP, RH, Supply, CRM) | ✅ |
| **7** | Refinamento — timing, performance, dados, touch targets, idle | 🔜 |

---

## Checklist de qualidade por solução

Antes de marcar uma solução como pronta:

- [ ] Device frame correto para o contexto
- [ ] Dados do mockup realistas, com terminologia do produto
- [ ] 3–5 etapas de fluxo bem definidas em `data/flows/`
- [ ] `PulsingDot` aparece na área correta de cada etapa
- [ ] `FlowGuide` orienta a ação esperada em cada etapa
- [ ] Pelo menos 1 companion contextual animado
- [ ] Animação de entrada diferente das outras soluções do mesmo grupo
- [ ] Transição entre etapas sem flicker
- [ ] Última etapa com `ConfirmationFeedback`
- [ ] Botão Voltar visível e funcional (≥ 56 px)
- [ ] Funciona em 1920×1080
- [ ] Touch targets ≥ 56 px
- [ ] Zero emojis

---

## Convenções

### Nomenclatura

- Componentes: `PascalCase`
- Hooks: `camelCase` com prefixo `use`
- Variantes Framer: `camelCase` (`fadeInUp`, `scaleIn`)
- IDs de solução e segmento: `kebab-case` (`pdv-novo`, `frente-de-loja`, `pessoas-rh`)
- Arquivos: `PascalCase` para componentes, `camelCase` para utils/hooks

### Commit

- Sem coautoria. Commits são autorais únicos.
- Mensagens curtas e claras, focadas no *porquê* da mudança.
- Prefira novos commits a `git commit --amend` em commits já publicados.

---

## Sobre

A Teknisa é uma empresa brasileira com mais de 34 anos de mercado, referência em software para food service, refeições coletivas, varejo alimentar, restaurantes, gestão operacional, ERP e HCM. Atende clientes como GRSA, Sapore, Sodexo, Madero e LSG SkyChefs, com presença em 6 países, 20 mil instalações e mais de 65 mil usuários ativos. Este painel é a vitrine interativa dessa plataforma.
