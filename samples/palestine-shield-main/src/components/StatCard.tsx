import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  variant?: 'default' | 'yellow' | 'orange' | 'red';
  className?: string;
}

export function StatCard({ icon: Icon, value, label, variant = 'default', className }: StatCardProps) {
  const variantClasses = {
    default: 'border-l-primary',
    yellow: 'border-l-alert-yellow',
    orange: 'border-l-alert-orange',
    red: 'border-l-alert-red',
  };

  return (
    <div className={cn('stat-card', variantClasses[variant], className)}>
      <Icon className="w-8 h-8 text-muted-foreground mb-3" />
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
