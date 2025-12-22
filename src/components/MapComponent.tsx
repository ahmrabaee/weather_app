import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Home, Settings2 } from 'lucide-react';
import { AlertLevel, useApp } from '@/contexts/AppContext';
import { MapLayer } from '@/types/mapStudio';

interface MapComponentProps {
    mode: 'edit' | 'view' | 'mini';
    layers?: MapLayer[]; // New prop for dynamic layers
    className?: string;
    onOpenStudio?: () => void; // Callback to open studio
}

export function MapComponent({
    mode,
    layers = [],
    className,
    onOpenStudio
}: MapComponentProps) {
    const { language, mapComposition } = useApp();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    // Reset View
    const resetView = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom Handlers
    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(s => Math.min(s + 0.5, 4));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(s => Math.max(s - 0.5, 1));
    };

    // Pan Handlers for Map
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale === 1) return;
        setIsPanning(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Add effect to handle global mouse up
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isPanning) {
                setIsPanning(false);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isPanning]);

    // CRITICAL FIX: Auto-calculate scale to fit 600x917 map into container
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale to fit 600x917 map
        const scaleX = containerWidth / 600;
        const scaleY = containerHeight / 917;
        const autoScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

        setScale(autoScale);
        setPosition({ x: 0, y: 0 }); // Reset position
    }, [mode]); // Recalculate when mode changes

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'yellow': return '#FFC107';
            case 'orange': return '#FF9800';
            case 'red': return '#DC2626';
            default: return '#FFC107';
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden bg-slate-100 border border-slate-200 rounded-xl shadow-inner select-none",
                mode === 'mini' ? 'w-[120px] h-[100px]' : 'w-full h-[500px]',
                className
            )}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {/* Map Controls */}
            {mode !== 'mini' && (
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-md border border-slate-200">
                    <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-md transition-colors" title="Zoom In">
                        <ZoomIn className="w-5 h-5 text-slate-700" />
                    </button>
                    <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-md transition-colors" title="Zoom Out">
                        <ZoomOut className="w-5 h-5 text-slate-700" />
                    </button>
                    <div className="h-px bg-slate-200 my-0.5" />
                    <button onClick={resetView} className="p-2 hover:bg-slate-100 rounded-md transition-colors" title="Reset View">
                        <Home className="w-5 h-5 text-slate-700" />
                    </button>

                    {onOpenStudio && (
                        <>
                            <div className="h-px bg-slate-200 my-0.5" />
                            <button
                                onClick={onOpenStudio}
                                className="p-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors"
                                title="Open Map Studio"
                            >
                                <Settings2 className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Map Content */}
            <div
                className={cn(
                    "relative w-full h-full flex items-center justify-center origin-center",
                    scale > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                )}
                onMouseDown={handleMouseDown}
            >
                {/* CRITICAL FIX: Display snapshot if available, otherwise render layers */}
                {mapComposition?.snapshot ? (
                    // Display captured snapshot for perfect accuracy
                    <div
                        className="relative shadow-2xl"
                        style={{
                            width: '600px',
                            height: '917px',
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        <img
                            src={mapComposition.snapshot}
                            alt="Map Composition"
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    // Fallback: Render layers manually
                    <div
                        className="relative shadow-2xl"
                        style={{
                            width: '600px',
                            height: '917px',  // FIXED: Match actual image ratio
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        {/* Base Map */}
                        <img
                            src="/images/base-map.png"
                            alt="Map of Palestine"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                        />

                        {/* Render Layers from Map Studio */}
                        {layers.map(layer => {
                            // CRITICAL: Use the SAME coordinate system as StudioCanvas
                            // Convert percentages to pixels based on the fixed 600x917 reference
                            const containerWidth = 600;
                            const containerHeight = 917;  // FIXED: Match actual image aspect ratio
                            const leftPx = (layer.x / 100) * containerWidth;
                            const topPx = (layer.y / 100) * containerHeight;
                            const widthPx = (layer.width / 100) * containerWidth;

                            return (
                                <div
                                    key={layer.id}
                                    className="absolute pointer-events-none select-none z-10"
                                    style={{
                                        left: `${leftPx}px`,
                                        top: `${topPx}px`,
                                        width: `${widthPx}px`,
                                        transform: `rotate(${layer.rotation}deg)`,
                                    }}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            aspectRatio: '1/1',
                                            maskImage: `url(${layer.src})`,
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                            backgroundColor: getLevelColor(layer.level),
                                            opacity: 0.9
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Overlay Button (Large) */}
            {mode === 'edit' && onOpenStudio && layers.length === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                    <button
                        onClick={onOpenStudio}
                        className="bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-xl border border-white/50 text-primary font-bold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Settings2 className="w-5 h-5" />
                        {language === 'ar' ? 'فتح استوديو الخريطة' : 'Open Map Studio'}
                    </button>
                </div>
            )}
        </div>
    );
}
