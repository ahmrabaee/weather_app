import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Undo, Redo } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';
import { StudioSidebar } from './StudioSidebar';
import { StudioCanvas } from './StudioCanvas';
import { MapLayer, MapComposition } from '@/types/mapStudio';
import { Button } from '@/components/ui/button';

interface MapStudioProps {
    onClose: () => void;
    onSave: (composition: MapComposition) => void;
    initialComposition?: MapComposition;
}

export function MapStudio({ onClose, onSave, initialComposition }: MapStudioProps) {
    const [layers, setLayers] = useState<MapLayer[]>(initialComposition?.layers || []);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Sync state with initialComposition if it changes
    useEffect(() => {
        if (initialComposition?.layers) {
            setLayers(initialComposition.layers);
        }
    }, [initialComposition]);

    const handleAddLayer = (assetId: string, level: 'yellow' | 'orange' | 'red', src: string) => {
        const newLayer: MapLayer = {
            id: `layer-${Date.now()}`,
            assetId,
            level,
            src,
            x: 35, // Default center-ish
            y: 35,
            width: 30, // Default width
            height: 0, // Auto
            rotation: 0,
            opacity: 1,
        };
        setLayers([...layers, newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    const handleUpdateLayer = (id: string, updates: Partial<MapLayer>) => {
        setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const handleDeleteLayer = (id: string) => {
        setLayers(layers.filter(l => l.id !== id));
        if (selectedLayerId === id) setSelectedLayerId(null);
    };

    const handleSave = async () => {
        // CRITICAL: Capture screenshot of canvas
        if (!canvasRef.current) {
            onSave({ layers });
            return;
        }

        try {
            // Find the actual map container (600x917)
            const mapContainer = canvasRef.current.querySelector('div[style*="width: 600px"]') as HTMLElement;
            if (!mapContainer) {
                onSave({ layers });
                return;
            }

            // Capture at 2x scale for high quality
            const canvas = await html2canvas(mapContainer, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const snapshot = canvas.toDataURL('image/png');
            onSave({ layers, snapshot });
        } catch (error) {
            console.error('Failed to capture snapshot:', error);
            // Fallback to layers only
            onSave({ layers });
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-xl tracking-tight text-slate-100">Map Studio</div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div className="text-sm text-slate-400">
                        {layers.length === 0 ? 'No active warnings' : `Editing ${layers.length} warning layer(s)`}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
                        <Check className="w-4 h-4" />
                        Apply to Alert
                    </Button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <StudioSidebar onAddLayer={handleAddLayer} />

                {/* Canvas Area */}
                <div
                    ref={canvasRef}
                    className="flex-1 bg-[#1E293B] relative overflow-hidden flex items-center justify-center p-8"
                >
                    {/* Dot Pattern Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                    />

                    <StudioCanvas
                        layers={layers}
                        selectedLayerId={selectedLayerId}
                        onSelectLayer={setSelectedLayerId}
                        onUpdateLayer={handleUpdateLayer}
                        onDeleteLayer={handleDeleteLayer}
                    />
                </div>
            </div>
        </div>
    );
}
