import { MapPin } from 'lucide-react';
import { useEWS, AlertLevel } from '@/contexts/EWSContext';
import { cn } from '@/lib/utils';

interface MapPlaceholderProps {
  affectedAreas?: string[];
  level?: AlertLevel;
  className?: string;
}

export function MapPlaceholder({ affectedAreas = [], level = 'yellow', className }: MapPlaceholderProps) {
  const { language } = useEWS();

  const levelBorderColors = {
    red: 'border-alert-red',
    orange: 'border-alert-orange',
    yellow: 'border-alert-yellow',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 border-dashed overflow-hidden',
        levelBorderColors[level],
        className
      )}
    >
      {/* Map Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Palestine Shape Placeholder */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] p-6">
        <div className="w-24 h-32 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {language === 'ar' 
            ? 'سيتم عرض خريطة فلسطين المخصصة هنا'
            : 'Custom Palestine map will be displayed here'}
        </p>

        {affectedAreas.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              {language === 'ar' ? 'المناطق المتأثرة:' : 'Affected Areas:'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {affectedAreas.map((area, index) => (
                <span
                  key={index}
                  className={cn(
                    'px-2 py-1 text-xs rounded-full font-medium',
                    level === 'red' && 'bg-alert-red-bg text-alert-red',
                    level === 'orange' && 'bg-alert-orange-bg text-alert-orange',
                    level === 'yellow' && 'bg-alert-yellow-bg text-alert-yellow'
                  )}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
