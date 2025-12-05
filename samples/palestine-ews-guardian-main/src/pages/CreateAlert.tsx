import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { InteractivePalestineMap } from '@/components/InteractivePalestineMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertLevel, HazardType, AREAS, HAZARD_TYPES, SECTORS } from '@/types/alert';
import { ArrowLeft, Save, Send, Eye, Flame, Droplets, CloudRain } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const quickTemplates = [
  { type: 'heatwave' as HazardType, level: 'yellow' as AlertLevel, label: 'Heatwave', icon: Flame },
  { type: 'drought' as HazardType, level: 'orange' as AlertLevel, label: 'Drought', icon: Droplets },
  { type: 'flood' as HazardType, level: 'red' as AlertLevel, label: 'Flood', icon: CloudRain },
];

export default function CreateAlert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts, addAlert, updateAlert, language, user } = useApp();
  
  const existingAlert = id ? alerts.find(a => a.id === id) : null;
  const isEdit = !!existingAlert;

  const [formData, setFormData] = useState({
    hazardType: existingAlert?.hazardType || 'heatwave' as HazardType,
    level: existingAlert?.level || 'yellow' as AlertLevel,
    title: existingAlert?.title || '',
    titleAr: existingAlert?.titleAr || '',
    affectedAreas: existingAlert?.affectedAreas || [] as string[],
    validFrom: existingAlert?.validFrom?.slice(0, 16) || new Date().toISOString().slice(0, 16),
    validTo: existingAlert?.validTo?.slice(0, 16) || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    technicalDescEn: existingAlert?.technicalDescEn || '',
    technicalDescAr: existingAlert?.technicalDescAr || '',
    publicAdviceEn: existingAlert?.publicAdviceEn || '',
    publicAdviceAr: existingAlert?.publicAdviceAr || '',
    sectorRecommendations: existingAlert?.sectorRecommendations || {} as Record<string, string>,
  });

  const handleQuickTemplate = (template: typeof quickTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      hazardType: template.type,
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

  const handleSubmit = (asDraft = false) => {
    if (!formData.title || !formData.affectedAreas.length) {
      toast.error(language === 'ar' ? 'الرجاء ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    const alertData: Alert = {
      id: existingAlert?.id || `ALERT-${String(Date.now()).slice(-3)}`,
      title: formData.title,
      titleAr: formData.titleAr || formData.title,
      hazardType: formData.hazardType,
      level: formData.level,
      issueTime: new Date().toISOString(),
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
      affectedAreas: formData.affectedAreas,
      technicalDescEn: formData.technicalDescEn,
      technicalDescAr: formData.technicalDescAr,
      publicAdviceEn: formData.publicAdviceEn,
      publicAdviceAr: formData.publicAdviceAr,
      sectorRecommendations: formData.sectorRecommendations,
      status: asDraft ? 'draft' : 'pending',
      sectorResponses: existingAlert?.sectorResponses || [],
      createdBy: user?.name || 'Meteorology',
      createdAt: existingAlert?.createdAt || new Date().toISOString(),
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin-dashboard')}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
        </Button>

        <h1 className="page-title">
          {isEdit 
            ? (language === 'ar' ? 'تعديل التنبيه' : 'Edit Alert')
            : (language === 'ar' ? 'إنشاء تنبيه' : 'Create Alert')
          }
        </h1>

        {/* Quick Templates */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {quickTemplates.map(template => (
            <button
              key={template.type}
              onClick={() => handleQuickTemplate(template)}
              className={cn(
                'card-government p-6 text-center hover-lift transition-all',
                formData.hazardType === template.type && formData.level === template.level
                  ? 'ring-2 ring-primary'
                  : ''
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3',
                template.level === 'yellow' ? 'bg-alert-yellow/20' :
                template.level === 'orange' ? 'bg-alert-orange/20' :
                'bg-alert-red/20'
              )}>
                <template.icon className={cn(
                  'w-6 h-6',
                  template.level === 'yellow' ? 'text-alert-yellow' :
                  template.level === 'orange' ? 'text-alert-orange' :
                  'text-alert-red'
                )} />
              </div>
              <div className="font-semibold">{template.label}</div>
              <div className={cn(
                'text-sm font-medium uppercase mt-1',
                template.level === 'yellow' ? 'text-alert-yellow' :
                template.level === 'orange' ? 'text-alert-orange' :
                'text-alert-red'
              )}>
                {template.level}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card-government card-accent-left p-6">
              <h2 className="section-title">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'نوع الخطر' : 'Hazard Type'} *
                  </label>
                  <Select 
                    value={formData.hazardType} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, hazardType: v as HazardType }))}
                  >
                    <SelectTrigger className="input-government">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border shadow-xl z-50">
                      {HAZARD_TYPES.map(h => (
                        <SelectItem key={h.value} value={h.value}>
                          {language === 'ar' ? h.labelAr : h.label}
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-government"
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
                  className="input-government"
                  dir="rtl"
                  placeholder="مثال: تحذير من موجة حر شديدة"
                />
              </div>
            </div>

            {/* Geographic & Time */}
            <div className="card-government card-accent-left p-6">
              <h2 className="section-title">{language === 'ar' ? 'النطاق الجغرافي والزمني' : 'Geographic & Time Scope'}</h2>
              
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'صالح من' : 'Valid From'}
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="input-government"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'صالح حتى' : 'Valid To'}
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                    className="input-government"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="card-government card-accent-left p-6">
              <h2 className="section-title">{language === 'ar' ? 'الوصف والنصائح' : 'Descriptions & Advice'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الوصف التقني (إنجليزي)' : 'Technical Description (English)'}
                  </label>
                  <Textarea
                    value={formData.technicalDescEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalDescEn: e.target.value }))}
                    className="input-government min-h-[100px]"
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
                    className="input-government min-h-[100px]"
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
                    className="input-government min-h-[100px]"
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
                    className="input-government min-h-[100px]"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Sector Recommendations */}
            <div className="card-government card-accent-left p-6">
              <h2 className="section-title">{language === 'ar' ? 'توصيات القطاعات' : 'Sector Recommendations'}</h2>
              
              <div className="space-y-4">
                {SECTORS.filter(s => s.value !== 'meteorology').map(sector => (
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
                      className="input-government"
                      placeholder={`Recommended actions for ${sector.label}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-1">
            <div className="card-government card-accent-left p-6 sticky top-8">
              <h2 className="section-title">{language === 'ar' ? 'معاينة الخريطة' : 'Map Preview'}</h2>
              <InteractivePalestineMap
                mode="select"
                selectedRegions={formData.affectedAreas}
                onRegionSelect={handleAreaToggle}
                alertLevel={formData.level}
                showAlertMarkers={true}
                height="450px"
                enableZoom={true}
                enablePan={true}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {language === 'ar' ? 'انقر على المناطق لتحديدها' : 'Click regions to select them'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/public-alert/${existingAlert?.id || 'preview'}`)}
            className="btn-government-secondary"
          >
            <Eye className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'معاينة' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin-dashboard')}
            className="btn-government-secondary"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="btn-government-secondary"
          >
            <Save className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
          </Button>
          <Button onClick={() => handleSubmit(false)} className="btn-government">
            <Send className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إرسال التنبيه' : 'Send Alert'}
          </Button>
        </div>
      </main>
    </div>
  );
}
