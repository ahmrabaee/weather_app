import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { InteractivePalestineMap } from '@/components/InteractivePalestineMap';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, MapPin, CheckCircle, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicAlert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts, language, user } = useApp();

  const alert = alerts.find((a) => a.id === id);

  if (!alert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Alert Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested alert could not be found.
          </p>
          <Button onClick={() => navigate('/')} className="btn-gov-primary">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const bannerClass = {
    yellow: 'alert-banner-yellow',
    orange: 'alert-banner-orange',
    red: 'alert-banner-red',
  }[alert.level];

  const levelText = {
    yellow: { en: 'YELLOW ALERT', ar: 'تنبيه أصفر' },
    orange: { en: 'ORANGE ALERT', ar: 'تنبيه برتقالي' },
    red: { en: 'RED ALERT', ar: 'تنبيه أحمر' },
  }[alert.level];

  const adviceItems = (language === 'en' ? alert.publicAdviceEn : alert.publicAdviceAr)
    .split('\n')
    .filter((item) => item.trim())
    .map((item) => item.replace(/^[•\-]\s*/, '').trim());

  return (
    <div className="min-h-screen bg-background">
      {/* Back button for logged in users */}
      {user && (
        <div className="bg-primary text-primary-foreground py-2 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
        </div>
      )}

      {/* Alert Banner */}
      <div className={cn(bannerClass, 'animate-pulse-alert')}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className={cn(
              'w-12 h-12',
              alert.level === 'red' ? 'text-white' : 'text-foreground'
            )} />
            <h1 className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-bold',
              alert.level === 'red' ? 'text-white' : 'text-foreground'
            )}>
              {language === 'en' ? levelText.en : levelText.ar}
            </h1>
          </div>
          <h2 className={cn(
            'text-xl sm:text-2xl font-semibold',
            alert.level === 'red' ? 'text-white/90' : 'text-foreground/80'
          )}>
            {language === 'en' ? alert.titleEn : alert.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* What is Happening */}
        <div className="gov-card animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-8 h-8 text-info" />
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'What is Happening?' : 'ماذا يحدث؟'}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'en' ? alert.technicalDescEn : alert.technicalDescAr}
          </p>
        </div>

        {/* When */}
        <div className="gov-card animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-warning" />
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'When?' : 'متى؟'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                {language === 'en' ? 'From' : 'من'}
              </p>
              <p className="text-xl font-semibold">
                {format(new Date(alert.validFrom), 'EEEE, dd MMMM yyyy')}
              </p>
              <p className="text-lg text-muted-foreground">
                {format(new Date(alert.validFrom), 'h:mm a')}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                {language === 'en' ? 'To' : 'إلى'}
              </p>
              <p className="text-xl font-semibold">
                {format(new Date(alert.validTo), 'EEEE, dd MMMM yyyy')}
              </p>
              <p className="text-lg text-muted-foreground">
                {format(new Date(alert.validTo), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Where */}
        <div className="gov-card animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'Where?' : 'أين؟'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <InteractivePalestineMap
              affectedAreas={alert.affectedAreas}
              level={alert.level}
              className="min-h-[400px]"
            />
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'en' ? 'Affected Areas:' : 'المناطق المتأثرة:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {alert.affectedAreas.map((area) => (
                  <span
                    key={area}
                    className={cn(
                      'px-4 py-2 rounded-full font-medium',
                      `alert-badge-${alert.level}`
                    )}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What Should I Do */}
        <div className="gov-card border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              {language === 'en' ? 'What Should I Do?' : 'ماذا يجب أن أفعل؟'}
            </h2>
          </div>
          <ul className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {adviceItems.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <span className="text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
          <Info className="w-5 h-5 inline-block mr-2 -mt-0.5" />
          {language === 'en'
            ? 'This is a demonstration prototype using test data only.'
            : 'هذا نموذج تجريبي يستخدم بيانات اختبارية فقط.'}
        </div>
      </div>
    </div>
  );
}
