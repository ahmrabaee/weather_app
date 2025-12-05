import { cn } from '@/lib/utils';
import { AlertLevel } from '@/types/alert';

interface PalestineMapProps {
  highlightedAreas?: string[];
  alertLevel?: AlertLevel;
  className?: string;
}

export function PalestineMap({ highlightedAreas = [], alertLevel, className }: PalestineMapProps) {
  const overlayColor = alertLevel === 'red' 
    ? 'rgba(220, 38, 38, 0.3)' 
    : alertLevel === 'orange' 
    ? 'rgba(255, 152, 0, 0.3)' 
    : alertLevel === 'yellow'
    ? 'rgba(255, 193, 7, 0.3)'
    : 'transparent';

  return (
    <div className={cn('relative rounded-lg overflow-hidden shadow-lg bg-muted', className)}>
      <img
        src="/images/palestine-map.png"
        alt="Map of Palestine showing affected regions"
        className="w-full h-full object-contain"
      />
      {highlightedAreas.length > 0 && alertLevel && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: overlayColor }}
        />
      )}
      {highlightedAreas.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <p className="text-xs font-medium text-muted-foreground mb-2">Affected Areas:</p>
          <div className="flex flex-wrap gap-1">
            {highlightedAreas.map(area => (
              <span
                key={area}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium',
                  alertLevel === 'red' ? 'bg-alert-red/20 text-alert-red' :
                  alertLevel === 'orange' ? 'bg-alert-orange/20 text-foreground' :
                  'bg-alert-yellow/20 text-foreground'
                )}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
