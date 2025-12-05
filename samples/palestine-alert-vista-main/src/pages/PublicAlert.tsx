import { useState } from 'react';
import { Globe, Clock, MapPin, Shield, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPlaceholder } from '@/components/ews/MapPlaceholder';
import { useEWS, alertLevelLabels } from '@/contexts/EWSContext';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function PublicAlert() {
  const { language, setLanguage, alerts } = useEWS();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeAlerts = alerts.filter(a => a.status === 'issued');
  const currentAlert = activeAlerts[currentIndex];
  const dateLocale = language === 'ar' ? ar : enUS;

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const levelBgColors = {
    red: 'bg-alert-red',
    orange: 'bg-alert-orange',
    yellow: 'bg-alert-yellow',
  };

  const levelTextColors = {
    red: 'text-primary-foreground',
    orange: 'text-primary-foreground',
    yellow: 'text-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">
                {language === 'ar' ? 'نظام الإنذار المبكر' : 'Early Warning System'}
              </h1>
              <p className="text-xs text-primary-foreground/70">
                {language === 'ar' ? 'فلسطين' : 'Palestine'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Globe className="w-4 h-4 ml-2" />
            {language === 'ar' ? 'EN' : 'عربي'}
          </Button>
        </div>
      </header>

      {activeAlerts.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-alert-green-bg flex items-center justify-center">
              <Shield className="w-10 h-10 text-alert-green" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {language === 'ar' ? 'لا توجد إنذارات نشطة' : 'No Active Alerts'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'الوضع آمن حالياً. ابق على اطلاع.'
                : 'The situation is currently safe. Stay informed.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Alert Banner */}
          {currentAlert && (
            <div className={cn(
              'py-6 px-4',
              levelBgColors[currentAlert.level],
              levelTextColors[currentAlert.level]
            )}>
              <div className="container mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 animate-pulse-alert" />
                    <div>
                      <p className="text-sm opacity-80 mb-1">
                        {language === 'ar' 
                          ? `إنذار ${alertLevelLabels[currentAlert.level].ar}`
                          : `${alertLevelLabels[currentAlert.level].en} Alert`}
                      </p>
                      <h2 className="text-2xl font-bold">
                        {language === 'ar' ? currentAlert.title : currentAlert.titleEn}
                      </h2>
                    </div>
                  </div>
                  {activeAlerts.length > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        className="text-inherit hover:bg-black/10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <span className="text-sm">
                        {currentIndex + 1} / {activeAlerts.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentIndex(i => Math.min(activeAlerts.length - 1, i + 1))}
                        disabled={currentIndex === activeAlerts.length - 1}
                        className="text-inherit hover:bg-black/10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Alert Content */}
          {currentAlert && (
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* What's Happening */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'ماذا يحدث؟' : 'What\'s Happening?'}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'ar' ? currentAlert.descriptionAr : currentAlert.descriptionEn}
                    </p>
                  </CardContent>
                </Card>

                {/* When */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'متى؟' : 'When?'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'يبدأ من' : 'Starts From'}
                        </p>
                        <p className="font-semibold">
                          {format(currentAlert.validFrom, 'PPPp', { locale: dateLocale })}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'ينتهي في' : 'Ends At'}
                        </p>
                        <p className="font-semibold">
                          {format(currentAlert.validTo, 'PPPp', { locale: dateLocale })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Where */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'أين؟' : 'Where?'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentAlert.affectedAreas.map((area, i) => (
                        <span
                          key={i}
                          className={cn(
                            'px-3 py-1 rounded-full text-sm font-medium',
                            currentAlert.level === 'red' && 'bg-alert-red-bg text-alert-red',
                            currentAlert.level === 'orange' && 'bg-alert-orange-bg text-alert-orange',
                            currentAlert.level === 'yellow' && 'bg-alert-yellow-bg text-alert-yellow'
                          )}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                    <MapPlaceholder
                      affectedAreas={currentAlert.affectedAreas}
                      level={currentAlert.level}
                      className="h-64"
                    />
                  </CardContent>
                </Card>

                {/* What To Do */}
                <Card className={cn(
                  'border-2',
                  currentAlert.level === 'red' && 'border-alert-red',
                  currentAlert.level === 'orange' && 'border-alert-orange',
                  currentAlert.level === 'yellow' && 'border-alert-yellow'
                )}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'ماذا يجب أن أفعل؟' : 'What Should I Do?'}
                    </h3>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {language === 'ar' ? currentAlert.adviceAr : currentAlert.adviceEn}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'هذا نموذج أولي يستخدم بيانات اختبار فقط.'
              : 'This is a prototype using test data only.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2024 {language === 'ar' ? 'نظام الإنذار المبكر - فلسطين' : 'Early Warning System - Palestine'}
          </p>
        </div>
      </footer>
    </div>
  );
}
