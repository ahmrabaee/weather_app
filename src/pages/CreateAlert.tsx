import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { MapComponent } from '@/components/MapComponent';
import { useApp, Alert, AlertLevel, Marker } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Sun, CloudRain, Wind, Droplets, Send, Save, Eye, Trash2, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const HAZARD_TYPES = [
  { value: 'heatwave', label: 'Heatwave', labelAr: 'موجة حر', icon: Sun },
  { value: 'flood', label: 'Flood', labelAr: 'فيضان', icon: CloudRain },
  { value: 'storm', label: 'Storm', labelAr: 'عاصفة', icon: Wind },
  { value: 'drought', label: 'Drought', labelAr: 'جفاف', icon: Droplets },
  { value: 'other', label: 'Other', labelAr: 'أخرى', icon: Wind },
];

const AREAS = [
  'Ramallah', 'Al-Bireh', 'Jericho', 'Jerusalem', 'Bethlehem',
  'Hebron', 'Nablus', 'Jenin', 'Tulkarm', 'Qalqilya', 'Gaza',
];

// Quick templates for common hazard types - level is selected separately
const QUICK_TEMPLATES = [
  { type: 'heatwave' as const, label: 'Heatwave', labelAr: 'موجة حر', icon: Flame },
  { type: 'flood' as const, label: 'Flood', labelAr: 'فيضان', icon: CloudRain },
  { type: 'drought' as const, label: 'Drought', labelAr: 'جفاف', icon: Droplets },
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
  const { alerts, addAlert, updateAlert, language, user } = useApp();

  const existingAlert = id ? alerts.find(a => a.id === id) : null;
  const isEdit = !!existingAlert;

  const [formData, setFormData] = useState({
    hazardType: existingAlert?.hazardType || 'heatwave',
    level: existingAlert?.level || 'yellow' as AlertLevel,
    title: existingAlert?.titleEn || '',
    titleAr: existingAlert?.title || '',
    titleEn: existingAlert?.titleEn || '',
    affectedAreas: existingAlert?.affectedAreas || [] as string[],
    validFrom: existingAlert?.validFrom ? new Date(existingAlert.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    validTo: existingAlert?.validTo ? new Date(existingAlert.validTo).toISOString().slice(0, 16) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    technicalDescAr: existingAlert?.technicalDescAr || '',
    technicalDescEn: existingAlert?.technicalDescEn || '',
    publicAdviceAr: existingAlert?.publicAdviceAr || '',
    publicAdviceEn: existingAlert?.publicAdviceEn || '',
    sectorRecommendations: existingAlert?.sectorRecommendations || {} as Record<string, string>,
  });

  // Markers state for map
  const [markers, setMarkers] = useState<Marker[]>(existingAlert?.markers || []);

  const handleQuickTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      hazardType: template.type,
      // Keep the current level - user selects level separately
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
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
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
      markers, // Include markers in alert data
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
        {/* Back Button */}
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

        {/* Quick Templates - Hazard Type Selection */}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Preview */}
          <div className="lg:col-span-1">
            <div className="gov-card p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {language === 'en' ? 'Map Location' : 'موقع الخريطة'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMarkers([])}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <MapComponent
                mode="edit"
                markers={markers}
                onMarkersChange={setMarkers}
                selectedAlertLevel={formData.level}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {language === 'en'
                  ? `Click map to place ${formData.level} markers. ${markers.length} marker(s) placed.`
                  : `انقر على الخريطة لإضافة نقاط ${formData.level}. ${markers.length} نقطة موضوعة.`}
              </p>
              {/* Selected Areas List */}
              {formData.affectedAreas.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === 'en' ? 'Selected Areas:' : 'المناطق المحددة:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.affectedAreas.map((area) => (
                      <span
                        key={area}
                        className={`px-2 py-1 rounded text-xs font-medium ${formData.level === 'yellow'
                          ? 'bg-alert-yellow text-yellow-900'
                          : formData.level === 'orange'
                            ? 'bg-alert-orange text-orange-900'
                            : 'bg-alert-red text-red-900'
                          }`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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

            {/* Geographic & Time Scope */}
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

            {/* Descriptions */}
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

            {/* Sector Recommendations */}
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

            {/* Action Buttons */}
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
        </div>
      </main>
    </div>
  );
}
