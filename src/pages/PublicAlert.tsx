import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MapComponent } from '@/components/MapComponent';
import { StudioCanvas } from '@/components/MapStudio/StudioCanvas';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, MapPin, CheckCircle, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertLegend } from '@/components/AlertLegend';

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

  // --- Risk Spectrum Logic ---
  // 1. Identify all active risk levels
  const activeLevels = alert.zones && alert.zones.length > 0
    ? Array.from(new Set(alert.zones.map(z => z.level)))
    : [alert.level];

  // Map levels to "Meteorological" hex colors for the gradient
  // These aren't just CSS classes, but raw values for flexible gradient construction
  const levelColors: Record<string, string> = {
    red: '#DC2626',    // severe
    orange: '#EA580C', // moderate
    yellow: '#CA8A04', // awareness
  };

  // 2. Construct the Dynamic Gradient
  // If multiple zones: Linear Gradient from highest risk -> lowest risk
  // If single zone: A solid, unified theme
  const getBackgroundStyle = () => {
    if (activeLevels.length > 1) {
      // Sort levels by severity (Red > Orange > Yellow) to ensure logical flow
      const severityOrder = ['red', 'orange', 'yellow'];
      const sortedLevels = activeLevels.sort((a, b) => severityOrder.indexOf(a) - severityOrder.indexOf(b));

      const distinctColors = sortedLevels.map(lvl => levelColors[lvl]);
      return {
        background: `linear-gradient(135deg, ${distinctColors.join(', ')})`,
        text: 'text-white'
      };
    } else {
      // Single level fallback
      const lvl = activeLevels[0];
      return {
        background: levelColors[lvl],
        text: lvl === 'yellow' ? 'text-yellow-950' : 'text-white'
      };
    }
  };

  const currentStyle = getBackgroundStyle();
  const isMultiZone = activeLevels.length > 1;

  const levelText = {
    yellow: { en: 'Yellow Alert', ar: 'تنبيه أصفر' },
    orange: { en: 'Orange Alert', ar: 'تنبيه برتقالي' },
    red: { en: 'Red Alert', ar: 'تنبيه أحمر' },
  };

  // Spectrum Bar Component (The "Engineering Touch")
  const SpectrumBar = () => {
    if (!isMultiZone) return null;

    // Total width 100%, segments proportional
    const segmentWidth = 100 / activeLevels.length;

    return (
      <div className="w-full h-3 flex mt-8 rounded-full overflow-hidden shadow-inner bg-black/20 backdrop-blur-sm border border-white/10">
        {activeLevels
          // Sort again to ensure the bar matches the gradient direction logic if needed, 
          // or keep it distinct. Let's sort Red -> Yellow.
          .sort((a, b) => ['red', 'orange', 'yellow'].indexOf(a) - ['red', 'orange', 'yellow'].indexOf(b))
          .map(lvl => (
            <div
              key={lvl}
              className="h-full first:rounded-l-full last:rounded-r-full relative group"
              style={{ width: `${segmentWidth}%`, backgroundColor: levelColors[lvl] }}
            >
              {/* Tooltip-ish indicator on hover could go here, but keep it clean for now */}
            </div>
          ))}
      </div>
    );
  };

  const adviceItems = (language === 'en' ? alert.publicAdviceEn : alert.publicAdviceAr)
    .split('\n')
    .filter((item) => item.trim())
    .map((item) => item.replace(/^[•\-]\s*/, '').trim());

  return (
    <div className="min-h-screen bg-slate-50 font-inter pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => user ? navigate(-1) : navigate('/')}
            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Back' : 'رجوع'}
          </Button>
          <div className="text-sm font-semibold text-slate-500">
            {language === 'en' ? 'Official Alert System' : 'نظام الإنذار الرسمي'}
          </div>
        </div>
      </nav>

      {/* Hero Banner: The Risk Spectrum */}
      <div
        className={cn("relative w-full overflow-hidden shadow-xl transition-all duration-500 ease-out py-16 px-6 text-center")}
        style={{ background: currentStyle.background }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Main Icon */}
          <div className="mb-6 inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg animate-fade-in">
            <AlertTriangle className={cn("w-16 h-16 drop-shadow-md", currentStyle.text)} />
          </div>

          <div className="space-y-4 animate-fade-in">
            {/* Dynamic Title */}
            <h1 className={cn("text-4xl sm:text-6xl font-black uppercase tracking-tight drop-shadow-sm", currentStyle.text)}>
              {isMultiZone
                ? (language === 'en' ? 'Composite Weather Alert' : 'تحذير جوي مركب')
                : (language === 'en' ? levelText[alert.level as keyof typeof levelText].en : levelText[alert.level as keyof typeof levelText].ar)
              }
            </h1>

            {/* Subtitle / Context */}
            <h2 className={cn("text-xl sm:text-2xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed", currentStyle.text)}>
              {language === 'en' ? alert.titleEn : alert.title}
            </h2>

            {/* The Spectrum Bar (Engineering Visualization) */}
            <div className="max-w-md mx-auto">
              <SpectrumBar />
              {isMultiZone && (
                <div className={cn("flex justify-between text-xs font-mono mt-2 opacity-80 uppercase tracking-widest", currentStyle.text)}>
                  <span>{language === 'en' ? 'Highest Risk' : 'الأعلى خطورة'}</span>
                  <span>{language === 'en' ? 'Lowest Risk' : 'الأقل خطورة'}</span>
                </div>
              )}
            </div>

            <p className={cn("mt-6 text-sm font-mono opacity-70 uppercase tracking-widest", currentStyle.text)}>
              {language === 'en' ? 'Issued: ' : 'تم الإصدار: '}
              {format(new Date(alert.issueTime), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Subtle Pattern Overlay for Texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
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
          <div className="space-y-6">
            {alert.mapComposition ? (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-in fade-in duration-1000">
                <div className="relative group shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <StudioCanvas layers={alert.mapComposition.layers} readOnly />
                </div>
                <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {language === 'en' ? 'Geographic Coverage Map' : 'خريطة التغطية الجغرافية'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <MapComponent
                  mode="view"
                  className="min-h-[400px] rounded-xl overflow-hidden shadow-inner"
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
            )}

            {/* Alert Level Legend & Expert Analysis (Shared Component) */}
            <AlertLegend alert={alert} className="mt-8" />
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
