import type { Variants, Transition } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

export const slideFromTop: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

export const slideFromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// v13.22 — pageTransition refeito com filter blur + scale + y para
// dar SENSAÇÃO DE PROFUNDIDADE no clique dos cards. Antes era um
// fade-scale simples (sentia parado). Agora é cinematográfico:
// content entrante vem com slight blur + scale + slide up,
// outgoing vai com blur + scale up + slide down (sai da câmera).
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.94,
    y: 24,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease,
      filter: { duration: 0.4, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -16,
    filter: "blur(8px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const pulseRing = {
  animate: {
    scale: [1, 1.6, 1],
    opacity: [0.6, 0, 0.6],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const cardPress = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 },
};

// ============================================================
// V7 additions — soft, fast, premium variants reusable across
// the whole app (frames, companions, tour UI, mockups, etc.)
// ============================================================

/**
 * Quick, lightweight entrance for any element. Smaller travel than
 * fadeInUp, faster than fadeIn. Use for inline content reveals where
 * you want presence without much animation.
 */
export const softFadeIn: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/**
 * Stagger container with tighter timing — great for short rows or
 * groups of 2–6 items where the standard stagger feels too slow.
 */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/**
 * Stagger container tuned for card grids. Slightly longer per-child
 * gap and a small delay so the first card lands AFTER its parent
 * settles.
 */
export const staggerCards: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/**
 * Soft spring transition — premium, slightly bouncy but not playful.
 * Spread into a `transition` prop or use as `transition={softSpring}`.
 */
export const softSpring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 0.6,
};

/**
 * Infinite halo pulse for highlight rings, status dots, and
 * "alive" indicators. Animates the boxShadow keyframes around the
 * brand color so it can be applied to a wrapping div without
 * affecting layout.
 */
export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(2,7,136,0.0), 0 0 0 0 rgba(2,7,136,0.0)",
      "0 0 0 6px rgba(2,7,136,0.18), 0 0 24px 8px rgba(2,7,136,0.28)",
      "0 0 0 0 rgba(2,7,136,0.0), 0 0 0 0 rgba(2,7,136,0.0)",
    ],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

/**
 * Count-up entrance for numeric values that change. Pair with a
 * `key={value}` on the element so the animation replays whenever the
 * displayed number changes.
 */
export const countUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};
