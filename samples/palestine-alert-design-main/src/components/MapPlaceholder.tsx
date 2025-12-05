import { MapPin } from 'lucide-react';
import { AlertLevel } from '@/types/alert';

interface MapPlaceholderProps {
  level?: AlertLevel;
  areas?: string[];
  className?: string;
}

export const MapPlaceholder = ({ level, areas, className = '' }: MapPlaceholderProps) => {
  const getLevelColor = () => {
    switch (level) {
      case 'yellow':
        return 'bg-alert-yellow/20 border-alert-yellow';
      case 'orange':
        return 'bg-alert-orange/20 border-alert-orange';
      case 'red':
        return 'bg-alert-red/20 border-alert-red';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className={`relative rounded-lg border-2 ${getLevelColor()} p-8 ${className}`}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <MapPin className="h-16 w-16 text-muted-foreground" />
        <div>
          <h3 className="font-semibold text-lg mb-2">خريطة تفاعلية</h3>
          <p className="text-sm text-muted-foreground mb-4">
            سيتم إضافة خريطة مخصصة هنا لعرض المناطق المتأثرة
          </p>
          {areas && areas.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {areas.map((area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
