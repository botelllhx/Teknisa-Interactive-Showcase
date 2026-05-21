import type { Variants } from "framer-motion";

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

export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.25 } },
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
