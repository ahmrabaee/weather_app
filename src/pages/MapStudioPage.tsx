import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapStudio } from '@/components/MapStudio/MapStudio';
import { useApp } from '@/contexts/AppContext';

export default function MapStudioPage() {
    const navigate = useNavigate();
    const { mapComposition, setMapComposition } = useApp();

    return (
        <MapStudio
            onClose={() => navigate(-1)}
            onSave={(composition) => {
                setMapComposition(composition);
                navigate(-1);
            }}
            initialComposition={mapComposition}
        />
    );
}
