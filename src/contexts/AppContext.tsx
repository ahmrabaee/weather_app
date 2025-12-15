import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'meteorology' | 'civil-defense' | 'agriculture' | 'water-authority' | 'environment' | 'security';
export type AlertLevel = 'yellow' | 'orange' | 'red';
export type AlertStatus = 'draft' | 'pending' | 'issued' | 'cancelled';
export type SectorStatus = 'pending' | 'acknowledged' | 'in-progress' | 'completed';

export interface Marker {
  id: string;
  x: number;
  y: number;
  level: AlertLevel;
}

export interface SectorResponse {
  sectorName: string;
  status: SectorStatus;
  notes: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  title: string;
  titleEn: string;
  hazardType: 'flood' | 'heatwave' | 'storm' | 'soil-moisture' | 'other';
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
  markers?: Marker[]; // NEW: Map markers for alert visualization
}

export interface ActivityLog {
  id: string;
  role: UserRole;
  action: string;
  alertId?: string;
  timestamp: string;
}

interface User {
  role: UserRole;
  name: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearAll: () => void;
  loadSampleData: () => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ROLE_NAMES: Record<UserRole, string> = {
  'meteorology': 'Meteorology',
  'civil-defense': 'Civil Defense',
  'agriculture': 'Agriculture',
  'water-authority': 'Water Authority',
  'environment': 'Environment',
  'security': 'Security',
};

const SAMPLE_ALERTS: Alert[] = [
  {
    id: 'ALERT-001',
    title: 'موجة حرارة شديدة - رام الله',
    titleEn: 'Severe Heatwave - Ramallah Region',
    hazardType: 'heatwave',
    level: 'orange',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Ramallah', 'Al-Bireh', 'Jericho'],
    technicalDescAr: 'من المتوقع أن ترتفع درجات الحرارة لتتجاوز 40 درجة مئوية لمدة ثلاثة أيام متتالية. ستكون الظروف خطيرة بشكل خاص لكبار السن والأطفال.',
    technicalDescEn: 'Temperatures expected to exceed 40°C for three consecutive days. Conditions will be particularly dangerous for the elderly and children.',
    publicAdviceAr: '• تجنب أشعة الشمس المباشرة من الساعة 11 صباحاً حتى 4 مساءً\n• اشرب الكثير من الماء\n• تفقد الجيران المسنين\n• أبقِ النوافذ مغلقة خلال ساعات الذروة الحرارية',
    publicAdviceEn: '• Avoid direct sunlight from 11am to 4pm\n• Drink plenty of water\n• Check on elderly neighbors\n• Keep windows closed during hottest hours',
    sectorRecommendations: {
      'civil-defense': 'Prepare emergency cooling centers. Deploy water distribution teams.',
      'agriculture': 'Advise farmers on livestock protection. Issue irrigation advisories.',
      'water-authority': 'Increase water supply to affected areas. Monitor reservoir levels.',
      'environment': 'Monitor air quality. Issue health advisories.',
    },
    status: 'issued',
    sectorResponses: [
      { sectorName: 'civil-defense', status: 'in-progress', notes: 'Cooling centers being set up', timestamp: new Date().toISOString() },
      { sectorName: 'water-authority', status: 'acknowledged', notes: '', timestamp: new Date().toISOString() },
    ],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-002',
    title: 'تحذير من فيضانات مفاجئة',
    titleEn: 'Flash Flood Warning - Valley Areas',
    hazardType: 'flood',
    level: 'red',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Hebron', 'Bethlehem'],
    technicalDescAr: 'من المتوقع هطول أمطار غزيرة تسبب فيضانات مفاجئة خطيرة في المناطق المنخفضة والأودية.',
    technicalDescEn: 'Heavy rainfall expected causing dangerous flash floods in low-lying areas and valleys.',
    publicAdviceAr: '• لا تعبر الطرق المغمورة بالمياه\n• ابتعد عن الأودية\n• انتقل إلى أرض مرتفعة\n• استمع للتعليمات الرسمية',
    publicAdviceEn: '• Do not cross flooded roads\n• Stay away from valleys\n• Move to higher ground\n• Listen to official instructions',
    sectorRecommendations: {
      'civil-defense': 'Activate emergency response teams. Prepare evacuation routes.',
      'agriculture': 'Warn farmers in flood-prone areas.',
      'water-authority': 'Monitor drainage systems. Prepare pumping equipment.',
    },
    status: 'issued',
    sectorResponses: [
      { sectorName: 'civil-defense', status: 'completed', notes: 'Teams deployed', timestamp: new Date().toISOString() },
    ],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-003',
    title: 'تحذير من انخفاض رطوبة التربة',
    titleEn: 'Soil Moisture Level Warning',
    hazardType: 'soil-moisture',
    level: 'yellow',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Nablus', 'Jenin', 'Tulkarm'],
    technicalDescAr: 'مستويات رطوبة التربة أقل من المعدل الطبيعي في المنطقة الشمالية. التأثير على المحاصيل الزراعية متوقع.',
    technicalDescEn: 'Soil moisture levels below normal in the northern region. Agricultural impact expected.',
    publicAdviceAr: '• حافظ على المياه\n• قلل من استخدام المياه غير الضروري\n• أبلغ عن تسربات المياه',
    publicAdviceEn: '• Conserve water\n• Reduce non-essential water usage\n• Report water leaks',
    sectorRecommendations: {
      'agriculture': 'Monitor irrigation schedules. Advise on water-efficient practices.',
      'water-authority': 'Implement water conservation measures. Monitor ground water levels.',
    },
    status: 'pending',
    sectorResponses: [],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ews-user');
    return stored ? JSON.parse(stored) : null;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const stored = localStorage.getItem('ews-alerts');
    return stored ? JSON.parse(stored) : SAMPLE_ALERTS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const stored = localStorage.getItem('ews-logs');
    return stored ? JSON.parse(stored) : [];
  });

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    const stored = localStorage.getItem('ews-language');
    return (stored as 'ar' | 'en') || 'en';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ews-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ews-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ews-alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('ews-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ews-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    addLog({ role: user?.role || 'meteorology', action: `Created ${alert.id} (${alert.level}) - ${alert.titleEn}`, alertId: alert.id });
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const clearAll = () => {
    setAlerts([]);
    setLogs([]);
    localStorage.removeItem('ews-alerts');
    localStorage.removeItem('ews-logs');
  };

  const loadSampleData = () => {
    setAlerts(SAMPLE_ALERTS);
    addLog({ role: user?.role || 'meteorology', action: 'Loaded sample alerts data' });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      alerts,
      setAlerts,
      addAlert,
      updateAlert,
      logs,
      addLog,
      clearAll,
      loadSampleData,
      language,
      setLanguage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { ROLE_NAMES };
