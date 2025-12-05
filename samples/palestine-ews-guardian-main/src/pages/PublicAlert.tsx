import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { InteractivePalestineMap } from '@/components/InteractivePalestineMap';
import { AlertTriangle, Calendar, MapPin, CheckCircle, Info, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PublicAlert() {
  const { id } = useParams();
  const { alerts, language, setLanguage } = useApp();
  
  const alert = alerts.find(a => a.id === id) || alerts[0];

  if (!alert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">
            {language === 'ar' ? 'التنبيه غير موجود' : 'Alert Not Found'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'التنبيه المطلوب غير موجود' : 'The requested alert could not be found'}
          </p>
        </div>
      </div>
    );
  }

  const levelConfig = {
    yellow: {
      bg: 'bg-alert-yellow',
      text: 'text-foreground',
      label: language === 'ar' ? 'تنبيه أصفر' : 'YELLOW ALERT',
      sublabel: language === 'ar' ? 'كن على علم' : 'Be Aware',
    },
    orange: {
      bg: 'bg-alert-orange',
      text: 'text-white',
      label: language === 'ar' ? 'تنبيه برتقالي' : 'ORANGE ALERT',
      sublabel: language === 'ar' ? 'كن مستعداً' : 'Be Prepared',
    },
    red: {
      bg: 'bg-alert-red',
      text: 'text-white',
      label: language === 'ar' ? 'تنبيه أحمر' : 'RED ALERT',
      sublabel: language === 'ar' ? 'اتخذ إجراءً' : 'Take Action',
    },
  };

  const config = levelConfig[alert.level];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-card shadow-lg"
        >
          <Globe className="w-4 h-4 mr-2" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      {/* Alert Banner */}
      <div className={cn('py-12 px-6 text-center', config.bg, config.text)}>
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-12 h-12 animate-pulse" />
            <span className="text-4xl md:text-5xl font-bold uppercase tracking-wider">
              {config.label}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            {language === 'ar' ? alert.titleAr : alert.title}
          </h1>
          <p className="text-lg opacity-90">{config.sublabel}</p>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* What is Happening */}
        <section className="card-government card-accent-left p-8 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-info/10 rounded-lg">
              <Info className="w-6 h-6 text-info" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'ماذا يحدث؟' : 'What is Happening?'}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {language === 'ar' ? alert.technicalDescAr : alert.technicalDescEn}
          </p>
        </section>

        {/* When */}
        <section className="card-government card-accent-left p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'متى؟' : 'When?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                {language === 'ar' ? 'من' : 'From'}
              </div>
              <div className="text-xl font-bold text-foreground">
                {format(new Date(alert.validFrom), 'EEEE, MMMM dd, yyyy')}
              </div>
              <div className="text-lg text-primary">
                {format(new Date(alert.validFrom), 'h:mm a')}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                {language === 'ar' ? 'حتى' : 'To'}
              </div>
              <div className="text-xl font-bold text-foreground">
                {format(new Date(alert.validTo), 'EEEE, MMMM dd, yyyy')}
              </div>
              <div className="text-lg text-primary">
                {format(new Date(alert.validTo), 'h:mm a')}
              </div>
            </div>
          </div>
        </section>

        {/* Where */}
        <section className="card-government card-accent-left p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <MapPin className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'أين؟' : 'Where?'}
            </h2>
          </div>
          <InteractivePalestineMap
            mode="view"
            selectedRegions={alert.affectedAreas}
            alertLevel={alert.level}
            showAlertMarkers={true}
            enableRegionClick={false}
            height="450px"
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {alert.affectedAreas.map(area => (
              <span
                key={area}
                className={cn(
                  'px-4 py-2 rounded-full font-medium',
                  alert.level === 'red' ? 'bg-alert-red/20 text-alert-red' :
                  alert.level === 'orange' ? 'bg-alert-orange/20 text-foreground' :
                  'bg-alert-yellow/20 text-foreground'
                )}
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* What Should I Do */}
        <section 
          className="card-government p-8 mb-6 animate-fade-in border-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              {language === 'ar' ? 'ماذا يجب أن أفعل؟' : 'What Should I Do?'}
            </h2>
          </div>
          <div className="space-y-4">
            {(language === 'ar' ? alert.publicAdviceAr : alert.publicAdviceEn)
              ?.split('\n')
              .filter(line => line.trim())
              .map((advice, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm">
                  <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-lg text-foreground leading-relaxed">
                    {advice.replace(/^[•\-]\s*/, '')}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Info className="w-5 h-5" />
            <p className="text-sm">
              {language === 'ar'
                ? 'هذا نموذج أولي للتوضيح يستخدم بيانات اختبارية فقط.'
                : 'This is a demonstration prototype using test data only.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
