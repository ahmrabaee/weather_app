export type AlertLevel = 'yellow' | 'orange' | 'red';
export type AlertStatus = 'draft' | 'issued' | 'cancelled';
export type SectorStatus = 'pending' | 'acknowledged' | 'inProgress' | 'completed';
export type HazardType = 'flood' | 'heatwave' | 'storm' | 'heavyRain' | 'coldWave' | 'wind';

export interface SectorResponse {
  role: string;
  status: SectorStatus;
  notes?: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  titleEn: string;
  hazardType: HazardType;
  level: AlertLevel;
  issueTime: string;
  validFrom: string;
  validTo: string;
  affectedAreas: string[];
  technicalDescAr: string;
  technicalDescEn: string;
  publicAdviceAr: string;
  publicAdviceEn: string;
  sectorRecommendations: {
    civilDefense?: string;
    agriculture?: string;
    water?: string;
    environment?: string;
    security?: string;
  };
  status: AlertStatus;
  sectorResponses: SectorResponse[];
  createdBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  role: string;
  action: string;
}
