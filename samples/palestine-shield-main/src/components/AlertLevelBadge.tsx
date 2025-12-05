import { AlertLevel } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface AlertLevelBadgeProps {
  level: AlertLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LEVEL_LABELS: Record<AlertLevel, { en: string; ar: string }> = {
  yellow: { en: 'YELLOW', ar: 'أصفر' },
  orange: { en: 'ORANGE', ar: 'برتقالي' },
  red: { en: 'RED', ar: 'أحمر' },
};

export function AlertLevelBadge({ level, size = 'md', className }: AlertLevelBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <span
      className={cn(
        `alert-badge-${level}`,
        sizeClasses[size],
        className
      )}
    >
      {LEVEL_LABELS[level].en}
    </span>
  );
}
