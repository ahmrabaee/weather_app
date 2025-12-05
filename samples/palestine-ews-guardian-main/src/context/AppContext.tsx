import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, User, ActivityLog, UserRole, AlertLevel } from '@/types/alert';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  loadSampleData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_ALERTS: Alert[] = [
  {
    id: 'ALERT-001',
    title: 'Severe Heatwave Warning',
    titleAr: 'تحذير من موجة حر شديدة',
    hazardType: 'heatwave',
    level: 'orange',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Ramallah', 'Jericho', 'Jerusalem'],
    technicalDescEn: 'A severe heatwave is expected to affect the central region with temperatures exceeding 40°C for the next 3 days. High pressure system from the Arabian Peninsula is causing extreme heat conditions.',
    technicalDescAr: 'من المتوقع أن تؤثر موجة حر شديدة على المنطقة الوسطى مع درجات حرارة تتجاوز 40 درجة مئوية خلال الأيام الثلاثة القادمة.',
    publicAdviceEn: '• Stay hydrated - drink plenty of water\n• Avoid direct sunlight between 11am-4pm\n• Check on elderly neighbors\n• Keep windows closed during hottest hours\n• Never leave children or pets in vehicles',
    publicAdviceAr: '• حافظ على رطوبة جسمك - اشرب الكثير من الماء\n• تجنب أشعة الشمس المباشرة بين 11 صباحاً و 4 مساءً\n• تفقد كبار السن من الجيران\n• أغلق النوافذ خلال ساعات الحرارة الشديدة',
    sectorRecommendations: {
      'civil-defense': 'Prepare emergency cooling centers. Ensure medical teams are on standby.',
      'agriculture': 'Advise farmers to irrigate crops during early morning or evening hours.',
      'water-authority': 'Increase water distribution frequency. Monitor reservoir levels.',
      'environment': 'Monitor air quality levels. Issue advisories for vulnerable populations.',
    },
    status: 'issued',
    sectorResponses: [
      { sectorName: 'civil-defense', status: 'in-progress', notes: 'Setting up cooling centers', timestamp: new Date().toISOString() },
      { sectorName: 'water-authority', status: 'acknowledged', notes: '', timestamp: new Date().toISOString() },
    ],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-002',
    title: 'Flash Flood Warning',
    titleAr: 'تحذير من فيضان مفاجئ',
    hazardType: 'flood',
    level: 'red',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Gaza', 'Khan Yunis', 'Rafah', 'Jabalia'],
    technicalDescEn: 'Heavy rainfall expected to cause flash floods in low-lying areas. Rainfall intensity may exceed 50mm per hour in some areas.',
    technicalDescAr: 'من المتوقع أن تتسبب الأمطار الغزيرة في فيضانات مفاجئة في المناطق المنخفضة.',
    publicAdviceEn: '• Do not cross flooded roads\n• Stay away from valleys and low areas\n• Move to higher ground immediately if water rises\n• Have emergency supplies ready',
    publicAdviceAr: '• لا تعبر الطرق المغمورة بالمياه\n• ابتعد عن الوديان والمناطق المنخفضة\n• انتقل إلى مناطق مرتفعة فوراً إذا ارتفع منسوب المياه',
    sectorRecommendations: {
      'civil-defense': 'Activate flood emergency response teams. Prepare evacuation routes.',
      'agriculture': 'Protect livestock and secure agricultural equipment.',
      'water-authority': 'Monitor drainage systems. Prepare pumping equipment.',
    },
    status: 'issued',
    sectorResponses: [
      { sectorName: 'civil-defense', status: 'in-progress', notes: 'Teams deployed to affected areas', timestamp: new Date().toISOString() },
    ],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-003',
    title: 'Drought Advisory',
    titleAr: 'استشارة جفاف',
    hazardType: 'drought',
    level: 'yellow',
    issueTime: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Hebron', 'Bethlehem', 'Nablus'],
    technicalDescEn: 'Below-average rainfall has led to drought conditions in the southern region. Water conservation measures are recommended.',
    technicalDescAr: 'أدى انخفاض معدل هطول الأمطار إلى ظروف جفاف في المنطقة الجنوبية.',
    publicAdviceEn: '• Conserve water - reduce non-essential usage\n• Report any water leaks immediately\n• Use water-efficient appliances',
    publicAdviceAr: '• وفر المياه - قلل من الاستخدام غير الضروري\n• أبلغ عن أي تسرب للمياه فوراً',
    sectorRecommendations: {
      'water-authority': 'Implement water rationing schedules. Increase well water extraction.',
      'agriculture': 'Advise on drought-resistant crops. Promote efficient irrigation.',
    },
    status: 'issued',
    sectorResponses: [],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ALERT-004',
    title: 'Storm Warning',
    titleAr: 'تحذير من عاصفة',
    hazardType: 'storm',
    level: 'orange',
    issueTime: new Date().toISOString(),
    validFrom: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    validTo: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Jenin', 'Tulkarm', 'Qalqilya', 'Nablus'],
    technicalDescEn: 'A severe storm system is approaching from the Mediterranean. Expect strong winds up to 80 km/h and heavy rainfall.',
    technicalDescAr: 'نظام عاصفة شديدة يقترب من البحر المتوسط. توقع رياح قوية تصل إلى 80 كم/ساعة وأمطار غزيرة.',
    publicAdviceEn: '• Secure loose outdoor objects\n• Stay indoors during the storm\n• Avoid driving unless necessary',
    publicAdviceAr: '• أمّن الأشياء الخارجية غير المثبتة\n• ابق في الداخل أثناء العاصفة',
    sectorRecommendations: {
      'civil-defense': 'Prepare emergency response teams. Clear drainage systems.',
    },
    status: 'pending',
    sectorResponses: [],
    createdBy: 'Meteorology',
    createdAt: new Date().toISOString(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ews-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('ews-alerts');
    return saved ? JSON.parse(saved) : SAMPLE_ALERTS;
  });
  
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ews-logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('ews-language');
    return (saved as 'en' | 'ar') || 'en';
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
    addLog({
      sector: alert.createdBy,
      action: 'created',
      alertId: alert.id,
      details: `Created ${alert.level.toUpperCase()} alert: ${alert.title}`,
    });
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

  const clearLogs = () => setLogs([]);

  const loadSampleData = () => {
    setAlerts(SAMPLE_ALERTS);
    addLog({
      sector: 'System',
      action: 'loaded',
      details: 'Sample data loaded',
    });
  };

  const clearAllData = () => {
    setAlerts([]);
    setLogs([]);
    localStorage.removeItem('ews-alerts');
    localStorage.removeItem('ews-logs');
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
      clearLogs,
      language,
      setLanguage,
      loadSampleData,
      clearAllData,
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
