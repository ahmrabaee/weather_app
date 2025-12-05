import { SectorStatus, AlertStatus } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Loader2, Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: SectorStatus | AlertStatus;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', className: 'status-pending', icon: Circle },
  acknowledged: { label: 'Acknowledged', className: 'status-acknowledged', icon: CheckCircle },
  'in-progress': { label: 'In Progress', className: 'status-in-progress', icon: Loader2 },
  completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle },
  draft: { label: 'Draft', className: 'status-pending', icon: Circle },
  issued: { label: 'Issued', className: 'status-completed', icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive', icon: Circle },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={cn(config.className, className)}>
      <Icon className={cn("w-3 h-3", status === 'in-progress' && 'animate-spin')} />
      {config.label}
    </span>
  );
}
