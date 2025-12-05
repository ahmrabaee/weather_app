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
    'app.name': 'نظام الإنذار المبكر',
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
    'common.approve': 'اعتماد',
    'common.reject': 'رفض',

    // Navigation
    'nav.approvals': 'الموافقات',
    'nav.disseminate': 'نشر الإنذار',

    // Approval Page
    'approval.pendingList': 'قائمة الانتظار',
    'approval.details': 'تفاصيل الإنذار',
    'alert.approved': 'تم اعتماد الإنذار',
    'alert.rejected': 'تم رفض الإنذار',
    'alert.type': 'النوع',
    'alert.location': 'الموقع',
    'alert.severity': 'الشدة',
    'alert.sentBy': 'المرسل',
    'alert.endTime': 'وقت الانتهاء',
    'alert.hazard': 'الخطر',
    'alert.description': 'الوصف',

    // Disseminate Page
    'disseminate.channels': 'قنوات النشر',
    'disseminate.recipients': 'المستلمون',
    'disseminate.preview': 'معاينة الرسالة',
    'disseminate.sendSMS': 'إرسال SMS',
    'disseminate.sendWhatsapp': 'إرسال عبر واتساب',
    'disseminate.sendEmail': 'إرسال بريد إلكتروني',
    'disseminate.log': 'سجل النشر',
    'disseminate.sentOn': 'أرسلت في',
    'disseminate.noRecipients': 'لم يتم تحديد مستلمين',
    'disseminate.sent': 'تم الإرسال بنجاح',
    'disseminate.district.ramallah': 'محافظة رام الله',
    'disseminate.district.jericho': 'محافظة أريحا',
    'disseminate.district.hebron': 'محافظة الخليل',
    'disseminate.district.nablus': 'محافظة نابلس',
    'disseminate.district.gaza': 'قطاع غزة',
    'disseminate.district.emergency': 'فرق الاستجابة للطوارئ',
    'disseminate.recipientsCount': 'مستلم',
    'disseminate.preview.sms.content': '[نظام الإنذار المبكر] موجة حارة شديدة في المنطقة الوسطى. الحرارة > 40. تجنب الشمس. النهاية: 25/01 18:00.',
    'disseminate.preview.whatsapp.title': '🚨 *تنبيه طوارئ* 🚨',
    'disseminate.preview.whatsapp.line1': 'موجة حارة شديدة متوقعة في المنطقة الوسطى.',
    'disseminate.preview.whatsapp.line2': '🌡️ درجات الحرارة تتجاوز 40 درجة مئوية.',
    'disseminate.preview.whatsapp.line3': '⚠️ يرجى تجنب الأنشطة الخارجية والبقاء رطباً.',
    'disseminate.preview.email.subject': 'عاجل: تنبيه موجة حارة - المنطقة الوسطى',
    'disseminate.preview.email.greeting': 'عزيزي المواطن،',
    'disseminate.preview.email.body': 'من المتوقع حدوث موجة حارة شديدة في جميع أنحاء المنطقة الوسطى بدءاً من الغد. من المتوقع أن ترتفع درجات الحرارة بشكل ملحوظ فوق المعدل الموسمي.',
    'disseminate.preview.email.safety': 'تعليمات السلامة:',
    'disseminate.preview.email.safety1': 'تجنب أشعة الشمس المباشرة بين الساعة 11:00 صباحاً و 4:00 مساءً.',
    'disseminate.preview.email.safety2': 'شرب كميات كبيرة من الماء.',
    'disseminate.preview.email.safety3': 'الاطمئنان على الجيران المسنين.',
    'disseminate.preview.email.sign': 'ابق آمناً،\nقيادة الدفاع المدني',
    'disseminate.preview.sender': 'نظام الإنذار المبكر',
    'disseminate.preview.to': 'إلي، المواطنين',
    'disseminate.channel.sms': 'رسائل نصية',
    'disseminate.channel.whatsapp': 'واتساب',
    'disseminate.channel.email': 'بريد إلكتروني',
    'approval.approvedMessage': 'تم اعتماد الإنذار وإصداره.',
    'approval.rejectedMessage': 'تم رفض الإنذار.',
    'approval.actions': 'الإجراءات',
    'approval.approveButton': 'اعتماد الإنذار',
    'approval.rejectButton': 'رفض الإنذار',
  },
  en: {
    // Login Page
    'app.name': 'Early Warning System',
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
    'common.approve': 'Approve',
    'common.reject': 'Reject',

    // Navigation
    'nav.approvals': 'Approvals',
    'nav.disseminate': 'Disseminate Alert',

    // Approval Page
    'approval.pendingList': 'Pending List',
    'approval.details': 'Alert Details',
    'alert.approved': 'Alert Approved',
    'alert.rejected': 'Alert Rejected',
    'alert.type': 'Type',
    'alert.location': 'Location',
    'alert.severity': 'Severity',
    'alert.sentBy': 'Sent By',
    'alert.endTime': 'End Time',
    'alert.hazard': 'Hazard',
    'alert.description': 'Description',

    // Disseminate Page
    'disseminate.channels': 'Channels',
    'disseminate.recipients': 'Recipients',
    'disseminate.preview': 'Message Preview',
    'disseminate.sendSMS': 'Send SMS',
    'disseminate.sendWhatsapp': 'Send Whatsapp',
    'disseminate.sendEmail': 'Send Email',
    'disseminate.log': 'Dissemination Log',
    'disseminate.sentOn': 'Sent on',
    'disseminate.noRecipients': 'No recipients selected',
    'disseminate.sent': 'Sent successfully',
    'disseminate.district.ramallah': 'Ramallah District',
    'disseminate.district.jericho': 'Jericho District',
    'disseminate.district.hebron': 'Hebron District',
    'disseminate.district.nablus': 'Nablus District',
    'disseminate.district.gaza': 'Gaza Strip',
    'disseminate.district.emergency': 'Emergency Response Teams',
    'disseminate.recipientsCount': 'recipients',
    'disseminate.preview.sms.content': '[EWS Alert] Severe Heatwave in Central District. Temp > 40C. Avoid sun. End: 25/01 18:00.',
    'disseminate.preview.whatsapp.title': '🚨 *Emergency Alert* 🚨',
    'disseminate.preview.whatsapp.line1': 'Severe Heatwave expected in Central District.',
    'disseminate.preview.whatsapp.line2': '🌡️ Temperatures exceeding 40°C.',
    'disseminate.preview.whatsapp.line3': '⚠️ Please avoid outdoor activities and stay hydrated.',
    'disseminate.preview.email.subject': 'URGENT: Heatwave Alert - Central District',
    'disseminate.preview.email.greeting': 'Dear Citizen,',
    'disseminate.preview.email.body': 'A severe heatwave is expected across the Central District starting tomorrow. Temperatures are expected to rise significantly above the seasonal average.',
    'disseminate.preview.email.safety': 'Safety Instructions:',
    'disseminate.preview.email.safety1': 'Avoid direct sunlight between 11:00 AM and 4:00 PM.',
    'disseminate.preview.email.safety2': 'Drink plenty of water.',
    'disseminate.preview.email.safety3': 'Check on elderly neighbors.',
    'disseminate.preview.email.sign': 'Stay safe,<br/>Civil Defense Command',
    'disseminate.preview.sender': 'Early Warning System',
    'disseminate.preview.to': 'to me, citizens',
    'disseminate.channel.sms': 'SMS',
    'disseminate.channel.whatsapp': 'WhatsApp',
    'disseminate.channel.email': 'Email',
    'approval.approvedMessage': 'has been approved and issued.',
    'approval.rejectedMessage': 'has been rejected.',
    'approval.actions': 'Actions',
    'approval.approveButton': 'Approve Alert',
    'approval.rejectButton': 'Reject Alert',
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
