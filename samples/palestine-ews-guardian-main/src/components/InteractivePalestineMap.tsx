import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertLevel, AREAS } from '@/types/alert';
import { Plus, Minus, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Region center coordinates as percentage of map
const REGION_CENTERS: Record<string, { x: number; y: number }> = {
  'Jenin': { x: 52, y: 18 },
  'Tubas': { x: 60, y: 22 },
  'Tulkarm': { x: 42, y: 28 },
  'Nablus': { x: 52, y: 30 },
  'Qalqilya': { x: 38, y: 35 },
  'Salfit': { x: 48, y: 38 },
  'Ramallah': { x: 50, y: 48 },
  'Jericho': { x: 68, y: 52 },
  'Jerusalem': { x: 52, y: 56 },
  'Bethlehem': { x: 50, y: 62 },
  'Hebron': { x: 48, y: 72 },
  'Gaza': { x: 28, y: 78 },
};

interface InteractivePalestineMapProps {
  mode?: 'view' | 'select' | 'mini';
  alerts?: Alert[];
  selectedRegions?: string[];
  onRegionSelect?: (region: string) => void;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRegionClick?: boolean;
  showAlertMarkers?: boolean;
  height?: string;
  className?: string;
  alertLevel?: AlertLevel;
}

export function InteractivePalestineMap({
  mode = 'view',
  alerts = [],
  selectedRegions = [],
  onRegionSelect,
  enableZoom = true,
  enablePan = true,
  enableRegionClick = true,
  showAlertMarkers = true,
  height = '500px',
  className,
  alertLevel,
}: InteractivePalestineMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const minZoom = 100;
  const maxZoom = 300;
  const zoomStep = 20;

  // Get highest alert level for each region
  const regionAlerts = new Map<string, AlertLevel>();
  alerts.forEach(alert => {
    if (alert.status === 'issued' || alert.status === 'pending') {
      alert.affectedAreas.forEach(area => {
        const current = regionAlerts.get(area);
        const priority = { red: 3, orange: 2, yellow: 1 };
        if (!current || priority[alert.level] > priority[current]) {
          regionAlerts.set(area, alert.level);
        }
      });
    }
  });

  // Handle zoom
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev - zoomStep, minZoom);
      if (newZoom === minZoom) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoom(minZoom);
    setPan({ x: 0, y: 0 });
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!enableZoom) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -10 : 10;
    setZoom(prev => {
      const newZoom = Math.max(minZoom, Math.min(maxZoom, prev + delta));
      if (newZoom === minZoom) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  }, [enableZoom]);

  // Handle pan/drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= minZoom || !enablePan) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [zoom, pan, enablePan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    
    const maxPan = ((zoom - 100) / 100) * container.clientWidth / 2;
    const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - dragStart.x));
    const newY = Math.max(-maxPan, Math.min(maxPan, e.clientY - dragStart.y));
    setPan({ x: newX, y: newY });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle region click
  const handleRegionClick = (region: string) => {
    if (!enableRegionClick || mode === 'mini') return;
    onRegionSelect?.(region);
  };

  // Image load handlers
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Touch handlers for mobile
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1 && zoom > minZoom && enablePan) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  }, [zoom, pan, enablePan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - lastTouchDistance) * 0.5;
      setZoom(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
      setLastTouchDistance(dist);
    } else if (isDragging && e.touches.length === 1) {
      const container = containerRef.current;
      if (!container) return;
      const maxPan = ((zoom - 100) / 100) * container.clientWidth / 2;
      const newX = Math.max(-maxPan, Math.min(maxPan, e.touches[0].clientX - dragStart.x));
      const newY = Math.max(-maxPan, Math.min(maxPan, e.touches[0].clientY - dragStart.y));
      setPan({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, zoom, lastTouchDistance]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDistance(null);
  }, []);

  // Mini mode
  if (mode === 'mini') {
    const activeAlertCount = regionAlerts.size;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              'relative rounded-md overflow-hidden cursor-pointer',
              'border border-white/30 bg-white/10',
              'w-[100px] h-[80px] flex-shrink-0',
              className
            )}>
              <img
                src="/images/palestine-map.png"
                alt="Palestine Map"
                className="w-full h-full object-contain opacity-80"
              />
              {/* Alert dots */}
              <div className="absolute inset-0">
                {Array.from(regionAlerts.entries()).slice(0, 4).map(([region, level], idx) => {
                  const pos = REGION_CENTERS[region];
                  if (!pos) return null;
                  return (
                    <div
                      key={region}
                      className={cn(
                        'absolute w-2 h-2 rounded-full',
                        level === 'red' ? 'bg-alert-red animate-alert-pulse-red' :
                        level === 'orange' ? 'bg-alert-orange animate-alert-pulse-orange' :
                        'bg-alert-yellow animate-alert-pulse-yellow'
                      )}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  );
                })}
              </div>
              {activeAlertCount > 0 && (
                <div className="absolute bottom-1 right-1 bg-alert-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {activeAlertCount}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activeAlertCount} Active Alert{activeAlertCount !== 1 ? 's' : ''}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'map-container relative overflow-hidden',
        'bg-gradient-to-br from-muted/50 to-muted/30',
        'border border-border rounded-xl shadow-lg',
        isDragging ? 'cursor-grabbing' : zoom > minZoom ? 'cursor-grab' : 'cursor-default',
        className
      )}
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">Map unavailable</p>
            <Button size="sm" variant="outline" onClick={() => { setHasError(false); setIsLoading(true); }}>
              Reload Map
            </Button>
          </div>
        </div>
      )}

      {/* Map Content */}
      <div
        className="map-content absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Base Map Image */}
        <img
          src="/images/palestine-map.png"
          alt="Map of Palestine"
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />

        {/* Region Overlays & Markers */}
        <div className="absolute inset-0">
          {AREAS.map(region => {
            const pos = REGION_CENTERS[region];
            if (!pos) return null;

            const isSelected = selectedRegions.includes(region);
            const alertLevelForRegion = alertLevel && selectedRegions.includes(region) 
              ? alertLevel 
              : regionAlerts.get(region);
            const isHovered = hoveredRegion === region;

            return (
              <div key={region}>
                {/* Clickable Region Area */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleRegionClick(region)}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={cn(
                          'absolute w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2',
                          'transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                          enableRegionClick && 'hover:bg-primary/10',
                          isHovered && 'bg-primary/5'
                        )}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                        }}
                        disabled={!enableRegionClick}
                      />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-foreground/90 text-background px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{region}</span>
                        {alertLevelForRegion && (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-bold uppercase',
                            alertLevelForRegion === 'red' ? 'bg-alert-red text-white' :
                            alertLevelForRegion === 'orange' ? 'bg-alert-orange text-white' :
                            'bg-alert-yellow text-foreground'
                          )}>
                            {alertLevelForRegion}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Selection Indicator (for select mode) */}
                {mode === 'select' && isSelected && (
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-full border-3',
                      'border-primary bg-primary/10',
                      'flex items-center justify-center'
                    )}>
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </div>
                )}

                {/* Alert Marker (glowing pulse) */}
                {showAlertMarkers && alertLevelForRegion && (
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    <div className={cn(
                      'alert-marker rounded-full flex items-center justify-center',
                      alertLevelForRegion === 'red' ? 'alert-marker-red' :
                      alertLevelForRegion === 'orange' ? 'alert-marker-orange' :
                      'alert-marker-yellow'
                    )}>
                      {alertLevelForRegion === 'red' && (
                        <AlertTriangle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Region stroke for affected areas */}
                {(isSelected || alertLevelForRegion) && (
                  <svg
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: '80px',
                      height: '80px',
                    }}
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray="8 4"
                      className={cn(
                        'transition-all duration-300',
                        alertLevelForRegion === 'red' ? 'stroke-alert-red' :
                        alertLevelForRegion === 'orange' ? 'stroke-alert-orange' :
                        alertLevelForRegion === 'yellow' ? 'stroke-alert-yellow' :
                        'stroke-primary'
                      )}
                      style={{
                        opacity: isHovered ? 0.8 : 0.5,
                      }}
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Controls */}
      {enableZoom && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-card rounded-lg shadow-lg p-1.5 border border-border">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= maxZoom}
                  className="h-9 w-9"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className="h-9 w-9"
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="h-px bg-border my-0.5" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-9 w-9"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Reset View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Zoom Level Indicator */}
      {enableZoom && zoom > minZoom && (
        <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-border shadow-sm">
          {zoom}%
        </div>
      )}

      {/* Legend */}
      {showAlertMarkers && mode === 'view' && alerts.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-md">
          <p className="text-xs font-medium text-muted-foreground mb-2">Alert Levels</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-alert-yellow" />
              <span className="text-xs">Be Aware</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-alert-orange" />
              <span className="text-xs">Be Prepared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-alert-red" />
              <span className="text-xs">Take Action</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
