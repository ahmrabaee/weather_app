import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert } from '@/types/alert';
import { AlertTriangle, Calendar, MapPin, Info } from 'lucide-react';

// Mock alert for public view
const mockAlert: Alert = {
  id: 'ALERT-001',
  title: 'فيضانات محتملة في المناطق الشمالية',
  titleEn: 'Potential Flooding in Northern Areas',
  hazardType: 'flood',
  level: 'orange',
  issueTime: '2024-01-15T08:00:00',
  validFrom: '2024-01-15T12:00:00',
  validTo: '2024-01-16T18:00:00',
  affectedAreas: ['نابلس', 'جنين', 'طوباس'],
  technicalDescAr: 'متوقع هطول أمطار غزيرة قد تؤدي إلى فيضانات في المناطق المنخفضة.',
  technicalDescEn: 'Heavy rainfall expected that may lead to flooding in low-lying areas.',
  publicAdviceAr: '• تجنب المناطق المنخفضة والوديان\n• لا تحاول عبور الطرق المغمورة بالمياه\n• ابقَ في مكان آمن حتى انتهاء التحذير\n• تابع نشرات الأخبار والتحديثات\n• احتفظ بمصباح يدوي ومياه شرب',
  publicAdviceEn: '• Avoid low-lying areas and valleys\n• Do not attempt to cross flooded roads\n• Stay in a safe location until warning ends\n• Monitor news and updates\n• Keep a flashlight and drinking water ready',
  sectorRecommendations: {},
  status: 'issued',
  sectorResponses: [],
  createdBy: 'الأرصاد الجوية',
  createdAt: '2024-01-15T08:00:00',
};

const PublicAlert = () => {
  const { t, language } = useLanguage();

  const getLevelConfig = () => {
    switch (mockAlert.level) {
      case 'yellow':
        return {
          bg: 'alert-yellow',
          text: t('alert.yellow'),
          icon: '⚠️',
        };
      case 'orange':
        return {
          bg: 'alert-orange',
          text: t('alert.orange'),
          icon: '🟠',
        };
      case 'red':
        return {
          bg: 'alert-red',
          text: t('alert.red'),
          icon: '🔴',
        };
      default:
        return {
          bg: 'bg-muted',
          text: '',
          icon: '',
        };
    }
  };

  const levelConfig = getLevelConfig();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Alert Banner */}
      <div className={`${levelConfig.bg} py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 justify-center">
            <AlertTriangle className="h-12 w-12" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {levelConfig.icon} {levelConfig.text}
              </h1>
              <p className="text-xl mt-2">
                {language === 'ar' ? mockAlert.title : mockAlert.titleEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* What is Happening */}
        <Card className="shadow-elevated">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${levelConfig.bg}`}>
                <Info className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">{t('public.what')}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {language === 'ar' ? mockAlert.technicalDescAr : mockAlert.technicalDescEn}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">{t('public.when')}</h2>
                <div className="space-y-2 text-lg">
                  <p>
                    <span className="font-semibold">{language === 'ar' ? 'من:' : 'From:'}</span>{' '}
                    <span className="text-muted-foreground">
                      {new Date(mockAlert.validFrom).toLocaleString(language)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">{language === 'ar' ? 'إلى:' : 'To:'}</span>{' '}
                    <span className="text-muted-foreground">
                      {new Date(mockAlert.validTo).toLocaleString(language)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Where */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">{t('public.where')}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {mockAlert.affectedAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-lg font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <MapPlaceholder
              level={mockAlert.level}
              areas={mockAlert.affectedAreas}
              className="min-h-[350px]"
            />
          </CardContent>
        </Card>

        {/* What Should I Do */}
        <Card className="shadow-elevated border-2 border-primary">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-primary">{t('public.whatToDo')}</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-primary/5 rounded-lg p-6">
                <ul className="space-y-3 list-none p-0 m-0">
                  {(language === 'ar' ? mockAlert.publicAdviceAr : mockAlert.publicAdviceEn)
                    .split('\n')
                    .filter(Boolean)
                    .map((advice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary text-2xl">✓</span>
                        <span className="text-lg flex-1">{advice.replace('•', '').trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-center text-sm text-muted-foreground">
              ℹ️ {t('public.disclaimer')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicAlert;
