import { useState, useRef, useEffect } from 'react';
import { AlertLevel } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractivePalestineMapProps {
  affectedAreas: string[];
  level: AlertLevel;
  className?: string;
}

// إحداثيات المناطق على الخريطة (نسبة مئوية من الصورة)
// هذه الإحداثيات تحتاج إلى تعديل حسب الصورة الفعلية
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

const levelColors = {
  yellow: '#FFC107',
  orange: '#FF9800',
  red: '#DC2626',
};

export function InteractivePalestineMap({ 
  affectedAreas, 
  level, 
  className 
}: InteractivePalestineMapProps) {
  const { language } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.2;

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
      setImageLoaded(true);
    }
  }, []);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
      setImageLoaded(true);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (containerRef.current && imageRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const imageAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
      const containerAspect = containerWidth / containerHeight;
      
      const newScale = containerAspect > imageAspect
        ? containerHeight / imageRef.current.naturalHeight
        : containerWidth / imageRef.current.naturalWidth;
      
      setScale(newScale * 0.9); // 90% للسماح ببعض المساحة
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    setScale((prev) => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta));
      return newScale;
    });
  };

  // Extract height classes from className if provided
  const heightClass = className?.match(/(min-h-|h-)\[\d+px\]|(min-h-|h-)\d+/)?.[0] || 'h-[400px]';
  const baseClasses = className?.replace(/(min-h-|h-)\[\d+px\]|(min-h-|h-)\d+/g, '').trim() || '';

  return (
    <div className={cn('relative w-full rounded-lg overflow-hidden border-2 border-border bg-muted', baseClasses)}>
      {/* Map Container */}
      <div
        ref={containerRef}
        className={cn('relative w-full overflow-hidden cursor-move', heightClass)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      >
        {/* Image */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <img
            ref={imageRef}
            src="/images/final-map.png"
            alt="Palestine Map"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            draggable={false}
          />

        </div>

        {/* Zoom indicator */}
        {scale !== 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-2">
        <div className="flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            className="h-8 w-8 p-0"
            title={language === 'en' ? 'Zoom In' : 'تكبير'}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            className="h-8 w-8 p-0"
            title={language === 'en' ? 'Zoom Out' : 'تصغير'}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToScreen}
            className="h-8 w-8 p-0"
            title={language === 'en' ? 'Fit to Screen' : 'ملء الشاشة'}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0"
            title={language === 'en' ? 'Reset' : 'إعادة تعيين'}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground border border-border">
        {affectedAreas.length > 0 ? (
          <span>
            {affectedAreas.length} {language === 'en' 
              ? (affectedAreas.length === 1 ? 'area selected' : 'areas selected')
              : (affectedAreas.length === 1 ? 'منطقة محددة' : 'مناطق محددة')
            }
          </span>
        ) : (
          <span>
            {language === 'en' ? 'Drag to pan • Scroll to zoom' : 'اسحب للتحريك • مرر للتصغير/التكبير'}
          </span>
        )}
      </div>
    </div>
  );
}

