export type AlertLevel = 'yellow' | 'orange' | 'red';
export type HazardType = 'flood' | 'heatwave' | 'storm' | 'drought' | 'earthquake' | 'other';
export type AlertStatus = 'draft' | 'pending' | 'issued' | 'cancelled';
export type SectorStatus = 'pending' | 'acknowledged' | 'in-progress' | 'completed';

export interface SectorResponse {
  sectorName: string;
  status: SectorStatus;
  notes: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  title: string;
  titleAr: string;
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
  sectorRecommendations: Record<string, string>;
  status: AlertStatus;
  sectorResponses: SectorResponse[];
  createdBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  sector: string;
  action: string;
  alertId?: string;
  details: string;
}

export type UserRole = 
  | 'meteorology' 
  | 'civil-defense' 
  | 'agriculture' 
  | 'water-authority' 
  | 'environment' 
  | 'security';

export interface User {
  role: UserRole;
  name: string;
}

export const SECTORS: { value: UserRole; label: string; labelAr: string }[] = [
  { value: 'meteorology', label: 'Meteorology', labelAr: 'الأرصاد الجوية' },
  { value: 'civil-defense', label: 'Civil Defense', labelAr: 'الدفاع المدني' },
  { value: 'agriculture', label: 'Agriculture', labelAr: 'الزراعة' },
  { value: 'water-authority', label: 'Water Authority', labelAr: 'سلطة المياه' },
  { value: 'environment', label: 'Environment', labelAr: 'البيئة' },
  { value: 'security', label: 'Security', labelAr: 'الأمن' },
];

export const AREAS = [
  'Ramallah', 'Jericho', 'Gaza', 'Hebron', 'Nablus', 'Jenin', 
  'Tulkarm', 'Qalqilya', 'Tubas', 'Salfit', 'Bethlehem', 
  'Khan Yunis', 'Rafah', 'Jabalia', 'Jerusalem', 'Jordan Valley'
];

export const HAZARD_TYPES: { value: HazardType; label: string; labelAr: string }[] = [
  { value: 'heatwave', label: 'Heatwave', labelAr: 'موجة حر' },
  { value: 'flood', label: 'Flood', labelAr: 'فيضان' },
  { value: 'storm', label: 'Storm', labelAr: 'عاصفة' },
  { value: 'drought', label: 'Drought', labelAr: 'جفاف' },
  { value: 'earthquake', label: 'Earthquake', labelAr: 'زلزال' },
  { value: 'other', label: 'Other', labelAr: 'أخرى' },
];
