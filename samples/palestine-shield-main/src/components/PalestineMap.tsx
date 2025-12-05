import { AlertLevel } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface PalestineMapProps {
  affectedAreas: string[];
  level: AlertLevel;
  className?: string;
}

const REGIONS: Record<string, { path: string; cx: number; cy: number }> = {
  'Jenin': { path: 'M70,30 L90,25 L100,40 L85,55 L65,50 Z', cx: 80, cy: 40 },
  'Tulkarm': { path: 'M55,50 L75,45 L80,60 L65,75 L50,70 Z', cx: 65, cy: 60 },
  'Nablus': { path: 'M80,55 L100,50 L110,70 L95,85 L75,80 Z', cx: 90, cy: 67 },
  'Qalqilya': { path: 'M45,70 L60,65 L65,80 L55,90 L40,85 Z', cx: 52, cy: 77 },
  'Ramallah': { path: 'M70,85 L95,80 L105,100 L90,115 L65,110 Z', cx: 85, cy: 97 },
  'Al-Bireh': { path: 'M95,95 L110,92 L115,108 L105,118 L90,115 Z', cx: 102, cy: 105 },
  'Jericho': { path: 'M110,90 L135,85 L145,110 L130,130 L105,125 Z', cx: 125, cy: 105 },
  'Jerusalem': { path: 'M75,115 L100,110 L105,130 L90,145 L70,140 Z', cx: 87, cy: 127 },
  'Bethlehem': { path: 'M75,145 L100,140 L105,160 L90,175 L70,170 Z', cx: 87, cy: 157 },
  'Hebron': { path: 'M65,175 L95,170 L100,200 L80,220 L55,215 Z', cx: 77, cy: 195 },
  'Gaza': { path: 'M20,180 L40,175 L45,230 L30,260 L15,255 Z', cx: 30, cy: 217 },
};

export function PalestineMap({ affectedAreas, level, className }: PalestineMapProps) {
  const levelColors = {
    yellow: '#FFC107',
    orange: '#FF9800',
    red: '#DC2626',
  };

  return (
    <div className={cn('bg-secondary/50 rounded-xl p-6', className)}>
      <svg viewBox="0 0 160 280" className="w-full h-auto max-h-[400px]">
        {/* Background outline */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Regions */}
        {Object.entries(REGIONS).map(([name, { path, cx, cy }]) => {
          const isAffected = affectedAreas.includes(name);
          return (
            <g key={name}>
              <path
                d={path}
                fill={isAffected ? levelColors[level] : 'hsl(var(--muted))'}
                stroke="hsl(var(--border))"
                strokeWidth="1.5"
                className={cn(
                  'transition-all duration-300',
                  isAffected && 'animate-pulse-alert'
                )}
                opacity={isAffected ? 0.9 : 0.5}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                fontSize="6"
                fill={isAffected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                fontWeight={isAffected ? '600' : '400'}
                className="pointer-events-none"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
