import { Header } from '@/components/Header';
import { useApp, ROLE_NAMES } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Database,
  Clock,
  Settings,
  Lightbulb,
  Download,
  Trash2,
  Activity,
  CheckCircle,
} from 'lucide-react';

export default function ActivityLogs() {
  const { logs, alerts, loadSampleData, clearAll, language } = useApp();

  const handleLoadSample = () => {
    loadSampleData();
    toast.success('Sample data loaded successfully');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAll();
      toast.success('All data cleared');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      meteorology: 'bg-blue-100 text-blue-800',
      'civil-defense': 'bg-red-100 text-red-800',
      agriculture: 'bg-green-100 text-green-800',
      'water-authority': 'bg-cyan-100 text-cyan-800',
      environment: 'bg-emerald-100 text-emerald-800',
      security: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-container">
      <Header />

      <main className="page-content">
        <h1 className="page-title animate-fade-in flex items-center gap-3">
          <Database className="w-10 h-10 text-primary" />
          {language === 'en' ? 'Activity Logs' : 'سجلات النشاط'}
        </h1>

        {/* Data Controls */}
        <div className="gov-card mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Data Controls' : 'التحكم في البيانات'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleLoadSample} className="btn-gov-primary">
              <Download className="w-4 h-4" />
              {language === 'en' ? 'Load Sample Alerts' : 'تحميل تنبيهات تجريبية'}
            </Button>
            <Button onClick={handleClearAll} className="btn-gov-destructive">
              <Trash2 className="w-4 h-4" />
              {language === 'en' ? 'Clear All Data' : 'مسح جميع البيانات'}
            </Button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="gov-card mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Activity Log' : 'سجل النشاط'}
            </h2>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Activity className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                          log.role
                        )}`}
                      >
                        {ROLE_NAMES[log.role]}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {format(new Date(log.timestamp), 'dd MMM, HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{log.action}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{language === 'en' ? 'No activity logs yet' : 'لا توجد سجلات نشاط بعد'}</p>
              </div>
            )}
          </div>
        </div>

        {/* System Statistics */}
        <div className="gov-card mb-6 animate-fade-in bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'System Statistics' : 'إحصائيات النظام'}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-3xl font-bold text-primary">{logs.length}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Total Logs' : 'إجمالي السجلات'}
              </p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {logs.length > 0
                  ? format(new Date(logs[0].timestamp), 'HH:mm')
                  : '--:--'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Last Activity' : 'آخر نشاط'}
              </p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-xl font-bold text-success">Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'System Status' : 'حالة النظام'}
              </p>
            </div>
          </div>
        </div>

        {/* Developer Note */}
        <div className="gov-card border-l-4 border-info animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-6 h-6 text-info" />
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Developer Note' : 'ملاحظة المطور'}
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • {language === 'en'
                ? 'This page is for testing and development purposes'
                : 'هذه الصفحة لأغراض الاختبار والتطوير'}
            </li>
            <li>
              • {language === 'en'
                ? 'Use "Load Sample" to add test alerts to the system'
                : 'استخدم "تحميل عينة" لإضافة تنبيهات اختبارية إلى النظام'}
            </li>
            <li>
              • {language === 'en'
                ? 'Use "Clear All" to reset the system completely'
                : 'استخدم "مسح الكل" لإعادة تعيين النظام بالكامل'}
            </li>
            <li>
              • {language === 'en'
                ? 'All data in this prototype is stored locally in your browser'
                : 'يتم تخزين جميع البيانات في هذا النموذج محليًا في متصفحك'}
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
