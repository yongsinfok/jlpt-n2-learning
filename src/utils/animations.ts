/**
 * Animation Utilities - Bouncy Spring Physics
 * Japanese-inspired playful animations
 */

import { Transition } from 'framer-motion';

/**
 * Spring animation presets for bouncy effects
 */
export const springPresets = {
  /** Gentle bounce - for subtle interactions */
  gentle: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  } as const,

  /** Bouncy - for buttons and cards */
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  } as const,

  /** Very bouncy - for playful interactions */
  veryBouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 15,
  } as const,

  /** Snappy - for quick transitions */
  snappy: {
    type: 'spring',
    stiffness: 600,
    damping: 30,
  } as const,

  /** Smooth - for page transitions */
  smooth: {
    type: 'spring',
    stiffness: 350,
    damping: 35,
  } as const,

  /** Elastic - for special effects */
  elastic: {
    type: 'spring',
    stiffness: 200,
    damping: 10,
    mass: 0.8,
  } as const,
};

/**
 * Common transition variants
 */
export const variants = {
  /** Fade in from bottom */
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },

  /** Fade in from center with scale */
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },

  /** Slide from right */
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },

  /** Slide from left */
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },

  /** Stagger children */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

/**
 * Page transition variants
 */
export const pageVariants = {
  /** Slide and fade */
  slideFade: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
    transition: springPresets.smooth,
  },

  /** Scale and fade */
  scaleFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: springPresets.gentle,
  },
};

/**
 * Stagger children animation delay
 */
export const staggerDelay = (index: number, baseDelay = 0.1) => {
  return index * baseDelay;
};

/**
 * Transition with spring animation
 */
export const springTransition = (preset: keyof typeof springPresets = 'bouncy'): Transition => {
  return {
    ...springPresets[preset],
    duration: 0.6,
  };
};

/**
 * Micro-interaction hover animation
 */
export const hoverTransition = {
  scale: 1.05,
  transition: springPresets.bouncy,
};

/**
 * Tap/click feedback animation
 */
export const tapTransition = {
  scale: 0.95,
  transition: {
    type: 'spring',
    stiffness: 600,
    damping: 20,
  },
};
