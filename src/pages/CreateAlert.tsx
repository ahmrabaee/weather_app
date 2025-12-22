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
import { useApp, Alert, AlertLevel } from '@/contexts/AppContext';
import { MapComponent } from '@/components/MapComponent';
import { StudioSidebar } from '@/components/MapStudio/StudioSidebar';
import { StudioCanvas } from '@/components/MapStudio/StudioCanvas';
import { MapLayer } from '@/types/mapStudio';
import { HAZARD_LEGENDS } from '@/types/alert';
import { toast } from 'sonner';
import { Sun, CloudRain, Wind, Droplets, ArrowLeft, Save, FileText, Edit3, Eye, Flame, Send, Trash2, Check } from 'lucide-react';
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
    level: (existingAlert?.level || 'yellow') as AlertLevel,
    titleEn: existingAlert?.titleEn || '',
    titleAr: existingAlert?.title || '',
    validFrom: existingAlert?.validFrom ? new Date(existingAlert.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    validTo: existingAlert?.validTo ? new Date(existingAlert.validTo).toISOString().slice(0, 16) : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    affectedAreas: existingAlert?.affectedAreas || [] as string[],
    technicalDescEn: existingAlert?.technicalDescEn || '',
    technicalDescAr: existingAlert?.technicalDescAr || '',
    publicAdviceEn: existingAlert?.publicAdviceEn || '',
    publicAdviceAr: existingAlert?.publicAdviceAr || '',
    sectorRecommendations: existingAlert?.sectorRecommendations || {},
  });

  // Layer management functions
  const handleAddLayer = (assetId: string, level: 'yellow' | 'orange' | 'red', src: string) => {
    const newLayer: MapLayer = {
      id: `layer-${Date.now()}`,
      assetId,
      level,
      src,
      x: 35,
      y: 35,
      width: 30,
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

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      affectedAreas: prev.affectedAreas.includes(area)
        ? prev.affectedAreas.filter(a => a !== area)
        : [...prev.affectedAreas, area],
    }));
  };

  const handleSubmit = (asDraft = false) => {
    if (!formData.titleEn || formData.affectedAreas.length === 0) {
      toast.error(language === 'ar' ? 'الرجاء ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    const alertData: Alert = {
      id: existingAlert?.id || `ALERT-${String(Date.now()).slice(-3)}`,
      title: formData.titleAr || formData.titleEn,
      titleEn: formData.titleEn,
      hazardType: formData.hazardType as Alert['hazardType'],
      level: formData.level,
      issueTime: new Date().toISOString(),
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
      validTo: formData.validTo ? new Date(formData.validTo).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      affectedAreas: formData.affectedAreas,
      technicalDescAr: formData.technicalDescAr,
      technicalDescEn: formData.technicalDescEn,
      publicAdviceAr: formData.publicAdviceAr,
      publicAdviceEn: formData.publicAdviceEn,
      sectorRecommendations: formData.sectorRecommendations,
      status: asDraft ? 'draft' : 'pending',
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

        <div className="grid grid-cols-3 gap-4 mb-8">
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
        <div className="gov-card p-0 overflow-hidden">
          {/* Header - Exact match to reference */}
          <div className="bg-primary text-primary-foreground p-6 border-b border-primary-foreground/10 relative z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {language === 'en' ? 'Map Composition' : 'تكوين الخريطة'}
                    <span className="px-2 py-0.5 bg-primary-foreground/20 rounded-full text-xs border border-primary-foreground/30">
                      {mapComposition.layers.length} {language === 'en' ? 'layers' : 'طبقة'}
                    </span>
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {isEditingMap
                      ? (language === 'en' ? 'Edit mode - Position layers on the map' : 'وضع التحرير - ضع الطبقات على الخريطة')
                      : (language === 'en' ? 'Preview mode - View final composition' : 'وضع المعاينة - عرض التكوين النهائي')}
                  </p>
                </div>
              </div>

              {isEditingMap ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setSelectedLayerId(null);
                      setIsEditingMap(false);
                    }}
                    className="bg-green-600 text-white hover:bg-green-700 font-bold px-6 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    {language === 'en' ? 'Apply' : 'تطبيق'}
                  </Button>
                  <Button
                    onClick={() => setIsEditingMap(!isEditingMap)}
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-4"
                  >
                    <Eye className="w-4 h-4 mr-2" /> {language === 'en' ? 'Preview' : 'معاينة'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditingMap(!isEditingMap)}
                  className="border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-semibold rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> {language === 'en' ? 'Edit Map' : 'تحرير الخريطة'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content with Fade Transition */}
        <div className="transition-all duration-700 ease-in-out">
          {isEditingMap ? (
            /* Edit Mode - Sidebar + Canvas */
            <div key="edit-mode" className="flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-in fade-in duration-700">
              <StudioSidebar onAddLayer={handleAddLayer} />
              <div className="flex-1 studio-canvas min-h-[600px] max-h-[700px] overflow-hidden flex items-center justify-center relative p-8">
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
            <div key="preview-mode" className="relative p-8 bg-slate-50 flex flex-col items-center justify-center animate-in fade-in duration-1000 scroll-mt-20">
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

        {/* Rest of the form continues below */}
        <div className="grid lg:grid-cols-1 gap-8 mt-8">
          <div className="space-y-6">
            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Basic Information' : 'المعلومات الأساسية'}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'مستوى التنبيه' : 'Alert Level'} *
                  </label>
                  <div className="flex gap-2">
                    {(['yellow', 'orange', 'red'] as AlertLevel[]).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, level }))}
                        className={cn(
                          'flex-1 py-3 rounded-lg font-bold uppercase text-sm transition-all',
                          formData.level === level ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100',
                          level === 'yellow' ? 'bg-alert-yellow text-foreground ring-alert-yellow' :
                            level === 'orange' ? 'bg-alert-orange text-white ring-alert-orange' :
                              'bg-alert-red text-white ring-alert-red'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
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

              <div className="mt-4">
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

            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Geographic & Time Scope' : 'النطاق الجغرافي والزمني'}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'المناطق المتأثرة' : 'Affected Areas'} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AREAS.map(area => (
                    <label
                      key={area}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                        formData.affectedAreas.includes(area)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Checkbox
                        checked={formData.affectedAreas.includes(area)}
                        onCheckedChange={() => handleAreaToggle(area)}
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
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
