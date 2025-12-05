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
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('logs.title')}</h1>
        </div>

        {/* Control Buttons */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>أدوات التحكم في البيانات</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              onClick={handleLoadSample}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Database className="h-5 w-5" />
              {t('logs.loadSample')}
            </Button>
            <Button
              onClick={handleClearAll}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <Trash2 className="h-5 w-5" />
              {t('logs.clearAll')}
            </Button>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('logs.activityLog')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">{t('common.noData')}</p>
                <p className="text-sm mt-2">قم بتحميل إنذارات العينة للبدء</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 20)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-card transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleBadgeColor(log.role)}>
                              {t(`role.${log.role}`)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString('ar')}
                            </span>
                          </div>
                          <p className="text-sm">{log.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">إجمالي السجلات</p>
                <p className="text-3xl font-bold text-primary">{logs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">آخر نشاط</p>
                <p className="text-lg font-semibold">
                  {logs.length > 0
                    ? new Date(logs[0].timestamp).toLocaleTimeString('ar', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">حالة النظام</p>
                <Badge className="bg-status-completed text-white text-sm">
                  نشط
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Note */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <h3 className="font-semibold text-lg mb-3">ملاحظة للمطورين</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • هذه الصفحة مخصصة للاختبار والتطوير
              </p>
              <p>
                • يمكنك استخدام "تحميل إنذارات العينة" لإضافة بيانات تجريبية
              </p>
              <p>
                • استخدم "مسح جميع الإنذارات" لإعادة تعيين النظام
              </p>
              <p>
                • جميع البيانات في هذا النموذج الأولي محلية ومؤقتة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
