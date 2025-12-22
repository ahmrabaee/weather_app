import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { GOVERNORATES, OVERLAY_ASSETS } from './assets';

interface StudioSidebarProps {
    onAddLayer: (assetId: string, level: 'yellow' | 'orange' | 'red', src: string) => void;
}

export function StudioSidebar({ onAddLayer }: StudioSidebarProps) {
    const [activeTab, setActiveTab] = useState<'yellow' | 'orange' | 'red'>('yellow');
    const [search, setSearch] = useState('');

    const filteredAssets = GOVERNORATES.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'yellow': return '#FFC107';
            case 'orange': return '#FF9800';
            case 'red': return '#DC2626';
            default: return '#FFC107';
        }
    };

    return (
        <div className="w-80 bg-primary border-r border-primary-foreground/10 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-primary-foreground/20">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search governorates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-foreground/40 focus:ring-1 focus:ring-primary-foreground/40 transition-all"
                    />
                </div>
            </div>

            {/* Level Tabs */}
            <div className="flex p-1 m-3 rounded-lg bg-primary-foreground/10">
                {(['yellow', 'orange', 'red'] as const).map(level => (
                    <button
                        key={level}
                        onClick={() => setActiveTab(level)}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${activeTab === level
                            ? "bg-primary-foreground text-primary shadow-sm"
                            : "text-primary-foreground/70 hover:text-primary-foreground"
                            }`}
                    >
                        <span
                            className="inline-block w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: getLevelColor(level) }}
                        />
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
            </div>

            {/* Asset List */}
            <div className="flex-1 p-3 overflow-y-auto">
                <p className="text-xs text-primary-foreground/60 mb-3 px-1">
                    Click a governorate to add it to the map
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {filteredAssets.map(asset => {
                        const assetSrc = OVERLAY_ASSETS[asset.id]?.[activeTab] || '';
                        return (
                            <button
                                key={asset.id}
                                onClick={() => onAddLayer(asset.id, activeTab, assetSrc)}
                                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all hover:scale-105 border border-slate-700/50"
                            >
                                <div className="w-full h-16 mb-2 flex items-center justify-center">
                                    <img
                                        src={assetSrc}
                                        alt={asset.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <p className="text-xs text-primary-foreground/80 text-center truncate">
                                    {asset.name}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
