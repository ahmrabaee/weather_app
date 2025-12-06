import { AlertLevel } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface PalestineMapProps {
  affectedAreas: string[];
  level: AlertLevel;
  className?: string;
}

// إحداثيات المناطق على الخريطة (نسبة مئوية من الصورة)
// هذه الإحداثيات تستند إلى صورة final-map.png
const REGION_COORDINATES: Record<string, { x: number; y: number; width: number; height: number }> = {
  'Jenin': { x: 15, y: 8, width: 12, height: 10 },
  'Tulkarm': { x: 10, y: 15, width: 10, height: 12 },
  'Nablus': { x: 18, y: 18, width: 12, height: 14 },
  'Qalqilya': { x: 8, y: 22, width: 8, height: 10 },
  'Ramallah': { x: 20, y: 28, width: 10, height: 12 },
  'Al-Bireh': { x: 25, y: 30, width: 8, height: 10 },
  'Jericho': { x: 32, y: 28, width: 12, height: 15 },
  'Jerusalem': { x: 22, y: 38, width: 10, height: 12 },
  'Bethlehem': { x: 22, y: 48, width: 10, height: 12 },
  'Hebron': { x: 20, y: 58, width: 12, height: 15 },
  'Gaza': { x: 5, y: 55, width: 10, height: 20 },
};

export function PalestineMap({ affectedAreas, level, className }: PalestineMapProps) {
  const levelColors = {
    yellow: '#FFC107',
    orange: '#FF9800',
    red: '#DC2626',
  };

  return (
    <div className={cn('bg-secondary/50 rounded-xl p-6 relative overflow-hidden', className)}>
      {/* Map Image Container */}
      <div className="relative w-full h-full min-h-[200px]">
        <img
          src="/images/final-map.png"
          alt="Palestine Map"
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Overlay for affected areas */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(REGION_COORDINATES).map(([name, coords]) => {
            const isAffected = affectedAreas.includes(name);
            if (!isAffected) return null;
            
            return (
              <div
                key={name}
                className="absolute transition-all duration-300 animate-pulse-alert"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  width: `${coords.width}%`,
                  height: `${coords.height}%`,
                  backgroundColor: levelColors[level],
                  opacity: 0.5,
                  borderRadius: '4px',
                  border: `2px solid ${levelColors[level]}`,
                  boxShadow: `0 0 8px ${levelColors[level]}40`,
                }}
                title={name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
