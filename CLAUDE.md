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

### Lições aprendidas na v1 — iteração obrigatória

A primeira implementação validou a estrutura geral, navegação e identidade visual. Os pontos críticos a corrigir:

1. **Header HOME — rotação de soluções:** o componente rotativo atual é lento, visualmente pobre e não agrega. Substituir por experiência de impacto real (ver seção 13).
2. **StepIndicator eliminado:** a barra de etapas ocupa espaço e é visualmente fraca. Removida completamente. O guia de fluxo migra para sistema de tooltip contextual (ver seção 10-B).
3. **Sistema de Tooltip/Tour refatorado:** precisa funcionar como driver.js/intro.js — overlay com spotlight, seta apontando para o elemento, texto contextual, navegação entre passos. É o coração da experiência interativa.
4. **Mockups maiores:** devem ocupar o máximo possível da área disponível. Nada de mockup pequeno centrado com muito espaço vazio ao redor.
5. **Logo Teknisa obrigatória:** usar `<Image src="/logo-teknisa.svg" />` em vez de texto em todos os contextos. Nunca escrever "Teknisa" como texto onde a logo couber.
6. **Companions refatorados:** ou têm qualidade visual premium integrada ao mockup, ou são removidos. Companions ruins pioram mais do que ajudam.
7. **Aproveitamento máximo de tela:** viewport 1920×1080 deve ser aproveitado de forma agressiva. Padding excessivo é desperdício.
8. **Molduras de device redesenhadas:** mais realistas, melhor proporcionadas, com detalhes que lembram o equipamento real (botões, câmera, indicadores), mas sempre em cinza claro.
9. **Interatividade real nos mockups:** o usuário deve clicar/tocar em elementos reais da interface simulada — botões que respondem, listas que selecionam, campos que recebem input simulado.

---

## 2. Contexto da Empresa

**Teknisa** é uma empresa brasileira com mais de 34 anos de mercado, referência em software para **food service, refeições coletivas, varejo alimentar, restaurantes, gestão operacional, ERP e HCM**. Atua em redes nacionais de food service, refeições coletivas e varejo alimentar, com presença em 6 países, 20 mil instalações e mais de 65 mil usuários ativos.

> **Nota de compliance (v13.27):** os mockups deste painel NÃO devem mencionar nomes específicos de clientes reais da Teknisa. Todo nome de comércio, marca, produto, pessoa ou local nos mockups deve ser fictício. Ver §21.10 para a lista canônica de nomes fictícios.

### Segmentos e agrupamentos para o painel

O painel deve usar **exatamente os nomes e agrupamentos do site/produto Teknisa**, conforme a estrutura "Soluções por área da operação". São **8 grupos**, organizados em grade 4×2 na tela HOME:

| Grupo | Nome exibido no painel | Ícone sugerido (Lucide) | Soluções do briefing que pertencem aqui |
|---|---|---|---|
| 1 | **Frente de Loja** | `Monitor` | TAA (Autoatendimento), PDV Novo, SmartPOS, Cardápio Digital, QuickPass (Cashless/Ficha) |
| 2 | **TecFood** | `Utensils` | Cardápio Inteligente, MyQuest, MyMenu, Approve, WasteControl |
| 3 | **ERP Backoffice** | `LayoutGrid` | Rotina Fiscal, Rotina Rastreabilidade, App Rotinas de Estoque, Mercadum |
| 4 | **Pessoas e RH** | `Users` | Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva |
| 5 | **Supply e Compras** | `ShoppingCart` | Mercadum (cotações/compras), App Comercial |
| 6 | **CRM** | `Heart` | CRM Premium |
| 7 | **IA** | `Sparkles` | Análise Preditiva (capacidades de IA) |
| 8 | **Gestão Corporativa** | `Globe` | Soluções de multiunidades/franquias (complementar) |

> **Nota de mapeamento:** As soluções do briefing foram organizadas nos grupos corretos acima. Alguns produtos (ex: Análise Preditiva) têm natureza de IA mas vivem dentro de Pessoas e RH; devem aparecer no grupo correto com badge "IA" para indicar a capacidade. O Mercadum aparece em ERP Backoffice e Supply e Compras — priorizá-lo em **Supply e Compras** como solução principal de cotação/compra.

### Soluções por grupo (mapeamento definitivo)

**Frente de Loja** — TAA, PDV Novo, SmartPOS, Cardápio Digital, QuickPass
**TecFood** — Cardápio Inteligente, MyQuest, MyMenu, Approve, WasteControl
**ERP Backoffice** — Rotina Fiscal, Rotina Rastreabilidade, App Rotinas de Estoque
**Pessoas e RH** — Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva
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
| `next/font/google` — Sora | Fonte de títulos (display) |
| `next/font/google` — Roboto | Fonte de corpo e UI (substitui Rubik a partir da v6.6) |
| `clsx` + `tailwind-merge` | Composição condicional de classes |
| `zustand` | Estado global simples (navegação, progresso de fluxo) |
| `react-use` | Hooks utilitários (idle timer, tamanho de tela) |
| **shadcn/ui** (instalado em v8) | Primitives `Button`, `Card`, `Badge`, `Separator`, `ScrollArea`, `Tooltip` em `@/components/ui/shadcn`. Variantes brand custom (`Button variant="ai"` = gradiente brand→roxo). Ver §23 |
| `class-variance-authority` | Suporte ao shadcn (composição de variantes) |
| `tailwindcss-animate` | Plugin Tailwind para keyframes do shadcn |
| `@radix-ui/react-*` | Primitives de acessibilidade do shadcn (Slot, ScrollArea, Tooltip, Separator, Dialog) |

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
/* Corpo e UI: Roboto (era Rubik até v6.5; trocado em v6.6 por preferência do cliente) */

:root {
  --font-display: 'Sora', sans-serif;
  --font-ui: 'Roboto', sans-serif;
}

/* IMPORTANTE: globals.css força Roboto em button, input, p, span, li, label,
   td, th, strong, em. Só h1-h6 e quem usa `font-display` explicitamente
   ficam em Sora. Isso garante que o "texto" do projeto seja Roboto, mesmo
   em mockups que tinham font-display em rótulos pequenos. */

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
        display: ['var(--font-display)', 'Sora', 'sans-serif'],
        ui: ['var(--font-ui)', 'Roboto', 'sans-serif'],
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
    solutions: ['portal-gestor', 'portal-funcionario', 'mesa-operacoes', 'analise-preditiva']
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

  // Fluxo — tour guiado
  currentStep: number;
  totalSteps: number;
  tourActive: boolean;       // se o tour está rodando
  tourCompleted: boolean;    // se completou todos os passos

  // UI
  idleSeconds: number;

  // Actions
  selectSegment: (id: SolutionSegment) => void;
  selectSolution: (id: string) => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  resetFlow: () => void;
  goHome: () => void;
}
```

### Fluxo de navegação

```
[HOME]
  → Logo Teknisa + área de destaque animada + grade 4×2 de grupos
  
  → [GRADE DE SOLUÇÕES do grupo]
      → Cards das soluções com stagger animation
      
      → [DEMO DA SOLUÇÃO]
          → Mockup ocupa 80–90% da área útil (fullscreen-like)
          → Tour guiado via TourTooltip inicia automaticamente
          → Overlay escurece tudo exceto o elemento alvo (spotlight)
          → Tooltip posicionado adjacente ao elemento, com seta
          → Usuário interage com o elemento destacado para avançar
          → Ao final: tela de conclusão com CTA "Explorar outra solução"
          → Botão "Voltar" sempre visível (top-left, touch-friendly)

[IDLE RESET]
  → Após 90s sem interação: overlay "Toque para explorar"
  → Após +5s: volta para HOME com pageTransition
```

---

## 8. Sistema de Molduras (Device Frames) — v2 Redesign

### Princípios obrigatórios (v2)

- **Cinza claro moderno:** carcaça `#e2e5ea`, detalhes `#d0d4db`, sombra `rgba(0,0,0,0.08)`
- **Proporções fiéis ao dispositivo real** — não distorcer aspect ratio
- **Detalhes anatômicos:** cada frame deve ter os elementos físicos do dispositivo (câmera, botões, porta, base, etc.) renderizados em SVG ou CSS — não como placeholder, mas como componente visual real
- **Tamanho máximo:** o frame deve preencher o máximo da área disponível. Nunca deixar o frame pequeno centrado com mar de espaço vazio
- **Área de tela scrollable:** a área de conteúdo dentro do frame deve ter `overflow: hidden` + `border-radius` interno para cortar a interface nos cantos
- **Sombra projetada:** `box-shadow: 0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)` — presença física sem peso visual

### Especificações por dispositivo (v2)

#### `DesktopFrame` — Monitor widescreen
```
Anatomia:
├── Painel da tela: bordas 16px, top 12px (mais fino), cinza #e2e5ea
│   ├── Câmera: ponto 6px centralizado no top bezel
│   ├── Área de tela: border-radius 4px, overflow hidden
│   └── Borda interna sutil: 1px sólido #d0d4db
├── Pescoço: haste fina centralizada (~40px altura, 20px largura), gradiente #d8dbe2→#e2e5ea
└── Base: elipse achatada (~240px × 16px), gradiente radial, #d4d7de

Proporção: 16:10 para a área de tela
Tamanho alvo: máximo que couber na área útil, respeitando margens de 24px
```

#### `MobileFrame` — Smartphone moderno
```
Anatomia:
├── Carcaça: border-radius 40px, padding 12px lateral, 16px top, 20px bottom
│   ├── Dynamic Island / câmera: pill shape centralizado, 80px × 28px, #c8cdd6, top 8px
│   ├── Área de tela: border-radius 32px, overflow hidden, fill height
│   ├── Botão volume: 2 botões lado esquerdo, 40px cada, 2px largura, #d0d4db, border-radius 2px
│   ├── Botão power: lado direito, 56px, 2px largura, #d0d4db
│   └── Barra home: pill 120px × 4px, centrado no bottom, #c8cdd6, margin 8px bottom
└── Sombra: box-shadow profunda

Proporção tela: 9:19.5
Tamanho alvo: altura ~85vh da área de demo
```

#### `TabletFrame` — Tablet landscape ou portrait
```
Anatomia:
├── Carcaça: border-radius 24px, padding 14px todos os lados
│   ├── Câmera: ponto 8px no bezel lateral (landscape) ou superior (portrait)
│   ├── Área de tela: border-radius 16px, overflow hidden
│   ├── Botão home (opcional): círculo 20px no bezel lateral
│   └── Borda interna: 1px #d0d4db
└── Sombra projetada

Proporções: 4:3 (portrait) ou 16:10 (landscape)
```

#### `POSTerminalFrame` — Terminal PDV
```
Anatomia:
├── Display principal: proporção 16:10, bezel 12px, border-radius 8px
│   └── Câmera pequena no topo
├── Corpo central: gradiente sutil, conectando display ao teclado
│   └── Logo placeholder ou slot de cartão decorativo
├── Área de teclado numérico: grid 3×4 de teclas estilizadas + teclas de função
│   ├── Teclas: border-radius 6px, background #d8dbe2, shadow inset
│   └── Teclas coloridas: verde (confirmar), vermelho (cancelar)
└── Base: suporte com inclinação visual

O display é a área interativa. O teclado é decorativo mas visualmente detalhado.
```

#### `KioskFrame` — Totem de autoatendimento
```
Anatomia:
├── Cabeçalho do totem: logo placeholder / stripe brand color
├── Display principal: proporção 9:16, bezel 16px, border-radius 12px
│   └── Câmera/sensor no topo
├── Corpo do totem: mais largo que o display, gradiente #e2e5ea→#d8dbe2
│   ├── Slot de impressão (decorativo): linha horizontal 60px × 4px
│   └── Leitor de cartão (decorativo): slot retangular
└── Base: suporte robusto, mais largo

Visual robusto mas clean — reconhecível como totem de fast food / autoatendimento
```

---

## 9. Componentes Visuais Complementares (Companions) — v2

### Filosofia v2

**Regra crítica:** companions que existiam na v1 e ficavam ruins devem ser completamente redesenhados ou removidos. Um companion só existe se elevar visualmente a cena. A decisão é: companion de alta qualidade OU sem companion (mockup maior e mais impactante).

### Padrão visual obrigatório (v2)

Todos os companions devem:
- Ter fundo branco com `border-radius: 16px` e `box-shadow: 0 4px 24px rgba(0,0,0,0.08)`
- Usar a mesma tipografia (Sora/Rubik) e paleta da interface principal
- Conter **dados simulados realistas** (não placeholders genéricos)
- Ter animação de entrada própria e reagir ao step atual do fluxo
- Nunca ter mais de 3 elementos de informação visíveis ao mesmo tempo
- **Conversar visualmente com o mockup** — usar as mesmas cores de acento, ícones e terminologia

### Catálogo revisado de companions

| Componente | Redesign v2 | Dados obrigatórios |
|---|---|---|
| `POSCardReader` | Maquininha realista com tela de status e LED | Bandeira do cartão, valor, status animado |
| `OrderTicket` | Cupom térmico com fonte mono, linhas tracejadas | Itens reais, subtotal, total, número do pedido |
| `KitchenDisplay` | Monitor de cozinha tipo KDS com fila de pedidos | Pedidos com status (novo/em preparo/pronto), timers |
| `MiniDashboard` | Card de métricas com micro gráfico sparkline | 3 KPIs relevantes ao contexto, variação % |
| `StockIndicator` | Card de estoque com barra de nível visual | Item, quantidade, unidade, status (ok/baixo/crítico) |
| `EmployeeCard` | Card de crachá digital com foto placeholder | Nome, cargo, unidade, status de turno |
| `FiscalBadge` | Badge premium com shield icon | "Preparado para Reforma Tributária 2026", IBS/CBS |

### Posicionamento dos companions

```
Layout com companion lateral direito (mais comum):
┌─────────────────────────────────────────────────┐
│  [Device Frame — 70% da largura]  [Companion]   │
│                                   [  Card 1  ]   │
│                                   [  Card 2  ]   │
└─────────────────────────────────────────────────┘

Layout com companion inferior (mobile frames):
┌──────────────────────────────────┐
│  [Device Frame — centralizado]   │
│  [altura máxima disponível]      │
└──────────────────────────────────┘
│  [Companion Card 1]  [Card 2]    │  ← row abaixo

Layout sem companion (mockup dominante):
┌─────────────────────────────────────────────────┐
│         [Device Frame — 90%+ da área]            │
└─────────────────────────────────────────────────┘
```

---

## 10. Sistema de Tour Guiado (substitui StepIndicator + FlowGuide)

### Conceito

O sistema de guia de fluxo é inspirado em **driver.js** e **intro.js**, mas implementado do zero com Framer Motion. É a peça central da experiência interativa — sem ele o painel é apenas uma galeria estática.

### Componente `TourTooltip`

```tsx
interface TourStep {
  id: string;
  // Seletor ou ref do elemento alvo dentro do mockup
  targetSelector: string;
  // Posição do tooltip em relação ao elemento
  placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-end';
  title: string;           // Título curto do passo
  description: string;     // Descrição da ação/valor
  actionLabel?: string;    // Label do botão de avanço ("Toque aqui", "Próximo", "Ver resultado")
  // Se true, o usuário deve clicar no elemento alvo para avançar (não no botão do tooltip)
  requiresInteraction?: boolean;
  // Highlight especial no elemento além do spotlight
  highlightStyle?: 'pulse' | 'ring' | 'glow';
}
```

### Comportamento do `TourOverlay`

```
1. Ao entrar na demo: TourOverlay inicia com step 0 (delay 400ms)
2. Overlay escurece o fundo: backdrop rgba(0,0,0,0.55) com blur(2px)
3. Spotlight: recorte transparente (clip-path ou box-shadow inset) revela apenas o elemento alvo
   - O recorte tem border-radius que corresponde ao elemento
   - Animação do recorte: scale de 0.8→1 com spring
4. Tooltip aparece adjacente ao spotlight:
   - Card branco, border-radius 16px, shadow proeminente
   - Seta CSS apontando para o elemento
   - Título em Sora 18px bold
   - Descrição em Rubik 15px
   - Contador "Passo X de Y" em label-sm, cor brand
   - Botão primário: avançar / interagir
   - Botão fantasma: "Pular tour"
5. Se requiresInteraction=true:
   - Botão do tooltip mostra "Toque no elemento destacado"
   - PulsingDot aparece sobre o elemento
   - Clicar no elemento faz o spotlight piscar (success) e avança
6. Transição entre steps:
   - Spotlight se move suavemente para o próximo elemento (spring animation)
   - Tooltip faz fadeOut/fadeIn com nova posição
7. Último step: "Concluído" — spotlight desaparece, overlay some, tela de conclusão aparece
```

### Anatomia visual do Tooltip

```
┌──────────────────────────────────┐
│  Passo 2 de 5                    │  ← label-sm, brand color
│                                  │
│  Adicione um produto             │  ← Sora 18px, bold, neutral-900
│                                  │
│  Toque em qualquer item do       │  ← Rubik 15px, neutral-600
│  cardápio para adicioná-lo ao    │
│  pedido. O carrinho atualiza     │
│  em tempo real.                  │
│                                  │
│  [Toque no item ↑]  [Pular]      │  ← botão primário + link fantasma
└──────────────────────────────────┘
         ▲ seta CSS apontando pro elemento
```

### Posicionamento dinâmico

O tooltip deve ser posicionado dinamicamente usando `getBoundingClientRect()` do elemento alvo dentro do device frame, com ajuste de viewport para não sair da tela.

### Regra: StepIndicator ELIMINADO

**Não existirá mais barra de steps no header da tela de demo.** O progresso é comunicado apenas pelo contador interno do tooltip ("Passo 2 de 5") e pelo comportamento natural do tour.

---

## 10-B. Sistema de Animações

### Princípios

1. **Animações têm propósito** — nunca decorativas por si só
2. **Duração coerente** — micro: 150–200ms | transição: 300–400ms | entrada de cena: 500–700ms
3. **Easing** — usar `[0.16, 1, 0.3, 1]` (spring-like) para entradas, `easeOut` para saídas
4. **Stagger** — cards e listas sempre em stagger (50–80ms por item)
5. **Feedback imediato** — toda ação touch deve ter resposta visual em < 100ms
6. **Spotlight move** — a transição do recorte de spotlight entre steps usa spring com stiffness 200, damping 30

### Variantes Framer Motion

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
export const pulseRing = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.7, 0, 0.7],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
  }
}
// Spotlight move entre steps
export const spotlightTransition = {
  type: 'spring', stiffness: 200, damping: 28, mass: 0.8
}
```

### Microinterações por ação

| Ação | Animação |
|---|---|
| Toque em card de grupo | scale 0.97→1 (spring) + brilho brand sutil |
| Toque em card de solução | scale 0.96 + flash brand color 150ms |
| Spotlight muda de step | move suave com spring + tooltip fadeOut/In |
| Elemento clicado no tour | flash success (verde) + spotlight pisca |
| Confirmar ação simulada | Check icon scale bounce + success color |
| Notificação simulada | slide from top-right + auto-dismiss 3s |
| Voltar | slide from left |
| Idle overlay | fadeIn gradual (após 90s) |

---

## 11. Componentes UI Reutilizáveis (v2)

### `TourOverlay` ← componente central v2

Gerencia todo o sistema de tour: overlay, spotlight, posicionamento dinâmico do tooltip. Deve ser um portal React renderizado fora do device frame, no root do documento.

### `TourTooltip`

Card de tooltip do tour. Recebe posição calculada, dados do step atual e callbacks.

```tsx
interface TourTooltipProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect;         // getBoundingClientRect() do elemento alvo
  onNext: () => void;
  onSkip: () => void;
  onPrev: () => void;
}
```

### `PulsingDot`

Indicador visual pulsante. Renderizado sobre o elemento alvo quando `requiresInteraction=true`.

```tsx
// Composição: 3 anéis concêntricos com delays escalonados
// Cor: brand DEFAULT (#020788)
// Tamanho: 48px área total, ponto central 12px
// Pulse: rings se expandem de 12px para 48px com opacidade 0.6→0
```

### `SimulatedNotification`

Toast que aparece simulando notificação do sistema. Não faz parte do tour — aparece como elemento diegético da interface demonstrada.

```tsx
// Posição: top-right absoluto, z-index acima do frame mas abaixo do tour overlay
// Background: branco, border-left 4px brand/success/warning
// Ícone Lucide + título + mensagem
// Auto-dismiss: 3.5s com barra de progresso na base
// Animação: slideFromRight + spring bounce
```

### `LoadingBar`

Barra de progresso horizontal no topo da área de tela do device frame, simulando carregamento.

```tsx
// Posição: absolute top-0 left-0 right-0, z-10, height 3px
// Animação: width 0%→100% em 600ms easeInOut
// Cor: brand DEFAULT
// Aparece/desaparece com fade
```

### `ConfirmationFeedback`

Tela de conclusão do tour — aparece após o último step.

```tsx
// Overlay sobre o mockup (não sobre o tour overlay)
// Check animado: circle + checkmark com stroke animation, cor success
// Título: "Exploração concluída!" (Sora 28px)
// Subtítulo: nome da solução + tagline
// CTA primário: "Explorar outra solução" → volta para a grade
// CTA secundário: "Repetir tour" → reinicia o tour
// Auto-redirect: após 8s sem interação, volta para a grade
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

> Na v1, soluções com capacidade de IA (Análise Preditiva) exibem badge `IA` no card mas pertencem ao grupo Pessoas e RH. O grupo IA como destino de navegação pode exibir um card especial mostrando as capacidades transversais de IA da plataforma Teknisa, com placeholder animado para a v2.

---

### Gestão Corporativa — Fluxos (v2)

> Placeholder para v2. O card deve estar visível na grade HOME com badge `"Em breve"` e não ser clicável ou exibir um card informativo sobre capacidades de gestão de multiunidades e franquias.

---

## 13. Tela HOME — Especificação v2

### Layout geral

```
┌────────────────────────────────────────────────────────────┐
│  [Logo SVG Teknisa]    [Área de destaque animada]           │  ← Header 18%
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ FRENTE   │ │ TECFOOD  │ │   ERP    │ │PESSOAS   │      │  ← Linha 1
│  │ DE LOJA  │ │          │ │BACKOFFICE│ │  E RH    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ SUPPLY   │ │   CRM    │ │    IA    │ │ GESTÃO   │      │  ← Linha 2
│  │ E COMPRAS│ │          │ │ (v2)     │ │CORP.(v2) │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Header da HOME — Área de destaque animada (substituição do rotativo ruim)

**O componente rotativo antigo deve ser completamente removido e substituído por uma das seguintes abordagens** (escolher a que entregar mais impacto):

**Opção A — Contadores animados de impacto (recomendada):**
```
┌─────────────────────────────────────────────────────┐
│  [Logo Teknisa SVG]   │  34+      6        20k+      │
│                       │  anos   países  instalações   │
│  Tecnologia que       │                               │
│  transforma o         │  [tag pill: Food Service]     │
│  food service         │  [tag pill: Refeições Colet.] │
│                       │  [tag pill: ERP & HCM]        │
└─────────────────────────────────────────────────────┘
- Contadores fazem count-up animado ao carregar (0→34, 0→6, 0→20.000)
- Tags pulsam suavemente em sequência
- Visual clean, tipografia grande, dados reais da Teknisa
```

**Opção B — Marquee de soluções com mockup thumbnail:**
```
Faixa horizontal animada com miniatura dos sistemas + nome
Velocidade suave (60s por ciclo), pausa no hover/touch
Cards com aspect ratio, screenshot/mockup thumb estilizado
```

**Opção C — Frase animada com troca de palavras (typewriter refinado):**
```
"Gestão inteligente para [food service / refeições coletivas / redes de restaurantes]"
A palavra em colchetes faz crossfade suave, não typewriter
Velocidade de troca: 2.5s por palavra, transition 400ms opacity
Sem cursor piscante — apenas crossfade limpo
```

> **Qualquer que seja a opção implementada: deve ter animação fluida (≥60fps), ser imediatamente legível à distância e comunica a dimensão e autoridade da Teknisa.**

### Card de grupo (segmento)

```
Anatomia do card:
├── Background: branco, border 1px solid rgba(2,7,136,0.08)
├── Border-radius: 20px
├── Padding: 32px
├── Shadow: card shadow (0 2px 12px rgba(0,0,0,0.06))
│
├── Ícone Lucide: 52px, cor brand DEFAULT
├── Nome do grupo: Sora 22px, 600, neutral-900
├── Tagline: Rubik 14px, neutral-500
├── Contagem: "5 soluções" — label-sm brand color
│
└── Estado hover/press:
    ├── background: brand-ghost (#f0f1fc)
    ├── border-color: brand-subtle
    ├── scale: 0.98 (active/press)
    ├── sombra brand: 0 4px 20px rgba(2,7,136,0.15)
    └── ícone: transition para brand-lighter

Cards IA e Gestão Corporativa:
├── opacity: 0.55
├── pointer-events: none
├── Badge "Em breve" no canto superior direito
└── Cursor: default (não pointer)
```

### Transição HOME → Grade de soluções

```
1. Toque no card → scale 0.97 (100ms) → scale 1.02 (150ms) → scale 1 (100ms)
2. Overlay brand/5 sobre os outros cards (fadeIn 200ms)
3. Card selecionado: border brand sólida + sombra brand
4. Layout transition: header HOME sai (slide up + fade, 300ms)
5. Grid de soluções entra (slide up from bottom, stagger 60ms/card)
6. Breadcrumb aparece no novo header: "← [ícone grupo] Nome do grupo"
```

---

## 14. Tela de SOLUÇÃO/DEMO — Especificação v2

### Layout v2

```
┌────────────────────────────────────────────────────────────┐
│ [←Logo] [breadcrumb: Frente de Loja › PDV Novo]            │  ← Header slim 56px
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────────────────────┐  ┌───────────┐   │
│  │                                     │  │ Companion │   │
│  │        DEVICE FRAME                 │  │  Card 1   │   │
│  │   (80–85% da altura disponível)     │  │           │   │
│  │   (70% da largura se tem companion) │  │ Companion │   │
│  │                                     │  │  Card 2   │   │
│  └─────────────────────────────────────┘  └───────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
        ↑ TourOverlay renderizado como portal acima de tudo
```

**Quando não há companion:** device frame ocupa 88% da largura e 85% da altura útil, centralizado.

### Comportamentos v2

- **Header slim** (56px): apenas logo Teknisa SVG (não texto) + breadcrumb com ícone do grupo + nome da solução. Sem StepBar, sem contador de passos no header.
- **Device frame:** dimensionado para preencher agressivamente a área útil. Mínimo de margens.
- **TourOverlay:** inicia automaticamente 400ms após a tela de demo montar. Renderizado via `createPortal` no `document.body`, z-index 9999.
- **Companions:** renderizados no espaço lateral ou inferior, fora do device frame, com animação de entrada sincronizada com o step do tour em que são relevantes.
- **Sem footer fixo:** a navegação é feita exclusivamente pelo TourTooltip. Sem botões de "próxima etapa" fixos no rodapé.
- **Botão Voltar:** no header, 56×56px mínimo, sempre visível e acessível. Nunca coberto pelo tour overlay.

### Hierarquia de z-index

```
z-0:    device frame e conteúdo do mockup
z-10:   companions
z-20:   simulatedNotification (dentro do contexto da demo)
z-9998: idle overlay
z-9999: TourOverlay (backdrop + spotlight + tooltip)
```

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

### Regras de componente (v2)

1. **Todo componente de mockup** recebe `tourStep: number` como prop e renderiza o estado visual correspondente ao passo do tour
2. **TourOverlay** é um portal React (`createPortal`) renderizado em `document.body` — nunca dentro do device frame
3. **Posicionamento do spotlight** calculado com `getBoundingClientRect()` + `useLayoutEffect` — recalcular no resize
4. **Companions** são sempre externos ao device frame — em coluna lateral ou row inferior
5. **StepIndicator REMOVIDO** — não existe mais no codebase. Não recriar.
6. **FlowGuide REMOVIDO** — substituído pelo TourTooltip
7. **Logo Teknisa:** sempre `<Image src="/logo-teknisa.svg" alt="Teknisa" />` — nunca texto puro
8. **Mockups:** preenchem agressivamente a área disponível — calcular dimensões em `useEffect` baseado no viewport atual
9. **Fluxos** definidos em `/data/flows/*.ts` com array de `TourStep[]` — nunca embutidos no componente

### Convenções de nomenclatura

```
Componentes: PascalCase
Hooks: camelCase com prefixo "use"
Variantes Framer: camelCase (fadeInUp, scaleIn)
IDs de solução: kebab-case ('pdv-novo', 'waste-control')
IDs de segmento: kebab-case ('frente-de-loja', 'tecfood', 'erp-backoffice', 'pessoas-rh', 'supply-compras', 'crm', 'ia', 'gestao-corporativa')
Arquivos: PascalCase para componentes, camelCase para utils/hooks
Tour steps: kebab-case com prefixo do mockup ('pdv-step-select-item', 'pdv-step-confirm')
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

## 18. Checklist de Qualidade por Solução (v2)

Antes de considerar uma solução implementada, verificar:

**Device Frame**
- [ ] Frame correto para o contexto e com anatomia detalhada (câmera, botões, base)
- [ ] Frame preenche agressivamente a área disponível (mínimo de padding desperdiçado)
- [ ] Área de tela interna com `overflow: hidden` e `border-radius` correto

**Tour Guiado**
- [ ] TourStep[] definido em `/data/flows/*.ts` com 3–5 passos
- [ ] TourOverlay inicia automaticamente após 400ms
- [ ] Spotlight recorta corretamente o elemento alvo via `getBoundingClientRect()`
- [ ] Tooltip posicionado dinamicamente sem sair do viewport
- [ ] PulsingDot aparece quando `requiresInteraction: true`
- [ ] Interação com o elemento alvo avança o tour
- [ ] Último step exibe `ConfirmationFeedback`
- [ ] Botão "Pular tour" funcional

**Mockup**
- [ ] Dados simulados realistas (não placeholders genéricos)
- [ ] Terminologia correta do produto Teknisa
- [ ] Elementos clicáveis respondem visualmente ao toque
- [ ] Estado visual muda conforme o tourStep atual

**Companions**
- [ ] Se tem companion: qualidade visual premium, dados realistas
- [ ] Companion nunca sobrepõe o device frame
- [ ] Companion aparece com animação de entrada no step relevante
- [ ] Se companion é fraco visualmente: remover e ampliar o device frame

**Marca e Identidade**
- [ ] Logo Teknisa SVG em uso — nunca texto "Teknisa"
- [ ] Azul #020788 como cor de destaque primária
- [ ] Fontes Sora (títulos) e Rubik (corpo) em uso
- [ ] Zero emojis — apenas ícones Lucide

**TV Touch**
- [ ] Funciona bem em viewport 1920×1080
- [ ] Touch targets ≥ 56px em todos os elementos interativos
- [ ] Botão Voltar sempre visível e acessível (não coberto pelo tour)
- [ ] Texto mínimo 16px em qualquer elemento

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
**Prioridade 4 — Pessoas e RH:** Portal Gestor, Portal Funcionário, Mesa de Operações, Análise Preditiva
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

### Análise Preditiva — Pessoas e RH — Badge IA
Pertence ao grupo **Pessoas e RH**, mas possui forte componente de IA. Deve exibir badge `IA` no card e em destaque na tela de demo, comunicando que é capacidade potencializada por inteligência artificial dentro da plataforma Teknisa.

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

## 21. Padrão V6 — Cena interativa integrada (referência: TAA)

A v6 substitui o tour passivo por uma cena onde **o usuário toca, o mockup reage e os companions ao redor reagem junto**. Toda nova solução deve seguir os padrões abaixo. O TAA é a referência canônica.

### 21.1 Tour: interação real (sem botão "Próximo" em passos de ação)

```ts
// data/flows/*.ts
const myFlow: TourStep[] = [
  {
    id: "step-x",
    targetSelector: '[data-tour="solution-action"]',
    placement: "right",
    title: "Comece o pedido",
    description: "Frase curta de instrução.",
    requiresInteraction: true, // user MUST tap the target
    companions: ["OrderTicket"],
  },
  // ...
  {
    id: "final",
    targetSelector: '[data-tour="solution-result"]',
    placement: "left",
    title: "Concluído",
    description: "Sistema mostra o resultado.",
    actionLabel: "Concluir", // passive step gets a Next button
    companions: ["OrderTicket", "POSCardReader"],
  },
];
```

- `requiresInteraction: true` → usuário precisa tocar no elemento alvo no mockup. O tooltip mostra "Toque para continuar" como hint, sem botão clicável.
- Sem `requiresInteraction` (ou no último step) → passo passivo. Tooltip mostra botão "Próximo" ou "Concluir".
- Sempre acessível: botão X de skip no canto do tooltip.

### 21.2 TourOverlay sem backdrop escuro

**Regra:** nada deve cobrir a tela inteira em opacidade alta. Companions e mockup precisam ficar 100% visíveis durante o tour.

- Spotlight = ring brand 3px sólido + halo brand pulsante de 3 camadas (`0 0 0 6px rgba(brand, 0.18)`, `0 0 32px 8px rgba(brand, 0.30)`, `0 0 60px 12px rgba(brand, 0.12)`).
- Animação do halo: `opacity [0.45, 0.85, 0.45]` em loop de 1.8s.
- Movimento do ring entre steps: spring (stiffness 220, damping 26).
- Sem máscara SVG escura, sem `bg-black/60`.

### 21.3 Layout 3 colunas (companion-left, frame, companion-right)

```tsx
// SolutionDemo grid
className="grid min-h-0 flex-1 items-stretch gap-6 p-6 grid-cols-[340px_1fr_340px]"
```

- Coluna esquerda: `340px` — companions com `align: end` (encostam no frame).
- Coluna central: `1fr` — device frame, mede via `useMeasure` e se dimensiona ao container.
- Coluna direita: `340px` — companions com `align: start` (encostam no frame).
- Quando NÃO há companions: collapse para `grid-cols-1`.

Per-solução, mapear quais companions vão de cada lado:

```tsx
const COMPANION_LAYOUT: Record<string, { left?: CompanionType[]; right?: CompanionType[] }> = {
  taa: { left: ["OrderTicket"], right: ["POSCardReader"] },
  // ...
};
```

### 21.4 CompanionShell — equipamento, não widget

Todo companion é envolto em `CompanionShell` para ler como **equipamento físico na mesma cena do device**, não card flutuante:

```tsx
<CompanionShell
  label="Cupom do cliente"        // pequeno caps brand
  sublabel="Impressora térmica"   // posiciona na cena
  live                            // chip verde "ao vivo" com bolinha pulsando
  pulse={pulse}                   // scale 1.015 ao receber novo dado
>
  {/* corpo do companion */}
</CompanionShell>
```

Padrão visual obrigatório:
- Etiqueta contextual no topo (brand 10px font-bold uppercase tracking-[2px])
- Sublabel discreta (neutral-400)
- Live indicator (chip success-tinted com dot pulsando)
- Pulse animation quando estado muda
- `max-width: 320px`

### 21.5 Regra do cinza claro (TUDO que é hardware)

**Regra absoluta:** qualquer elemento que represente equipamento físico — device frames, maquininhas, leitores, totens, monitores em companion — usa o mesmo gradiente cinza claro:

```css
background: linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%);
box-shadow:
  0 0 0 1px rgba(0,0,0,0.06),
  0 18px 44px rgba(0,0,0,0.16),
  0 4px 12px rgba(0,0,0,0.06),
  inset 0 1px 0 rgba(255,255,255,0.7);
```

**Não:** corpo preto, dark grey escuro, qualquer cor saturada.
**Exceção válida:** displays/telas dentro do equipamento podem ter LCD branco-cinza com inner shadow.

### 21.6 Companion resolver per-solução, step-aware

```tsx
// components/companions/index.tsx
export function Companion({ type, solutionId, step, stepLabel }: CompanionProps) {
  // Per-solução overrides primeiro
  if (solutionId === "taa") {
    if (type === "OrderTicket") {
      const items = step >= 2 ? TAA_COMBO_ITEMS : []; // fill in real time
      return <OrderTicket items={items} approved={step >= 4} ... />;
    }
    if (type === "POSCardReader") {
      if (step < 3) return null; // só aparece no step de pagamento
      return <POSCardReader status={step >= 4 ? "approved" : "waiting"} amount={TAA_TOTAL} />;
    }
  }
  // ... fallback genérico depois
}
```

Cada solução define como cada companion progride com os steps. Companions devem **reagir narrativamente**: cupom enche conforme items são adicionados, maquininha aprova depois do tap, etc.

### 21.7 Variedade de companions por contexto

**Não use cupom+maquininha em todas as soluções.** Cada produto tem um conjunto de equipamentos/contextos diferente. Pense em "o que está na cena ao redor do operador/cliente real?":

| Contexto | Companions sugeridos |
|---|---|
| TAA / PDV operador | OrderTicket (cupom térmico), POSCardReader (maquininha cinza claro) |
| SmartPOS (mobile, IS a maquininha) | OperatorDailyPanel (KPIs do dia), CustomerReceiptPhone (SMS do cliente) |
| Cardápio Digital (cliente na mesa) | KitchenDisplay (KDS recebe o pedido), WaiterMobile (notif do garçom) |
| QuickPass (acesso refeitório) | EmployeeBadge (crachá digital), RestaurantQueueBoard (fila de cada refeitório) |
| Approve (workflow tablet) | MiniDashboard (KPIs de aprovação) |
| Análise Preditiva (RH IA) | MiniDashboard (gráficos preditivos), EmployeeCard (perfil em risco) |
| Rotina Fiscal (ERP desktop) | FiscalBadge (Reforma 2026 + IBS/CBS) |

Crie novos componentes quando o contexto pedir. Sempre dentro de CompanionShell.

### 21.8 Animação: rápida e narrativa

- Entradas: 200–300ms máximo (sem delays encadeados).
- Transições entre steps: instantâneas com `duration: 0.2`.
- Microinterações de toque: feedback em <100ms (`whileTap={{ scale: 0.96 }}`).
- Stagger só em listas que aparecem juntas (ex: items do cupom): 50ms entre items.
- Sem `LoadingBar` artificial entre steps — o mockup re-renderizando JÁ é o feedback.

### 21.9 Tooltip discreto, ancorado

- Largura 280px (não centralizado, não grande).
- Posicionamento `right > left > bottom > top` baseado no espaço disponível.
- Seta CSS aponta de volta para o elemento alvo.
- Skip vira X discreto no canto.
- Contador "1 / 5" em caps brand.
- "Próximo" SOMENTE em passos passivos.

### 21.10 Dados de referência (sempre fictícios)

**REGRA CRÍTICA DE COPYRIGHT (v13.27):** todo nome de comércio, marca,
produto, pessoa ou local nos mockups deve ser FICTÍCIO. Nada de clientes
reais da Teknisa (Sapore, Madero, GRSA, Sodexo, LSG, etc.), nada de
produtos com marca registrada (Coca-Cola, Camil, Brasfoods, etc.), nada
de venues reais (Allianz Parque, etc.), nada de nomes de pessoas reais
(funcionários Teknisa, clientes Teknisa). Use a lista abaixo como
referência canônica de nomes fictícios.

**Lojas e unidades (fictícios):**
- Vitalle Refeições — Vila Nova (refeições coletivas)
- Restaurante Vila Nova / Restaurante Central
- Sabor da Casa (restaurante)
- Brasa Real (steakhouse fictícia)
- Tropical Roots (restaurante)
- Praça Bar
- Simons Burgers / Pizza Forneria / Doce Mestre (food court / eventos)
- Padaria Manhã / Padaria Centro
- Café da Praça

**Operadores e funcionários (fictícios — nomes brasileiros genéricos):**
- João Costa, Mariana Costa, Carlos Mello, Diogo Castro, Bruno Sampaio,
  Carla Teixeira, Ricardo Nobre, Sofia Mendonça, Ricardo Almeida,
  Juliana Mendes, Pedro Souza, Camila Lopes, Ana Costa, João Pedro

**Marcas de fornecedores (fictícias):**
- Solare (cereais / arroz / feijão)
- VitaFoods (distribuidora)
- Pão Mestre / Tropical Cereais / Grão Bom

**Combos e pratos (TAA / fast food):**
- X-Burguer Artesanal Combo — R$ 61,70 (lanche + batata + suco)
- Chicken Crispy Combo — R$ 54,90
- Veggie Bowl Combo — R$ 48,50
- Refri Cola Zero 350ml (nunca "Coca-Cola")
- Refri Cola 600ml

**Pratos executivos (Cardápio Digital / TecFood):**
- Penne ao molho funghi — R$ 42,00
- Salmão grelhado com purê — R$ 58,90
- Costela no bafo 350g — R$ 44,90

**Códigos e identificadores:**
- Pedido #A1247 (kiosk/PDV)
- Pedido #C1247 (cardápio digital)
- Pedido #PED-2026-08471 (commercial)
- NSU 871402 (transação cartão)
- Cartão ****4128 (sem mencionar bandeira real)
- Matrícula 28471

**Venues / eventos:**
- Arena Central · setor B (estádio fictício)
- NUNCA usar: Allianz Parque, Maracanã, Morumbi ou venues reais

### 21.11 Replicação para novas soluções

Antes de marcar uma solução como pronta no padrão V6, validar:

- [ ] Flow é interaction-driven (`requiresInteraction: true` nos passos de ação)
- [ ] Mockup tem `data-tour` nos elementos certos por step
- [ ] Mockup reage à interação com animação (`whileTap: scale 0.96`)
- [ ] Companions per-solução definidos no `COMPANION_LAYOUT`
- [ ] Companions reagem ao step via resolver (não são estáticos)
- [ ] Todos os companions têm CompanionShell (label + sublabel + live + pulse)
- [ ] Hardware é cinza claro (regra 21.5)
- [ ] Dados realistas (lojas, valores, códigos, nomes)
- [ ] Logo SVG no lugar de texto "TEKNISA"
- [ ] Tooltip discreto, ancorado, sem "Próximo" em passos de ação

---

## 22. Padrão V7 — Refinamentos funcionais (v6.6 → v6.8.x)

Iterações sobre o padrão V6 baseadas em feedback do produto rodando em TV touch.
Tudo aqui é **obrigatório** para qualquer mockup novo ou retrabalho de mockup existente.

### 22.1 Fonte UI: Roboto, não Rubik

- A fonte de **texto** do projeto é Roboto (família UI). Sora segue para títulos display.
- `app/layout.tsx` carrega via `next/font/google`.
- `globals.css` força `font-family: var(--font-ui)` em `button, input, textarea, select, label, li, p, span, td, th, small, strong, em` para que rótulos pequenos em mockups (que historicamente usavam `font-display`) também caiam em Roboto.
- **Não** voltar a usar Rubik. **Não** usar Sora em textos pequenos de mockup.

### 22.2 TV touch não tem teclado

A vitrine roda em TV touch sem teclado físico. Qualquer interação que exija digitação **quebra** o produto. Substitua:

- **Cupons**: lista de chips clicáveis (`COUPONS: { code, label, pct }[]`) em vez de input. Tocar aplica, tocar de novo / botão "Remover" tira. Ver `QuickPass.tsx` como referência.
- **Busca**: input visual disabled (para parecer que existe) ou botões de categoria.
- **Observação / CPF / código**: opções pré-definidas em chips ou seletor; nunca campo livre.
- **Quantidade**: stepper `−/+` sempre, nunca input numérico.

Se o fluxo do produto real depender de digitação, simule com seleção de valores pré-prontos.

### 22.3 Sem em-dashes (`—`) em tooltip text

O cliente lê os em-dashes como travessões longos que poluem visualmente o tooltip. Use **vírgula** ou **frase nova** no lugar.

- Errado: `"Pagou no celular — sem fila."`
- Certo: `"Pagou no celular, sem fila."` ou `"Pagou no celular. Sem fila."`
- O sweep em `data/flows/*.ts` foi feito na v6.7. Não reintroduzir em flows novos.

### 22.4 Tooltips dinâmicos via `lib/tourState.ts`

Tooltips estáticos que inventam números (ex: "5 itens, R$ 100") quebram a ilusão quando o usuário interage e o carrinho real é diferente. A v7 resolve isso:

```ts
// lib/tourState.ts (Zustand)
export interface TourLiveState {
  selectedItemName?: string;
  cartCount?: number;
  cartTotal?: number;
  cartItems?: { id: string; qty: number; name: string; price: number }[];
  paymentMethod?: 'cartao' | 'pix' | 'credito' | 'debito' | 'dinheiro';
  paymentLabel?: string;
  couponApplied?: boolean;
  couponCode?: string;
  discountValue?: number;
  selectedAddons?: string[];
  [key: string]: unknown;
}

export const useTourLive = create<...>(...);
```

**Cada mockup deve**:

1. Levantar o state das selections para o topo do componente (cart, payment, qty, addons).
2. `useEffect` no topo que faz `patchLive({ ... })` sempre que esse state mudar.
3. Resetar via `useTourLive.getState().reset()` é responsabilidade do `SolutionDemo` ao trocar de solução (já implementado).

**Cada flow step pode declarar `title`, `description`, `actionLabel` como string OU função**:

```ts
{
  id: 'pagamento',
  title: (live) => live.paymentLabel
    ? `Pagando com ${live.paymentLabel}`
    : 'Forma de pagamento',
  description: (live) =>
    `Total ${brl(live.cartTotal)} via ${live.paymentLabel ?? 'método selecionado'}.`,
  // ...
}
```

`resolveText(step.title, live)` faz a ponte. Helpers de formatação em `lib/tourState.ts` (`brl(value)`).

### 22.5 Tooltip sempre fora do device frame

Tooltip cobrindo o mockup é inaceitável: esconde o que o usuário tem que tocar. A v7 garante isso por construção:

- Cada device frame (`MobileFrame`, `DesktopFrame`, `TabletFrame`, `POSTerminalFrame`, `KioskFrame`) recebe `data-tour-frame="true"` na motion.div raiz.
- `useTour` mede em paralelo `targetRect` e `frameRect`.
- `TourTooltip.computePosition` escolhe quadrante (`right` > `left` > `below` > `above`) baseado no espaço **fora do frame**, não do alvo. Gap de 28px entre tooltip e frame.
- Quando há espaço lateral suficiente, preferir esquerda/direita (a seta horizontal lê melhor em TV).
- **Re-clamp por altura medida**: o tooltip se mede via `useLayoutEffect` e re-clampa `top` contra o viewport real, evitando que tooltip alto vaze pra fora da tela.

### 22.6 Linha conectora reta + bolinha pulsante

A v6.8 introduziu a linha conectora; a v6.8.1 trocou pra reta com bolinha porque o cliente achou a curva ruim. **Não voltar pra Bézier nem para arrow head**.

- SVG renderizado dentro de `TourOverlay`.
- `<motion.line>` reta, brand color `#020788`, `strokeWidth 2.5`, `strokeDasharray "6 5"`, anima `pathLength 0→1` em 350ms.
- Ponta termina logo fora do `SpotlightRing` (não invade a área destacada).
- `<motion.circle>` r=6 sólida brand + um halo `scale [1, 1.8, 1]` em loop 1.6s para chamar atenção.

### 22.7 PDV: 2 colunas de atalhos

Na referência do produto real, a coluna direita do PDV é uma **grade 2 colunas × 8 linhas** de atalhos com tecla F#/ALT+. O painel atual reflete isso:

- `<main className="grid grid-cols-[260px_1fr_320px]">`
- `FunctionKeysColumn` = `grid grid-cols-2 gap-1`, botões altura mínima 44px.
- `FUNCTION_KEYS` tem 16 entradas (ajuste o array antes de mexer no layout).

### 22.8 Mudanças por solução de Frente de Loja (v7)

| Solução | Mudança |
|---|---|
| TAA | Mantida (referência V6). |
| PDV Novo | Coluna direita = 2 colunas de atalhos. Texto do tooltip "Marguerita" (era "Costela"). |
| SmartPOS | State lifted, 5 views (catalog, detail, cart, payment-select, success). PaymentSelectView com 4 formas (Crédito, Débito, Pix, Dinheiro). Sem processing screen separado. |
| Cardápio Digital | Gradientes refinados (radial soft + brand). Tooltip da confirmação fala "lá na cozinha o pedido cai no KDS". |
| QuickPass | **Repensado para eventos** (estádio/show). 4 views: catalog, cart, payment, success. Sem QR scanner (confundia). Companion = `RestaurantQueueBoard` com vendors fictícios do evento (Simons Burgers, Pizza Forneria, Doce Mestre). Cupom via chips. |

### 22.9 KitchenDisplay: tema light obrigatório

Companion KDS antes tinha tela LCD escura. Na v7 **toda a tela é light**:

- Casca em cinza claro (regra 21.5 mantida).
- Tela interna `linear-gradient(180deg, #ffffff, #f8f9fb)` com `inset shadow` sutil.
- Pills de status (Novo/Em preparo/Pronto) com cor de marca, não invertidas em dark.
- **Não** reintroduzir o tema escuro.

### 22.10 Checklist V7 para qualquer mockup novo

Antes de marcar pronto, validar (em cima dos checks da §21.11):

- [ ] Mockup levanta state para o topo e patcheia `useTourLive` via `useEffect`.
- [ ] Flow do mockup tem **pelo menos uma** descrição dinâmica que referencia o que o usuário escolheu.
- [ ] Tooltip text não tem em-dashes (`—`).
- [ ] Mockup não tem nenhum `<input>` ativo que exija digitação. Tudo via chip / botão / stepper.
- [ ] Device frame tem `data-tour-frame="true"` (já vem dos componentes de frame; não remover).
- [ ] Companions per-solução fazem sentido para o contexto (eventos ≠ refeitório ≠ caixa de loja).
- [ ] Texto pequeno em mockup usa `font-ui` (Roboto), não `font-display`.

---

## 23. Padrão V8 — shadcn/ui, sistema de design refinado, Retail Intelligence

Salto qualitativo de v7 → v8 a partir do feedback do cliente: "os chips ali tão bem feios, seu design não está muito bom, dos gráficos e tudo mais você está pecando bastante, você ampliar seu uso de tailwind css e shadcn/ui afinal o que você usou até agora é patético e feio". Inspiração de referência: **Linear, Notion AI, Vercel, Arc**, mais dashboards de produto (Panacea, Knowwio, PMO).

### 23.1 shadcn/ui é o sistema de primitives

Instalado em `components/ui/shadcn/` (não é o CLI completo, é a versão manual com as primitives que usamos). Sempre importar via barrel:

```ts
import {
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge,
  Separator,
  ScrollArea,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/shadcn";
```

**Regras de uso**:

- **Todo card branco/superfície elevada** = `Card`. Os `rounded-2xl border border-brand/8 bg-white shadow-card` ad-hoc devem virar `Card`. (A própria primitive já aplica essa base.)
- **Todo CTA principal** = `Button`. Variants disponíveis:
  - `default` — brand sólido, padrão da maioria dos CTAs
  - `ai` — gradiente `brand → brand-light → #7c3aed`, exclusivo para CTAs de IA/insight (máximo 1 por tela)
  - `outline` — borda brand, fundo branco
  - `ghost` — sem fundo, hover suave
  - `soft` — `brand-ghost` background, brand text
  - `success` — verde, para "aprovar", "aplicar recomendação"
  - `link` — texto sublinhado
  - Sizes: `sm`, `default` (40px), `lg` (48px), `xl` (56px), `icon`
- **Toda pill/chip de status** = `Badge`. Variants: `default`, `secondary`, `success`, `warning`, `danger`, `outline`, `ai`, `ghost`.
- **Botão desabilitado**: confiar no `disabled` prop. O `Button` já dá conta de `opacity-50 cursor-not-allowed`. Em `motion.button` custom, sempre fazer `whileTap={enabled ? { scale: 0.98 } : undefined}` para evitar feedback fantasma.

### 23.2 Layout vertical de jornada (substitui StepRail horizontal)

A Retail Intelligence é a referência canônica do padrão. Quando a solução tem mais de 4 etapas ou navega entre telas distintas (não apenas linear no mesmo mockup), use um **painel de jornada vertical à direita** dentro do próprio mockup, no lugar de step pills horizontais no topo. Estrutura:

```tsx
<div className="flex h-full flex-col overflow-hidden">
  <Header />
  <div className="flex min-h-0 flex-1 overflow-hidden">
    <main className="relative min-w-0 flex-1 overflow-hidden">
      {/* screens com AnimatePresence */}
    </main>
    <aside className="flex w-[280px] flex-none flex-col border-l border-brand/10 bg-white">
      {/* timeline vertical com nó por etapa */}
    </aside>
  </div>
</div>
```

Cada nó da timeline:

- 32px círculo com 3 estados: `done` (success verde + Check), `active` (brand + halo pulsante 1.55× / 1.8s loop), `pending` (white + neutral-200 ring)
- Linha conectora vertical entre nós: cinza neutral-200 quando pending, success verde quando done, gradiente brand→neutral quando ativo
- Ícone Lucide por etapa (correlacionado ao conteúdo da tela)
- Label `01 Dashboard` (número em tabular opacidade 60% + label)
- Hint de 1 linha em `text-[11px] text-neutral-400` (ou `text-neutral-700` quando active)
- Wrapper da row ativa: `border-l-2 border-brand bg-brand/5`

**Quando a solução tem um painel vertical interno, NÃO atribuir companions à solução** — eles duplicam o painel e roubam espaço. Para a Retail Intelligence isso significa remover `companions: [...]` dos steps e do `solutions.ts`. O frame ganha 680px de largura no 1920×1080.

### 23.3 Disabled de fato (sem pagar R$ 0,00)

Crítico: nenhum mockup de venda pode permitir confirmar pagamento com total zero. Aplicar a TODO botão de "Finalizar", "Pagar", "Confirmar":

```tsx
<button
  type="button"
  disabled={cartCount === 0 || total === 0}
  className={cn(
    "rounded-md py-3 px-6 font-bold transition-colors",
    cartCount === 0 || total === 0
      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
      : "bg-brand text-white shadow-brand hover:bg-brand-light"
  )}
>
  {cartCount === 0 ? "Carrinho vazio" : `Pagar R$ ${total.toFixed(2).replace(".", ",")}`}
</button>
```

Tela de sucesso/aprovado **deve refletir o estado real**, não hardcodar:

- ❌ Antes: SuccessView mostrava "PIX · aprovado em 2s" hardcoded
- ✅ Agora: SuccessView recebe `paymentLabel` e `total` por prop e renderiza o que o usuário pagou

### 23.4 Refino visual obrigatório (vibe Linear/Notion AI/Vercel/Arc)

- **Números grandes**: `font-ui font-bold tabular-nums text-[28px]+`. Labels pequenos em uppercase tracked.
- **Eyebrow labels**: `text-[10-11px] font-bold uppercase tracking-[2-3px] text-brand`.
- **Sombras**: preferir `shadow-card` (`0 2px 12px rgba(0,0,0,0.06)`) e `shadow-card-hover`. Evitar sombras heavy custom.
- **Gradientes em superfícies de destaque**:
  - Brand soft: `bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/30`
  - Brand strong (CTAs `ai`): `from-brand via-brand-light to-[#7c3aed]`
  - Success: `from-success/5 to-transparent` (horizontal) para banners
- **Hover/active feedback**: `hover:-translate-y-[1px]` em cards e CTAs, `active:scale-[0.98]` em buttons.
- **Charts**:
  - Gradient fill com `<linearGradient>` (2-3 stops, opacidade decrescente)
  - Topo de barra arredondado (`rx` no `<rect>`)
  - Hover/highlight dot com halo via `<circle>` empilhados em raios diferentes
  - Grid horizontal sutil (`stroke="#e5e7eb" stroke-dasharray="2 1.5"`)
  - Label por barra com a porcentagem em tabular-nums

### 23.5 Animações novas em `lib/animations.ts`

Adicionadas em v8 (não remover, são usadas em múltiplos componentes):

- `softFadeIn` — opacity + y:6, 250ms ease-out (entrada padrão de seções)
- `staggerFast` — staggerChildren 0.06 (listas curtas que entram juntas)
- `staggerCards` — staggerChildren 0.08, delayChildren 0.05 (grids de cards)
- `softSpring` — Transition object: spring stiffness 220, damping 24, mass 0.6
- `glowPulse` — boxShadow keyframes para halo brand pulsante infinito
- `countUp` — scale 0.92→1 + opacity 0→1, 0.3s (para valores que mudam)

Regras de animação V8:

- Entradas: 200-300ms ease-out, nunca > 400ms
- Stagger: 50-80ms por item (curto), nunca > 100ms
- Spring scale **nunca passa de 1.15** (causa motion sickness em TV)
- Springs com 3 keyframes (`[0.6, 1.2, 1]`) **dão erro Framer Motion**. Usar key change + initial/animate de 2 keyframes.

### 23.6 Layout sem companions (jornada interna)

Quando o mockup já tem painel de jornada interno (§23.2), o `SolutionDemo` deve renderizar `grid-cols-1` (sem colunas de companion). Isso é automático: se `currentStepData.companions` é `undefined` ou `[]`, o grid colapsa para 1 coluna e o device frame ocupa toda a largura disponível (depois do header).

### 23.7 Flow data: descrições dinâmicas e TV-touch friendly

- Descrição de step que mencione digitação (`"Digite o nome"`, `"Diga em português..."`) **deve ser reescrita** para "Toque para...", "A IA recebe...", "O sistema mostra..." (TV touch não tem teclado físico, V7 §22.2 reforçado).
- Descrição que cita valor de carrinho/total deve vir de `live.cartTotal` via função, nunca hardcoded.
- Em-dashes (`—`) em tooltip text são proibidos (V7 §22.3). Em **placeholder de dado vazio** (ex: `"—"` quando "Ausente · sem horas extras"), é aceitável.

### 23.8 Checklist V8 — quando refatorar um mockup existente

- [ ] CTAs trocados para `Button` shadcn (não `motion.button` ad-hoc, salvo casos com animação custom obrigatória)
- [ ] Cards trocados para `Card` shadcn
- [ ] Pills/chips trocados para `Badge` shadcn (variant correto: success/warning/danger/ai)
- [ ] Disabled state com classe e `whileTap` condicional. Botão de pagamento bloqueia carrinho vazio
- [ ] Success/aprovado screen reflete state real (não hardcoded)
- [ ] Números KPI ≥ 28px tabular-nums com eyebrow label uppercase tracked
- [ ] Charts com gradient fill + rounded top + grid sutil + labels por barra
- [ ] CTA principal de IA usa `Button variant="ai"` (máximo 1 por tela)
- [ ] Mockup respeita `flex h-full w-full flex-col overflow-hidden` no root, com `min-h-0 overflow-y-auto` em listas
- [ ] data-tour selectors preservados (compatibilidade com tour flow)
- [ ] Tooltip do flow não pede digitação

---

## 24. Padrão V9 — Bugs reais + foundation visual (fotos Pexels + avatares)

V9 nasceu do feedback "tudo mudou de classe mas visualmente não mudou" e
fechou 4 buracos concretos que escaparam dos agentes:

### 24.1 Bugs críticos corrigidos

- **TAA modal de produto preso ao tour step**: `ItemDetailModal` estava
  gated em `step === 2`. Clicar em produto setava `openProductId` mas o
  modal não renderizava. Corrigido para `openProduct && step !== 3 && step < 4`.
- **Charts vazios em PortalGestor + AnálisePreditiva**: as colunas dos
  bars não tinham `h-full`, então `height: %` resolvia 0. Coluna agora é
  `flex h-full flex-col justify-end`, bar é `motion.div` animando
  `height: 0 → pct%` em vez de `motion.span` com `scaleY`.
- **Hero counters não animavam**: `useInView` com margin restritivo
  `-20%` não disparava. Removido — animação roda do mount direto.

### 24.2 Foundation: fotos reais + avatares stacked

- **Pexels CDN** habilitado em `next.config.mjs` via `remotePatterns`.
- `lib/photos.ts` com helper `pexels(id, opts)` e catálogo curado.
- `components/ui/PersonAvatar.tsx`: avatar circular Image + fallback de
  iniciais coloridas. Prop `status` (online/offline/busy) render bottom-right.
- `components/ui/StackedAvatars.tsx`: pilha overlap configurável, "+N"
  pill brand-ghost quando excede o `max`.

### 24.3 ⚠️ REGRA OBRIGATÓRIA — Verificação de fotos

Após o incidente da v9.2 onde múltiplas fotos foram atribuídas erradamente
(Filé Parmegiana virou salada, frango virou peixe, pizza virou avocado
toast), toda foto adicionada a `lib/photos.ts` PRECISA:

1. Ser baixada e visualizada antes de entrar no catálogo
   (`curl -L "https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg"
   -o tmp.jpg` + abrir o arquivo)
2. Ser nomeada **pelo que a foto realmente mostra** — não pelo produto
   que a gente queria que mostrasse
3. Ter um comentário `// ✅ verified <data>: <descrição honesta>` ao lado
   do entry

Se uma solução precisa de uma foto que não temos verificada, **não force**:
caia no ícone/gradient fallback que cada mockup já suporta. **Foto errada
é pior que ícone correto.**

Padrão de fallback (TAA / QuickPass / CRM / etc):
```ts
const PRODUCT_PHOTO: Record<string, number> = {
  // só entries com foto verificada para aquele produto específico
  marguerita: food.pizza.id, // pizza fatiada real (verified)
};

// No render:
{PRODUCT_PHOTO[id] ? (
  <Image src={pexels(PRODUCT_PHOTO[id], {w, h, fit: "crop"})} ... />
) : (
  <div style={{ background: gradient }}><Icon /></div>
)}
```

---

## 25. Padrão V10 — SaaS 2026 (Linear/Notion/Vercel/Arc level)

V10 nasceu de "refino nível SaaS trending 2026, mas não se distancie das
references em /public — refinar, não mudar". Princípio: **mesmo produto
Teknisa, só mais polido**. Exceção: Retail Intelligence pode ser 100%
criativo (não tem ref em /public limitando).

### 25.1 SmartPOSDeviceFrame (device PDV portátil real)

Arquivo: `components/mockups/frames/SmartPOSDeviceFrame.tsx`.
Anatomia (referência /public/FrenteDeLoja/Smart POS/POS *.png):

```
┌───────────────────────┐
│  ●  APROXIME O CARTÃO │  ← NFC reader bay (64px), wave icons + LED verde
├───────────────────────┤
│                       │
│       SCREEN (9:17)   │
│                       │
├───────────────────────┤
│ ◀  ⬤  ☰  TEKNISA POS │  ← Android nav bar (44px), label do device
└───────────────────────┘
```

`SolutionDevice = "smartpos"` adicionado em `data/solutions.ts`.
SmartPOS agora usa device "smartpos" — não mais "mobile" (parecia celular).

### 25.2 Charts primitives — `components/ui/charts/`

3 charts SaaS-2026 reutilizáveis. SEMPRE consumir essas primitivas em vez
de escrever SVG custom:

- **DonutChart** + **DonutLegend** (`DonutChart.tsx`)
  - Anel animado via `stroke-dasharray` por slice
  - Centro com big label tabular-nums + caps subtitle
  - DonutLegend = lista lateral com color dot + label + valor + percent
  - Referência visual: Panacea Patient Risk Analytics, Knowwio Weekly Activity

- **AreaChart** (`AreaChart.tsx`)
  - Gradient fill 3-stop, line animada via `pathLength`
  - Grid horizontal sutil dashed
  - Reference line opcional (`referenceY` + `referenceLabel`)
  - **Tooltip vertical no hover** — line + dot + card branco com valor
  - Halo pulsante no último ponto quando idle
  - Props: `yMin`/`yMax` para amplificar pequenas variações
  - Referência visual: Knowwio Progress Overview

- **RadialGauge** (`RadialGauge.tsx`)
  - Half-circle (speedometer), gradient brand→roxo
  - Big value central
  - Animação `strokeDashoffset` de cheia → preenchimento
  - Referência visual: Knowwio Speed Optimization, DropInBlog gauge

### 25.3 UI primitives — `components/ui/`

- **ToggleSwitch** (`ToggleSwitch.tsx`): iOS-style com knob spring,
  variant `"labeled"` mostra ✓ no knob quando ON. Tones brand/success.
  Referência: Roles & Permissions ("Assign travel policies" ON).
- **ChipRemovable** (`ChipRemovable.tsx`): pill com X clicável, 5 tones
  (brand/neutral/success/warning/danger), `motion.span` scale-in.
  Referência: Roles & Permissions ("Liam Carter ✕").
- **GradientIcon** (`GradientIcon.tsx`): container de ícone Notion-style.
  8 tones (brand/ai/success/warning/danger/amber/teal/rose), variant
  `"soft"` (pastel bg + bold colored icon) ou `"solid"` (gradient fill +
  white icon + inset highlight). Clona lucide icon mantendo estilo.
  **Substitui** todos os blocos quadrados monocromáticos de ícone.

### 25.4 Tokens novos em `tailwind.config.ts`

Linear/Notion 2026 elevation system — sombras quase invisíveis:

```ts
boxShadow: {
  subtle: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
  elevated:
    "0 8px 24px -8px rgba(2,7,136,0.10), 0 2px 6px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
  "inset-soft": "inset 0 0 0 1px rgba(0,0,0,0.04)",
}
backgroundImage: {
  "brand-orb":  "radial-gradient(circle at 30% 25%, rgba(124,58,237,0.45), rgba(2,7,136,0.85) 65%, rgba(2,7,136,1))",
  "ai-gradient":"linear-gradient(135deg, #020788 0%, #1a1fa8 45%, #7c3aed 100%)",
  "ai-soft":    "radial-gradient(ellipse at top, rgba(124,58,237,0.10), transparent 55%), radial-gradient(ellipse at bottom right, rgba(2,7,136,0.08), transparent 55%)",
}
```

Uso:
- `shadow-card` legado continua existindo (compat), mas `shadow-subtle` é
  o default V10 para cards "calmos"
- `shadow-elevated` para hero/destaque
- `bg-ai-soft` em painéis de "hero KPI" (Mercadum hero, AppEstoque hero)
- `bg-ai-gradient` só em CTAs IA críticos
- `bg-brand-orb` em orbs de geração IA (Cardápio Inteligente)

### 25.5 Tipografia trending 2026

- Big numbers (≥18px): `font-ui font-bold tabular-nums`, `letter-spacing: -0.02em`
- Labels grandes (13-16px): `letter-spacing: -0.01em` ou `-0.005em`
- Eyebrow labels uppercase: `letter-spacing: 0.16-0.18em`, font-size 9-11px
  (mais espaçado que `tracking-wider` padrão do Tailwind)
- Sempre `tabular-nums` em valores numéricos para alinhamento

### 25.6 Refatorações aplicadas em V10 (transversal)

**TecFood:**
- WasteControl 4-kind selector ganhou GradientIcon per tipo (Sobra=success,
  Resto=amber, Produção=teal, Excesso=danger), active state com `layoutId`
- WasteControl Histórico ganhou Card "Composição por tipo" com DonutChart
  104px + DonutLegend
- CardapioInteligente CostPanel ganhou AreaChart 7d com reference line
  R$ 9,50 (meta)
- MyMenu dish cards refinados: GradientIcon per course (principal=amber,
  salada=success, sobremesa=brand, guarnição=teal)

**ERP Backoffice:**
- RotinaFiscal: header com RadialGauge 25% concluído + GradientIcons per
  status nas obrigações
- Rastreabilidade: **timeline VERTICAL → MILESTONE TIMELINE HORIZONTAL**
  (PMO Golden Garden style) com 3 estados de nó (done/active/pending),
  conector linear gradient, halo pulsante no active
- AppRotinasEstoque: hero "Hoje" com bg-ai-soft + GradientIcon +
  3-up KPIs com backdrop-blur

**Supply + RH:**
- Mercadum: KPI hero strip antes da tabela com 3 KPITiles (Cotações
  abertas / Economia / Fornecedores) + AreaChart 7d compact
- AssistenteRegras: regras com GradientIcon + ToggleSwitch primitive;
  ConditionsView ganhou row de ChipRemovable IA tokens (Hora extra ×,
  Sábado ×, Adicional 80% ×, Notifica gestor ×)

**Frente de Loja:**
- Retail Intelligence dashboard: Top desvios virou DonutChart + Legend;
  CMV chart custom virou AreaChart primitive com tooltip vertical hover

### 25.7 Checklist V10 — refatorando mockup existente

- [ ] Cards usam `shadow-subtle` ou `shadow-elevated` (não `shadow-card`
      heavy salvo casos específicos)
- [ ] Ícones em blocos quadrados foram trocados por `GradientIcon`
- [ ] Charts SVG custom foram trocados por primitives (`DonutChart`,
      `AreaChart`, `RadialGauge`)
- [ ] Toggles handmade foram trocados por `ToggleSwitch`
- [ ] Chips com X foram trocados por `ChipRemovable`
- [ ] Big numbers (≥18px) têm `letter-spacing: -0.02em` + `tabular-nums`
- [ ] Eyebrow labels uppercase têm `letter-spacing: 0.16-0.18em`
- [ ] Hero KPI areas usam `bg-ai-soft` quando faz sentido (refrear,
      não em todo lugar)
- [ ] Fotos novas obedeceram §24.3 (verificação manual + naming honesto)
- [ ] Mockup sem foto fiel mantém fallback ícone/gradient — **NUNCA forçar**

---

*Este documento deve ser mantido atualizado conforme o projeto evolui. Qualquer decisão de arquitetura, visual ou de fluxo que desvie das diretrizes aqui definidas deve ser documentada com justificativa.*

*Versão: 10.0 | Projeto: Teknisa Interactive Showcase*