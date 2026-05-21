# CLAUDE.md — Teknisa Interactive Showcase

> Documento de referência técnica e visual para o desenvolvimento do painel interativo de soluções Teknisa. Este arquivo deve ser consultado antes de qualquer decisão de implementação, layout ou animação.

---

## 1. Visão Geral do Projeto

### O que é

Um **painel interativo de soluções Teknisa** pensado para rodar em **TV touch** (tipicamente 55"–75" em modo paisagem), utilizado em contextos de **showroom, feiras, demonstrações comerciais e ambientes institucionais**.

O painel funciona como uma vitrine de produto: o usuário navega por segmentos, seleciona uma solução e interage com um **fluxo demonstrativo simulado** daquele sistema — com telas, animações, transições, tooltips e microinterações que comunicam o valor do produto sem depender de explicação verbal.

### O que não é

- Não é uma reprodução fiel dos sistemas (não é um storybook nem um protótipo funcional real).
- Não é uma aplicação web convencional com múltiplas abas ou navegação por URL.
- Não é uma apresentação em slides estática.
- Não é um vídeo ou GIF loop.

### Princípio central

> **"Mostrar antes de explicar."**
> Cada solução deve comunicar sua proposta de valor através da experiência interativa, não através de texto descritivo.

---

## 2. Contexto da Empresa

**Teknisa** é uma empresa brasileira com mais de 34 anos de mercado, referência em software para **food service, refeições coletivas, varejo alimentar, restaurantes, gestão operacional, ERP e HCM**. Atende clientes como GRSA, Sapore, Sodexo, Madero e LSG SkyChefs, com presença em 6 países, 20 mil instalações e mais de 65 mil usuários ativos.

### Segmentos e agrupamentos para o painel

O painel deve usar **exatamente os nomes e agrupamentos do site/produto Teknisa**, conforme a estrutura "Soluções por área da operação". São **8 grupos**, organizados em grade 4×2 na tela HOME:

| Grupo | Nome exibido no painel | Ícone sugerido (Lucide) | Soluções do briefing que pertencem aqui |
|---|---|---|---|
| 1 | **Frente de Loja** | `Monitor` | TAA (Autoatendimento), PDV Novo, SmartPOS, Cardápio Digital, QuickPass (Cashless/Ficha) |
| 2 | **TecFood** | `Utensils` | Cardápio Inteligente, MyQuest, MyMenu, Approve, WasteControl |
| 3 | **ERP Backoffice** | `LayoutGrid` | Rotina Fiscal, Rotina Rastreabilidade, App Rotinas de Estoque, Mercadum |
| 4 | **Pessoas e RH** | `Users` | Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva, Assistente de Criação de Regras |
| 5 | **Supply e Compras** | `ShoppingCart` | Mercadum (cotações/compras), App Comercial |
| 6 | **CRM** | `Heart` | CRM Premium |
| 7 | **IA** | `Sparkles` | Análise Preditiva, Assistente de Criação de Regras (capacidades de IA) |
| 8 | **Gestão Corporativa** | `Globe` | Soluções de multiunidades/franquias (complementar) |

> **Nota de mapeamento:** As soluções do briefing foram organizadas nos grupos corretos acima. Alguns produtos (ex: Análise Preditiva, Assistente de Regras) têm natureza de IA mas vivem dentro de Pessoas e RH; devem aparecer no grupo correto com badge "IA" para indicar a capacidade. O Mercadum aparece em ERP Backoffice e Supply e Compras — priorizá-lo em **Supply e Compras** como solução principal de cotação/compra.

### Soluções por grupo (mapeamento definitivo)

**Frente de Loja** — TAA, PDV Novo, SmartPOS, Cardápio Digital, QuickPass
**TecFood** — Cardápio Inteligente, MyQuest, MyMenu, Approve, WasteControl
**ERP Backoffice** — Rotina Fiscal, Rotina Rastreabilidade, App Rotinas de Estoque
**Pessoas e RH** — Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva, Assistente de Criação de Regras
**Supply e Compras** — Mercadum, App Comercial
**CRM** — CRM Premium
**IA** — (badges em soluções com IA; grupo pode exibir capacidades transversais de IA da plataforma)
**Gestão Corporativa** — (complementar; pode ser placeholder na v1)

---

## 3. Stack Técnica

### Obrigatório

| Tecnologia | Versão recomendada | Papel |
|---|---|---|
| Next.js | 14+ (App Router) | Framework principal |
| React | 18+ | UI |
| TypeScript | 5+ | Tipagem |
| Tailwind CSS | 3.4+ | Estilização utilitária |
| Framer Motion | 11+ | Animações, transições, gestos |
| Lucide React | latest | Ícones (único sistema de ícones permitido) |

### Complementar (quando necessário)

| Tecnologia | Uso |
|---|---|
| `@fontsource/sora` | Fonte Sora (títulos) |
| `@fontsource/rubik` | Fonte Rubik (corpo e interface) |
| `clsx` + `tailwind-merge` | Composição condicional de classes |
| `zustand` | Estado global simples (navegação, progresso de fluxo) |
| `react-use` | Hooks utilitários (idle timer, tamanho de tela) |

### Proibido

- `styled-components` ou `emotion` (usar Tailwind)
- Qualquer biblioteca de ícones além de Lucide React
- Emojis como elementos visuais funcionais
- `react-router-dom` (usar Next.js routing)
- Bibliotecas de animação além de Framer Motion (ex: GSAP, AOS, animate.css)

---

## 4. Estrutura de Pastas

```
/
├── app/
│   ├── layout.tsx              # Root layout, fontes, providers
│   ├── page.tsx                # Entry point → redireciona para /showcase
│   └── showcase/
│       ├── page.tsx            # Tela principal do painel (Home)
│       └── [segment]/
│           └── [solution]/
│               └── page.tsx   # Tela de demo da solução
├── components/
│   ├── layout/
│   │   ├── ShowcaseNav.tsx     # Navegação por segmento
│   │   ├── BackButton.tsx      # Botão voltar (touch-friendly)
│   │   └── IdleReset.tsx       # Reset automático após inatividade
│   ├── home/
│   │   ├── HeroSection.tsx     # Logo + tagline animada
│   │   ├── SegmentGrid.tsx     # Grade de segmentos
│   │   └── SolutionGrid.tsx    # Cards de soluções por segmento
│   ├── mockups/
│   │   ├── frames/
│   │   │   ├── DesktopFrame.tsx
│   │   │   ├── MobileFrame.tsx
│   │   │   ├── TabletFrame.tsx
│   │   │   ├── POSTerminalFrame.tsx   # Terminal PDV
│   │   │   └── KioskFrame.tsx         # Totem autoatendimento
│   │   ├── frente-de-loja/
│   │   │   ├── TAA/                   # Terminal de Autoatendimento
│   │   │   ├── PDVNovo/
│   │   │   ├── SmartPOS/
│   │   │   ├── CardapioDigital/
│   │   │   └── QuickPass/
│   │   ├── tecfood/
│   │   │   ├── CardapioInteligente/
│   │   │   ├── MyQuest/
│   │   │   ├── MyMenu/
│   │   │   ├── Approve/
│   │   │   └── WasteControl/
│   │   ├── erp-backoffice/
│   │   │   ├── RotinaFiscal/
│   │   │   ├── RotinaRastreabilidade/
│   │   │   └── AppRotinasEstoque/
│   │   ├── pessoas-rh/
│   │   │   ├── PortalGestor/
│   │   │   ├── PortalFuncionario/
│   │   │   ├── MesaDeOperacoes/
│   │   │   ├── AnalisePreditiva/
│   │   │   └── AssistenteCriacaoRegras/
│   │   ├── supply-compras/
│   │   │   ├── Mercadum/
│   │   │   └── AppComercial/
│   │   ├── crm/
│   │   │   └── CRMPremium/
│   │   ├── ia/
│   │   │   └── (capacidades transversais — v2)
│   │   └── gestao-corporativa/
│   │       └── (placeholder — v2)
│   ├── ui/
│   │   ├── Tooltip.tsx
│   │   ├── PulsingDot.tsx          # Indicador "clique aqui"
│   │   ├── StepIndicator.tsx       # Progresso do fluxo
│   │   ├── FlowGuide.tsx           # Guia visual de navegação
│   │   ├── SimulatedNotification.tsx
│   │   ├── LoadingBar.tsx          # Simulação de carregamento
│   │   └── ConfirmationFeedback.tsx
│   └── companions/                 # Elementos visuais complementares
│       ├── POSCardReader.tsx        # Maquininha
│       ├── OrderTicket.tsx          # Comanda/ticket
│       ├── KitchenDisplay.tsx       # Tela de cozinha
│       ├── MiniDashboard.tsx        # Mini dashboard lateral
│       ├── StockIndicator.tsx       # Indicador de estoque
│       └── EmployeeCard.tsx         # Card de funcionário (HCM)
├── data/
│   ├── solutions.ts            # Catálogo completo de soluções
│   └── flows/                  # Definição dos fluxos por solução
│       ├── frente-de-loja.ts
│       ├── tecfood.ts
│       ├── erp-backoffice.ts
│       ├── pessoas-rh.ts
│       ├── supply-compras.ts
│       └── crm.ts
├── hooks/
│   ├── useFlowController.ts    # Controle de etapas do fluxo
│   ├── useIdleTimer.ts         # Reset por inatividade
│   └── useTouchOptimized.ts    # Ajustes para touch
├── lib/
│   ├── animations.ts           # Variantes Framer Motion reutilizáveis
│   └── tokens.ts               # Design tokens (cores, espaçamentos)
├── public/
│   ├── logo-teknisa.svg
│   └── logo-teknisa-white.svg
└── styles/
    └── globals.css             # Reset + variáveis CSS + fontes
```

---

## 5. Design Tokens e Identidade Visual

### Paleta de cores

```ts
// lib/tokens.ts
export const colors = {
  // Azul institucional Teknisa
  brand: {
    DEFAULT: '#020788',
    light: '#1a1fa8',
    lighter: '#3b42c4',
    subtle: '#e8e9f8',
    ghost: '#f0f1fc',
  },

  // Neutros (interface clara)
  neutral: {
    50:  '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },

  // Semânticas
  success: '#16a34a',
  warning: '#d97706',
  danger:  '#dc2626',
  info:    '#0284c7',

  // Superfícies
  surface: {
    base:    '#ffffff',
    raised:  '#f8f9fa',
    overlay: 'rgba(255,255,255,0.92)',
  },

  // Molduras de dispositivos
  frame: {
    body:    '#e2e5ea',
    screen:  '#d0d4db',
    shadow:  'rgba(0,0,0,0.08)',
    bezel:   '#c8cdd6',
  },
}
```

### Tipografia

```css
/* globals.css */

/* Títulos: Sora */
/* Corpo e UI: Rubik */

:root {
  --font-display: 'Sora', sans-serif;
  --font-ui: 'Rubik', sans-serif;
}

/* Escala tipográfica */
/* display-2xl: 4.5rem / 700 — Hero principal */
/* display-xl:  3.5rem / 700 — Título de segmento */
/* display-lg:  2.5rem / 600 — Título de solução */
/* heading-xl:  1.75rem / 600 — Subtítulo */
/* heading-lg:  1.375rem / 500 — Label de seção */
/* body-lg:     1.125rem / 400 — Descrição */
/* body-md:     1rem / 400     — Corpo padrão */
/* label-sm:    0.875rem / 500 — Labels, badges */
/* caption:     0.75rem / 400  — Legendas, hints */
```

### Configuração Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#020788',
          light: '#1a1fa8',
          lighter: '#3b42c4',
          subtle: '#e8e9f8',
          ghost: '#f0f1fc',
        },
        frame: {
          body: '#e2e5ea',
          screen: '#d0d4db',
          bezel: '#c8cdd6',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        ui: ['Rubik', 'sans-serif'],
      },
      boxShadow: {
        'frame': '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        'card':  '0 2px 12px rgba(0,0,0,0.06)',
        'brand': '0 4px 20px rgba(2,7,136,0.25)',
      },
      borderRadius: {
        'frame': '20px',
        'frame-inner': '14px',
        'device': '28px',
      },
    },
  },
}
```

---

## 6. Estrutura de Dados

### Tipo base de solução

```ts
// data/solutions.ts

export type SolutionDevice =
  | 'desktop'
  | 'mobile'
  | 'tablet'
  | 'pos-terminal'
  | 'kiosk'
  | 'split';  // layout dividido (mockup + companion)

export type SolutionSegment =
  | 'frente-de-loja'
  | 'tecfood'
  | 'erp-backoffice'
  | 'pessoas-rh'
  | 'supply-compras'
  | 'crm'
  | 'ia'
  | 'gestao-corporativa';

export interface FlowStep {
  id: string;
  label: string;               // Exibido no StepIndicator
  tooltip?: string;            // Dica para o usuário
  highlightArea?: {            // Área pulsante que indica onde clicar
    x: number;
    y: number;
    width: number;
    height: number;
  };
  companions?: CompanionType[]; // Elementos visuais que aparecem nessa etapa
  duration?: number;           // ms para auto-avançar (se autoPlay)
}

export interface Solution {
  id: string;
  segment: SolutionSegment;
  name: string;
  tagline: string;             // Frase curta de posicionamento
  description: string;         // Descrição 2–3 frases
  device: SolutionDevice;
  icon: LucideIconName;        // Nome do ícone Lucide
  accentColor?: string;        // Cor de destaque personalizada (opcional, default: brand)
  tags: string[];              // Ex: ['PDV', 'Touch', 'Frente de Caixa']
  flowSteps: FlowStep[];
  companions?: CompanionType[];
  figmaRef?: string;           // URL de referência (apenas para dev)
  status: 'ready' | 'in-progress' | 'placeholder';
}
```

### Catálogo de soluções (estrutura)

```ts
export const segments: Segment[] = [
  {
    id: 'frente-de-loja',
    label: 'Frente de Loja',
    description: 'PDV, autoatendimento e experiência de compra',
    icon: 'Monitor',
    color: '#020788',
    solutions: ['taa', 'pdv-novo', 'smart-pos', 'cardapio-digital', 'quickpass']
  },
  {
    id: 'tecfood',
    label: 'TecFood',
    description: 'Gestão especializada em refeições coletivas',
    icon: 'Utensils',
    color: '#020788',
    solutions: ['cardapio-inteligente', 'myquest', 'mymenu', 'approve', 'waste-control']
  },
  {
    id: 'erp-backoffice',
    label: 'ERP Backoffice',
    description: 'Gestão fiscal, estoque e rastreabilidade',
    icon: 'LayoutGrid',
    color: '#020788',
    solutions: ['rotina-fiscal', 'rotina-rastreabilidade', 'app-rotinas-estoque']
  },
  {
    id: 'pessoas-rh',
    label: 'Pessoas e RH',
    description: 'Gestão de pessoas, ponto e operações de RH',
    icon: 'Users',
    color: '#020788',
    solutions: ['portal-gestor', 'portal-funcionario', 'mesa-operacoes', 'analise-preditiva', 'assistente-regras']
  },
  {
    id: 'supply-compras',
    label: 'Supply e Compras',
    description: 'Cotações, compras e gestão de fornecedores',
    icon: 'ShoppingCart',
    color: '#020788',
    solutions: ['mercadum', 'app-comercial']
  },
  {
    id: 'crm',
    label: 'CRM',
    description: 'Fidelidade, jornada do cliente e campanhas',
    icon: 'Heart',
    color: '#020788',
    solutions: ['crm-premium']
  },
  {
    id: 'ia',
    label: 'IA',
    description: 'Inteligência artificial aplicada ao food service',
    icon: 'Sparkles',
    color: '#020788',
    solutions: [] // v2 — capacidades transversais de IA
  },
  {
    id: 'gestao-corporativa',
    label: 'Gestão Corporativa',
    description: 'Multiunidades, franquias e BI',
    icon: 'Globe',
    color: '#020788',
    solutions: [] // v2 — placeholder
  }
]
```

---

## 7. Arquitetura de Navegação

### Estados globais (Zustand)

```ts
interface ShowcaseStore {
  // Navegação
  activeSegment: SolutionSegment | null;
  activeSolution: string | null;

  // Fluxo
  currentStep: number;
  totalSteps: number;
  isAutoPlaying: boolean;

  // UI
  showTooltip: boolean;
  idleSeconds: number;

  // Actions
  selectSegment: (id: SolutionSegment) => void;
  selectSolution: (id: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetFlow: () => void;
  goHome: () => void;
}
```

### Fluxo de navegação

```
[HOME]
  → Tela inicial com logo Teknisa, tagline animada e grade de segmentos
  
  → [SEGMENTO]
      → Ao tocar num segmento, a tela faz transição para a grade de soluções
      → Cards das soluções aparecem com stagger animation
      
      → [SOLUÇÃO / DEMO]
          → Mockup da solução em fullscreen (com moldura de dispositivo)
          → StepIndicator no topo (progresso do fluxo)
          → Tooltips e highlights visuais guiam o usuário
          → Ao final do fluxo, confirmação visual + botão "Explorar outra solução"
          → Botão "Voltar" sempre visível (touch-friendly, canto superior esquerdo)

[IDLE RESET]
  → Após 90 segundos sem interação, volta animadamente para a HOME
  → Exibe overlay sutil de "Toque para explorar"
```

---

## 8. Sistema de Molduras (Device Frames)

### Princípios de design das molduras

- **Cor base:** cinza claro (`#e2e5ea`) — moderno, não chama atenção para o dispositivo
- **Bordas arredondadas:** generosas, mas não exageradas
- **Sem reflexo de tela ou efeitos de vidro pesados** — mantém foco no conteúdo
- **Sombra suave:** `0 20px 60px rgba(0,0,0,0.10)` — profundidade sem peso
- **Proporção real:** cada frame deve usar proporções que lembrem o dispositivo real

### Especificações por dispositivo

#### `DesktopFrame`
- Monitor com base fina
- Proporção 16:10
- Área de tela com `border-radius: 4px`
- Cor: `#e2e5ea` para carcaça, `#d0d4db` para bordas

#### `MobileFrame`
- Smartphone fino, sem notch exagerado
- Proporção 9:19.5
- Câmera frontal como ponto discreto
- Botões laterais sutis

#### `TabletFrame`
- Tablet sem case
- Proporção 4:3 ou 3:4 (portrait)
- Bordas finas

#### `POSTerminalFrame`
- Terminal PDV com display + teclado numérico abaixo
- Base com leitor de cartão
- Companion: `POSCardReader` ao lado

#### `KioskFrame`
- Totem vertical
- Moldura mais robusta, lembra um totem real
- Proporção 9:16

---

## 9. Componentes Visuais Complementares (Companions)

Elementos visuais que **aparecem ao redor do mockup** para contextualizar o uso da solução. Devem aparecer com animações de entrada suaves e serem sutis — enriquecem sem poluir.

### Catálogo de companions

| Componente | Quando usar | Animação de entrada |
|---|---|---|
| `POSCardReader` | PDV, SmartPOS | Slide from right + fade |
| `OrderTicket` | PDV Novo, TAA, Cardápio Digital | Drop + fade |
| `KitchenDisplay` | TecFood, Approve | Slide from top |
| `MiniDashboard` | CRM, ERP, HCM | Scale + fade |
| `StockIndicator` | Rotinas Estoque, WasteControl | Slide from bottom |
| `EmployeeCard` | Portal Gestor, Portal Funcionário | Flip + fade |
| `SimulatedNotification` | Qualquer fluxo com confirmação | Slide from top-right |
| `FiscalBadge` | Rotina Fiscal | Pulse + fade |

### Estrutura de um companion

```tsx
// Exemplo: OrderTicket
interface OrderTicketProps {
  items: { name: string; qty: number; price: number }[];
  total: number;
  visible: boolean;  // Controla entrada/saída animada
  step: number;      // Reage ao passo atual do fluxo
}
```

---

## 10. Sistema de Animações

### Princípios

1. **Animações têm propósito** — nunca decorativas por si só
2. **Duração coerente** — micro: 150–200ms | transição: 300–400ms | entrada de cena: 500–700ms
3. **Easing** — usar `[0.16, 1, 0.3, 1]` (spring-like) para entradas, `easeOut` para saídas
4. **Stagger** — cards e listas sempre em stagger (50–80ms por item)
5. **Feedback imediato** — toda ação touch deve ter resposta visual em < 100ms

### Variantes Framer Motion reutilizáveis

```ts
// lib/animations.ts

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}

export const pageTransition = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 1.02, transition: { duration: 0.25 } }
}

// Pulsação do indicador "clique aqui"
export const pulseRing = {
  animate: {
    scale: [1, 1.4, 1],
    opacity: [0.8, 0, 0.8],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
  }
}
```

### Microinterações por ação

| Ação | Animação |
|---|---|
| Toque em card de segmento | Scale 0.97 → 1.0 (spring) + ripple sutil |
| Toque em solução | Scale 0.96 + flash de brand color |
| Avançar etapa do fluxo | Slide horizontal (conteúdo) + StepIndicator atualiza |
| Confirmar ação simulada | Check icon com scale bounce + cor success |
| Carregar tela | Barra de progresso brand color (500ms) |
| Notificação simulada | Slide from top-right + auto-dismiss 3s |
| Tooltip aparecer | FadeIn + scale 0.95 → 1 |
| Voltar | Slide from left |
| Idle overlay | FadeIn gradual (após 90s) |

---

## 11. Componentes UI Reutilizáveis

### `PulsingDot`

Indicador visual pulsante que marca onde o usuário deve tocar. Deve ser visível, mas não agressivo.

```tsx
// Composição: círculo externo pulsando + ponto interno fixo
// Cor: brand DEFAULT (#020788)
// Tamanho: 40px (toque confortável em touch)
// Pulse: scale 1 → 1.6, opacity 0.6 → 0, loop infinito
```

### `StepIndicator`

Barra de progresso do fluxo com labels das etapas.

```tsx
// Posição: topo da tela de demo, abaixo do header
// Layout: dots conectados por linha, com label abaixo de cada dot
// Dot ativo: brand color sólido
// Dot concluído: brand color + check
// Dot futuro: neutral 200
// Linha de progresso: preenchimento animado brand color
```

### `FlowGuide`

Card sutil no canto da tela que indica a ação atual esperada do usuário.

```tsx
// Posição: bottom-left fixo
// Conteúdo: ícone + texto curto ("Toque no botão Confirmar")
// Background: branco com borda brand/10
// Aparece e desaparece com fadeIn/fadeOut
// Auto-atualiza conforme o passo do fluxo
```

### `SimulatedNotification`

Notificação que aparece simulando o sistema notificando o usuário.

```tsx
// Posição: top-right
// Tipos: success, warning, info
// Auto-dismiss: 3 segundos
// Animação: slide from right + bounce
```

### `LoadingBar`

Barra de carregamento que simula ações do sistema.

```tsx
// Full-width na parte superior da tela simulada
// Duração: 400–800ms
// Cor: brand DEFAULT
// Aparece antes de cada transição de tela simulada
```

---

## 12. Fluxos por Solução

### Diretrizes gerais de fluxo

Cada solução deve ter **3 a 5 etapas** bem definidas que demonstrem o valor central do produto. O fluxo deve ser linear (pode ter bifurcação visual, mas sem lógica condicional complexa).

---

### Frente de Loja — Fluxos

#### TAA (Terminal de Autoatendimento)
- **Moldura:** KioskFrame
- **Companion:** OrderTicket + SimulatedNotification
- **Fluxo:**
  1. Tela de boas-vindas com opções (local / viagem)
  2. Seleção de categoria de produto
  3. Montagem do pedido (adicionar itens, personalizar)
  4. Resumo do pedido + confirmação
  5. Simulação de pagamento + comprovante

#### PDV Novo
- **Moldura:** POSTerminalFrame
- **Companion:** POSCardReader + OrderTicket
- **Fluxo:**
  1. Tela principal do PDV com itens do dia
  2. Adição de item ao pedido (toque no produto)
  3. Aplicação de desconto ou promoção
  4. Finalização e escolha de pagamento
  5. Confirmação e emissão de cupom

#### SmartPOS
- **Moldura:** MobileFrame (dispositivo POS portátil)
- **Companion:** POSCardReader
- **Fluxo:**
  1. Tela de venda com catálogo
  2. Seleção de produto e quantidade
  3. Tela de pagamento (cartão/PIX/dinheiro)
  4. Simulação de leitura de cartão
  5. Aprovação + recibo digital

#### Cardápio Digital
- **Moldura:** TabletFrame (mesa) ou MobileFrame
- **Companion:** SimulatedNotification (pedido na cozinha)
- **Fluxo:**
  1. Cardápio por categoria (foto dos produtos)
  2. Detalhe do item + personalização
  3. Carrinho com resumo
  4. Confirmação do pedido
  5. Status: "Pedido em preparo" (KDS companion)

#### QuickPass
- **Moldura:** MobileFrame
- **Companion:** StockIndicator (créditos/saldo)
- **Fluxo:**
  1. Login com QR ou biometria simulada
  2. Saldo e benefícios disponíveis
  3. Seleção do item/refeitório
  4. Liberação de acesso (animação de catraca/passagem)
  5. Confirmação e saldo atualizado

---

### TecFood — Fluxos

#### Cardápio Inteligente
- **Moldura:** DesktopFrame ou TabletFrame
- **Companion:** KitchenDisplay
- **Fluxo:**
  1. Tela de planejamento de cardápio semanal
  2. Adição de refeição/prato por dia
  3. Análise nutricional automática
  4. Aprovação do cardápio
  5. Publicação e distribuição

#### MyQuest
- **Moldura:** MobileFrame
- **Companion:** SimulatedNotification
- **Fluxo:**
  1. Fila virtual — check-in
  2. Posição na fila + tempo estimado
  3. Chamada para o refeitório (notificação)
  4. Confirmação de presença
  5. Avaliação da refeição

#### MyMenu
- **Moldura:** MobileFrame
- **Companion:** OrderTicket
- **Fluxo:**
  1. Cardápio do dia por refeitório
  2. Detalhes nutricionais do prato
  3. Reserva da refeição
  4. Confirmação de agendamento
  5. QR Code de acesso

#### Approve
- **Moldura:** TabletFrame ou DesktopFrame
- **Companion:** MiniDashboard (aprovações pendentes)
- **Fluxo:**
  1. Lista de solicitações pendentes
  2. Detalhe da solicitação (compra, cardápio, escala)
  3. Análise e comentários
  4. Aprovação ou reprovação com justificativa
  5. Notificação enviada ao solicitante

#### WasteControl
- **Moldura:** TabletFrame
- **Companion:** StockIndicator (sobras por categoria)
- **Fluxo:**
  1. Registro de sobras do dia (pesagem por item)
  2. Categorização (sobra limpa / resto)
  3. Comparativo com dias anteriores (gráfico)
  4. Alerta de desvio de meta
  5. Relatório gerado

---

### ERP Backoffice — Fluxos

#### Rotina Fiscal
- **Moldura:** DesktopFrame
- **Companion:** FiscalBadge (Reforma Tributária)
- **Fluxo:**
  1. Painel de obrigações fiscais do mês
  2. Destaque: nova estrutura (IBS/CBS/IS — Reforma Tributária)
  3. Validação automática de notas fiscais
  4. Apuração comparativa: regime atual vs. novo modelo
  5. Declaração/SPED gerado e enviado
- **Nota:** DEVE destacar a preparação da Teknisa para a Reforma Tributária (IBS, CBS, IS, Split Payment).

#### Rotina Rastreabilidade
- **Moldura:** DesktopFrame
- **Companion:** StockIndicator (lote rastreado)
- **Fluxo:**
  1. Busca de produto/lote
  2. Linha do tempo de movimentações
  3. Origem do produto (fornecedor → estoque → saída)
  4. Alerta de recall simulado
  5. Relatório de rastreabilidade gerado

#### App Rotinas de Estoque
- **Moldura:** MobileFrame
- **Companion:** StockIndicator
- **Fluxo:**
  1. Lista de tarefas de estoque do dia
  2. Contagem de item (input de quantidade)
  3. Divergência detectada (alerta)
  4. Registro de justificativa
  5. Contagem finalizada e sincronizada

---

### Pessoas e RH — Fluxos

#### Portal Gestor
- **Moldura:** DesktopFrame
- **Companion:** EmployeeCard + MiniDashboard
- **Fluxo:**
  1. Dashboard de equipe (indicadores de presença, escala)
  2. Gestão de escala da semana
  3. Aprovação de ponto / hora extra
  4. Solicitações pendentes
  5. Relatório exportado

#### Portal Funcionário
- **Moldura:** MobileFrame
- **Companion:** SimulatedNotification
- **Fluxo:**
  1. Login e boas-vindas com nome
  2. Espelho de ponto (marcações do mês)
  3. Solicitação de férias
  4. Status da solicitação
  5. Holerite disponível (PDF simulado)

#### Mesa de Operações
- **Moldura:** DesktopFrame (wide, dois painéis)
- **Companion:** MiniDashboard (alertas em tempo real)
- **Fluxo:**
  1. Visão geral de múltiplas unidades
  2. Alerta de absenteísmo em unidade X
  3. Ação: realocação de funcionário
  4. Confirmação e atualização do painel
  5. Log de operação registrado

#### Análise Preditiva
- **Moldura:** DesktopFrame
- **Companion:** MiniDashboard (gráficos preditivos)
- **Badge:** `IA`
- **Fluxo:**
  1. Dashboard de indicadores de RH
  2. Mapa de risco de turnover
  3. Identificação de funcionários em risco
  4. Sugestão de ação (plano de retenção)
  5. Simulação de impacto da ação

#### Assistente de Criação de Regras
- **Moldura:** DesktopFrame
- **Companion:** SimulatedNotification (regra ativada)
- **Badge:** `IA`
- **Fluxo:**
  1. Tela de regras existentes
  2. Criar nova regra (wizard com IA)
  3. Configuração de condições
  4. Preview da regra criada
  5. Ativação e confirmação

---

### Supply e Compras — Fluxos

#### Mercadum
- **Moldura:** DesktopFrame ou TabletFrame
- **Companion:** MiniDashboard (comparativo de fornecedores)
- **Fluxo:**
  1. Cotação de insumos (lista de itens)
  2. Comparativo de fornecedores (preço, prazo, avaliação)
  3. Seleção automática (menor preço / melhor avaliado)
  4. Geração de pedido de compra
  5. Envio ao fornecedor e confirmação

#### App Comercial
- **Moldura:** MobileFrame
- **Companion:** MiniDashboard (metas de vendas)
- **Fluxo:**
  1. Dashboard comercial (pedidos do dia, meta)
  2. Novo pedido: busca de cliente
  3. Seleção de produtos e quantidades
  4. Resumo e confirmação do pedido
  5. Pedido enviado + notificação

---

### CRM — Fluxos

#### CRM Premium
- **Moldura:** DesktopFrame
- **Companion:** MiniDashboard (métricas de fidelidade)
- **Fluxo:**
  1. Dashboard de clientes (métricas, gráficos)
  2. Perfil de cliente (histórico, preferências)
  3. Criação de campanha de fidelidade
  4. Configuração de oferta/desconto personalizado
  5. Preview e ativação da campanha

---

### IA — Fluxos (v2)

> Na v1, soluções com capacidade de IA (Análise Preditiva, Assistente de Regras) exibem badge `IA` no card mas pertencem ao grupo Pessoas e RH. O grupo IA como destino de navegação pode exibir um card especial mostrando as capacidades transversais de IA da plataforma Teknisa, com placeholder animado para a v2.

---

### Gestão Corporativa — Fluxos (v2)

> Placeholder para v2. O card deve estar visível na grade HOME com badge `"Em breve"` e não ser clicável ou exibir um card informativo sobre capacidades de gestão de multiunidades e franquias.

---

## 13. Tela HOME — Especificação

### Layout

A tela inicial deve ter **alto impacto visual** e ser navegável com poucos toques. Com 8 grupos, o layout deve usar uma **grade 4×2** (4 colunas, 2 linhas), que preenche bem uma tela 1920×1080 em modo paisagem.

```
┌────────────────────────────────────────────────────────┐
│  [Logo Teknisa]              [Tagline animada]          │  ← Header (10%)
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ FRENTE   │ │ TECFOOD  │ │   ERP    │ │PESSOAS   │  │  ← Linha 1 (4 cards)
│  │ DE LOJA  │ │          │ │BACKOFFICE│ │  E RH    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ SUPPLY   │ │   CRM    │ │    IA    │ │ GESTÃO   │  │  ← Linha 2 (4 cards)
│  │ E COMPRAS│ │          │ │          │ │CORPORAT. │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

> Cards de IA e Gestão Corporativa devem exibir badge `"Em breve"` ou `"v2"` se não tiverem soluções na v1, ainda assim sendo visíveis na grade (não ocultados).

### Card de segmento

- **Tamanho:** grande (touch-friendly), mínimo 200x200px
- **Conteúdo:** Ícone Lucide (48px) + nome do segmento + número de soluções + tagline curta
- **Estado hover/press:** scale sutil + sombra brand color
- **Background:** branco com borda brand/10 → on hover: brand ghost
- **Ícone:** brand color no estado default → branco on hover/active

### Transição para grade de soluções

Ao tocar num segmento:
1. O card selecionado faz scale up suave
2. Os outros cards fazem fadeOut
3. A tela "expande" para mostrar a grade de soluções (slide up)
4. Cards de solução entram em stagger

---

## 14. Tela de SOLUÇÃO/DEMO — Especificação

### Layout

```
┌───────────────────────────────────────────────┐
│ [←] [Logo] │ Segmento > Solução   [StepBar]   │  ← Header (8%)
├───────────────────────────────────────────────┤
│                                               │
│   [Companion     [   DEVICE FRAME          ]  │  ← Área de demo (84%)
│    esquerdo]     [   com mockup interativo ]  │
│                  [                         ]  │
│   [Companion     [                         ]  │
│    inferior]                                  │
│                                               │
├───────────────────────────────────────────────┤
│  [FlowGuide: "Toque em..."]  [Próxima etapa→] │  ← Footer (8%)
└───────────────────────────────────────────────┘
```

### Comportamentos

- O device frame deve ser centralizado e dimensionado para ocupar 60–75% da área disponível
- Companions aparecem nas bordas, com animação de entrada
- O botão "Próxima etapa" avança o fluxo manualmente
- O FlowGuide orienta a ação esperada (tooltip de ação)
- PulsingDot aparece sobre o elemento interativo da etapa atual
- Ao final da última etapa: tela de conclusão com checkmark animado + "Explorar outra solução"

---

## 15. Otimização para TV Touch

### Tamanhos mínimos de toque

- **Botões de ação primária:** 64px altura, 160px largura mínima
- **Cards clicáveis:** 120px altura mínima
- **Botão Voltar:** 56x56px mínimo (ícone + área de toque)
- **Dots de navegação:** 48x48px área de toque

### Tipografia para TV (à distância)

- **Título de segmento:** 2.5rem mínimo
- **Título de solução no header:** 1.75rem
- **Labels de fluxo:** 1.125rem
- **Tooltips e guias:** 1rem (nunca abaixo)

### Comportamento de idle

```ts
// hooks/useIdleTimer.ts
const IDLE_TIMEOUT = 90_000; // 90 segundos
// Após timeout: exibir overlay "Toque para explorar"
// Após 5s no overlay sem interação: voltar para HOME com animação
```

### Cursor e feedback touch

- Desabilitar cursor padrão (contexto de touch)
- Adicionar `touch-action: manipulation` em todos os elementos interativos
- Highlight de toque: usar `active:scale-95` nos cards

---

## 16. Padrões de Implementação

### Regras de componente

1. **Todo componente de mockup** recebe `step: number` como prop e reage ao step atual
2. **Toda animação de entrada** usa `AnimatePresence` com mode `"wait"` para transições limpas
3. **Companions** são sempre `position: absolute` ou em grid lateral, nunca sobrepõem o frame
4. **PulsingDot** é sempre renderizado relativo ao device frame, usando coordenadas percentuais
5. **Fluxos** são definidos em `/data/flows/*.ts` e nunca embutidos no componente do mockup

### Convenções de nomenclatura

```
Componentes: PascalCase
Hooks: camelCase com prefixo "use"
Variantes Framer: camelCase (fadeInUp, scaleIn)
IDs de solução: kebab-case ('pdv-novo', 'waste-control')
IDs de segmento: kebab-case ('tecfood', 'hcm')
Arquivos: PascalCase para componentes, camelCase para utils/hooks
```

### Performance

- Cada mockup interativo deve ser carregado com `dynamic()` do Next.js (code splitting)
- Imagens: usar `next/image` com `priority` apenas para hero
- Animações: preferir `transform` e `opacity` (GPU-accelerated) — evitar animações de `height`/`width`

### Acessibilidade (mínimo necessário em TV touch)

- Todos os botões com `aria-label`
- Focus ring visível (para eventual uso com controle remoto)
- Contraste mínimo WCAG AA nos textos principais

---

## 17. Diferenciação Visual por Solução

**REGRA CRÍTICA:** Nenhuma solução pode parecer "o mesmo layout com texto diferente". A diferenciação deve acontecer em:

| Dimensão | Como diferenciar |
|---|---|
| Device frame | Cada solução usa o frame correto para seu contexto |
| Companions | Conjunto único de elementos complementares por solução |
| Layout da cena | Posição dos companions muda (esquerda, baixo, direita, flutuante) |
| Conteúdo do mockup | Cores de destaque, dados realistas, terminologia correta do produto |
| Animação de entrada | Variar entre fadeInUp, scaleIn, slideFromRight etc. |
| Ênfase do fluxo | Cada fluxo destaca uma capacidade diferente do produto |

---

## 18. Checklist de Qualidade por Solução

Antes de considerar uma solução implementada, verificar:

- [ ] Device frame correto para o contexto
- [ ] Dados do mockup são realistas e com terminologia do produto
- [ ] 3–5 etapas de fluxo bem definidas
- [ ] PulsingDot aparece na área correta de cada etapa
- [ ] FlowGuide orienta o usuário em cada etapa
- [ ] Pelo menos 1 companion contextual
- [ ] Animação de entrada única para esta solução
- [ ] Transição entre etapas limpa (sem flicker)
- [ ] Última etapa tem tela de conclusão
- [ ] Botão Voltar funcional e visível
- [ ] Funciona bem em viewport 1920x1080 (TV padrão)
- [ ] Tamanhos de toque adequados (min 56px)
- [ ] Sem emojis — apenas ícones Lucide

---

## 19. Ordem de Implementação Recomendada

### Fase 1 — Fundação
1. Setup Next.js + Tailwind + Framer Motion + fontes
2. `globals.css` com tokens e reset
3. `lib/animations.ts` com todas as variantes
4. `lib/tokens.ts`
5. `data/solutions.ts` com catálogo completo
6. Store Zustand (`ShowcaseStore`)
7. `useIdleTimer` e `useFlowController`

### Fase 2 — Layout e Navegação
8. `app/layout.tsx` com providers
9. `HOME` — tela inicial (logo + grade de segmentos)
10. Transição para grade de soluções
11. `BackButton` e `ShowcaseNav`
12. `IdleReset` com overlay

### Fase 3 — Device Frames
13. `DesktopFrame`
14. `MobileFrame`
15. `TabletFrame`
16. `POSTerminalFrame`
17. `KioskFrame`

### Fase 4 — UI Components
18. `PulsingDot`
19. `StepIndicator`
20. `FlowGuide`
21. `SimulatedNotification`
22. `LoadingBar`
23. `ConfirmationFeedback`

### Fase 5 — Companions
24. `POSCardReader`
25. `OrderTicket`
26. `KitchenDisplay`
27. `MiniDashboard`
28. `StockIndicator`
29. `EmployeeCard`
30. `FiscalBadge`

### Fase 6 — Mockups por grupo
Implementar na ordem de prioridade comercial:

**Prioridade 1 — Frente de Loja:** PDV Novo, TAA, SmartPOS, Cardápio Digital, QuickPass
**Prioridade 2 — TecFood:** Cardápio Inteligente, MyMenu, WasteControl, MyQuest, Approve
**Prioridade 3 — ERP Backoffice:** Rotina Fiscal, App Rotinas de Estoque, Rotina Rastreabilidade
**Prioridade 4 — Pessoas e RH:** Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva, Assistente de Regras
**Prioridade 5 — Supply e Compras:** Mercadum, App Comercial
**Prioridade 6 — CRM:** CRM Premium
**v2 — IA e Gestão Corporativa:** placeholder animado na v1

### Fase 7 — Refinamento
- Ajuste de timing de animações
- Testes em viewport 1920x1080
- Otimização de performance
- Ajuste de tamanhos de toque
- Revisão de dados dos mockups

---

## 20. Notas Específicas por Solução

### Rotina Fiscal — ERP Backoffice — Reforma Tributária
O fluxo DEVE mencionar e demonstrar visualmente:
- IBS (Imposto sobre Bens e Serviços)
- CBS (Contribuição sobre Bens e Serviços)
- IS (Imposto Seletivo)
- Split Payment
- Comparativo regime atual vs. novo modelo
- Badge "Preparado para a Reforma Tributária" em destaque

### TAA — Frente de Loja — Layout em Finalização
O componente deve ser implementado com base em princípios de autoatendimento modernos, com referência visual próxima a totens de fast food. Manter flexibilidade para atualização futura.

### WasteControl — TecFood — Referência Existente
Já existe uma versão prototipada. O fluxo deve manter fidelidade ao conceito de controle de desperdício com pesagem, categorização (sobra limpa/resto) e relatório.

### Análise Preditiva e Assistente de Regras — Pessoas e RH — Badge IA
Estas soluções pertencem ao grupo **Pessoas e RH**, mas possuem forte componente de IA. Devem exibir badge `IA` no card e em destaque na tela de demo, comunicando que são capacidades potencializadas por inteligência artificial dentro da plataforma Teknisa.

### IDs de segmento — Nomenclatura correta
Os IDs de segmento no código devem seguir o padrão kebab-case dos nomes reais:
- `frente-de-loja` (não `retail`)
- `tecfood`
- `erp-backoffice` (não `erp`)
- `pessoas-rh` (não `hcm`)
- `supply-compras`
- `crm`
- `ia`
- `gestao-corporativa`

### IA e Gestão Corporativa — v2
Na v1, estes dois grupos exibem na grade HOME com visual levemente diferenciado (opacidade reduzida, badge "Em breve") e não são clicáveis. Não devem ser ocultados — a presença na grade comunica a amplitude da plataforma Teknisa.

---

## 21. Convenções de Commit

- **Sem coautoria.** Nunca adicione `Co-Authored-By: Claude ...` (ou qualquer trailer de coautoria) nas mensagens de commit deste projeto. Os commits devem aparecer como autoria única do desenvolvedor.
- Mensagens claras e concisas, focadas no *porquê* da mudança.
- Prefira criar um novo commit ao invés de `git commit --amend` em commits já publicados.

---

*Este documento deve ser mantido atualizado conforme o projeto evolui. Qualquer decisão de arquitetura, visual ou de fluxo que desvie das diretrizes aqui definidas deve ser documentada com justificativa.*

*Versão: 1.0 | Projeto: Teknisa Interactive Showcase*