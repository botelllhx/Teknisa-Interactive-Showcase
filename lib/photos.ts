/**
 * Curated Pexels CDN URLs used throughout the showcase.
 *
 * All IDs verified to respond 200 from `images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg`.
 * Pexels content is free for commercial use (https://www.pexels.com/license/).
 *
 * Usage pattern in components:
 *   <Image src={people.maria.url} alt={people.maria.alt} fill className="object-cover" />
 *
 * Or via next/image with width helper:
 *   pexels(123456, { w: 400, h: 400 })
 */

export function pexels(
  id: number,
  opts: { w?: number; h?: number; fit?: "crop" | "contain" } = {},
): string {
  const params = new URLSearchParams();
  params.set("auto", "compress");
  params.set("cs", "tinysrgb");
  if (opts.w) params.set("w", String(opts.w));
  if (opts.h) params.set("h", String(opts.h));
  if (opts.fit === "crop") {
    params.set("fit", "crop");
  }
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${params.toString()}`;
}

export interface Photo {
  id: number;
  alt: string;
}

// =====================================================================
// PEOPLE — portraits used for avatars, employee cards, customer profiles
// =====================================================================

export const people = {
  // Managers / executives
  joao: { id: 220453, alt: "João Costa" } as Photo,
  carlos: { id: 1222271, alt: "Carlos Mello" } as Photo,
  ricardo: { id: 3777943, alt: "Ricardo Almeida" } as Photo,
  pedro: { id: 1300402, alt: "Pedro Souza" } as Photo,
  diego: { id: 2379004, alt: "Diego Lima" } as Photo,
  thomas: { id: 2182970, alt: "Thomas Andrade" } as Photo,

  // Employees / staff
  mariana: { id: 415829, alt: "Mariana Costa" } as Photo,
  ana: { id: 733872, alt: "Ana Costa" } as Photo,
  juliana: { id: 1239291, alt: "Juliana Mendes" } as Photo,
  camila: { id: 762020, alt: "Camila Lopes" } as Photo,
  beatriz: { id: 1820770, alt: "Beatriz Silva" } as Photo,
  sofia: { id: 3760263, alt: "Sofia Almeida" } as Photo,
  laura: { id: 2381069, alt: "Laura Pereira" } as Photo,
  bruna: { id: 3184405, alt: "Bruna Cardoso" } as Photo,
  rafael: { id: 1844547, alt: "Rafael Souza" } as Photo,
  felipe: { id: 4255490, alt: "Felipe Oliveira" } as Photo,
} as const;

// =====================================================================
// FOOD — dishes, products, drinks
// =====================================================================

export const food = {
  // Burgers and fast food
  burgerArtesanal: { id: 1639557, alt: "Hambúrguer artesanal" } as Photo,
  burgerCombo: { id: 1639565, alt: "Combo hambúrguer e batata" } as Photo,
  burgerSimples: { id: 776538, alt: "Hambúrguer simples" } as Photo,

  // Pizza
  pizzaMargherita: { id: 1147687, alt: "Pizza margherita" } as Photo,

  // Brazilian / executive dishes
  costela: { id: 769289, alt: "Costela grelhada" } as Photo,
  fileParmegiana: { id: 1640774, alt: "Filé parmegiana" } as Photo,
  pasta: { id: 1437267, alt: "Massa ao molho" } as Photo,
  pastaCarbonara: { id: 1487511, alt: "Pasta carbonara" } as Photo,
  saladBowl: { id: 1640777, alt: "Bowl de salada" } as Photo,
  salmao: { id: 1352281, alt: "Salmão grelhado" } as Photo,
  frango: { id: 725991, alt: "Frango grelhado" } as Photo,

  // Desserts
  chocolateCake: { id: 132694, alt: "Bolo de chocolate" } as Photo,

  // Drinks
  coffee: { id: 302899, alt: "Café expresso" } as Photo,
  smoothie: { id: 1346155, alt: "Smoothie de frutas" } as Photo,
  soda: { id: 2641886, alt: "Refrigerante gelado" } as Photo,
} as const;

// =====================================================================
// VENUES — restaurant / store interiors and exteriors
// =====================================================================

export const venues = {
  restaurantModern: { id: 262978, alt: "Restaurante moderno" } as Photo,
  restaurantInterior: { id: 941861, alt: "Interior de restaurante" } as Photo,
  coffeeShop: { id: 1855214, alt: "Café gourmet" } as Photo,
} as const;

// =====================================================================
// AVATAR FALLBACK COLOR PALETTE — derives from name initials when no
// photo is wanted (used in stacked groups for variety)
// =====================================================================

export const avatarColors = [
  { bg: "#0284c7", fg: "#fff" }, // sky
  { bg: "#16a34a", fg: "#fff" }, // green
  { bg: "#d97706", fg: "#fff" }, // amber
  { bg: "#dc2626", fg: "#fff" }, // red
  { bg: "#7c3aed", fg: "#fff" }, // violet
  { bg: "#020788", fg: "#fff" }, // brand
  { bg: "#ec4899", fg: "#fff" }, // pink
  { bg: "#0d9488", fg: "#fff" }, // teal
] as const;

export function colorForInitials(s: string) {
  const i =
    s.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[i];
}
