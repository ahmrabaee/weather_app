import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'meteorology' 
  | 'civil_defense' 
  | 'agriculture' 
  | 'water_authority' 
  | 'environment' 
  | 'security';

export type AlertLevel = 'yellow' | 'orange' | 'red';

export type AlertStatus = 'draft' | 'issued' | 'cancelled';

export type SectorStatus = 'pending' | 'acknowledged' | 'in_progress' | 'completed';

export interface SectorResponse {
  role: UserRole;
  status: SectorStatus;
  notes?: string;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  title: string;
  titleEn: string;
  hazardType: string;
  level: AlertLevel;
  issuedAt: Date;
  validFrom: Date;
  validTo: Date;
  affectedAreas: string[];
  descriptionAr: string;
  descriptionEn: string;
  adviceAr: string;
  adviceEn: string;
  sectorRecommendations: Record<UserRole, string>;
  sectorResponses: SectorResponse[];
  status: AlertStatus;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  role: UserRole;
  action: string;
}

interface EWSContextType {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  logs: LogEntry[];
  addLog: (role: UserRole, action: string) => void;
  loadSampleAlerts: () => void;
  clearAllAlerts: () => void;
}

const EWSContext = createContext<EWSContextType | undefined>(undefined);

export const roleLabels: Record<UserRole, { ar: string; en: string }> = {
  meteorology: { ar: 'الأرصاد الجوية', en: 'Meteorology' },
  civil_defense: { ar: 'الدفاع المدني', en: 'Civil Defense' },
  agriculture: { ar: 'وزارة الزراعة', en: 'Agriculture' },
  water_authority: { ar: 'سلطة المياه', en: 'Water Authority' },
  environment: { ar: 'سلطة جودة البيئة', en: 'Environment Authority' },
  security: { ar: 'الأمن', en: 'Security' },
};

export const alertLevelLabels: Record<AlertLevel, { ar: string; en: string }> = {
  yellow: { ar: 'كن على دراية', en: 'Advisory' },
  orange: { ar: 'كن مستعداً', en: 'Watch' },
  red: { ar: 'اتخذ إجراء', en: 'Warning' },
};

export const statusLabels: Record<SectorStatus, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  acknowledged: { ar: 'تم الإقرار', en: 'Acknowledged' },
  in_progress: { ar: 'قيد التنفيذ', en: 'In Progress' },
  completed: { ar: 'مكتمل', en: 'Completed' },
};

const sampleAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    title: 'تحذير من عاصفة رعدية شديدة',
    titleEn: 'Severe Thunderstorm Warning',
    hazardType: 'thunderstorm',
    level: 'red',
    issuedAt: new Date(),
    validFrom: new Date(),
    validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
    affectedAreas: ['رام الله', 'القدس', 'بيت لحم'],
    descriptionAr: 'من المتوقع هطول أمطار غزيرة مصحوبة بعواصف رعدية شديدة خلال الـ 24 ساعة القادمة.',
    descriptionEn: 'Heavy rainfall accompanied by severe thunderstorms expected in the next 24 hours.',
    adviceAr: '• تجنب التواجد في الأماكن المنخفضة\n• ابتعد عن الأشجار والأعمدة الكهربائية\n• لا تقود السيارة أثناء العاصفة',
    adviceEn: '• Avoid low-lying areas\n• Stay away from trees and power lines\n• Do not drive during the storm',
    sectorRecommendations: {
      meteorology: '',
      civil_defense: 'تجهيز فرق الإنقاذ وتوزيعها على المناطق المتأثرة',
      agriculture: 'حماية المحاصيل الزراعية وتأمين البيوت البلاستيكية',
      water_authority: 'فحص شبكات الصرف الصحي وتنظيف المجاري',
      environment: 'مراقبة مستويات التلوث بعد العاصفة',
      security: 'تأمين الطرق الرئيسية والتحكم في حركة المرور',
    },
    sectorResponses: [
      { role: 'civil_defense', status: 'in_progress', updatedAt: new Date() },
      { role: 'water_authority', status: 'acknowledged', updatedAt: new Date() },
    ],
    status: 'issued',
  },
  {
    id: 'ALERT-002',
    title: 'موجة حر شديدة',
    titleEn: 'Extreme Heat Wave',
    hazardType: 'heatwave',
    level: 'orange',
    issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    validFrom: new Date(),
    validTo: new Date(Date.now() + 72 * 60 * 60 * 1000),
    affectedAreas: ['أريحا', 'غور الأردن', 'طوباس'],
    descriptionAr: 'موجة حر شديدة متوقعة مع درجات حرارة تتجاوز 40 درجة مئوية.',
    descriptionEn: 'Extreme heat wave expected with temperatures exceeding 40°C.',
    adviceAr: '• شرب كميات كافية من الماء\n• تجنب التعرض لأشعة الشمس المباشرة\n• فحص كبار السن والأطفال بانتظام',
    adviceEn: '• Drink plenty of water\n• Avoid direct sunlight\n• Check on elderly and children regularly',
    sectorRecommendations: {
      meteorology: '',
      civil_defense: 'تجهيز نقاط إسعاف متنقلة',
      agriculture: 'زيادة ري المحاصيل وتوفير الظل للحيوانات',
      water_authority: 'ضمان استمرار إمدادات المياه',
      environment: 'مراقبة جودة الهواء',
      security: 'دعم نقاط التوزيع',
    },
    sectorResponses: [
      { role: 'agriculture', status: 'completed', updatedAt: new Date() },
    ],
    status: 'issued',
  },
  {
    id: 'ALERT-003',
    title: 'احتمالية فيضانات خفيفة',
    titleEn: 'Minor Flood Risk',
    hazardType: 'flood',
    level: 'yellow',
    issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    validFrom: new Date(),
    validTo: new Date(Date.now() + 48 * 60 * 60 * 1000),
    affectedAreas: ['نابلس', 'جنين', 'طولكرم'],
    descriptionAr: 'احتمالية حدوث فيضانات خفيفة في المناطق المنخفضة.',
    descriptionEn: 'Possibility of minor flooding in low-lying areas.',
    adviceAr: '• كن على دراية بحالة الطقس\n• تجنب الوديان والمناطق المنخفضة',
    adviceEn: '• Stay aware of weather conditions\n• Avoid valleys and low areas',
    sectorRecommendations: {
      meteorology: '',
      civil_defense: 'وضع فرق الإنقاذ في حالة تأهب',
      agriculture: 'تصريف المياه الزائدة من الحقول',
      water_authority: 'مراقبة مستويات المياه',
      environment: 'تقييم المخاطر البيئية',
      security: 'مراقبة الطرق المعرضة للفيضانات',
    },
    sectorResponses: [],
    status: 'issued',
  },
];

export function EWSProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (role: UserRole, action: string) => {
    const newLog: LogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date(),
      role,
      action,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const loadSampleAlerts = () => {
    setAlerts(sampleAlerts);
    addLog('meteorology', 'تم تحميل إنذارات العينة');
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    addLog('meteorology', 'تم مسح جميع الإنذارات');
  };

  return (
    <EWSContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        alerts,
        setAlerts,
        logs,
        addLog,
        loadSampleAlerts,
        clearAllAlerts,
      }}
    >
      {children}
    </EWSContext.Provider>
  );
}

export function useEWS() {
  const context = useContext(EWSContext);
  if (context === undefined) {
    throw new Error('useEWS must be used within an EWSProvider');
  }
  return context;
}
