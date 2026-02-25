/**
 * BentoGrid - Modular card-based layout component
 * Inspired by Apple's iOS 17+ design language
 */

import { cn } from '@/utils/cn';

// ========================================
// Types
// ========================================

export interface BentoCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sakura' | 'matcha' | 'ai' | 'featured' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  colSpan?: 1 | 2 | 3 | 'full';
  rowSpan?: 1 | 2;
  onClick?: () => void;
  as?: React.ElementType;
  href?: string;
}

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'sm' | 'md' | 'lg' | 'auto';
  columns?: number;
}

export interface BentoStatProps {
  value: number | string;
  label: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconVariant?: 'ai' | 'sakura' | 'matcha' | 'gold';
  className?: string;
}

// ========================================
// BentoCard Component
// ========================================

export function BentoCard({
  children,
  className,
  variant = 'default',
  size = 'md',
  colSpan = 1,
  rowSpan = 1,
  onClick,
  as: Component = 'div',
  ...props
}: BentoCardProps) {
  const variantClasses = {
    default: 'bento-card',
    sakura: 'bento-card bento-card-sakura',
    matcha: 'bento-card bento-card-matcha',
    ai: 'bento-card bento-card-ai',
    featured: 'bento-card bento-card-featured',
    animated: 'glass-card-animated',
  };

  const sizeClasses = {
    sm: 'bento-card-sm',
    md: '',
    lg: 'bento-card-lg',
  };

  const colSpanClasses = {
    1: 'bento-col-span-1',
    2: 'bento-col-span-2',
    3: 'bento-col-span-3',
    full: 'bento-col-span-full',
  };

  const rowSpanClasses = {
    1: 'bento-row-span-1',
    2: 'bento-row-span-2',
  };

  return (
    <Component
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        onClick && 'cursor-pointer hover-lift',
        'animate-spring-bounce',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

// ========================================
// BentoGrid Component
// ========================================

export function BentoGrid({
  children,
  className,
  variant = 'md',
  columns,
}: BentoGridProps) {
  const gridVariantClasses = {
    sm: 'bento-grid-sm',
    md: 'bento-grid-md',
    lg: 'bento-grid-lg',
    auto: 'bento-grid-auto',
  };

  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : undefined;

  return (
    <div
      className={cn('bento-grid', gridVariantClasses[variant], className)}
      style={gridStyle}
    >
      {children}
    </div>
  );
}

// ========================================
// BentoStat Component
// ========================================

export function BentoStat({
  value,
  label,
  change,
  changeLabel,
  icon,
  iconVariant = 'ai',
  className,
}: BentoStatProps) {
  return (
    <BentoCard className={cn('bento-stat', className)}>
      {icon && (
        <div className={cn('bento-icon', `bento-icon-${iconVariant}`, 'mx-auto mb-4')}>
          {icon}
        </div>
      )}
      <div className="bento-stat-value">{value}</div>
      <div className="bento-stat-label">{label}</div>
      {change !== undefined && (
        <div className={cn('bento-stat-change', change > 0 ? 'positive' : 'negative')}>
          {change > 0 ? '+' : ''}{change} {changeLabel && `(${changeLabel})`}
        </div>
      )}
    </BentoCard>
  );
}

// ========================================
// BentoCardHeader Component
// ========================================

export function BentoCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('bento-card-header', className)}>{children}</div>;
}

// ========================================
// BentoCardTitle Component
// ========================================

export function BentoCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn('bento-card-title', className)}>{children}</h3>;
}

// ========================================
// BentoCardSubtitle Component
// ========================================

export function BentoCardSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn('bento-card-subtitle', className)}>{children}</p>;
}

// ========================================
// BentoCardBody Component
// ========================================

export function BentoCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('bento-card-body', className)}>{children}</div>;
}

// ========================================
// BentoCardFooter Component
// ========================================

export function BentoCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('bento-card-footer', className)}>{children}</div>;
}

// ========================================
// Preset Bento Cards
// ========================================

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconVariant?: 'ai' | 'sakura' | 'matcha' | 'gold';
  delay?: number;
}

export function QuickActionCard({
  title,
  description,
  icon,
  href,
  iconVariant = 'ai',
  delay = 0,
}: QuickActionCardProps) {
  return (
    <BentoCard
      variant="default"
      as="a"
      href={href}
      className="group hover-lift"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-5">
        <div className={cn('bento-icon', `bento-icon-${iconVariant}`)}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-sumi mb-1 group-hover:text-ai transition-colors">
            {title}
          </h4>
          <p className="text-base text-sumi/70">{description}</p>
        </div>
        <svg
          className="w-6 h-6 text-sumi/50 group-hover:text-sakura transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </BentoCard>
  );
}

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  icon: React.ReactNode;
  color?: 'ai' | 'sakura' | 'matcha' | 'gold';
  delay?: number;
}

export function ProgressCard({
  title,
  current,
  total,
  icon,
  color = 'ai',
  delay = 0,
}: ProgressCardProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <BentoCard
      variant="default"
      className="hover-lift"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className={cn('bento-icon', `bento-icon-${color}`)}>{icon}</div>
        <span className="text-lg font-semibold text-sumi">{title}</span>
      </div>
      <div className="text-5xl font-bold text-sumi mb-2">{current}</div>
      <div className="text-base text-sumi/70 mb-4">共 {total} 个</div>
      <div className="progress-bar h-2 glass-card-subtle">
        <div
          className="progress-fill-gradient h-2"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </BentoCard>
  );
}
