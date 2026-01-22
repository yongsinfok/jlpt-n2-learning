/**
 * EmptyState Component - Animated Empty State
 */

import { Button } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  /** Icon */
  icon?: React.ReactNode;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Action button text */
  actionText?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Default empty state icon
 */
const DefaultIcon = () => (
  <Inbox className="w-24 h-24 text-neutral-dark" />
);

/**
 * EmptyState Component - Animated
 */
export function EmptyState({
  icon = <DefaultIcon />,
  title,
  description,
  actionText,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className} animate-fade-in-up`}>
      <div className="mb-6 animate-scale-in">{icon}</div>
      <h3 className="text-3xl font-bold text-primary mb-3">{title}</h3>
      {description && <p className="text-lg text-neutral-dark mb-8 max-w-md">{description}</p>}
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionText}
        </Button>
      )}
    </div>
  );
}
