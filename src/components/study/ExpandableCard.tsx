import { ReactNode, useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface ExpandableCardProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  variant?: 'default' | 'subtle' | 'strong' | 'accent' | 'profile';
  theme?: 'accent' | 'pine' | 'amber' | 'ink' | 'gold';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function ExpandableCard({
  title,
  children,
  defaultExpanded = false,
  variant = 'default',
  theme = 'accent',
  icon,
  className = '',
  disabled = false,
  onToggle,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else if (!isExpanded) {
      setHeight(0);
    }
  }, [isExpanded]);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  const variantStyles = {
    default: 'bg-surface border border-border rounded-[10px] shadow-sm',
    subtle: 'bg-surface-dim border border-border rounded-[8px]',
    strong: 'bg-surface border border-border rounded-[10px] shadow-md',
    accent: 'bg-surface border border-accent/20 rounded-[10px] shadow-sm',
    profile: 'bg-surface-dim border border-border rounded-[8px]',
  };

  const themeColors = {
    accent: 'text-accent',
    pine: 'text-pine',
    amber: 'text-amber',
    ink: 'text-ink-mute',
    gold: 'text-amber',
  };

  const springConfig = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  };

  const baseCard = variantStyles[variant];

  return (
    <motion.div
      className={`${baseCard} rounded-[10px] overflow-hidden ${disabled ? 'opacity-60' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      whileHover={disabled ? {} : { scale: 1.01, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
    >
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-6 text-left transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        aria-expanded={isExpanded}
        aria-controls="expandable-content"
        aria-disabled={disabled}
      >
        <div className="flex items-center gap-4 flex-1">
          {icon && (
            <div className={`flex-shrink-0 ${themeColors[theme]}`}>
              {icon}
            </div>
          )}

          <h3 className="text-xl font-bold text-ink">
            {title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={springConfig}
          className={`flex-shrink-0 ml-4 ${themeColors[theme]}`}
        >
          <ChevronDown size={24} strokeWidth={2.5} />
        </motion.div>
      </button>

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
