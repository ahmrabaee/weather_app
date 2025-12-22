export interface MapLayer {
    id: string;
    assetId: string; // e.g., 'hebron'
    level: 'yellow' | 'orange' | 'red';
    src: string;
    x: number; // Percentage relative to map width
    y: number; // Percentage relative to map height
    width: number; // Percentage relative to map width
    height: number; // Percentage relative to map height (or auto)
    rotation: number;
    opacity: number;
}

export interface MapComposition {
    layers: MapLayer[];
    snapshot?: string; // Base64 encoded image of final composition
}
