import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Database, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  id: string;
  timestamp: string;
  role: string;
  action: string;
}

const Logs = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-15T08:00:00',
      role: 'meteorology',
      action: 'أصدر إنذار ALERT-001 (برتقالي) - فيضانات محتملة',
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:00:00',
      role: 'meteorology',
      action: 'أصدر إنذار ALERT-002 (أحمر) - موجة حر شديدة',
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:30:00',
      role: 'civilDefense',
      action: 'حدّث حالة ALERT-001 إلى "قيد التنفيذ"',
    },
    {
      id: '4',
      timestamp: '2024-01-15T09:15:00',
      role: 'water',
      action: 'أقر باستلام ALERT-001',
    },
  ]);

  const handleLoadSample = () => {
    const sampleLogs: LogEntry[] = [
      {
        id: Date.now().toString() + '1',
        timestamp: new Date().toISOString(),
        role: 'meteorology',
        action: 'تم تحميل إنذارات العينة (3 إنذارات)',
      },
      {
        id: Date.now().toString() + '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        role: 'meteorology',
        action: 'أصدر إنذار SAMPLE-001 (أصفر) - رياح قوية متوقعة',
      },
      {
        id: Date.now().toString() + '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        role: 'meteorology',
        action: 'أصدر إنذار SAMPLE-002 (برتقالي) - عاصفة رملية',
      },
      {
        id: Date.now().toString() + '4',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        role: 'meteorology',
        action: 'أصدر إنذار SAMPLE-003 (أحمر) - موجة برد قارسة',
      },
    ];
    setLogs([...sampleLogs, ...logs]);
    toast.success('تم تحميل إنذارات العينة بنجاح');
  };

  const handleClearAll = () => {
    setLogs([]);
    toast.success('تم مسح جميع الإنذارات والسجلات');
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      meteorology: 'bg-primary text-primary-foreground',
      civilDefense: 'bg-status-in-progress text-white',
      agriculture: 'bg-secondary text-secondary-foreground',
      water: 'bg-status-acknowledged text-white',
      environment: 'bg-accent text-accent-foreground',
    };
    return colors[role as keyof typeof colors] || 'bg-muted';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto p-6 max-w-6xl space-y-6">
        {/* Page Title */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border-2 border-primary/20 shadow-lg">
          <div className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-xl">
            <Database className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t('logs.title')}</h1>
        </div>

        {/* Control Buttons */}
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              أدوات التحكم في البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              onClick={handleLoadSample}
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
            >
              <Database className="h-5 w-5" />
              {t('logs.loadSample')}
            </Button>
            <Button
              onClick={handleClearAll}
              variant="destructive"
              size="lg"
              className="gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl font-semibold"
            >
              <Trash2 className="h-5 w-5" />
              {t('logs.clearAll')}
            </Button>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-blue-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              {t('logs.activityLog')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-muted/30 to-transparent rounded-2xl border-2 border-dashed border-primary/20">
                <div className="text-8xl mb-4">📋</div>
                <p className="text-2xl font-bold text-muted-foreground">{t('common.noData')}</p>
                <p className="text-base mt-3 text-muted-foreground">قم بتحميل إنذارات العينة للبدء</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 20)
                  .map((log, index) => (
                    <div
                      key={log.id}
                      className="p-5 rounded-2xl border-2 border-border bg-gradient-to-r from-card to-card/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-primary/30 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`${getRoleBadgeColor(log.role)} px-4 py-1.5 font-semibold text-sm shadow-md group-hover:scale-105 transition-transform`}>
                              {t(`role.${log.role}`)}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-lg">
                              ⏰ {new Date(log.timestamp).toLocaleString('ar')}
                            </span>
                          </div>
                          <p className="text-base font-medium leading-relaxed">{log.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-xl border-2 border-primary/20">
          <CardContent className="py-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="group hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wide">إجمالي السجلات</p>
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-6 shadow-lg">
                  <p className="text-5xl font-black">{logs.length}</p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wide">آخر نشاط</p>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                  <p className="text-3xl font-bold font-mono">
                    {logs.length > 0
                      ? new Date(logs[0].timestamp).toLocaleTimeString('ar', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : '--:--'}
                  </p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wide">حالة النظام</p>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg flex items-center justify-center">
                  <Badge className="bg-white/20 text-white text-lg px-6 py-2 font-bold border-2 border-white/30">
                    ✓ نشط
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Note */}
        <Card className="border-4 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="py-8">
            <h3 className="font-black text-2xl mb-4 flex items-center gap-3">
              <span className="text-4xl">💡</span>
              ملاحظة للمطورين
            </h3>
            <div className="space-y-3 text-base">
              <p className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border-l-4 border-primary">
                <span className="text-2xl">•</span>
                <span>هذه الصفحة مخصصة للاختبار والتطوير</span>
              </p>
              <p className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border-l-4 border-primary">
                <span className="text-2xl">•</span>
                <span>يمكنك استخدام "تحميل إنذارات العينة" لإضافة بيانات تجريبية</span>
              </p>
              <p className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border-l-4 border-primary">
                <span className="text-2xl">•</span>
                <span>استخدم "مسح جميع الإنذارات" لإعادة تعيين النظام</span>
              </p>
              <p className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border-l-4 border-primary">
                <span className="text-2xl">•</span>
                <span>جميع البيانات في هذا النموذج الأولي محلية ومؤقتة</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
