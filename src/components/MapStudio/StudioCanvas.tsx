import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import { MapLayer } from '@/types/mapStudio';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize, Trash2, Keyboard, Move, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface StudioCanvasProps {
    layers: MapLayer[];
    selectedLayerId?: string | null;
    onSelectLayer?: (id: string | null) => void;
    onUpdateLayer?: (id: string, updates: Partial<MapLayer>) => void;
    onDeleteLayer?: (id: string) => void;
    readOnly?: boolean;
}

export function StudioCanvas({
    layers,
    selectedLayerId,
    onSelectLayer,
    onUpdateLayer,
    onDeleteLayer,
    readOnly = false
}: StudioCanvasProps) {
    const { language } = useApp();
    const [zoom, setZoom] = useState(0.65);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLImageElement | null>(null);

    // Handle delete key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId && onDeleteLayer) {
                onDeleteLayer(selectedLayerId);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedLayerId, onDeleteLayer]);

    // Mouse wheel zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (containerRef.current && containerRef.current.contains(e.target as Node)) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom(z => Math.max(0.5, Math.min(2, z + delta)));
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, []);

    // Force Moveable update when selection changes
    const [moveableKey, setMoveableKey] = useState(0);
    useEffect(() => {
        if (selectedLayerId) {
            // Small delay to ensure DOM is updated
            const timer = setTimeout(() => {
                setMoveableKey(k => k + 1);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [selectedLayerId]);

    // Deselect on click outside
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onSelectLayer) {
            onSelectLayer(null);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'yellow': return '#FFC107';
            case 'orange': return '#FF9800';
            case 'red': return '#DC2626';
            default: return '#FFC107';
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only pan if clicking on background or image (not on layers or controls)
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning) return;

        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        setPan(prev => ({
            x: prev.x + deltaX / zoom,
            y: prev.y + deltaY / zoom
        }));

        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Toolbar */}
            {!readOnly && (
                <div className="absolute bottom-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-full border border-slate-800 shadow-xl">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-slate-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-700 mx-1" />
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <Maximize className="w-4 h-4" />
                    </button>

                    {/* Mobile Delete Button */}
                    {selectedLayerId && (
                        <>
                            <div className="w-px h-4 bg-slate-700 mx-1" />
                            <button
                                onClick={() => onDeleteLayer(selectedLayerId)}
                                className="p-2 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-300 transition-colors md:hidden"
                                title="حذف الطبقة"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Refined Glassmorphism Instructions Banner */}
            {!readOnly && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-6 py-4 bg-slate-950/20 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col items-center gap-3 min-w-[320px] transition-all hover:bg-slate-950/30">
                    <div className="flex items-center gap-3 text-white/90">
                        <Keyboard className="w-5 h-5 opacity-60" />
                        <span className="font-semibold tracking-wide text-base">
                            {language === 'en' ? 'Keyboard Shortcuts' : 'اختصارات لوحة المفاتيح'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 w-full justify-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                            <kbd className="px-2 py-1 bg-slate-900/80 text-white rounded-md border-b-2 border-white/20 font-mono text-xs shadow-sm">Delete</kbd>
                            <span className="text-sm font-medium text-white/80">
                                {language === 'en' ? 'Delete selected layer' : 'حذف الطبقة المحددة'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
                        <Move className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] text-white font-medium uppercase tracking-wider">
                            {language === 'en' ? 'Click and drag background to pan' : 'اضغط واسحب الخلفية للتحريك'}
                        </span>
                    </div>
                </div>
            )}


            {/* Canvas Area */}
            <div
                className="relative shadow-2xl bg-white"
                style={{
                    width: '600px',  // Reference width
                    height: '917px', // FIXED: Match actual image ratio (5999/9177 * 600 ≈ 917)
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                    cursor: isPanning ? 'grabbing' : 'grab'
                }}
                onClick={handleBackgroundClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Base Map */}
                <img
                    src="/images/base-map.png"
                    alt="Base Map"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                />

                {/* Layers */}
                {layers.map(layer => {
                    // CRITICAL FIX: Convert percentages to pixels for Moveable compatibility
                    const containerWidth = 600;
                    const containerHeight = 917; // FIXED: Match actual image aspect ratio
                    const leftPx = (layer.x / 100) * containerWidth;
                    const topPx = (layer.y / 100) * containerHeight;
                    const widthPx = (layer.width / 100) * containerWidth;

                    return (
                        <div
                            key={layer.id}
                            id={layer.id}
                            className={cn(
                                "absolute cursor-move",
                                selectedLayerId === layer.id ? "z-10" : "z-0"
                            )}
                            style={{
                                left: `${leftPx}px`,
                                top: `${topPx}px`,
                                width: `${widthPx}px`,
                                transform: `rotate(${layer.rotation}deg)`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (readOnly) return;
                                if (onSelectLayer) onSelectLayer(layer.id);
                            }}
                        >
                            {/* Colored Mask Image */}
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

                            {/* Internal "Apply" Checkmark - Midpoint of Right Side */}
                            {!readOnly && selectedLayerId === layer.id && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectLayer) onSelectLayer(null);
                                    }}
                                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow-lg border-2 border-white hover:bg-green-600 hover:scale-110 active:scale-95 transition-all shrink-0 cursor-pointer"
                                    title="إنهاء التحريك"
                                >
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Moveable Controller */}
                {selectedLayerId && !readOnly && (
                    <Moveable
                        key={`moveable-${selectedLayerId}-${moveableKey}`}
                        target={document.getElementById(selectedLayerId)}
                        container={null}
                        origin={false}
                        edge={false}
                        draggable={true}
                        resizable={true}
                        rotatable={true}
                        keepRatio={true}
                        throttleDrag={0}
                        throttleResize={0}
                        throttleRotate={0}
                        zoom={zoom} // FIXED: Should be the direct scale value
                        snappable={true}
                        bounds={{ left: 0, top: 0, right: 600, bottom: 917 }} // FIXED: Match new height
                        renderDirections={["nw", "ne", "sw", "se"]}
                        onDrag={({ target, left, top }) => {
                            target.style.left = `${left}px`;
                            target.style.top = `${top}px`;
                        }}
                        onDragEnd={({ target }) => {
                            const containerWidth = 600;
                            const containerHeight = 917; // FIXED
                            const leftPx = parseFloat(target.style.left || '0');
                            const topPx = parseFloat(target.style.top || '0');

                            onUpdateLayer(selectedLayerId, {
                                x: parseFloat(((leftPx / containerWidth) * 100).toFixed(6)),
                                y: parseFloat(((topPx / containerHeight) * 100).toFixed(6))
                            });
                        }}
                        onResize={({ target, width, height, drag }) => {
                            target.style.width = `${width}px`;
                            target.style.height = `${height}px`;
                            target.style.left = `${drag.left}px`;
                            target.style.top = `${drag.top}px`;
                        }}
                        onResizeEnd={({ target }) => {
                            const containerWidth = 600;
                            const containerHeight = 917; // FIXED
                            const widthPx = parseFloat(target.style.width || '0');
                            const leftPx = parseFloat(target.style.left || '0');
                            const topPx = parseFloat(target.style.top || '0');

                            onUpdateLayer(selectedLayerId, {
                                width: parseFloat(((widthPx / containerWidth) * 100).toFixed(6)),
                                x: parseFloat(((leftPx / containerWidth) * 100).toFixed(6)),
                                y: parseFloat(((topPx / containerHeight) * 100).toFixed(6))
                            });
                        }}
                        onRotate={({ target, transform, rotation }) => {
                            target.style.transform = transform;
                            // We can store rotation in a dataset or ref to use in onRotateEnd if needed
                            // but actually we can just call onUpdateLayer if we want it to persist
                        }}
                        onRotateEnd={({ target }) => {
                            // Extract rotation from transform or use a more robust way
                            // For simplicity, let's assume rotation is handled visually
                            // To fix the lint, we'll avoid the non-existent 'rotate' property
                            const transform = target.style.transform;
                            const match = transform.match(/rotate\(([-\d.]+)deg\)/);
                            const rotation = match ? parseFloat(match[1]) : 0;

                            onUpdateLayer(selectedLayerId, {
                                rotation: rotation
                            });
                        }}
                    />
                )}
            </div>
        </div>
    );
}
