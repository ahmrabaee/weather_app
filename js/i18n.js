// ============================================
// Early Warning System - Internationalization
// Bilingual Support (Arabic/English)
// ============================================

const translations = {
  ar: {
    // Common
    systemName: "نظام الإنذار المبكر",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    selectRole: "اختر دورك",
    enterSystem: "دخول النظام",
    
    // Roles
    roles: {
      Meteorology: "الأرصاد الجوية",
      "Civil Defense": "الدفاع المدني",
      "Ministry of Agriculture": "وزارة الزراعة",
      "Water Authority": "سلطة المياه",
      "Environmental Quality Authority": "سلطة جودة البيئة",
      "Security Authority": "السلطة الأمنية"
    },
    
    // Dashboard
    dashboard: "لوحة التحكم",
    adminDashboard: "لوحة تحكم الأرصاد",
    createAlert: "إنشاء تنبيه",
    activeAlerts: "التنبيهات النشطة",
    alertsCount: "عدد التنبيهات",
    sectorsAcknowledged: "القطاعات المستجيبة",
    
    // Alert Levels
    alertLevels: {
      Yellow: "أصفر",
      Orange: "برتقالي",
      Red: "أحمر"
    },
    
    // Alert Types
    hazardTypes: {
      Flood: "فيضان",
      Heatwave: "موجة حر",
      Storm: "عاصفة",
      Drought: "جفاف",
      Dust: "عاصفة ترابية",
      "Multi-Hazard": "مخاطر متعددة"
    },
    
    // Alert Form
    alertTitle: "عنوان التنبيه",
    hazardType: "نوع الخطر",
    alertLevel: "مستوى التنبيه",
    issueTime: "وقت الإصدار",
    validFrom: "صالح من",
    validTo: "صالح حتى",
    affectedAreas: "المناطق المتأثرة",
    affectedGovernorates: "المحافظات المتأثرة",
    description: "الوصف",
    descriptionArabic: "الوصف (عربي)",
    descriptionEnglish: "الوصف (إنجليزي)",
    publicAdvice: "نصائح للجمهور",
    publicAdviceArabic: "نصائح للجمهور (عربي)",
    publicAdviceEnglish: "نصائح للجمهور (إنجليزي)",
    sectorRecommendations: "توصيات للقطاعات",
    
    // Actions
    preview: "معاينة",
    cancel: "إلغاء",
    save: "حفظ",
    saveAsDraft: "حفظ كمسودة",
    issueAlert: "إصدار التنبيه",
    sendAlert: "إرسال التنبيه",
    approve: "موافقة",
    reject: "رفض",
    update: "تحديث",
    view: "عرض",
    edit: "تعديل",
    delete: "حذف",
    
    // Approve Alerts
    approveAlerts: "الموافقة على التنبيهات",
    pendingAlerts: "التنبيهات المعلقة",
    alertDetails: "تفاصيل التنبيه",
    
    // Disseminate
    disseminateAlert: "نشر التنبيه",
    communicationChannels: "قنوات الاتصال",
    sms: "رسائل نصية",
    whatsapp: "واتساب",
    email: "بريد إلكتروني",
    log: "السجل",
    forAlerts: "للتنبيهات",
    sentOn: "أُرسل في",
    
    // Status
    status: {
      Draft: "مسودة",
      Active: "نشط",
      Issued: "صادر",
      Expired: "منتهي",
      Pending: "معلق",
      Acknowledged: "مستلم",
      "In Progress": "قيد المعالجة",
      Completed: "مكتمل",
      "Not Applicable": "غير قابل للتطبيق"
    },
    
    // Public View
    publicAlert: "تنبيه عام",
    whatIsHappening: "ماذا يحدث؟",
    when: "متى؟",
    where: "أين؟",
    whatShouldIDo: "ماذا يجب أن أفعل؟",
    demoNote: "هذا نموذج تجريبي يستخدم بيانات اختبارية فقط.",
    
    // Areas
    areas: {
      Ramallah: "رام الله",
      Jericho: "أريحا",
      "Jordan Valley": "الأغوار",
      Gaza: "غزة",
      Hebron: "الخليل",
      Nablus: "نابلس",
      Jenin: "جنين",
      Tubas: "طوباس",
      Tulkarm: "طولكرم",
      Qalqilya: "قلقيلية",
      Salfit: "سلفيت",
      Bethlehem: "بيت لحم"
    },
    
    // Table
    alertId: "رقم التنبيه",
    title: "العنوان",
    level: "المستوى",
    affectedRegions: "المناطق المتأثرة",
    validUntil: "صالح حتى",
    actions: "الإجراءات",
    sectorStatus: "حالة القطاع",
    
    // Filters
    filterByLevel: "تصفية حسب المستوى",
    filterByStatus: "تصفية حسب الحالة",
    all: "الكل",
    
    // Messages
    noActiveAlerts: "لا توجد تنبيهات نشطة",
    alertCreatedSuccess: "تم إنشاء التنبيه بنجاح",
    alertUpdatedSuccess: "تم تحديث التنبيه بنجاح",
    alertSentSuccess: "تم إرسال التنبيه بنجاح",
    fillAllFields: "يرجى ملء جميع الحقول المطلوبة",
    confirmDelete: "هل أنت متأكد من حذف هذا التنبيه؟"
  },
  
  en: {
    // Common
    systemName: "Early Warning System",
    login: "Log in",
    logout: "Logout",
    username: "Username",
    password: "Password",
    selectRole: "Select your role",
    enterSystem: "Enter System",
    
    // Roles
    roles: {
      Meteorology: "Meteorology",
      "Civil Defense": "Civil Defense",
      "Ministry of Agriculture": "Ministry of Agriculture",
      "Water Authority": "Water Authority",
      "Environmental Quality Authority": "Environmental Quality Authority",
      "Security Authority": "Security Authority"
    },
    
    // Dashboard
    dashboard: "Dashboard",
    adminDashboard: "Admin Dashboard",
    createAlert: "Create Alert",
    activeAlerts: "Active Alerts",
    alertsCount: "Alerts Count",
    sectorsAcknowledged: "Sectors Acknowledged",
    
    // Alert Levels
    alertLevels: {
      Yellow: "Yellow",
      Orange: "Orange",
      Red: "Red"
    },
    
    // Alert Types
    hazardTypes: {
      Flood: "Flood",
      Heatwave: "Heatwave",
      Storm: "Storm",
      Drought: "Drought",
      Dust: "Dust Storm",
      "Multi-Hazard": "Multi-Hazard"
    },
    
    // Alert Form
    alertTitle: "Alert Title",
    hazardType: "Hazard Type",
    alertLevel: "Alert Level",
    issueTime: "Issue Time",
    validFrom: "Valid From",
    validTo: "Valid To",
    affectedAreas: "Affected Areas",
    affectedGovernorates: "Affected Governorates",
    description: "Description",
    descriptionArabic: "Description (Arabic)",
    descriptionEnglish: "Description (English)",
    publicAdvice: "Public Advice",
    publicAdviceArabic: "Public Advice (Arabic)",
    publicAdviceEnglish: "Public Advice (English)",
    sectorRecommendations: "Sector Recommendations",
    
    // Actions
    preview: "Preview",
    cancel: "Cancel",
    save: "Save",
    saveAsDraft: "Save as Draft",
    issueAlert: "Issue Alert",
    sendAlert: "Send Alert",
    approve: "Approve",
    reject: "Reject",
    update: "Update",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    
    // Approve Alerts
    approveAlerts: "Approve Alerts",
    pendingAlerts: "Pending Alerts",
    alertDetails: "Alert Details",
    
    // Disseminate
    disseminateAlert: "Disseminate Alert",
    communicationChannels: "Communication Channels",
    sms: "SMS",
    whatsapp: "WhatsApp",
    email: "Email",
    log: "Log",
    forAlerts: "For Alerts",
    sentOn: "Sent on",
    
    // Status
    status: {
      Draft: "Draft",
      Active: "Active",
      Issued: "Issued",
      Expired: "Expired",
      Pending: "Pending",
      Acknowledged: "Acknowledged",
      "In Progress": "In Progress",
      Completed: "Completed",
      "Not Applicable": "Not Applicable"
    },
    
    // Public View
    publicAlert: "Public Alert",
    whatIsHappening: "What is happening?",
    when: "When?",
    where: "Where?",
    whatShouldIDo: "What should I do?",
    demoNote: "This is a demonstration prototype using test data only.",
    
    // Areas
    areas: {
      Ramallah: "Ramallah",
      Jericho: "Jericho",
      "Jordan Valley": "Jordan Valley",
      Gaza: "Gaza",
      Hebron: "Hebron",
      Nablus: "Nablus",
      Jenin: "Jenin",
      Tubas: "Tubas",
      Tulkarm: "Tulkarm",
      Qalqilya: "Qalqilya",
      Salfit: "Salfit",
      Bethlehem: "Bethlehem"
    },
    
    // Table
    alertId: "Alert ID",
    title: "Title",
    level: "Level",
    affectedRegions: "Affected Regions",
    validUntil: "Valid Until",
    actions: "Actions",
    sectorStatus: "Sector Status",
    
    // Filters
    filterByLevel: "Filter by Level",
    filterByStatus: "Filter by Status",
    all: "All",
    
    // Messages
    noActiveAlerts: "No active alerts",
    alertCreatedSuccess: "Alert created successfully",
    alertUpdatedSuccess: "Alert updated successfully",
    alertSentSuccess: "Alert sent successfully",
    fillAllFields: "Please fill all required fields",
    confirmDelete: "Are you sure you want to delete this alert?"
  }
};

// ============================================
// i18n Object
// ============================================
const i18n = {
  currentLanguage: 'ar', // Default language
  
  // Get translation
  t(key) {
    const keys = key.split('.');
    let value = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  },
  
  // Change language
  setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') {
      console.error(`Invalid language: ${lang}`);
      return;
    }
    
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    document.body.lang = lang;
    
    // Update direction
    if (lang === 'ar') {
      document.body.dir = 'rtl';
    } else {
      document.body.dir = 'ltr';
    }
    
    // Save to localStorage
    localStorage.setItem('language', lang);
    
    // Trigger custom event for components to update
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },
  
  // Get current language
  getLanguage() {
    return this.currentLanguage;
  },
  
  // Initialize from localStorage
  init() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('ar'); // Default to Arabic
    }
  },
  
  // Toggle between Arabic and English
  toggle() {
    const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
