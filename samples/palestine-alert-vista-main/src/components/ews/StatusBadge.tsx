import { SectorStatus, statusLabels, useEWS } from '@/contexts/EWSContext';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: SectorStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { language } = useEWS();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const statusClasses = {
    pending: 'bg-muted text-muted-foreground',
    acknowledged: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-alert-orange-bg text-alert-orange',
    completed: 'alert-badge-green',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        sizeClasses[size],
        statusClasses[status]
      )}
    >
      {language === 'ar' ? statusLabels[status].ar : statusLabels[status].en}
    </span>
  );
}
