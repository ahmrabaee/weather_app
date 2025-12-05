import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Header } from '@/components/ews/Header';
import { Sidebar } from '@/components/ews/Sidebar';
import { MapPlaceholder } from '@/components/ews/MapPlaceholder';
import { useEWS, Alert, AlertLevel, UserRole, roleLabels } from '@/contexts/EWSContext';
import { toast } from 'sonner';

const hazardTypes = [
  { value: 'flood', ar: 'فيضان', en: 'Flood' },
  { value: 'thunderstorm', ar: 'عاصفة رعدية', en: 'Thunderstorm' },
  { value: 'heatwave', ar: 'موجة حر', en: 'Heat Wave' },
  { value: 'coldwave', ar: 'موجة برد', en: 'Cold Wave' },
  { value: 'drought', ar: 'جفاف', en: 'Drought' },
  { value: 'sandstorm', ar: 'عاصفة رملية', en: 'Sandstorm' },
];

const sectors: UserRole[] = ['civil_defense', 'agriculture', 'water_authority', 'environment', 'security'];

export default function CreateAlert() {
  const { language, setAlerts, addLog } = useEWS();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    hazardType: '',
    level: 'yellow' as AlertLevel,
    validFrom: '',
    validTo: '',
    affectedAreas: '',
    descriptionAr: '',
    descriptionEn: '',
    adviceAr: '',
    adviceEn: '',
    sectorRecommendations: {} as Record<UserRole, string>,
  });

  const handleSubmit = (asDraft: boolean) => {
    const newAlert: Alert = {
      id: `ALERT-${Date.now().toString().slice(-6)}`,
      title: formData.title,
      titleEn: formData.titleEn,
      hazardType: formData.hazardType,
      level: formData.level,
      issuedAt: new Date(),
      validFrom: new Date(formData.validFrom),
      validTo: new Date(formData.validTo),
      affectedAreas: formData.affectedAreas.split(',').map(a => a.trim()),
      descriptionAr: formData.descriptionAr,
      descriptionEn: formData.descriptionEn,
      adviceAr: formData.adviceAr,
      adviceEn: formData.adviceEn,
      sectorRecommendations: {
        meteorology: '',
        ...formData.sectorRecommendations,
      },
      sectorResponses: [],
      status: asDraft ? 'draft' : 'issued',
    };

    setAlerts(prev => [newAlert, ...prev]);
    addLog('meteorology', `${asDraft ? 'تم حفظ مسودة' : 'تم إصدار'} إنذار ${newAlert.id}`);
    
    toast.success(
      language === 'ar' 
        ? (asDraft ? 'تم حفظ المسودة بنجاح' : 'تم إصدار الإنذار بنجاح')
        : (asDraft ? 'Draft saved successfully' : 'Alert issued successfully')
    );
    
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {language === 'ar' ? 'إنشاء إنذار جديد' : 'Create New Alert'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'أدخل تفاصيل الإنذار' : 'Enter alert details'}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'معلومات الخطر' : 'Hazard Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'ar' ? 'عنوان الإنذار (عربي)' : 'Alert Title (Arabic)'}</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={language === 'ar' ? 'أدخل العنوان...' : 'Enter title...'}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ar' ? 'عنوان الإنذار (إنجليزي)' : 'Alert Title (English)'}</Label>
                      <Input
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="Enter title..."
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'ar' ? 'نوع الخطر' : 'Hazard Type'}</Label>
                    <Select value={formData.hazardType} onValueChange={(v) => setFormData({ ...formData, hazardType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر نوع الخطر...' : 'Select hazard type...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {hazardTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {language === 'ar' ? type.ar : type.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-3 block">{language === 'ar' ? 'مستوى الإنذار' : 'Alert Level'}</Label>
                    <RadioGroup
                      value={formData.level}
                      onValueChange={(v) => setFormData({ ...formData, level: v as AlertLevel })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="yellow" id="yellow" className="border-alert-yellow text-alert-yellow" />
                        <Label htmlFor="yellow" className="flex items-center gap-2 cursor-pointer">
                          <span className="w-4 h-4 rounded-full bg-alert-yellow" />
                          {language === 'ar' ? 'أصفر - كن على دراية' : 'Yellow - Advisory'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="orange" id="orange" className="border-alert-orange text-alert-orange" />
                        <Label htmlFor="orange" className="flex items-center gap-2 cursor-pointer">
                          <span className="w-4 h-4 rounded-full bg-alert-orange" />
                          {language === 'ar' ? 'برتقالي - كن مستعداً' : 'Orange - Watch'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="red" id="red" className="border-alert-red text-alert-red" />
                        <Label htmlFor="red" className="flex items-center gap-2 cursor-pointer">
                          <span className="w-4 h-4 rounded-full bg-alert-red" />
                          {language === 'ar' ? 'أحمر - اتخذ إجراء' : 'Red - Warning'}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Time & Location */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'النطاق الزمني والجغرافي' : 'Time & Geographic Scope'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'ar' ? 'صالح من' : 'Valid From'}</Label>
                      <Input
                        type="datetime-local"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ar' ? 'صالح حتى' : 'Valid Until'}</Label>
                      <Input
                        type="datetime-local"
                        value={formData.validTo}
                        onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'ar' ? 'المناطق المتأثرة (مفصولة بفواصل)' : 'Affected Areas (comma-separated)'}</Label>
                    <Input
                      value={formData.affectedAreas}
                      onChange={(e) => setFormData({ ...formData, affectedAreas: e.target.value })}
                      placeholder={language === 'ar' ? 'مثال: رام الله، القدس، بيت لحم' : 'e.g., Ramallah, Jerusalem, Bethlehem'}
                    />
                  </div>

                  <MapPlaceholder 
                    affectedAreas={formData.affectedAreas.split(',').filter(a => a.trim())} 
                    level={formData.level}
                    className="h-64"
                  />
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'الرسائل' : 'Messages'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'ar' ? 'الوصف التقني (عربي)' : 'Technical Description (Arabic)'}</Label>
                      <Textarea
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        rows={4}
                        placeholder={language === 'ar' ? 'أدخل الوصف التقني...' : 'Enter technical description...'}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ar' ? 'الوصف التقني (إنجليزي)' : 'Technical Description (English)'}</Label>
                      <Textarea
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        rows={4}
                        dir="ltr"
                        placeholder="Enter technical description..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{language === 'ar' ? 'النصيحة العامة (عربي)' : 'Public Advice (Arabic)'}</Label>
                      <Textarea
                        value={formData.adviceAr}
                        onChange={(e) => setFormData({ ...formData, adviceAr: e.target.value })}
                        rows={4}
                        placeholder={language === 'ar' ? '• نقطة 1\n• نقطة 2' : '• Point 1\n• Point 2'}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ar' ? 'النصيحة العامة (إنجليزي)' : 'Public Advice (English)'}</Label>
                      <Textarea
                        value={formData.adviceEn}
                        onChange={(e) => setFormData({ ...formData, adviceEn: e.target.value })}
                        rows={4}
                        dir="ltr"
                        placeholder="• Point 1&#10;• Point 2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sector Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'توصيات القطاعات' : 'Sector Recommendations'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectors.map((sector) => (
                    <div key={sector}>
                      <Label>
                        {language === 'ar' 
                          ? `الإجراءات الموصى بها لـ ${roleLabels[sector].ar}`
                          : `Recommended Actions for ${roleLabels[sector].en}`}
                      </Label>
                      <Textarea
                        value={formData.sectorRecommendations[sector] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          sectorRecommendations: {
                            ...formData.sectorRecommendations,
                            [sector]: e.target.value,
                          },
                        })}
                        rows={2}
                        placeholder={language === 'ar' ? 'أدخل التوصيات...' : 'Enter recommendations...'}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <X className="w-4 h-4 ml-2" />
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button variant="secondary" onClick={() => handleSubmit(true)}>
                  <Save className="w-4 h-4 ml-2" />
                  {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
                </Button>
                <Button onClick={() => handleSubmit(false)}>
                  <Send className="w-4 h-4 ml-2" />
                  {language === 'ar' ? 'إصدار الإنذار' : 'Issue Alert'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
