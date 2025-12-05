import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  ar: {
    // Login Page
    'login.title': 'نظام الإنذار المبكر - تسجيل الدخول',
    'login.selectRole': 'اختر دورك',
    'login.username': 'اسم المستخدم',
    'login.enter': 'دخول النظام',
    
    // Roles
    'role.meteorology': 'الأرصاد الجوية',
    'role.civilDefense': 'الدفاع المدني',
    'role.agriculture': 'وزارة الزراعة',
    'role.water': 'سلطة المياه',
    'role.environment': 'سلطة جودة البيئة',
    'role.security': 'الأمن',
    
    // Alert Levels
    'alert.yellow': 'أصفر - كن على دراية',
    'alert.orange': 'برتقالي - كن مستعداً',
    'alert.red': 'أحمر - اتخذ إجراء',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.activeAlerts': 'الإنذارات النشطة',
    'dashboard.byLevel': 'حسب المستوى',
    'dashboard.avgResponse': 'متوسط وقت الاستجابة',
    'dashboard.createAlert': 'إنشاء إنذار جديد',
    'dashboard.filterAll': 'الكل',
    'dashboard.filterActive': 'نشط',
    'dashboard.filterPast': 'ماضي',
    
    // Alert Table
    'table.alertId': 'رقم الإنذار',
    'table.title': 'العنوان',
    'table.level': 'المستوى',
    'table.areas': 'المناطق المتأثرة',
    'table.validUntil': 'صالح حتى',
    'table.status': 'الحالة',
    'table.actions': 'الإجراءات',
    
    // Create Alert
    'create.title': 'إنشاء إنذار جديد',
    'create.basicInfo': 'المعلومات الأساسية',
    'create.alertTitle': 'عنوان الإنذار',
    'create.hazardType': 'نوع الخطر',
    'create.alertLevel': 'مستوى الإنذار',
    'create.timeGeo': 'النطاق الزمني والجغرافي',
    'create.issueTime': 'وقت الإصدار',
    'create.validFrom': 'صالح من',
    'create.validTo': 'صالح حتى',
    'create.affectedAreas': 'المناطق المتأثرة',
    'create.publicMessages': 'الرسائل العامة',
    'create.technicalDesc': 'الوصف التقني',
    'create.publicAdvice': 'النصيحة العامة',
    'create.sectorRecs': 'توصيات القطاعات',
    'create.saveDraft': 'حفظ كمسودة',
    'create.issueAlert': 'إصدار الإنذار',
    'create.cancel': 'إلغاء',
    
    // Hazard Types
    'hazard.flood': 'فيضان',
    'hazard.heatwave': 'موجة حر',
    'hazard.storm': 'عاصفة',
    'hazard.heavyRain': 'أمطار غزيرة',
    'hazard.coldWave': 'موجة برد',
    'hazard.wind': 'رياح قوية',
    
    // Sector Dashboard
    'sector.myAlerts': 'إنذاراتي',
    'sector.alertDetails': 'تفاصيل الإنذار',
    'sector.myRecommendations': 'توصياتي',
    'sector.otherSectors': 'حالة القطاعات الأخرى',
    'sector.updateStatus': 'تحديث حالتي',
    'sector.notes': 'ملاحظات / تعليقات',
    'sector.saveStatus': 'حفظ الحالة',
    'sector.viewDetails': 'عرض التفاصيل',
    
    // Status
    'status.pending': 'قيد الانتظار',
    'status.acknowledged': 'تم الإقرار',
    'status.inProgress': 'قيد التنفيذ',
    'status.completed': 'تم الإنجاز',
    'status.draft': 'مسودة',
    'status.issued': 'صادر',
    'status.cancelled': 'ملغى',
    
    // Public View
    'public.title': 'إنذار طقس',
    'public.what': 'ماذا يحدث؟',
    'public.when': 'متى؟',
    'public.where': 'أين؟',
    'public.whatToDo': 'ماذا يجب أن أفعل؟',
    'public.disclaimer': 'هذا نموذج أولي يستخدم بيانات اختبار فقط.',
    
    // Logs
    'logs.title': 'السجلات وبيانات الاختبار',
    'logs.loadSample': 'تحميل إنذارات العينة',
    'logs.clearAll': 'مسح جميع الإنذارات',
    'logs.activityLog': 'سجل النشاط',
    'logs.time': 'الوقت',
    'logs.role': 'الدور',
    'logs.action': 'الإجراء',
    
    // Common
    'common.save': 'حفظ',
    'common.close': 'إغلاق',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.loading': 'جاري التحميل...',
    'common.noData': 'لا توجد بيانات',
  },
  en: {
    // Login Page
    'login.title': 'Early Warning System - Login',
    'login.selectRole': 'Select Your Role',
    'login.username': 'Username',
    'login.enter': 'Enter System',
    
    // Roles
    'role.meteorology': 'Meteorology',
    'role.civilDefense': 'Civil Defense',
    'role.agriculture': 'Ministry of Agriculture',
    'role.water': 'Water Authority',
    'role.environment': 'Environmental Quality Authority',
    'role.security': 'Security',
    
    // Alert Levels
    'alert.yellow': 'Yellow - Be Aware',
    'alert.orange': 'Orange - Be Prepared',
    'alert.red': 'Red - Take Action',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.activeAlerts': 'Active Alerts',
    'dashboard.byLevel': 'By Level',
    'dashboard.avgResponse': 'Average Response Time',
    'dashboard.createAlert': 'Create New Alert',
    'dashboard.filterAll': 'All',
    'dashboard.filterActive': 'Active',
    'dashboard.filterPast': 'Past',
    
    // Alert Table
    'table.alertId': 'Alert ID',
    'table.title': 'Title',
    'table.level': 'Level',
    'table.areas': 'Affected Areas',
    'table.validUntil': 'Valid Until',
    'table.status': 'Status',
    'table.actions': 'Actions',
    
    // Create Alert
    'create.title': 'Create New Alert',
    'create.basicInfo': 'Basic Information',
    'create.alertTitle': 'Alert Title',
    'create.hazardType': 'Hazard Type',
    'create.alertLevel': 'Alert Level',
    'create.timeGeo': 'Time & Geographic Range',
    'create.issueTime': 'Issue Time',
    'create.validFrom': 'Valid From',
    'create.validTo': 'Valid To',
    'create.affectedAreas': 'Affected Areas',
    'create.publicMessages': 'Public Messages',
    'create.technicalDesc': 'Technical Description',
    'create.publicAdvice': 'Public Advice',
    'create.sectorRecs': 'Sector-Specific Recommendations',
    'create.saveDraft': 'Save as Draft',
    'create.issueAlert': 'Issue Alert',
    'create.cancel': 'Cancel',
    
    // Hazard Types
    'hazard.flood': 'Flood',
    'hazard.heatwave': 'Heatwave',
    'hazard.storm': 'Storm',
    'hazard.heavyRain': 'Heavy Rain',
    'hazard.coldWave': 'Cold Wave',
    'hazard.wind': 'Strong Wind',
    
    // Sector Dashboard
    'sector.myAlerts': 'My Alerts',
    'sector.alertDetails': 'Alert Details',
    'sector.myRecommendations': 'My Recommendations',
    'sector.otherSectors': 'Other Sectors Status',
    'sector.updateStatus': 'Update My Status',
    'sector.notes': 'Notes / Comments',
    'sector.saveStatus': 'Save Status',
    'sector.viewDetails': 'View Details',
    
    // Status
    'status.pending': 'Pending',
    'status.acknowledged': 'Acknowledged',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',
    'status.draft': 'Draft',
    'status.issued': 'Issued',
    'status.cancelled': 'Cancelled',
    
    // Public View
    'public.title': 'Weather Alert',
    'public.what': 'What is happening?',
    'public.when': 'When?',
    'public.where': 'Where?',
    'public.whatToDo': 'What should I do?',
    'public.disclaimer': 'This is a prototype using test data only.',
    
    // Logs
    'logs.title': 'Logs & Test Data',
    'logs.loadSample': 'Load Sample Alerts',
    'logs.clearAll': 'Clear All Alerts',
    'logs.activityLog': 'Activity Log',
    'logs.time': 'Time',
    'logs.role': 'Role',
    'logs.action': 'Action',
    
    // Common
    'common.save': 'Save',
    'common.close': 'Close',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
