import { AlertLevel, alertLevelLabels, useEWS } from '@/contexts/EWSContext';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  level: AlertLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function AlertBadge({ level, size = 'md' }: AlertBadgeProps) {
  const { language } = useEWS();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const levelClasses = {
    red: 'alert-badge-red',
    orange: 'alert-badge-orange',
    yellow: 'alert-badge-yellow',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full',
        sizeClasses[size],
        levelClasses[level]
      )}
    >
      {language === 'ar' ? alertLevelLabels[level].ar : alertLevelLabels[level].en}
    </span>
  );
}
