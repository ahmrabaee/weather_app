import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Users } from 'lucide-react';
import { HAZARD_LEGENDS, AlertLevel, Alert } from '@/types/alert';
import { useApp } from '@/contexts/AppContext';

interface AlertLegendProps {
    alert?: Alert;
    // Fallbacks for preview mode (Create Alert)
    manualHazardType?: string;
    manualLevels?: AlertLevel[];
    className?: string;
}

export const AlertLegend: React.FC<AlertLegendProps> = ({
    alert,
    manualHazardType,
    manualLevels,
    className
}) => {
    const { language } = useApp();

    // Determine active levels and hazard type
    const hazardType = alert?.hazardType || manualHazardType;
    const activeLevels = alert?.zones && alert.zones.length > 0
        ? Array.from(new Set(alert.zones.map(z => z.level)))
        : (alert ? [alert.level] : (manualLevels || []));

    if (!hazardType || activeLevels.length === 0) return null;

    const isMultiZone = activeLevels.length > 1;
    const levelColors: Record<string, string> = {
        red: '#DC2626',
        orange: '#EA580C',
        yellow: '#CA8A04',
    };

    const levelText = {
        yellow: { en: 'Yellow Alert', ar: 'تنبيه أصفر' },
        orange: { en: 'Orange Alert', ar: 'تنبيه برتقالي' },
        red: { en: 'Red Alert', ar: 'تنبيه أحمر' },
    };

    return (
        <div className={cn("space-y-4", className)}>
            {isMultiZone ? (
                /* Expert Composite Risk Analysis for Multiple Zones */
                <div className="p-6 rounded-xl border-2 border-slate-300 bg-slate-50 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">
                            {language === 'en' ? 'Composite Risk Analysis' : 'تحليل المخاطر المركب'}
                        </h4>
                    </div>

                    <div className="grid gap-4">
                        {activeLevels
                            .sort((a, b) => ['red', 'orange', 'yellow'].indexOf(a) - ['red', 'orange', 'yellow'].indexOf(b))
                            .map(lvl => (
                                <div key={lvl} className={cn(
                                    "p-4 rounded-lg border-l-4 bg-white shadow-sm flex gap-4",
                                    lvl === 'red' ? 'border-red-600' : lvl === 'orange' ? 'border-orange-500' : 'border-yellow-400'
                                )}>
                                    <div className={cn(
                                        "w-3 h-3 rounded-full mt-1.5 shrink-0",
                                        lvl === 'red' ? 'bg-red-600' : lvl === 'orange' ? 'bg-orange-500' : 'bg-yellow-400'
                                    )} />
                                    <div>
                                        <p className="font-bold text-sm uppercase mb-1" style={{ color: levelColors[lvl] }}>
                                            {language === 'en' ? levelText[lvl as keyof typeof levelText].en : levelText[lvl as keyof typeof levelText].ar}
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {language === 'en'
                                                ? HAZARD_LEGENDS[hazardType as any]?.[lvl as AlertLevel]?.en
                                                : HAZARD_LEGENDS[hazardType as any]?.[lvl as AlertLevel]?.ar}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            {language === 'en' ? 'Meteorological Note' : 'ملاحظة الأرصاد الجوية'}
                        </p>
                        <p className="text-sm italic text-blue-900/80">
                            {language === 'en'
                                ? "Atmospheric conditions show varying intensity across different sectors. Unified vigilance is advised as risk boundaries may shift with weather evolution."
                                : "تظهر الظروف الجوية تبايناً في الشدة عبر قطاعات مختلفة. نوصي باليقظة الموحدة حيث قد تتغير حدود المخاطر مع تطور الحالة الجوية."}
                        </p>
                    </div>
                </div>
            ) : (
                /* Standard Single Level Legend (Guardian Style) */
                <div className={cn(
                    'p-6 rounded-xl border-2 transition-all duration-300',
                    activeLevels[0] === 'red' ? 'border-red-600 bg-red-50/50' :
                        activeLevels[0] === 'orange' ? 'border-orange-500 bg-orange-50/50' :
                            'border-yellow-400 bg-yellow-50/50'
                )}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                            'w-4 h-4 rounded-full shadow-sm',
                            activeLevels[0] === 'red' ? 'bg-red-600' :
                                activeLevels[0] === 'orange' ? 'bg-orange-500' :
                                    'bg-yellow-400'
                        )} />
                        <h4 className="font-extrabold text-lg tracking-tight text-slate-800">
                            {language === 'en' ? 'What does this level mean?' : 'ماذا يعني هذا المستوى؟'}
                        </h4>
                    </div>
                    <p className="text-base leading-relaxed text-slate-700 font-medium">
                        {language === 'en'
                            ? HAZARD_LEGENDS[hazardType as any]?.[activeLevels[0] as AlertLevel]?.en
                            : HAZARD_LEGENDS[hazardType as any]?.[activeLevels[0] as AlertLevel]?.ar
                        }
                    </p>
                </div>
            )}
        </div>
    );
};
