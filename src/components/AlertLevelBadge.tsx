import { AlertLevel, AlertZone } from '@/types/alert';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface AlertLevelBadgeProps {
  level: AlertLevel;
  zones?: AlertZone[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LEVEL_LABELS: Record<AlertLevel, { en: string; ar: string }> = {
  yellow: { en: 'YELLOW', ar: 'أصفر' },
  orange: { en: 'ORANGE', ar: 'برتقالي' },
  red: { en: 'RED', ar: 'أحمر' },
};

export function AlertLevelBadge({ level, zones, size = 'md', className }: AlertLevelBadgeProps) {
  const { language } = useApp();

  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Determine if this is a multi-level alert
  const activeLevels = zones && zones.length > 0
    ? Array.from(new Set(zones.map(z => z.level)))
    : [level];

  const isMulti = activeLevels.length > 1;

  if (isMulti) {
    return (
      <span
        className={cn(
          'alert-badge-multi ring-1 ring-white/20',
          sizeClasses[size],
          className
        )}
      >
        {language === 'en' ? 'MULTI' : 'مركب'}
      </span>
    );
  }

  return (
    <span
      className={cn(
        `alert-badge-${level}`,
        sizeClasses[size],
        className
      )}
    >
      {language === 'en' ? LEVEL_LABELS[level].en : LEVEL_LABELS[level].ar}
    </span>
  );
}
