import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertLevel, HazardType } from '@/types/alert';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

const CreateAlert = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    hazardType: 'flood' as HazardType,
    level: 'yellow' as AlertLevel,
    validFrom: '',
    validTo: '',
    affectedAreas: '',
    technicalDescAr: '',
    technicalDescEn: '',
    publicAdviceAr: '',
    publicAdviceEn: '',
    civilDefenseRec: '',
    agricultureRec: '',
    waterRec: '',
    environmentRec: '',
    securityRec: '',
  });

  const hazardTypes: HazardType[] = ['flood', 'heatwave', 'storm', 'heavyRain', 'coldWave', 'wind'];

  const handleSubmit = (isDraft: boolean) => {
    if (!formData.title || !formData.titleEn || !formData.validFrom || !formData.validTo) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    toast.success(isDraft ? 'تم حفظ المسودة بنجاح' : 'تم إصدار الإنذار بنجاح');
    setTimeout(() => navigate('/admin-dashboard'), 1500);
  };

  const areas = formData.affectedAreas.split(',').map(a => a.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{t('create.title')}</h1>
        </div>

        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('create.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('create.alertTitle')} (عربي) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: فيضانات محتملة في المناطق الشمالية"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">{t('create.alertTitle')} (English) *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Example: Potential flooding in northern areas"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazardType">{t('create.hazardType')} *</Label>
              <Select
                value={formData.hazardType}
                onValueChange={(value) => setFormData({ ...formData, hazardType: value as HazardType })}
              >
                <SelectTrigger id="hazardType" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {hazardTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`hazard.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>{t('create.alertLevel')} *</Label>
              <RadioGroup
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value as AlertLevel })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="yellow" id="yellow" />
                  <Label
                    htmlFor="yellow"
                    className="cursor-pointer px-4 py-2 rounded-lg alert-yellow font-semibold"
                  >
                    {t('alert.yellow')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="orange" id="orange" />
                  <Label
                    htmlFor="orange"
                    className="cursor-pointer px-4 py-2 rounded-lg alert-orange font-semibold"
                  >
                    {t('alert.orange')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="red" id="red" />
                  <Label
                    htmlFor="red"
                    className="cursor-pointer px-4 py-2 rounded-lg alert-red font-semibold"
                  >
                    {t('alert.red')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Time & Geographic Range */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('create.timeGeo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">{t('create.validFrom')} *</Label>
                <Input
                  id="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validTo">{t('create.validTo')} *</Label>
                <Input
                  id="validTo"
                  type="datetime-local"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="areas">{t('create.affectedAreas')} *</Label>
              <Input
                id="areas"
                value={formData.affectedAreas}
                onChange={(e) => setFormData({ ...formData, affectedAreas: e.target.value })}
                placeholder="مثال: نابلس, جنين, طوباس (افصل بفواصل)"
                className="bg-background"
              />
            </div>

            <MapPlaceholder level={formData.level} areas={areas} className="min-h-[300px]" />
          </CardContent>
        </Card>

        {/* Public Messages */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('create.publicMessages')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="techDescAr">{t('create.technicalDesc')} (عربي)</Label>
                <Textarea
                  id="techDescAr"
                  value={formData.technicalDescAr}
                  onChange={(e) => setFormData({ ...formData, technicalDescAr: e.target.value })}
                  placeholder="الوصف التقني المفصل للحالة الجوية..."
                  rows={4}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techDescEn">{t('create.technicalDesc')} (English)</Label>
                <Textarea
                  id="techDescEn"
                  value={formData.technicalDescEn}
                  onChange={(e) => setFormData({ ...formData, technicalDescEn: e.target.value })}
                  placeholder="Detailed technical description of weather conditions..."
                  rows={4}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adviceAr">{t('create.publicAdvice')} (عربي)</Label>
                <Textarea
                  id="adviceAr"
                  value={formData.publicAdviceAr}
                  onChange={(e) => setFormData({ ...formData, publicAdviceAr: e.target.value })}
                  placeholder="• تجنب المناطق المنخفضة&#10;• ابقَ في مكان آمن&#10;• تابع التحديثات"
                  rows={4}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adviceEn">{t('create.publicAdvice')} (English)</Label>
                <Textarea
                  id="adviceEn"
                  value={formData.publicAdviceEn}
                  onChange={(e) => setFormData({ ...formData, publicAdviceEn: e.target.value })}
                  placeholder="• Avoid low-lying areas&#10;• Stay in safe location&#10;• Monitor updates"
                  rows={4}
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('create.sectorRecs')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="civilDefense">{t('role.civilDefense')}</Label>
              <Textarea
                id="civilDefense"
                value={formData.civilDefenseRec}
                onChange={(e) => setFormData({ ...formData, civilDefenseRec: e.target.value })}
                placeholder="الإجراءات الموصى بها للدفاع المدني..."
                rows={3}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agriculture">{t('role.agriculture')}</Label>
              <Textarea
                id="agriculture"
                value={formData.agricultureRec}
                onChange={(e) => setFormData({ ...formData, agricultureRec: e.target.value })}
                placeholder="الإجراءات الموصى بها لوزارة الزراعة..."
                rows={3}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water">{t('role.water')}</Label>
              <Textarea
                id="water"
                value={formData.waterRec}
                onChange={(e) => setFormData({ ...formData, waterRec: e.target.value })}
                placeholder="الإجراءات الموصى بها لسلطة المياه..."
                rows={3}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">{t('role.environment')}</Label>
              <Textarea
                id="environment"
                value={formData.environmentRec}
                onChange={(e) => setFormData({ ...formData, environmentRec: e.target.value })}
                placeholder="الإجراءات الموصى بها لسلطة جودة البيئة..."
                rows={3}
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end pb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin-dashboard')}
            size="lg"
          >
            {t('create.cancel')}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            size="lg"
            className="gap-2"
          >
            <Save className="h-5 w-5" />
            {t('create.saveDraft')}
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            className="gradient-primary text-white gap-2"
            size="lg"
          >
            <Send className="h-5 w-5" />
            {t('create.issueAlert')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlert;
