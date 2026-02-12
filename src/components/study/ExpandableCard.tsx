/**
 * ExpandableCard Component - Glassmorphism with Japanese Colors
 * Advanced collapsible card with Framer Motion animations
 */

import { ReactNode, useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface ExpandableCardProps {
  /** Card title */
  title: string;
  /** Card content */
  children: ReactNode;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Card variant */
  variant?: 'default' | 'subtle' | 'strong' | 'accent' | 'profile';
  /** Theme color */
  theme?: 'ai' | 'matcha' | 'sakura' | 'sumi' | 'gold';
  /** Custom icon */
  icon?: ReactNode;
  /** Additional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** On toggle callback */
  onToggle?: (expanded: boolean) => void;
}

/**
 * ExpandableCard - Bouncy glassmorphism card with spring animations
 *
 * Features:
 * - Spring physics with cubic-bezier easing
 * - Multiple glassmorphism variants
 * - Japanese color theming
 * - Keyboard accessible (Space/Enter to toggle)
 * - Smooth height animation
 * - Hover lift effect
 */
export function ExpandableCard({
  title,
  children,
  defaultExpanded = false,
  variant = 'default',
  theme = 'ai',
  icon,
  className = '',
  disabled = false,
  onToggle,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  // Handle height animation
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else if (!isExpanded) {
      setHeight(0);
    }
  }, [isExpanded]);

  // Toggle handler with keyboard support
  const handleToggle = () => {
    if (disabled) return;
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  // Keyboard handler
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Variant styles mapping
  const variantStyles = {
    default: 'glass-card',
    subtle: 'glass-card-subtle',
    strong: 'glass-card-strong',
    accent: 'glass-card-strong glass-glow',
    profile: 'glass-card-subtle hover-lift',
  };

  // Theme color mapping for icons
  const themeColors = {
    ai: 'text-ai-500',
    matcha: 'text-matcha-500',
    sakura: 'text-sakura-500',
    sumi: 'text-sumi-500',
    gold: 'text-gold-500',
  };

  // Spring animation config
  const springConfig = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  };

  const baseCard = variantStyles[variant];

  return (
    <motion.div
      className={`${baseCard} rounded-2xl overflow-hidden ${disabled ? 'opacity-60' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      whileHover={disabled ? {} : { scale: 1.01, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
    >
      {/* Header - Always visible */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-6 text-left transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover-lift'
        }`}
        aria-expanded={isExpanded}
        aria-controls="expandable-content"
        aria-disabled={disabled}
      >
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-4 flex-1">
          {/* Custom icon or default theme icon */}
          {icon && (
            <div className={`flex-shrink-0 ${themeColors[theme]}`}>
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-sumi">
            {title}
          </h3>
        </div>

        {/* Right side: Chevron (rotates on expand) */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={springConfig}
          className={`flex-shrink-0 ml-4 ${themeColors[theme]}`}
        >
          <ChevronDown size={24} strokeWidth={2.5} />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="expandable-content"
            ref={contentRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springConfig}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
