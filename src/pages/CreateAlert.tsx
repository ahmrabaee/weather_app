import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Alert, AlertZone, AlertLevel } from '@/types/alert';
import { MapComponent } from '@/components/MapComponent';
import { StudioSidebar } from '@/components/MapStudio/StudioSidebar';
import { StudioCanvas } from '@/components/MapStudio/StudioCanvas';
import { MapLayer } from '@/types/mapStudio';
import { GOVERNORATE_COORDINATES } from '@/components/MapStudio/assets';
import { HAZARD_LEGENDS } from '@/types/alert';
import { AlertLegend } from '@/components/AlertLegend';
import { toast } from 'sonner';
import { Sun, CloudRain, Wind, Droplets, ArrowLeft, Save, FileText, Edit3, Eye, Flame, Send, Trash2, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hazard type definitions
const HAZARD_TYPES = [
  { value: 'heatwave', label: 'Heatwave', labelAr: 'موجة حر', icon: Sun },
  { value: 'flood', label: 'Flood', labelAr: 'فيضان', icon: CloudRain },
  { value: 'storm', label: 'Storm', labelAr: 'عاصفة', icon: Wind },
  { value: 'soil-moisture', label: 'Soil Moisture', labelAr: 'رطوبة التربة', icon: Droplets },
  { value: 'other', label: 'Other', labelAr: 'أخرى', icon: Wind },
];

// Predefined areas
// Predefined areas
const AREAS = [
  'Al-Quds (Jerusalem)', 'Hebron', 'Ramallah & Al-Bireh', 'Nablus', 'Jenin',
  'Bethlehem', 'Tulkarm', 'Qalqilya', 'Tubas', 'Salfit', 'Jericho', 'Gaza Strip'
];

const QUICK_TEMPLATES = [
  { type: 'heatwave' as const, label: 'Heatwave', labelAr: 'موجة حر', icon: Flame },
  { type: 'flood' as const, label: 'Flood', labelAr: 'فيضان', icon: CloudRain },
  { type: 'soil-moisture' as const, label: 'Soil Moisture', labelAr: 'رطوبة التربة', icon: Droplets },
];

const SECTORS = [
  { value: 'civil-defense', label: 'Civil Defense', labelAr: 'الدفاع المدني' },
  { value: 'agriculture', label: 'Agriculture', labelAr: 'الزراعة' },
  { value: 'water-authority', label: 'Water Authority', labelAr: 'سلطة المياه' },
  { value: 'environment', label: 'Environment', labelAr: 'البيئة' },
];

export default function CreateAlert() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, alerts, addAlert, updateAlert, language, mapComposition, setMapComposition } = useApp();

  // Map editor state  
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const existingAlert = id ? alerts.find(a => a.id === id) : undefined;
  const isEdit = !!existingAlert;

  const [formData, setFormData] = useState({
    hazardType: existingAlert?.hazardType || 'heatwave',
    // We maintain 'level' as logic for the active tab or preview, but real data is in zones
    titleEn: existingAlert?.titleEn || '',
    titleAr: existingAlert?.title || '',
    validFrom: existingAlert?.validFrom ? new Date(existingAlert.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    validTo: existingAlert?.validTo ? new Date(existingAlert.validTo).toISOString().slice(0, 16) : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    // New Structure: Map of areas per level
    zones: {
      red: [] as string[],
      orange: [] as string[],
      yellow: [] as string[]
    },
    technicalDescEn: existingAlert?.technicalDescEn || '',
    technicalDescAr: existingAlert?.technicalDescAr || '',
    publicAdviceEn: existingAlert?.publicAdviceEn || '',
    publicAdviceAr: existingAlert?.publicAdviceAr || '',
    sectorRecommendations: existingAlert?.sectorRecommendations || {},
  });

  // Load existing zones if editing
  useEffect(() => {
    if (existingAlert?.zones) {
      const newZones = { red: [] as string[], orange: [] as string[], yellow: [] as string[] };
      existingAlert.zones.forEach(z => {
        if (z.level === 'red' || z.level === 'orange' || z.level === 'yellow') {
          newZones[z.level] = z.affectedAreas;
        }
      });
      setFormData(prev => ({ ...prev, zones: newZones }));
    } else if (existingAlert?.affectedAreas && existingAlert.level) {
      // Migration for old alerts
      const newZones = { red: [] as string[], orange: [] as string[], yellow: [] as string[] };
      newZones[existingAlert.level] = existingAlert.affectedAreas;
      setFormData(prev => ({ ...prev, zones: newZones }));
    }
  }, [existingAlert]);

  const [activeTab, setActiveTab] = useState<AlertLevel>('red');

  // Layer management functions
  const handleAddLayer = (assetId: string, level: 'yellow' | 'orange' | 'red', src: string) => {
    // Check if we have calibrated coordinates for this governorate
    const coords = GOVERNORATE_COORDINATES[assetId];

    const newLayer: MapLayer = {
      id: `layer-${Date.now()}`,
      assetId,
      level,
      src,
      // Use calibrated values if available, otherwise fallback to defaults
      x: coords?.x ?? 35,
      y: coords?.y ?? 35,
      width: coords?.width ?? 30,
      height: 0,
      rotation: 0,
      opacity: 1,
    };
    setMapComposition({
      layers: [...mapComposition.layers, newLayer],
      snapshot: mapComposition.snapshot
    });
    setSelectedLayerId(newLayer.id);
  };

  const handleUpdateLayer = (id: string, updates: Partial<MapLayer>) => {
    setMapComposition({
      layers: mapComposition.layers.map(l => l.id === id ? { ...l, ...updates } : l),
      snapshot: mapComposition.snapshot
    });
  };

  const handleDeleteLayer = (id: string) => {
    setMapComposition({
      layers: mapComposition.layers.filter(l => l.id !== id),
      snapshot: mapComposition.snapshot
    });
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const handleQuickTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      hazardType: template.type,
    }));
  };

  const handleAreaToggle = (area: string, level: AlertLevel) => {
    setFormData(prev => {
      const currentLevelAreas = prev.zones[level];
      // Check if area is already in ANOTHER level, if so remove it from there (Mutually exclusive zones logic)
      let newZones = { ...prev.zones };

      // Remove from all levels first to ensure single assignment
      Object.keys(newZones).forEach(k => {
        newZones[k as AlertLevel] = newZones[k as AlertLevel].filter(a => a !== area);
      });

      // Toggle in current level
      if (currentLevelAreas.includes(area)) {
        // It was already here (and we just removed it above), so it stays removed (Toggle OFF)
      } else {
        // Add to target level (Toggle ON)
        newZones[level] = [...newZones[level], area];
      }

      return { ...prev, zones: newZones };
    });
  };

  const handleSubmit = (asDraft = false) => {
    const allAreas = [...formData.zones.red, ...formData.zones.orange, ...formData.zones.yellow];

    if (!formData.titleEn || allAreas.length === 0) {
      toast.error(language === 'ar' ? 'الرجاء ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    // Construct Zones Array
    const zones: AlertZone[] = [];
    if (formData.zones.red.length > 0) zones.push({ id: 'z-red', level: 'red', affectedAreas: formData.zones.red });
    if (formData.zones.orange.length > 0) zones.push({ id: 'z-orange', level: 'orange', affectedAreas: formData.zones.orange });
    if (formData.zones.yellow.length > 0) zones.push({ id: 'z-yellow', level: 'yellow', affectedAreas: formData.zones.yellow });

    // Calculate Max Level
    let maxLevel: AlertLevel = 'yellow';
    if (formData.zones.red.length > 0) maxLevel = 'red';
    else if (formData.zones.orange.length > 0) maxLevel = 'orange';

    const alertData: Alert = {
      id: existingAlert?.id || `ALERT-${String(Date.now()).slice(-3)}`,
      title: formData.titleAr || formData.titleEn,
      titleEn: formData.titleEn,
      hazardType: formData.hazardType as Alert['hazardType'],

      // Legacy Compatibility Fields
      level: maxLevel,
      affectedAreas: allAreas,

      // New Source of Truth
      zones: zones,

      issueTime: new Date().toISOString(),
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
      validTo: formData.validTo ? new Date(formData.validTo).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      technicalDescAr: formData.technicalDescAr,
      technicalDescEn: formData.technicalDescEn,
      publicAdviceAr: formData.publicAdviceAr,
      publicAdviceEn: formData.publicAdviceEn,
      sectorRecommendations: formData.sectorRecommendations,
      status: (asDraft ? 'draft' : 'pending') as Alert['status'],
      sectorResponses: existingAlert?.sectorResponses || [],
      createdBy: user?.name || 'Meteorology',
      createdAt: existingAlert?.createdAt || new Date().toISOString(),
      mapComposition: mapComposition,
    };

    if (isEdit) {
      updateAlert(alertData.id, alertData);
      toast.success(language === 'ar' ? 'تم تحديث التنبيه' : 'Alert updated');
    } else {
      addAlert(alertData);
      toast.success(language === 'ar' ? 'تم إنشاء التنبيه' : 'Alert created');
    }

    navigate('/admin-dashboard');
  };

  return (
    <div className="page-container">
      <Header />

      <main className="page-content">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin-dashboard')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Back to Dashboard' : 'العودة إلى لوحة التحكم'}
        </Button>

        <h1 className="page-title animate-fade-in">
          {isEdit
            ? (language === 'ar' ? 'تعديل التنبيه' : 'Edit Alert')
            : (language === 'ar' ? 'إنشاء تنبيه' : 'Create Alert')
          }
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {QUICK_TEMPLATES.map(template => (
            <button
              key={template.type}
              onClick={() => handleQuickTemplate(template)}
              className={cn(
                'gov-card p-6 text-center transition-all hover:scale-105 cursor-pointer',
                formData.hazardType === template.type
                  ? 'ring-2 ring-primary'
                  : ''
              )}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-primary/10">
                <template.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-semibold">
                {language === 'ar' ? template.labelAr : template.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {language === 'ar' ? 'اختر نوع الخطر' : 'Select hazard type'}
              </div>
            </button>
          ))}
        </div>

        {/* Integrated Map Editor Section (Reference Design) */}
        <div className="gov-card p-0 overflow-x-auto mb-8">
          {/* Header - Exact match to reference */}
          <div className="bg-primary text-primary-foreground p-4 lg:p-6 border-b border-primary-foreground/10 relative z-30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2">
                    {language === 'en' ? 'Map Composition' : 'تكوين الخريطة'}
                    <span className="px-2 py-0.5 bg-primary-foreground/20 rounded-full text-[10px] lg:text-xs border border-primary-foreground/30">
                      {mapComposition.layers.length} {language === 'en' ? 'layers' : 'طبقة'}
                    </span>
                  </h3>
                  <p className="text-primary-foreground/70 text-xs lg:text-sm hidden xs:block">
                    {isEditingMap
                      ? (language === 'en' ? 'Edit mode - Position layers' : 'وضع التحرير - ضع الطبقات')
                      : (language === 'en' ? 'Preview mode - View final map' : 'وضع المعاينة - عرض الخريطة')}
                  </p>
                </div>
              </div>

              {isEditingMap ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setSelectedLayerId(null);
                      setIsEditingMap(false);
                    }}
                    className="flex-1 sm:flex-none bg-green-600 text-white hover:bg-green-700 font-bold px-4 lg:px-6 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg text-xs lg:text-sm"
                  >
                    <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                    {language === 'en' ? 'Apply' : 'تطبيق'}
                  </Button>
                  <Button
                    onClick={() => setIsEditingMap(!isEditingMap)}
                    className="flex-1 sm:flex-none bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-3 lg:px-4 text-xs lg:text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1 lg:mr-2" /> {language === 'en' ? 'Preview' : 'معاينة'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditingMap(!isEditingMap)}
                  className="w-full sm:w-auto border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold rounded-xl text-xs lg:text-sm py-2 lg:py-3"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> {language === 'en' ? 'Edit Map' : 'تحرير الخريطة'}
                </Button>
              )}
            </div>
          </div>

          {/* Content with Fade Transition */}
          <div className="transition-all duration-700 ease-in-out">
            {isEditingMap ? (
              /* Edit Mode - Sidebar + Canvas */
              <div key="edit-mode" className="flex flex-col lg:flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-in fade-in duration-700">
                <StudioSidebar onAddLayer={handleAddLayer} />
                <div className="flex-1 studio-canvas min-h-[400px] lg:min-h-[600px] max-h-[700px] overflow-x-auto flex items-center justify-center relative p-4 lg:p-8">
                  {/* Nested overflow container */}
                  <div className="overflow-hidden" style={{ maxWidth: "100%", maxHeight: "100%" }}>
                    <StudioCanvas
                      layers={mapComposition.layers}
                      selectedLayerId={selectedLayerId}
                      onSelectLayer={setSelectedLayerId}
                      onUpdateLayer={handleUpdateLayer}
                      onDeleteLayer={handleDeleteLayer}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Mode - Final Map with Fade Transition */
              <div key="preview-mode" className="relative p-4 lg:p-8 bg-slate-50 flex flex-col items-center justify-center animate-in fade-in duration-1000 scroll-mt-20 overflow-x-auto">
                <div className="relative group shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
                  <StudioCanvas layers={mapComposition.layers} readOnly />
                </div>

                {/* Optional Legend Overlay if needed for context, but using Canvas for beauty */}
                {mapComposition.layers.length === 0 && (
                  <div className="mt-8 text-center p-12 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium">{language === 'en' ? 'No layers added' : 'لا توجد طبقات مضافة'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rest of the form continues below */}
        <div className="grid lg:grid-cols-1 gap-8 mt-8">
          <div className="space-y-6">
            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Basic Information' : 'المعلومات الأساسية'}
              </h3>

              <div className="grid sm:grid-cols-1 gap-4">
                {/* Title Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                    </label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      className="gov-input"
                      placeholder="e.g., Severe Heatwave Warning"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                    </label>
                    <Input
                      value={formData.titleAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                      className="gov-input"
                      dir="rtl"
                      placeholder="مثال: تحذير من موجة حر شديدة"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Hazard Type' : 'نوع الخطر'}
                  </label>
                  <Select
                    value={formData.hazardType}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, hazardType: v as typeof prev.hazardType }))}
                  >
                    <SelectTrigger className="gov-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border shadow-xl z-50">
                      {HAZARD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {language === 'ar' ? type.labelAr : type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="gov-card space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold text-lg">
                  {language === 'en' ? 'Geographic Zones' : 'النطاقات الجغرافية'}
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  Multi-Zone System
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-4">
                  {language === 'ar'
                    ? 'قم بتعيين المناطق لكل مستوى خطر. المناطق لا يمكن أن تكون في أكثر من مستوى في نفس الوقت.'
                    : 'Assign areas to hazard levels. Areas cannot be in multiple levels simultaneously.'}
                </label>

                <Tabs defaultValue="red" value={activeTab} onValueChange={(v) => setActiveTab(v as AlertLevel)} className="w-full">
                  <div className="overflow-x-auto pb-2 -mx-2 px-2">
                    <TabsList className="flex min-w-max sm:grid sm:w-full sm:grid-cols-3 mb-4">
                      <TabsTrigger value="red" className="flex-1 whitespace-nowrap data-[state=active]:bg-red-100 data-[state=active]:text-red-900 data-[state=active]:border-red-200 border border-transparent">
                        <AlertTriangle className="w-4 h-4 mr-2" /> {language === 'ar' ? 'شديد الخطورة (أحمر)' : 'High Risk (Red)'}
                      </TabsTrigger>
                      <TabsTrigger value="orange" className="flex-1 whitespace-nowrap data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 data-[state=active]:border-orange-200 border border-transparent">
                        <AlertTriangle className="w-4 h-4 mr-2" /> {language === 'ar' ? 'متوسط الخطورة (برتقالي)' : 'Medium Risk (Orange)'}
                      </TabsTrigger>
                      <TabsTrigger value="yellow" className="flex-1 whitespace-nowrap data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900 data-[state=active]:border-yellow-200 border border-transparent">
                        <AlertTriangle className="w-4 h-4 mr-2" /> {language === 'ar' ? 'منخفض الخطورة (أصفر)' : 'Low Risk (Yellow)'}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {['red', 'orange', 'yellow'].map((level) => (
                    <TabsContent key={level} value={level} className="space-y-4 animate-in fade-in duration-300">
                      <div className={cn(
                        "p-4 rounded-xl border-2 border-dashed",
                        level === 'red' ? "border-red-200 bg-red-50/50" :
                          level === 'orange' ? "border-orange-200 bg-orange-50/50" :
                            "border-yellow-200 bg-yellow-50/50"
                      )}>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {AREAS.map(area => {
                            const isSelected = formData.zones[level as AlertLevel].includes(area);
                            const usedInOther = !isSelected && (
                              formData.zones.red.includes(area) ||
                              formData.zones.orange.includes(area) ||
                              formData.zones.yellow.includes(area)
                            );

                            return (
                              <button
                                key={area}
                                type="button"
                                onClick={() => handleAreaToggle(area, level as AlertLevel)}
                                className={cn(
                                  'flex items-center gap-2 p-3 rounded-lg border text-sm transition-all',
                                  isSelected
                                    ? (level === 'red' ? 'bg-red-500 text-white border-red-600 shadow-md transform scale-105' :
                                      level === 'orange' ? 'bg-orange-500 text-white border-orange-600 shadow-md transform scale-105' :
                                        'bg-yellow-400 text-black border-yellow-500 shadow-md transform scale-105')
                                    : usedInOther
                                      ? 'opacity-30 cursor-not-allowed bg-slate-100'
                                      : 'hover:bg-white hover:border-slate-300 bg-white/50'
                                )}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center bg-white",
                                  isSelected ? "border-transparent" : "border-slate-300"
                                )}>
                                  {isSelected && <div className={cn("w-2 h-2 rounded-full", level === 'yellow' ? 'bg-black' : 'bg-current')} />}
                                </div>
                                <span className="font-medium">{area}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Live Legend Preview */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h4 className="font-bold text-slate-800">
                      {language === 'en' ? 'Live Legend Preview' : 'معاينة مباشرة لمفتاح التنبيه'}
                    </h4>
                  </div>
                  <AlertLegend
                    manualHazardType={formData.hazardType}
                    manualLevels={Object.entries(formData.zones)
                      .filter(([_, areas]) => areas.length > 0)
                      .map(([level]) => level as AlertLevel)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-4 italic">
                    {language === 'en'
                      ? '* This is how the risk explanation will appear to the public based on your selections.'
                      : '* هكذا سيظهر شرح المخاطر للجمهور بناءً على اختياراتك.'}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Valid From' : 'صالح من'}
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="gov-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Valid To' : 'صالح حتى'}
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                    className="gov-input"
                  />
                </div>
              </div>
            </div>

            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Description & Public Advice' : 'الوصف والنصائح العامة'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الوصف التقني (إنجليزي)' : 'Technical Description (English)'}
                  </label>
                  <Textarea
                    value={formData.technicalDescEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalDescEn: e.target.value }))}
                    className="gov-input min-h-[100px]"
                    placeholder="Detailed technical description of the hazard..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الوصف التقني (عربي)' : 'Technical Description (Arabic)'}
                  </label>
                  <Textarea
                    value={formData.technicalDescAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalDescAr: e.target.value }))}
                    className="gov-input min-h-[100px]"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'نصائح للجمهور (إنجليزي)' : 'Public Advice (English)'}
                  </label>
                  <Textarea
                    value={formData.publicAdviceEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, publicAdviceEn: e.target.value }))}
                    className="gov-input min-h-[100px]"
                    placeholder="• Stay indoors&#10;• Drink plenty of water..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'نصائح للجمهور (عربي)' : 'Public Advice (Arabic)'}
                  </label>
                  <Textarea
                    value={formData.publicAdviceAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, publicAdviceAr: e.target.value }))}
                    className="gov-input min-h-[100px]"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'ar' ? 'توصيات القطاعات' : 'Sector Recommendations'}
              </h3>

              <div className="space-y-4">
                {SECTORS.map(sector => (
                  <div key={sector.value}>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? sector.labelAr : sector.label}
                    </label>
                    <Textarea
                      value={formData.sectorRecommendations[sector.value] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sectorRecommendations: {
                          ...prev.sectorRecommendations,
                          [sector.value]: e.target.value,
                        }
                      }))}
                      className="gov-input"
                      placeholder={`Recommended actions for ${sector.label}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pb-8">
              <Button
                variant="outline"
                onClick={() => navigate(`/public-alert/${existingAlert?.id || 'preview'}`)}
                className="btn-gov-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'معاينة' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin-dashboard')}
                className="btn-gov-secondary"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                className="btn-gov-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
              </Button>
              <Button onClick={() => handleSubmit(false)} className="btn-gov-primary">
                <Send className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إرسال التنبيه' : 'Send Alert'}
              </Button>
            </div>
          </div>
        </div >
      </main >
    </div >
  );
}
