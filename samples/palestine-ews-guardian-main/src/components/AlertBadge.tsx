import { AlertLevel } from '@/types/alert';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  level: AlertLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AlertBadge({ level, size = 'md', className }: AlertBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const levelClasses = {
    yellow: 'alert-badge-yellow',
    orange: 'alert-badge-orange',
    red: 'alert-badge-red',
  };

  const labels = {
    yellow: 'Yellow',
    orange: 'Orange',
    red: 'Red',
  };

  return (
    <span className={cn('alert-badge', levelClasses[level], sizeClasses[size], className)}>
      {labels[level]}
    </span>
  );
}
