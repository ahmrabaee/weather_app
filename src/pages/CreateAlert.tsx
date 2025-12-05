import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { InteractivePalestineMap } from '@/components/InteractivePalestineMap';
import { useApp, Alert, AlertLevel } from '@/contexts/AppContext';
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
import { ArrowLeft, Sun, CloudRain, Wind, Droplets, Send, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

const HAZARD_TYPES = [
  { value: 'heatwave', label: 'Heatwave', icon: Sun },
  { value: 'flood', label: 'Flood', icon: CloudRain },
  { value: 'storm', label: 'Storm', icon: Wind },
  { value: 'drought', label: 'Drought', icon: Droplets },
  { value: 'other', label: 'Other', icon: Wind },
];

const AREAS = [
  'Ramallah', 'Al-Bireh', 'Jericho', 'Jerusalem', 'Bethlehem',
  'Hebron', 'Nablus', 'Jenin', 'Tulkarm', 'Qalqilya', 'Gaza',
];

const QUICK_TEMPLATES = [
  { hazard: 'heatwave', level: 'yellow' as AlertLevel, label: 'Heatwave' },
  { hazard: 'drought', level: 'orange' as AlertLevel, label: 'Drought' },
  { hazard: 'flood', level: 'red' as AlertLevel, label: 'Flood' },
];

export default function CreateAlert() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { alerts, addAlert, updateAlert, language, user } = useApp();

  const existingAlert = id ? alerts.find(a => a.id === id) : null;

  const [formData, setFormData] = useState({
    hazardType: existingAlert?.hazardType || 'heatwave',
    level: existingAlert?.level || 'yellow' as AlertLevel,
    title: existingAlert?.title || '',
    titleEn: existingAlert?.titleEn || '',
    affectedAreas: existingAlert?.affectedAreas || [] as string[],
    validFrom: existingAlert?.validFrom ? new Date(existingAlert.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    validTo: existingAlert?.validTo ? new Date(existingAlert.validTo).toISOString().slice(0, 16) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    technicalDescAr: existingAlert?.technicalDescAr || '',
    technicalDescEn: existingAlert?.technicalDescEn || '',
    publicAdviceAr: existingAlert?.publicAdviceAr || '',
    publicAdviceEn: existingAlert?.publicAdviceEn || '',
    civilDefenseRec: existingAlert?.sectorRecommendations?.['civil-defense'] || '',
    agricultureRec: existingAlert?.sectorRecommendations?.['agriculture'] || '',
    waterRec: existingAlert?.sectorRecommendations?.['water-authority'] || '',
    environmentRec: existingAlert?.sectorRecommendations?.['environment'] || '',
  });

  const handleQuickTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      hazardType: template.hazard as typeof prev.hazardType,
      level: template.level,
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

  const handleSubmit = (status: 'draft' | 'pending' | 'issued') => {
    if (!formData.titleEn || formData.affectedAreas.length === 0) {
      toast.error('Please fill in required fields (Title and at least one affected area)');
      return;
    }

    const alertData: Alert = {
      id: existingAlert?.id || `ALERT-${String(Date.now()).slice(-3)}`,
      title: formData.title || formData.titleEn,
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
      sectorRecommendations: {
        'civil-defense': formData.civilDefenseRec,
        'agriculture': formData.agricultureRec,
        'water-authority': formData.waterRec,
        'environment': formData.environmentRec,
      },
      status,
      sectorResponses: existingAlert?.sectorResponses || [],
      createdBy: user?.name || 'Meteorology',
      createdAt: existingAlert?.createdAt || new Date().toISOString(),
    };

    if (existingAlert) {
      updateAlert(existingAlert.id, alertData);
      toast.success('Alert updated successfully');
    } else {
      addAlert(alertData);
      toast.success(status === 'issued' ? 'Alert sent successfully' : 'Alert saved as draft');
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
          {existingAlert
            ? (language === 'en' ? 'Edit Alert' : 'تعديل التنبيه')
            : (language === 'en' ? 'Create Alert' : 'إنشاء تنبيه')
          }
        </h1>

        {/* Quick Templates */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {QUICK_TEMPLATES.map((template) => (
            <button
              key={template.hazard}
              onClick={() => handleQuickTemplate(template)}
              className={`gov-card p-4 text-center transition-all hover:scale-105 cursor-pointer ${
                formData.hazardType === template.hazard && formData.level === template.level
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
            >
              <AlertLevelBadge level={template.level} size="sm" />
              <p className="mt-2 font-medium">{template.label}</p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Preview */}
          <div className="lg:col-span-1">
            <div className="gov-card p-4 sticky top-4">
              <h3 className="font-semibold mb-4">
                {language === 'en' ? 'Affected Areas' : 'المناطق المتأثرة'}
              </h3>
              <InteractivePalestineMap
                affectedAreas={formData.affectedAreas}
                level={formData.level}
                className="w-full"
              />
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
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          formData.level === 'yellow' 
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
                    <SelectContent className="bg-card">
                      {HAZARD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'en' ? 'Alert Level' : 'مستوى التنبيه'}
                  </label>
                  <div className="flex gap-2">
                    {(['yellow', 'orange', 'red'] as AlertLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, level }))}
                        className={`flex-1 p-3 rounded-lg transition-all ${
                          formData.level === level
                            ? `alert-badge-${level} ring-2 ring-offset-2`
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Alert Title (English)' : 'عنوان التنبيه (إنجليزي)'} *
                </label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="e.g., Severe Heatwave Warning - Central Region"
                  className="gov-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Alert Title (Arabic)' : 'عنوان التنبيه (عربي)'}
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: تحذير من موجة حرارة شديدة"
                  className="gov-input"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Geographic & Time Scope */}
            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Geographic & Time Scope' : 'النطاق الجغرافي والزمني'}
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Affected Areas' : 'المناطق المتأثرة'} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AREAS.map((area) => (
                    <label
                      key={area}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.affectedAreas.includes(area)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Technical Description (English)' : 'الوصف الفني (إنجليزي)'}
                </label>
                <Textarea
                  value={formData.technicalDescEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicalDescEn: e.target.value }))}
                  placeholder="Describe the weather event and its expected impact..."
                  className="gov-input min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'en' ? 'Public Advice (English)' : 'النصائح العامة (إنجليزي)'}
                </label>
                <Textarea
                  value={formData.publicAdviceEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicAdviceEn: e.target.value }))}
                  placeholder="• Stay indoors during peak hours&#10;• Drink plenty of water&#10;• Check on vulnerable neighbors"
                  className="gov-input min-h-[100px]"
                />
              </div>
            </div>

            {/* Sector Recommendations */}
            <div className="gov-card space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {language === 'en' ? 'Sector Recommendations' : 'توصيات القطاعات'}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Civil Defense</label>
                  <Textarea
                    value={formData.civilDefenseRec}
                    onChange={(e) => setFormData(prev => ({ ...prev, civilDefenseRec: e.target.value }))}
                    placeholder="Recommended actions for Civil Defense..."
                    className="gov-input min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agriculture</label>
                  <Textarea
                    value={formData.agricultureRec}
                    onChange={(e) => setFormData(prev => ({ ...prev, agricultureRec: e.target.value }))}
                    placeholder="Recommended actions for Agriculture..."
                    className="gov-input min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Water Authority</label>
                  <Textarea
                    value={formData.waterRec}
                    onChange={(e) => setFormData(prev => ({ ...prev, waterRec: e.target.value }))}
                    placeholder="Recommended actions for Water Authority..."
                    className="gov-input min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Environment</label>
                  <Textarea
                    value={formData.environmentRec}
                    onChange={(e) => setFormData(prev => ({ ...prev, environmentRec: e.target.value }))}
                    placeholder="Recommended actions for Environment..."
                    className="gov-input min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/public-alert/${existingAlert?.id || 'preview'}`)}
                className="btn-gov-secondary"
              >
                <Eye className="w-4 h-4" />
                {language === 'en' ? 'Preview' : 'معاينة'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin-dashboard')}
                className="btn-gov-secondary"
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button
                onClick={() => handleSubmit('draft')}
                className="btn-gov-secondary"
              >
                <Save className="w-4 h-4" />
                {language === 'en' ? 'Save as Draft' : 'حفظ كمسودة'}
              </Button>
              <Button
                onClick={() => handleSubmit('issued')}
                className="btn-gov-primary"
              >
                <Send className="w-4 h-4" />
                {language === 'en' ? 'Send Alert' : 'إرسال التنبيه'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
