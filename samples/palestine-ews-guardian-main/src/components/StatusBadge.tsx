import { AlertStatus, SectorStatus } from '@/types/alert';
import { cn } from '@/lib/utils';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AlertStatus | SectorStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    draft: { bg: 'bg-muted', text: 'text-muted-foreground', icon: <Clock className="w-3 h-3" />, label: 'Draft' },
    pending: { bg: 'bg-warning/20', text: 'text-warning', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
    issued: { bg: 'bg-info/20', text: 'text-info', icon: <AlertCircle className="w-3 h-3" />, label: 'Issued' },
    cancelled: { bg: 'bg-muted', text: 'text-muted-foreground', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' },
    acknowledged: { bg: 'bg-success/20', text: 'text-success', icon: <Check className="w-3 h-3" />, label: 'Acknowledged' },
    'in-progress': { bg: 'bg-info/20', text: 'text-info', icon: <Clock className="w-3 h-3" />, label: 'In Progress' },
    completed: { bg: 'bg-success/20', text: 'text-success', icon: <Check className="w-3 h-3" />, label: 'Completed' },
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.bg, config.text, className)}>
      {config.icon}
      {config.label}
    </span>
  );
}
