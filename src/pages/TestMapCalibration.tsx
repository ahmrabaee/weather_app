import React, { useState } from 'react';
import { StudioCanvas } from '@/components/MapStudio/StudioCanvas';
import { StudioSidebar } from '@/components/MapStudio/StudioSidebar';
import { MapLayer } from '@/types/mapStudio';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TestMapCalibration() {
    const [layers, setLayers] = useState<MapLayer[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

    const handleAddLayer = (assetId: string, level: 'yellow' | 'orange' | 'red', src: string) => {
        // Add layer with initial 30% width to allow for calibration
        const newLayer: MapLayer = {
            id: `layer-${Date.now()}`,
            assetId,
            level,
            src,
            x: 35,
            y: 35,
            width: 30, // Start small so we can drag it
            height: 0, // 0 means auto-height based on aspect ratio
            rotation: 0,
            opacity: 1,
        };
        setLayers(prev => [...prev, newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    const handleUpdateLayer = (id: string, updates: Partial<MapLayer>) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const handleDeleteLayer = (id: string) => {
        setLayers(prev => prev.filter(l => l.id !== id));
        if (selectedLayerId === id) setSelectedLayerId(null);
    };

    const copyConfig = () => {
        if (!selectedLayerId) return;
        const layer = layers.find(l => l.id === selectedLayerId);
        if (!layer) return;

        const config = `{
      x: ${layer.x},
      y: ${layer.y},
      width: ${layer.width},
    },`;

        navigator.clipboard.writeText(config);
        toast.success('Configuration copied to clipboard!');
        console.log(`Asset: ${layer.assetId}`, config);
    };

    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    return (
        <div className="flex bg-slate-100 min-h-screen">
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
                <div className="p-4 border-b">
                    <h1 className="font-bold text-lg">Map Calibration Tool</h1>
                    <p className="text-xs text-slate-500">Add a layer, position it perfectly, then copy the coordinates.</p>
                </div>

                <StudioSidebar onAddLayer={handleAddLayer} />

                <div className="p-4 border-t mt-auto bg-slate-50">
                    <h3 className="font-bold mb-2 text-sm">Selected Layer Values</h3>
                    {selectedLayer ? (
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between">
                                <span>Asset:</span>
                                <span className="font-bold text-blue-600">{selectedLayer.assetId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>X:</span>
                                <span>{selectedLayer.x.toFixed(4)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Y:</span>
                                <span>{selectedLayer.y.toFixed(4)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Width:</span>
                                <span>{selectedLayer.width.toFixed(4)}%</span>
                            </div>

                            <Button onClick={copyConfig} className="w-full mt-2">
                                Copy Config
                            </Button>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-xs italic">Select a layer to see values</p>
                    )}
                </div>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center bg-slate-900 overflow-auto">
                <StudioCanvas
                    layers={layers}
                    selectedLayerId={selectedLayerId}
                    onSelectLayer={setSelectedLayerId}
                    onUpdateLayer={handleUpdateLayer}
                    onDeleteLayer={handleDeleteLayer}
                />
            </div>
        </div>
    );
}
