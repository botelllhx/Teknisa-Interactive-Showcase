/**
 * Curated Pexels CDN URLs used throughout the showcase.
 *
 * ============================================================================
 * VERIFICATION RULE (added v10.5 after photo-mismatch audit)
 * ============================================================================
 * Every photo ID in this file MUST be verified by actually viewing the image
 * before being added. Naming MUST describe what the photo really shows — not
 * the product we wish it showed. If a product doesn't have a faithful photo
 * match, do NOT force a generic photo: render the icon/gradient fallback that
 * each mockup already supports.
 *
 * Past mistakes that prompted this rule (v9.2):
 *   - "fileParmegiana" was actually a top-down salad bowl photo
 *   - "frango" was a grilled fish (not chicken)
 *   - "salmao" was an ice cream sundae
 *   - "pizzaMargherita" was an avocado toast
 *   - "smoothie" was a glass of water
 *   - "soda" was a kebab plate
 * Result: cart screens, hero photos and dish previews showed the wrong food.
 *
 * Pexels content is free for commercial use (https://www.pexels.com/license/).
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
// PEOPLE — portrait photos used for avatars, employee cards, customer
// profiles. Each ID is a 200-confirmed Pexels portrait; the assignment to
// a name is arbitrary (we never claim "this IS that person") so there is
// no truthfulness issue here, only a visual coverage issue.
// =====================================================================

export const people = {
  // Manager / executive faces
  joao: { id: 220453, alt: "Retrato profissional" } as Photo,
  carlos: { id: 1222271, alt: "Retrato profissional" } as Photo,
  ricardo: { id: 3777943, alt: "Retrato profissional" } as Photo,
  pedro: { id: 1300402, alt: "Retrato profissional" } as Photo,
  diego: { id: 2379004, alt: "Retrato profissional" } as Photo,
  thomas: { id: 2182970, alt: "Retrato profissional" } as Photo,

  // Employees / staff faces
  mariana: { id: 415829, alt: "Retrato profissional" } as Photo,
  ana: { id: 733872, alt: "Retrato profissional" } as Photo,
  juliana: { id: 1239291, alt: "Retrato profissional" } as Photo,
  camila: { id: 762020, alt: "Retrato profissional" } as Photo,
  beatriz: { id: 1820770, alt: "Retrato profissional" } as Photo,
  sofia: { id: 3760263, alt: "Retrato profissional" } as Photo,
  laura: { id: 2381069, alt: "Retrato profissional" } as Photo,
  bruna: { id: 3184405, alt: "Retrato profissional" } as Photo,
  rafael: { id: 1844547, alt: "Retrato profissional" } as Photo,
  felipe: { id: 4255490, alt: "Retrato profissional" } as Photo,
} as const;

// =====================================================================
// FOOD — only photos manually verified to match their name. If a dish
// type isn't listed below, the mockup MUST use an icon fallback instead
// of forcing a wrong photo.
// =====================================================================

export const food = {
  // ✅ verified 2026-05-23: cheeseburger with bacon, lettuce, tomato
  burgerCheese: { id: 1639557, alt: "Hambúrguer com cheddar e bacon" } as Photo,
  // ✅ verified: single cheeseburger on wood board (no fries)
  burgerSimple: { id: 1639565, alt: "Hambúrguer artesanal" } as Photo,
  // ✅ verified: golden french fries with chimichurri/BBQ dip
  fries: { id: 1893555, alt: "Porção de batata frita" } as Photo,
  // ✅ verified: whole pizza with pepperoni, sliced
  pizza: { id: 825661, alt: "Pizza fatiada de calabresa" } as Photo,
  // ✅ verified: penne with red tomato sauce, basil
  pastaTomato: { id: 1437267, alt: "Penne ao molho de tomate" } as Photo,
  // ✅ verified: penne with cream sauce and mushrooms
  pastaCream: { id: 1487511, alt: "Penne ao molho branco" } as Photo,
  // ✅ verified: bowl of roasted vegetables + quinoa
  saladBowl: { id: 1640777, alt: "Bowl de salada com legumes" } as Photo,
  // ✅ verified: sliced steak (picanha-style) with vegetables and sauce
  beefSteak: { id: 769289, alt: "Bife fatiado com legumes" } as Photo,
  // ✅ verified: white fish fillet with vegetables on blue plate
  fishGrilled: { id: 1516415, alt: "Filé de peixe grelhado" } as Photo,
  // ✅ verified: roasted whole chicken with carrots, onions, lemon
  chickenRoasted: { id: 6210959, alt: "Frango assado com legumes" } as Photo,
  // ✅ verified: dark chocolate cake slice with strawberry on top
  chocolateCake: { id: 132694, alt: "Fatia de bolo de chocolate" } as Photo,
  // ✅ verified: latte being poured into a white cup, latte art
  coffeeLatte: { id: 302899, alt: "Café com leite vaporizado" } as Photo,
} as const;

// =====================================================================
// VENUES — interior/exterior shots. Verified visually.
// =====================================================================

export const venues = {
  // ✅ verified: modern restaurant interior with hanging lights
  restaurantModern: { id: 262978, alt: "Interior de restaurante moderno" } as Photo,
  // ✅ verified: cozy restaurant interior with tables and warm lighting
  restaurantInterior: { id: 941861, alt: "Interior de restaurante" } as Photo,
  // ✅ verified: cafe interior with bar counter
  coffeeShop: { id: 1855214, alt: "Café gourmet" } as Photo,
} as const;

// =====================================================================
// AVATAR FALLBACK COLOR PALETTE — derives from name initials when no
// photo is desired (used in stacked groups for variety)
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
