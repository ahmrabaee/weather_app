import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Home, AlertTriangle } from 'lucide-react';
import { AlertLevel, Marker, useApp } from '@/contexts/AppContext';

interface MapComponentProps {
    mode: 'edit' | 'view' | 'mini';
    markers?: Marker[];
    onMarkersChange?: (markers: Marker[]) => void;
    selectedAlertLevel?: AlertLevel;
    className?: string;
}

export function MapComponent({
    mode,
    markers = [],
    onMarkersChange,
    selectedAlertLevel = 'yellow',
    className
}: MapComponentProps) {
    const { language } = useApp();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Marker Dragging State
    const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
    const [initialMarkerPos, setInitialMarkerPos] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // Reset View
    const resetView = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom Handlers
    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(s => Math.min(s + 0.2, 3));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(s => Math.max(s - 0.2, 1));
    };

    // Pan Handlers for Map
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale === 1 || draggingMarkerId) return;
        setIsPanning(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        e.preventDefault();
    };

    // Marker Drag Start
    const handleMarkerMouseDown = (e: React.MouseEvent, markerId: string) => {
        if (mode !== 'edit') return;
        e.stopPropagation(); // Prevent map panning/clicking
        e.preventDefault();

        const marker = markers.find(m => m.id === markerId);
        if (!marker) return;

        setDraggingMarkerId(markerId);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialMarkerPos({ x: marker.x, y: marker.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Handle Marker Dragging
        if (draggingMarkerId && mode === 'edit') {
            const mapContainer = mapRef.current;
            if (!mapContainer) return;

            const rect = mapContainer.getBoundingClientRect();

            // Calculate delta in pixels
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            // Convert delta to percentage relative to container size
            const deltaXPercent = (deltaX / rect.width) * 100;
            const deltaYPercent = (deltaY / rect.height) * 100;

            // Calculate new position
            let newX = initialMarkerPos.x + deltaXPercent;
            let newY = initialMarkerPos.y + deltaYPercent;

            // Clamp to map bounds (0-100%)
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            // Update marker position
            onMarkersChange?.(markers.map(m =>
                m.id === draggingMarkerId
                    ? { ...m, x: newX, y: newY }
                    : m
            ));
            return;
        }

        // Handle Map Panning
        if (isPanning) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggingMarkerId(null);
    };

    // Marker Placement (Click on Map)
    const handleMapClick = (e: React.MouseEvent) => {
        if (mode !== 'edit' || isPanning || draggingMarkerId) return;
        if (scale > 1 && Math.abs(e.movementX) > 2) return;

        const mapContainer = mapRef.current;
        if (!mapContainer) return;

        // Get the bounding rectangle of the MAP CONTAINER (where markers are rendered)
        const rect = mapContainer.getBoundingClientRect();

        // Calculate click position relative to container bounds
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Calculate percentage coordinates (0-100%) based on container size
        const x = (clickX / rect.width) * 100;
        const y = (clickY / rect.height) * 100;

        // Clamp values to 0-100 range
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        const newMarker: Marker = {
            id: `m-${Date.now()}`,
            x: clampedX,
            y: clampedY,
            level: selectedAlertLevel
        };

        onMarkersChange?.([...markers, newMarker]);
    };

    // Only delete if NOT dragging and explicit click (prevent delete on drag release)
    const handleMarkerClick = (e: React.MouseEvent, markerId: string) => {
        e.stopPropagation();
        if (mode === 'edit') {
            onMarkersChange?.(markers.filter(m => m.id !== markerId));
        }
    };

    // Enhanced marker size reduction
    const getMarkerStyle = (level: AlertLevel) => {
        switch (level) {
            case 'yellow': return 'bg-warning-yellow border-yellow-200 marker-pulse-yellow w-2.5 h-2.5';
            case 'orange': return 'bg-warning-orange border-orange-200 marker-pulse-orange w-3 h-3';
            case 'red': return 'bg-warning-red border-red-200 marker-pulse-red w-4 h-4';
            default: return 'bg-gray-500';
        }
    };

    // Add effect to handle global mouse up to stop dragging even if outside container
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isPanning || draggingMarkerId) {
                setIsPanning(false);
                setDraggingMarkerId(null);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isPanning, draggingMarkerId]);

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
                </div>
            )}

            {/* Map Content */}
            <div
                className={cn(
                    "relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center",
                    scale > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : (mode === 'edit' ? "cursor-crosshair" : "cursor-default")
                )}
                style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`
                }}
                onMouseDown={handleMouseDown}
            >
                <div
                    ref={mapRef}
                    className="relative h-full aspect-[3/4] shadow-2xl"
                >
                    <img
                        src="/images/final-map.png"
                        alt="Map of Palestine"
                        className="h-full w-auto object-contain pointer-events-none select-none"
                    />

                    {/* Click Overlay for placing markers */}
                    <div
                        className="absolute inset-0 z-0"
                        onClick={handleMapClick}
                    />

                    {/* Markers */}
                    {markers.map((marker) => (
                        <div
                            key={marker.id}
                            className={cn(
                                "absolute rounded-full border-2 shadow-lg z-10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform",
                                mode === 'edit' ? "cursor-grab active:cursor-grabbing hover:scale-125" : "",
                                getMarkerStyle(marker.level)
                            )}
                            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                            onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
                            onClick={(e) => {
                                // Prevent deletion if we just dragged
                                e.stopPropagation();
                            }}
                            onDoubleClick={(e) => handleMarkerClick(e, marker.id)}
                            title={`${marker.level} Alert Marker (Double click to remove, Drag to move)`}
                        >
                            {/* {marker.level === 'red' && <AlertTriangle className="w-1.5 h-1.5 text-white" />} */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Instructions Overlay */}
            {mode === 'edit' && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center">
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 text-xs sm:text-sm font-medium text-slate-700 text-center max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {language === 'ar' ? (
                            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 divide-x divide-x-reverse divide-slate-300">
                                <span>انقر للإضافة</span>
                                <span className="pr-3">اسحب للتحريك</span>
                                <span className="pr-3">نقرتين للحذف</span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 divide-x divide-slate-300">
                                <span>Click to place</span>
                                <span className="pl-3">Drag to move</span>
                                <span className="pl-3">Double-click to remove</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
