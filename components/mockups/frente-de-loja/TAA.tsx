"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Tag,
  Fish,
  Utensils,
  IceCream,
  Coffee,
  Soup,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  Pizza,
  UserRound,
  Wallet,
  Wifi,
  Salad,
  Beef,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { brl } from "@/lib/format";
import { food, pexels } from "@/lib/photos";
import { GradientIcon } from "@/components/ui/GradientIcon";

// Per-product Pexels photo IDs. Only mapped when the photo TRULY matches
// what the product is — never force a generic photo on a specific dish.
// Products without an entry fall back to the legacy emoji + gradient block.
// See lib/photos.ts for the verification rule.
const PRODUCT_PHOTO: Record<string, number> = {
  // Restaurante Central — Brazilian dishes
  "carne-boi": food.beefSteak.id, // bife fatiado, próximo de carne de boi
  "frango-aceb": food.chickenRoasted.id, // frango assado com legumes
  costela: food.beefSteak.id, // sliced steak ~ costela fatiada
  "frango-grelhado": food.chickenRoasted.id,
  "penne-funghi": food.pastaCream.id, // penne ao molho branco com cogumelos
  spaghetti: food.pastaTomato.id, // penne ao tomate (closest pasta match)
  petit: food.chocolateCake.id,
  // Astrobox — pizza themed
  calabresa: food.pizza.id, // pizza de calabresa real (verified)
  marguerita: food.pizza.id,
  "pizza-japa": food.pizza.id,
  atum: food.pizza.id,
  "frango-estelar": food.pizza.id,
  "combo-basico": food.pizza.id,
  "combo-astrobox": food.burgerCheese.id, // o combo astrobox tem hambúrguer
  lasanha: food.pastaTomato.id,
  brownie: food.chocolateCake.id,
  // INTENTIONALLY OMITTED (no faithful photo → icon fallback used):
  //   file-mignon (não temos foto fiel de filé mignon ao molho madeira)
  //   combo-15, salmao-sashimi (sushi/sashimi — nenhuma foto fiel)
  //   salmao-grelhado, tilapia (poderiam usar fishGrilled mas só temos
  //     uma única foto de peixe, então deixamos para o emoji 🐟)
  //   suco-laranja, agua, coca, coca-600, guarana, pudim (bebidas/sobremesas
  //     sem foto fiel verificada)
};

interface TAAProps {
  step: number;
}

// ---------------------------------------------------------------------------
// Skins — same TAA, different commerce brand. The selector is the central
// "show, don't tell" demo of how the kiosk adapts to each client's identity.
// "Restaurante Central" = default neutral commerce; "Astrobox" = themed
// pizzaria. Both render the same components with different brand tokens.
// ---------------------------------------------------------------------------

interface Skin {
  id: "central" | "astrobox";
  name: string;
  brand: string;
  brandSoft: string;
  brandDark: string;
  accent: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCaption: string;
}

const SKINS: Record<"central" | "astrobox", Skin> = {
  central: {
    id: "central",
    name: "Restaurante Central",
    brand: "#020788",
    brandSoft: "#e8e9f8",
    brandDark: "#01055e",
    accent: "#1a1fa8",
    bannerTitle: "Economize na sua",
    bannerSubtitle: "próxima compra",
    bannerCaption: "R$ 25,00",
  },
  astrobox: {
    id: "astrobox",
    name: "Astrobox",
    brand: "#c8102e",
    brandSoft: "#fde8eb",
    brandDark: "#8b0a1f",
    accent: "#e62848",
    bannerTitle: "Complemente",
    bannerSubtitle: "seu pedido",
    bannerCaption: "fly me to the pizza!",
  },
};

// ---------------------------------------------------------------------------
// Categories + per-category catalog (each tab shows its own products)
// ---------------------------------------------------------------------------

type CategoryId =
  | "promo"
  | "pratos"
  | "sushi"
  | "peixes"
  | "massas"
  | "sobremesas"
  | "bebidas";

interface Category {
  id: CategoryId;
  label: string;
  Icon: typeof Tag;
}

const CATEGORIES: Category[] = [
  { id: "promo", label: "Promoções", Icon: Tag },
  { id: "pratos", label: "Pratos", Icon: Utensils },
  { id: "sushi", label: "Sushi", Icon: Fish },
  { id: "peixes", label: "Peixes", Icon: Fish },
  { id: "massas", label: "Massas", Icon: Soup },
  { id: "sobremesas", label: "Sobremesas", Icon: IceCream },
  { id: "bebidas", label: "Bebidas", Icon: Coffee },
];

// Product customization configs (per product). Each product declares which
// sections of the detail modal to render. Keeps detail screen relevant.
type CustomKind = "addons" | "ponto" | "sabores" | "tamanho";

interface CustomSection {
  kind: CustomKind;
  title: string;
  required?: string;
  options: { id: string; label: string; price?: number }[];
  single?: boolean; // single-select (radio) vs multi-stepper
}

interface Product {
  id: string;
  name: string;
  desc: string;
  oldPrice: number;
  price: number;
  emoji: string;
  bg: string;
  customSections: CustomSection[];
}

// --- Default brand catalog (Restaurante Central) ----------------------------
const CATALOG_CENTRAL: Record<CategoryId, Product[]> = {
  promo: [
    {
      id: "carne-boi",
      name: "Carne de Boi",
      desc: "Prato feito com arroz, feijão, batata frita e salada",
      oldPrice: 36.9,
      price: 29.9,
      emoji: "🍛",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #d97706 100%)",
      customSections: [
        {
          kind: "ponto",
          title: "Ponto da carne",
          required: "0/1",
          single: true,
          options: [
            { id: "mal", label: "Mal passada" },
            { id: "ao-ponto", label: "Ao ponto" },
            { id: "bem", label: "Bem passada" },
          ],
        },
        {
          kind: "addons",
          title: "Acompanhamentos extras",
          required: "0/3",
          options: [
            { id: "ovo", label: "Ovo frito", price: 4.0 },
            { id: "bacon", label: "Bacon crocante", price: 6.0 },
            { id: "salada", label: "Salada do dia", price: 5.0 },
          ],
        },
      ],
    },
    {
      id: "frango-aceb",
      name: "Frango Acebolado",
      desc: "Filé de frango grelhado, cebolas caramelizadas, arroz e legumes",
      oldPrice: 34.9,
      price: 27.9,
      emoji: "🍗",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #b45309 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Acompanhamentos extras",
          required: "0/3",
          options: [
            { id: "queijo", label: "Queijo gratinado", price: 5.0 },
            { id: "purê", label: "Purê de batata", price: 4.5 },
          ],
        },
      ],
    },
    {
      id: "costela",
      name: "Costela de Boi",
      desc: "Costela 12h no bafo com arroz, feijão e farofa",
      oldPrice: 44.9,
      price: 36.9,
      emoji: "🥩",
      bg: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #92400e 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Acompanhamentos extras",
          required: "0/3",
          options: [
            { id: "vinagrete", label: "Vinagrete", price: 3.0 },
            { id: "farofa", label: "Farofa premium", price: 4.0 },
          ],
        },
      ],
    },
  ],
  pratos: [
    {
      id: "file-mignon",
      name: "Filé Mignon ao Molho Madeira",
      desc: "Corte nobre 220g com risoto de parmesão",
      oldPrice: 78.9,
      price: 64.9,
      emoji: "🥩",
      bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #b91c1c 100%)",
      customSections: [
        {
          kind: "ponto",
          title: "Ponto da carne",
          required: "0/1",
          single: true,
          options: [
            { id: "mal", label: "Mal passada" },
            { id: "ao-ponto", label: "Ao ponto" },
            { id: "bem", label: "Bem passada" },
          ],
        },
      ],
    },
    {
      id: "frango-grelhado",
      name: "Frango Grelhado",
      desc: "Filé suculento, arroz integral, legumes salteados",
      oldPrice: 32.9,
      price: 26.9,
      emoji: "🍗",
      bg: "linear-gradient(135deg, #fef9c3 0%, #facc15 50%, #a16207 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Acompanhamentos extras",
          required: "0/2",
          options: [{ id: "queijo", label: "Queijo gratinado", price: 5.0 }],
        },
      ],
    },
  ],
  sushi: [
    {
      id: "combo-15",
      name: "Combo Sushi 15 peças",
      desc: "Sashimi salmão, niguiri, hot rolls, joe",
      oldPrice: 79.9,
      price: 64.9,
      emoji: "🍣",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fca5a5 50%, #b91c1c 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Adicionais",
          required: "0/3",
          options: [
            { id: "wasabi", label: "Wasabi extra", price: 2.0 },
            { id: "shoyu", label: "Shoyu adicional", price: 1.5 },
            { id: "gengibre", label: "Gengibre", price: 1.0 },
          ],
        },
      ],
    },
    {
      id: "salmao-sashimi",
      name: "Sashimi de Salmão 10 fatias",
      desc: "Cortes finos de salmão fresco com shoyu",
      oldPrice: 54.9,
      price: 49.9,
      emoji: "🐟",
      bg: "linear-gradient(135deg, #fed7aa 0%, #f97316 50%, #9a3412 100%)",
      customSections: [],
    },
  ],
  peixes: [
    {
      id: "salmao-grelhado",
      name: "Salmão Grelhado",
      desc: "Filé 180g com purê de batata e legumes",
      oldPrice: 64.9,
      price: 54.9,
      emoji: "🐟",
      bg: "linear-gradient(135deg, #fed7aa 0%, #fb923c 50%, #c2410c 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Molhos",
          required: "0/2",
          options: [
            { id: "limao", label: "Manteiga de limão", price: 3.0 },
            { id: "ervas", label: "Molho de ervas", price: 3.0 },
          ],
        },
      ],
    },
    {
      id: "tilapia",
      name: "Tilápia ao Molho de Maracujá",
      desc: "Filé empanado com arroz cremoso",
      oldPrice: 48.9,
      price: 39.9,
      emoji: "🐠",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #ca8a04 100%)",
      customSections: [],
    },
  ],
  massas: [
    {
      id: "penne-funghi",
      name: "Penne ao Molho Funghi",
      desc: "Funghi porcini, parmesão e creme de leite fresco",
      oldPrice: 48.9,
      price: 42.0,
      emoji: "🍝",
      bg: "linear-gradient(135deg, #fef9c3 0%, #facc15 50%, #92400e 100%)",
      customSections: [
        {
          kind: "addons",
          title: "Adicionais",
          required: "0/3",
          options: [
            { id: "parmesao", label: "Parmesão extra", price: 4.0 },
            { id: "frango", label: "Frango grelhado", price: 8.0 },
          ],
        },
      ],
    },
    {
      id: "spaghetti",
      name: "Spaghetti Carbonara",
      desc: "Bacon, ovo, parmesão, pimenta-do-reino",
      oldPrice: 42.9,
      price: 36.9,
      emoji: "🍜",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #b45309 100%)",
      customSections: [],
    },
  ],
  sobremesas: [
    {
      id: "petit",
      name: "Petit Gateau",
      desc: "Bolo de chocolate com recheio cremoso e sorvete",
      oldPrice: 24.9,
      price: 19.9,
      emoji: "🍰",
      bg: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #be185d 100%)",
      customSections: [],
    },
    {
      id: "pudim",
      name: "Pudim de Leite",
      desc: "Receita clássica com calda de caramelo",
      oldPrice: 18.9,
      price: 14.9,
      emoji: "🍮",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #b45309 100%)",
      customSections: [],
    },
  ],
  bebidas: [
    {
      id: "suco-laranja",
      name: "Suco de Laranja 400ml",
      desc: "Natural, sem açúcar, espremido na hora",
      oldPrice: 12.9,
      price: 9.9,
      emoji: "🍊",
      bg: "linear-gradient(135deg, #fed7aa 0%, #fb923c 50%, #c2410c 100%)",
      customSections: [],
    },
    {
      id: "agua",
      name: "Água Mineral 500ml",
      desc: "Com ou sem gás",
      oldPrice: 6.9,
      price: 5.0,
      emoji: "💧",
      bg: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #1d4ed8 100%)",
      customSections: [],
    },
    {
      id: "coca",
      name: "Refri Cola Zero 350ml",
      desc: "Lata gelada",
      oldPrice: 8.9,
      price: 6.9,
      emoji: "🥤",
      bg: "linear-gradient(135deg, #fecaca 0%, #f87171 50%, #7f1d1d 100%)",
      customSections: [],
    },
  ],
};

// --- Astrobox brand catalog -------------------------------------------------
const CATALOG_ASTROBOX: Record<CategoryId, Product[]> = {
  promo: [
    {
      id: "combo-basico",
      name: "Combo Básico",
      desc: "1 pizza (salgada), 1 porção de fritas média, 1 bebida",
      oldPrice: 39.9,
      price: 29.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #991b1b 100%)",
      customSections: [
        {
          kind: "sabores",
          title: "Escolha sua pizza",
          required: "0/1",
          single: true,
          options: [
            { id: "bacon", label: "Bacon Astronômico" },
            { id: "calabresa", label: "Calabresa Cósmica" },
            { id: "frango", label: "Frango Estelar" },
            { id: "lombo", label: "Lombo Galático" },
            { id: "marguerita", label: "Marguerita Magnética" },
            { id: "pepperoni", label: "Pepperoni Marciano" },
          ],
        },
        {
          kind: "tamanho",
          title: "Escolha sua batata",
          required: "0/3",
          options: [
            { id: "batata-m", label: "Batata M", price: 2.0 },
            { id: "batata-g", label: "Batata G", price: 5.0 },
          ],
        },
      ],
    },
    {
      id: "combo-astrobox",
      name: "Combo Astrobox",
      desc: "1 pizza grande + fritas G + bebida 600ml",
      oldPrice: 64.9,
      price: 54.9,
      emoji: "🌌",
      bg: "linear-gradient(135deg, #fecaca 0%, #f87171 50%, #7f1d1d 100%)",
      customSections: [
        {
          kind: "sabores",
          title: "Escolha sua pizza",
          required: "0/1",
          single: true,
          options: [
            { id: "calabresa", label: "Calabresa Cósmica" },
            { id: "pepperoni", label: "Pepperoni Marciano" },
            { id: "marguerita", label: "Marguerita Magnética" },
          ],
        },
      ],
    },
  ],
  pratos: [
    {
      id: "calabresa",
      name: "Pizza Calabresa Cósmica",
      desc: "Calabresa, cebola, mussarela e orégano",
      oldPrice: 39.9,
      price: 34.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #b45309 100%)",
      customSections: [],
    },
    {
      id: "frango-estelar",
      name: "Pizza Frango Estelar",
      desc: "Frango grelhado, mussarela, milho",
      oldPrice: 39.9,
      price: 34.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #92400e 100%)",
      customSections: [],
    },
    {
      id: "marguerita",
      name: "Pizza Marguerita Magnética",
      desc: "Tomate, mussarela, manjericão",
      oldPrice: 36.9,
      price: 29.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fef9c3 0%, #fcd34d 50%, #b45309 100%)",
      customSections: [],
    },
  ],
  sushi: [
    {
      id: "pizza-japa",
      name: "Pizza Japonesa Marciana",
      desc: "Salmão, cream cheese, cebolinha",
      oldPrice: 54.9,
      price: 44.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fed7aa 0%, #fb923c 50%, #c2410c 100%)",
      customSections: [],
    },
  ],
  peixes: [
    {
      id: "atum",
      name: "Pizza de Atum",
      desc: "Atum, cebola, azeitona, milho",
      oldPrice: 42.9,
      price: 36.9,
      emoji: "🍕",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #ca8a04 100%)",
      customSections: [],
    },
  ],
  massas: [
    {
      id: "lasanha",
      name: "Lasanha Galática",
      desc: "Massa caseira, ragu, mussarela, parmesão",
      oldPrice: 44.9,
      price: 38.9,
      emoji: "🍝",
      bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #b91c1c 100%)",
      customSections: [],
    },
  ],
  sobremesas: [
    {
      id: "brownie",
      name: "Brownie Estelar",
      desc: "Chocolate belga com sorvete de baunilha",
      oldPrice: 22.9,
      price: 18.9,
      emoji: "🍫",
      bg: "linear-gradient(135deg, #fcd34d 0%, #b45309 50%, #451a03 100%)",
      customSections: [],
    },
  ],
  bebidas: [
    {
      id: "coca-600",
      name: "Refri Cola 600ml",
      desc: "Gelada, sem açúcar disponível",
      oldPrice: 12.9,
      price: 9.9,
      emoji: "🥤",
      bg: "linear-gradient(135deg, #fecaca 0%, #f87171 50%, #7f1d1d 100%)",
      customSections: [],
    },
    {
      id: "guarana",
      name: "Guaraná 600ml",
      desc: "Gelado",
      oldPrice: 11.9,
      price: 8.9,
      emoji: "🥫",
      bg: "linear-gradient(135deg, #fef9c3 0%, #facc15 50%, #a16207 100%)",
      customSections: [],
    },
  ],
};

const FALLBACK_PRODUCT: Product = {
  id: "vazio",
  name: "Em breve",
  desc: "Novos itens chegando.",
  oldPrice: 0,
  price: 0,
  emoji: "✨",
  bg: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
  customSections: [],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TAAMockup({ step }: TAAProps) {
  const [skinId, setSkinId] = useState<"central" | "astrobox">("central");
  const skin = SKINS[skinId];
  const catalog = skinId === "central" ? CATALOG_CENTRAL : CATALOG_ASTROBOX;
  const [activeCategory, setActiveCategory] = useState<CategoryId>("promo");

  const products = catalog[activeCategory] ?? [];

  const [cart, setCart] = useState<Record<string, { qty: number; product: Product }>>({});
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [payment, setPayment] = useState<"credito" | "debito" | "pix" | null>(
    null,
  );

  const subtotal = useMemo(
    () =>
      Object.values(cart).reduce(
        (s, { qty, product }) => s + product.price * qty,
        0,
      ),
    [cart],
  );
  const cartCount = Object.values(cart).reduce((s, e) => s + e.qty, 0);

  const addItem = (product: Product) =>
    setCart((p) => {
      const cur = p[product.id]?.qty ?? 0;
      return { ...p, [product.id]: { product, qty: cur + 1 } };
    });
  const removeItem = (id: string) =>
    setCart((p) => {
      const cur = p[id];
      if (!cur) return p;
      const next = { ...p };
      if (cur.qty > 1) next[id] = { ...cur, qty: cur.qty - 1 };
      else delete next[id];
      return next;
    });

  // Once the tour leaves the "pick an item" phase (steps 0..2) clear any
  // user-selected product so it doesn't pop back into view when the tour
  // returns to an earlier step or re-renders the catalog.
  useEffect(() => {
    if (step >= 3 && openProductId !== null) {
      setOpenProductId(null);
    }
  }, [step, openProductId]);

  // Find product to show in detail modal. Step 2 opens the first product if
  // nothing was tapped, so the tour always has something to point at.
  const openProduct =
    (openProductId && findProductInCatalog(catalog, openProductId)) ||
    (step === 2 ? products[0] ?? FALLBACK_PRODUCT : null);

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const cartItems = Object.values(cart).map(({ qty, product }) => ({
      id: product.id,
      qty,
      name: product.name,
      price: product.price,
    }));
    patchLive({
      cartItems,
      cartCount,
      cartTotal: subtotal,
      cartSubtotal: subtotal,
      selectedItemName: cartItems[cartItems.length - 1]?.name,
      paymentMethod: payment ?? undefined,
      paymentLabel:
        payment === "credito"
          ? "Crédito"
          : payment === "debito"
            ? "Débito/Voucher"
            : payment === "pix"
              ? "Pix"
              : undefined,
      skinName: skin.name,
      activeCategoryLabel:
        CATEGORIES.find((c) => c.id === activeCategory)?.label,
    });
  }, [cart, cartCount, subtotal, payment, skin.name, activeCategory, patchLive]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-white font-ui"
      style={{ color: "#1f2330" }}
    >
      <BrandStripe skin={skin} skinId={skinId} onSkinChange={setSkinId} />

      <main className="relative flex-1 overflow-hidden">
        <HomeView
          skin={skin}
          products={products}
          cart={cart}
          activeCategory={activeCategory}
          onPickCategory={setActiveCategory}
          onPickProduct={(p) => setOpenProductId(p.id)}
        />

        <AnimatePresence mode="wait">
          {step === 0 && <OrderTypeModal key="order-type" skin={skin} />}
          {openProduct && step !== 3 && step < 4 && (
            <ItemDetailModal
              key={`detail-${openProduct.id}`}
              skin={skin}
              product={openProduct}
              quantity={cart[openProduct.id]?.qty ?? 0}
              onAdd={() => addItem(openProduct)}
              onRemove={() => removeItem(openProduct.id)}
              onClose={() => setOpenProductId(null)}
            />
          )}
          {step === 3 && (
            <PaymentModal
              key="payment"
              skin={skin}
              total={subtotal || 0}
              cartCount={cartCount}
              selected={payment}
              onPick={setPayment}
            />
          )}
          {step >= 4 && (
            <ProcessingDoneOverlay
              key="done"
              skin={skin}
              total={subtotal || 0}
              method={payment}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomTotalBar skin={skin} total={subtotal} cartCount={cartCount} />
    </div>
  );
}

function findProductInCatalog(
  catalog: Record<CategoryId, Product[]>,
  id: string,
): Product | null {
  for (const list of Object.values(catalog)) {
    const found = list.find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Top brand stripe — logo + status + discreet brand selector
// ---------------------------------------------------------------------------

function BrandStripe({
  skin,
  skinId,
  onSkinChange,
}: {
  skin: Skin;
  skinId: "central" | "astrobox";
  onSkinChange: (id: "central" | "astrobox") => void;
}) {
  return (
    <div
      className="relative flex items-center justify-between px-3 py-2 text-white"
      style={{
        background: `linear-gradient(180deg, ${skin.accent} 0%, ${skin.brand} 60%, ${skin.brandDark} 100%)`,
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.18)",
      }}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logo-teknisa-white.svg"
          alt="Teknisa"
          width={62}
          height={11}
          className="select-none opacity-95"
        />
        <span className="h-3 w-px bg-white/25" />
        <span
          className="font-ui text-[10.5px] font-bold uppercase opacity-90"
          style={{ letterSpacing: "0.18em" }}
        >
          Totem
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="relative inline-flex items-center rounded-full p-0.5 backdrop-blur"
          style={{
            background: "rgba(255,255,255,0.18)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
          }}
        >
          {(["central", "astrobox"] as const).map((id) => {
            const active = id === skinId;
            return (
              <motion.button
                key={id}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => onSkinChange(id)}
                className={cn(
                  "relative z-10 rounded-full px-2.5 py-1 font-ui text-[10.5px] font-bold uppercase transition-colors",
                  active ? "text-neutral-900" : "text-white/80",
                )}
                style={{ letterSpacing: "0.10em" }}
              >
                {active && (
                  <motion.span
                    layoutId="taa-skin-active"
                    className="absolute inset-0 rounded-full bg-white"
                    style={{
                      boxShadow:
                        "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 28,
                    }}
                  />
                )}
                <span className="relative">
                  {SKINS[id].name.split(" ")[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 backdrop-blur">
          <Wifi size={10} strokeWidth={2.5} className="opacity-90" />
          <span
            className="font-ui text-[10.5px] font-bold uppercase opacity-90 tabular-nums"
            style={{ letterSpacing: "0.10em" }}
          >
            Online
          </span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home — sidebar + promo banner + product grid
// ---------------------------------------------------------------------------

function HomeView({
  skin,
  products,
  cart,
  activeCategory,
  onPickCategory,
  onPickProduct,
}: {
  skin: Skin;
  products: Product[];
  cart: Record<string, { qty: number; product: Product }>;
  activeCategory: CategoryId;
  onPickCategory: (id: CategoryId) => void;
  onPickProduct: (p: Product) => void;
}) {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-[78px] flex-col border-r border-neutral-200 bg-white">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-1 border-b border-neutral-100 py-3"
          style={{ color: skin.brand }}
        >
          <Tag size={14} strokeWidth={2.5} />
          <span className="font-ui text-[10.5px] font-bold tracking-wider">
            CUPOM
          </span>
        </motion.button>
        {CATEGORIES.map((c) => {
          const active = c.id === activeCategory;
          // Map category to a gradient tone for the sidebar icon
          const tone: "amber" | "success" | "teal" | "brand" | "rose" =
            c.id === "promo"
              ? "amber"
              : c.id === "pratos" || c.id === "peixes"
                ? "brand"
                : c.id === "sushi"
                  ? "teal"
                  : c.id === "massas"
                    ? "amber"
                    : c.id === "sobremesas"
                      ? "rose"
                      : "success";
          return (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ x: 1 }}
              onClick={() => onPickCategory(c.id)}
              data-tour={c.id === "promo" ? "taa-cat-lanches" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors",
                active ? "" : "hover:bg-neutral-50",
              )}
              style={{
                background: active ? skin.brandSoft : undefined,
              }}
            >
              {active && (
                <motion.span
                  layoutId="taa-active-cat"
                  className="absolute inset-y-0 left-0 w-[3px] rounded-r-full"
                  style={{ background: skin.brand }}
                />
              )}
              <GradientIcon
                icon={<c.Icon />}
                tone={tone}
                size={28}
                variant={active ? "solid" : "soft"}
              />
              <span
                className="font-ui text-[10.5px] font-bold leading-tight"
                style={{
                  color: active ? skin.brand : "#6b7280",
                  letterSpacing: "0.04em",
                }}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Promo banner */}
        <div
          className="relative m-3 mb-2 flex items-center gap-3 overflow-hidden rounded-2xl p-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${skin.brandDark} 0%, ${skin.brand} 55%, ${skin.accent} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 18px rgba(0,0,0,0.12)",
          }}
        >
          {/* Decorative orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)",
            }}
          />
          <div className="relative flex-1">
            <p
              className="font-ui text-[10.5px] font-bold uppercase opacity-85"
              style={{ letterSpacing: "0.18em" }}
            >
              {skin.bannerTitle}
            </p>
            <p
              className="mt-0.5 font-display text-[14px] font-bold leading-tight"
              style={{ letterSpacing: "-0.018em" }}
            >
              {skin.bannerSubtitle}
            </p>
            <p
              className="mt-1.5 font-ui text-[18px] font-bold tabular-nums leading-none"
              style={{ letterSpacing: "-0.025em" }}
            >
              {skin.bannerCaption}
            </p>
          </div>
          <div
            className="relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl backdrop-blur"
            style={{
              background: "rgba(255,255,255,0.16)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 0 0 1px rgba(255,255,255,0.10)",
            }}
          >
            {skin.id === "astrobox" ? (
              <Pizza size={28} strokeWidth={1.5} />
            ) : (
              <Salad size={28} strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Section title + search */}
        <div className="flex items-center justify-between px-2.5 pb-1.5">
          <div className="flex items-center gap-2">
            <h2
              className="font-display text-[14px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.018em" }}
            >
              {CATEGORIES.find((c) => c.id === activeCategory)?.label ?? ""}
            </h2>
            <span
              className="rounded-full bg-brand/8 px-1.5 py-0.5 font-ui text-[10.5px] font-bold tabular-nums text-brand"
              style={{ letterSpacing: "0.04em" }}
            >
              {products.length} itens
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-neutral-500"
            style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.03)" }}
          >
            <Search size={10} strokeWidth={2.25} />
            Buscar
          </button>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-2"
            >
              {products.length === 0 && (
                <p className="col-span-2 py-6 text-center text-[11px] text-neutral-400">
                  Sem itens nesta categoria.
                </p>
              )}
              {products.map((p, i) => {
                const inCart = cart[p.id]?.qty ?? 0;
                const isFirst = i === 0;
                const photoId = PRODUCT_PHOTO[p.id];
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -2 }}
                    onClick={() => onPickProduct(p)}
                    data-tour={isFirst ? "taa-product-first" : undefined}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <div className="relative h-20 w-full overflow-hidden">
                      {photoId ? (
                        <Image
                          src={pexels(photoId, { w: 320, h: 240, fit: "crop" })}
                          alt={p.name}
                          fill
                          unoptimized
                          sizes="160px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="flex h-full w-full items-center justify-center text-[22px]"
                          style={{ background: p.bg }}
                        >
                          <span>{p.emoji}</span>
                        </div>
                      )}
                      {/* Subtle bottom gradient for legibility if any badge sits on photo */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent"
                      />
                      {p.oldPrice > p.price && (
                        <span className="absolute left-1.5 top-1.5 inline-flex items-center rounded-full bg-white/95 px-1.5 py-0.5 font-ui text-[10.5px] font-bold uppercase tracking-wider text-success shadow-card backdrop-blur">
                          {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% off
                        </span>
                      )}
                      {inCart > 0 && (
                        <motion.span
                          key={inCart}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="absolute right-1.5 top-1.5 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-1.5 font-ui text-[11px] font-bold shadow-brand"
                          style={{ color: skin.brand }}
                        >
                          ×{inCart}
                        </motion.span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 p-2">
                      <p className="font-ui text-[11px] font-bold leading-tight text-neutral-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-[10.5px] leading-tight text-neutral-500 line-clamp-2">
                        {p.desc}
                      </p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-ui text-[12px] font-bold tabular-nums text-success">
                          {brl(p.price)}
                        </span>
                        {p.oldPrice > p.price && (
                          <span className="text-[10.5px] text-neutral-400 line-through tabular-nums">
                            {brl(p.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order type modal — "Seu pedido é para: Comer aqui / Para Viagem"
// ---------------------------------------------------------------------------

function OrderTypeModal({ skin }: { skin: Skin }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 px-5 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full max-w-[320px]"
      >
        <p className="text-center font-ui text-[14px] font-medium text-neutral-700">
          Seu pedido é para:
        </p>
        <motion.button
          data-tour="taa-eat-here"
          type="button"
          whileTap={{ scale: 0.97 }}
          className="mt-3 flex w-full items-center justify-between rounded-2xl px-5 py-5 text-left text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          <span className="font-ui text-[18px] font-bold">Comer aqui</span>
          <Utensils size={36} strokeWidth={1.5} className="opacity-60" />
        </motion.button>
        <button
          type="button"
          className="mt-2.5 flex w-full items-center justify-between rounded-2xl px-5 py-5 text-left text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          <span className="font-ui text-[18px] font-bold">Para Viagem</span>
          <ShoppingBag size={36} strokeWidth={1.5} className="opacity-60" />
        </button>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-[10.5px] font-medium text-neutral-500 underline"
        >
          <UserRound size={11} strokeWidth={2.25} />
          Identifique-se com CPF
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Item detail — renders the ACTUAL product clicked with its own custom config
// ---------------------------------------------------------------------------

function ItemDetailModal({
  skin,
  product,
  quantity,
  onAdd,
  onRemove,
  onClose,
}: {
  skin: Skin;
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  // local customization state, fresh per product
  const [singleChoices, setSingleChoices] = useState<Record<string, string>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});

  const setSingle = (sectionTitle: string, value: string) =>
    setSingleChoices((p) => ({ ...p, [sectionTitle]: value }));
  const setCount = (key: string, value: number) =>
    setCounts((p) => ({ ...p, [key]: Math.max(0, value) }));

  const extrasTotal = product.customSections.reduce((sum, sec) => {
    if (sec.single) return sum;
    return (
      sum +
      sec.options.reduce(
        (s, o) => s + (o.price ?? 0) * (counts[`${sec.title}:${o.id}`] ?? 0),
        0,
      )
    );
  }, 0);
  const unitPrice = product.price + extrasTotal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex flex-col bg-white"
    >
      <div className="flex-1 overflow-y-auto">
        {/* Hero photo */}
        <div className="relative h-32 w-full overflow-hidden">
          {PRODUCT_PHOTO[product.id] ? (
            <Image
              src={pexels(PRODUCT_PHOTO[product.id], { w: 800, h: 400, fit: "crop" })}
              alt={product.name}
              fill
              unoptimized
              sizes="400px"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-center justify-center text-[44px]"
              style={{ background: product.bg }}
            >
              <span>{product.emoji}</span>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 text-white">
            <p className="font-ui text-[15px] font-bold leading-tight drop-shadow">
              {product.name}
            </p>
            <p className="mt-0.5 text-[10.5px] leading-snug text-white/85 line-clamp-2">
              {product.desc}
            </p>
          </div>
        </div>
        <div className="px-3 py-3">

        {product.customSections.length === 0 && (
          <p className="mt-4 rounded-md bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500">
            Este item não tem personalização. Ajuste só a quantidade e adicione
            ao carrinho.
          </p>
        )}

        {product.customSections.map((sec) => (
          <Section
            key={sec.title}
            title={sec.title}
            required={sec.required}
            skin={skin}
          >
            {sec.single ? (
              <div className="grid grid-cols-2 gap-1.5">
                {sec.options.map((opt) => {
                  const active = singleChoices[sec.title] === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSingle(sec.title, opt.id)}
                      className="flex items-center gap-1.5 rounded-md border-2 px-2 py-2 text-left transition-colors"
                      style={{
                        borderColor: active ? skin.brand : "#e5e7eb",
                        background: active ? skin.brandSoft : "white",
                      }}
                    >
                      <span
                        className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2"
                        style={{
                          borderColor: active ? skin.brand : "#cbd5e1",
                          background: active ? skin.brand : "white",
                        }}
                      >
                        {active && (
                          <span className="h-1 w-1 rounded-full bg-white" />
                        )}
                      </span>
                      <span className="font-ui text-[10.5px] font-medium text-neutral-900 line-clamp-1">
                        {opt.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1.5">
                {sec.options.map((opt) => {
                  const key = `${sec.title}:${opt.id}`;
                  const value = counts[key] ?? 0;
                  return (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-2.5 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-md"
                          style={{
                            background: skin.brandSoft,
                            color: skin.brand,
                          }}
                        >
                          {sec.kind === "sabores" || sec.kind === "tamanho" ? (
                            <Pizza size={12} strokeWidth={1.75} />
                          ) : (
                            <Beef size={12} strokeWidth={1.75} />
                          )}
                        </div>
                        <span className="font-ui text-[11px] font-medium text-neutral-700">
                          {opt.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {opt.price && (
                          <span className="font-ui text-[10.5px] font-bold text-neutral-700 tabular-nums">
                            + {brl(opt.price)}
                          </span>
                        )}
                        <Stepper
                          value={value}
                          onChange={(v) => setCount(key, v)}
                          skin={skin}
                          compact
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        ))}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] text-neutral-400 line-through tabular-nums">
              {brl(product.oldPrice)}
            </span>
            <span
              className="font-ui text-[16px] font-bold tabular-nums"
              style={{ color: "#16a34a" }}
            >
              {brl(unitPrice)}
            </span>
          </div>
          <Stepper
            value={quantity}
            onChange={(v) => {
              if (v > quantity) onAdd();
              else onRemove();
            }}
            skin={skin}
            compact
          />
        </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-neutral-100 bg-white p-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md border-2 py-2.5 font-ui text-[12px] font-bold"
          style={{ borderColor: skin.brand, color: skin.brand }}
        >
          Cancelar
        </button>
        <motion.button
          type="button"
          data-tour="taa-combo-burger"
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="flex-[1.4] rounded-md py-2.5 font-ui text-[12px] font-bold text-white shadow-brand"
          style={{ background: skin.brand }}
        >
          Adicionar ao carrinho
        </motion.button>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  required,
  children,
  skin,
}: {
  title: string;
  required?: string;
  children: React.ReactNode;
  skin: Skin;
}) {
  return (
    <div className="mt-3">
      <div
        className="-mx-3 flex items-center justify-between px-3 py-1.5"
        style={{ background: skin.brandSoft }}
      >
        <p
          className="font-ui text-[11px] font-bold"
          style={{ color: skin.brand }}
        >
          {title}
        </p>
        {required && (
          <p
            className="font-ui text-[10.5px] font-medium"
            style={{ color: skin.brand }}
          >
            {required}
          </p>
        )}
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

function Stepper({
  value,
  onChange,
  skin,
  compact,
}: {
  value: number;
  onChange: (v: number) => void;
  skin: Skin;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-1 rounded-md border px-1 py-0.5"
        style={{ borderColor: skin.brand }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className={cn(
            "flex h-6 w-6 items-center justify-center",
            value === 0 && "opacity-40",
          )}
          style={{ color: skin.brand }}
        >
          <Minus size={11} strokeWidth={2.5} />
        </button>
        <motion.span
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-4 text-center font-ui text-[12px] font-bold tabular-nums"
        >
          {value}
        </motion.span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-6 w-6 items-center justify-center"
          style={{ color: skin.brand }}
        >
          <Plus size={11} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Payment modal — methods + NFC banner when selected
// ---------------------------------------------------------------------------

function PaymentModal({
  skin,
  total,
  cartCount,
  selected,
  onPick,
}: {
  skin: Skin;
  total: number;
  cartCount: number;
  selected: "credito" | "debito" | "pix" | null;
  onPick: (m: "credito" | "debito" | "pix") => void;
}) {
  // Guard: payment with empty cart should not be allowed (R$ 0,00 paymant bug)
  const canPay = cartCount > 0 && total > 0;
  const methods: {
    id: "credito" | "debito" | "pix";
    label: string;
    Icon: typeof CreditCard;
  }[] = [
    { id: "credito", label: "Crédito", Icon: CreditCard },
    { id: "debito", label: "Débito/Voucher", Icon: CreditCard },
    { id: "pix", label: "Pix", Icon: Wallet },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 z-30 flex flex-col bg-white"
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-3">
        <span
          aria-hidden
          className="mx-auto mb-3 h-1 w-12 rounded-full"
          style={{ background: skin.brandSoft }}
        />
        <h2 className="font-ui text-[18px] font-bold text-neutral-900">
          Pagamento
        </h2>
        <p className="mt-2 text-[12px] text-neutral-700">
          Escolha uma forma de pagamento. Pode trocar quantas vezes quiser.
        </p>

        <div className="mt-3 space-y-2">
          {methods.map((m) => {
            const active = selected === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                data-tour={m.id === "pix" ? "taa-pix-button" : undefined}
                onClick={() => onPick(m.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                style={{
                  background: active ? skin.brand : skin.brandSoft,
                  color: active ? "white" : skin.brand,
                  border: active
                    ? `2px solid ${skin.brand}`
                    : "2px solid transparent",
                }}
              >
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-md"
                  style={{
                    background: active ? "white" : skin.brand,
                    color: active ? skin.brand : "white",
                  }}
                >
                  <m.Icon size={16} strokeWidth={2} />
                </span>
                <span className="flex-1 font-ui text-[14px] font-bold">
                  {m.label}
                </span>
                {active ? (
                  <CheckCircle2
                    size={18}
                    strokeWidth={2.25}
                    className="text-white"
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    strokeWidth={2.25}
                    style={{ color: skin.brand }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-3 flex items-center gap-3 rounded-xl p-3 text-white"
              style={{ background: skin.brand }}
            >
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white"
                style={{ color: skin.brand }}
              >
                {selected === "pix" ? (
                  <Wallet size={24} strokeWidth={2.25} />
                ) : (
                  <Wifi size={24} strokeWidth={2.25} />
                )}
              </motion.span>
              <p className="font-ui text-[11px] leading-snug">
                {selected === "pix"
                  ? "Use a câmera do seu app do banco para ler o QR no display do caixa."
                  : "Insira ou aproxime seu cartão da maquininha para realizar o pagamento."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="flex items-center justify-between gap-2 px-3 py-3 text-white"
        style={{ background: skin.brand }}
      >
        <div>
          <p className="text-[10.5px] opacity-80">Total:</p>
          <p className="font-ui text-[16px] font-bold tabular-nums">
            {brl(total || 0)}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="rounded-md border border-white px-2.5 py-2 font-ui text-[10.5px] font-bold text-white"
          >
            Continuar Comprando
          </button>
          <button
            type="button"
            disabled={!canPay}
            className="rounded-md bg-white px-2.5 py-2 font-ui text-[10.5px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: skin.brand }}
          >
            {canPay ? "Finalizar Compra" : "Carrinho vazio"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Confirmation overlay
// ---------------------------------------------------------------------------

function ProcessingDoneOverlay({
  skin,
  total,
  method,
}: {
  skin: Skin;
  total: number;
  method: "credito" | "debito" | "pix" | null;
}) {
  const methodLabel =
    method === "credito"
      ? "Crédito aprovado"
      : method === "debito"
        ? "Débito aprovado"
        : method === "pix"
          ? "Pix confirmado"
          : "Pagamento aprovado";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white px-6"
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full text-white"
        style={{ background: "#16a34a" }}
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2"
          style={{ borderColor: "#16a34a" }}
        />
        <CheckCircle2 size={54} strokeWidth={2} />
      </motion.div>

      <div className="text-center">
        <h2 className="font-ui text-[20px] font-bold text-neutral-900">
          Pedido confirmado
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500">{methodLabel}</p>
      </div>

      <div
        data-tour="taa-senha-card"
        className="rounded-2xl border-2 border-dashed px-8 py-4 text-center"
        style={{ borderColor: skin.brand, background: skin.brandSoft }}
      >
        <p
          className="text-[10.5px] font-bold uppercase tracking-wider"
          style={{ color: skin.brand }}
        >
          Sua senha
        </p>
        <p
          className="mt-1 font-ui text-[40px] font-bold leading-none tabular-nums"
          style={{ color: skin.brand }}
        >
          A1247
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-neutral-500">
          <Clock size={11} strokeWidth={2.25} />
          Tempo estimado
          <span className="font-bold text-neutral-700">8 min</span>
        </p>
      </div>

      <p className="text-center text-[11px] text-neutral-500">
        Total pago{" "}
        <span className="font-ui font-bold text-neutral-700 tabular-nums">
          {brl(total)}
        </span>
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Bottom dark total bar
// ---------------------------------------------------------------------------

function BottomTotalBar({
  skin,
  total,
  cartCount,
}: {
  skin: Skin;
  total: number;
  cartCount: number;
}) {
  return (
    <div
      className="relative flex items-center justify-between gap-2 px-3 py-2.5 text-white"
      style={{
        background: `linear-gradient(180deg, ${skin.brand} 0%, ${skin.brandDark} 100%)`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <Image
        src="/logo-teknisa-white.svg"
        alt="Teknisa"
        width={62}
        height={11}
        className="select-none opacity-95"
      />
      <div className="flex items-center gap-3 text-right">
        <div className="leading-tight">
          <p
            className="font-ui text-[10.5px] font-bold uppercase opacity-80"
            style={{ letterSpacing: "0.16em" }}
          >
            Total
          </p>
          <p
            className="mt-0.5 font-ui text-[15px] font-bold tabular-nums leading-none"
            style={{ letterSpacing: "-0.025em" }}
          >
            {brl(total)}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="relative flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-ui text-[10.5px] font-bold transition-all hover:-translate-y-[1px]"
          style={{
            color: skin.brand,
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.40)",
            letterSpacing: "-0.005em",
          }}
        >
          <ShoppingBag size={12} strokeWidth={2.5} />
          Ver Carrinho
          {cartCount > 0 && (
            <span
              className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-white tabular-nums"
              style={{
                background: skin.brand,
                fontSize: 10,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              {cartCount}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
