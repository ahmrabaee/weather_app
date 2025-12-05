import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Database, Clock, Settings, Lightbulb, Trash2, Download, Activity, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SECTORS } from '@/types/alert';

export default function ActivityLogs() {
  const { logs, loadSampleData, clearAllData, clearLogs, language } = useApp();

  const handleClearAll = () => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد؟ سيتم حذف جميع البيانات.' : 'Are you sure? This will delete all data.')) {
      clearAllData();
      toast.success(language === 'ar' ? 'تم مسح جميع البيانات' : 'All data cleared');
    }
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'meteorology': 'bg-primary text-primary-foreground',
      'civil-defense': 'bg-alert-red text-white',
      'agriculture': 'bg-success text-white',
      'water-authority': 'bg-info text-white',
      'environment': 'bg-alert-yellow text-foreground',
      'security': 'bg-muted-foreground text-white',
      'System': 'bg-muted text-foreground',
    };
    
    // Try to find by value
    const sectorKey = Object.keys(colors).find(
      k => sector.toLowerCase().includes(k.replace('-', ' ')) || 
           sector.toLowerCase().includes(k)
    );
    
    return colors[sectorKey || 'System'] || colors['System'];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h1 className="page-title mb-0">
            {language === 'ar' ? 'سجلات النشاط' : 'Activity Logs'}
          </h1>
        </div>

        {/* Data Controls */}
        <div className="card-government card-accent-left p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {language === 'ar' ? 'التحكم بالبيانات' : 'Data Controls'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={loadSampleData} className="btn-government-secondary">
              <Download className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تحميل بيانات نموذجية' : 'Load Sample Alerts'}
            </Button>
            <Button onClick={() => { clearLogs(); toast.success('Logs cleared'); }} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مسح السجلات' : 'Clear Logs'}
            </Button>
            <Button onClick={handleClearAll} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مسح الكل' : 'Clear All Data'}
            </Button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="card-government card-accent-left p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {language === 'ar' ? 'سجل النشاط' : 'Activity Log'}
            </h2>
          </div>
          
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'ar' ? 'لا توجد سجلات بعد' : 'No activity logs yet'}</p>
              <p className="text-sm mt-2">
                {language === 'ar' 
                  ? 'قم بتحميل البيانات النموذجية لرؤية الأنشطة' 
                  : 'Load sample data or perform actions to see activity'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {logs.map((log, idx) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex-shrink-0">
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium',
                      getSectorColor(log.sector)
                    )}>
                      {log.sector}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium">
                      {log.details}
                    </p>
                    {log.alertId && (
                      <p className="text-sm text-muted-foreground font-mono mt-1">
                        {log.alertId}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Statistics */}
        <div className="card-government card-accent-left p-6 mb-6 animate-fade-in bg-gradient-to-r from-primary/5 to-transparent" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold mb-4">
            {language === 'ar' ? 'إحصائيات النظام' : 'System Statistics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{logs.length}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إجمالي السجلات' : 'Total Logs'}
              </div>
            </div>
            <div className="p-4 bg-card rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {logs.length > 0 ? format(new Date(logs[0].timestamp), 'HH:mm') : '--:--'}
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'آخر نشاط' : 'Last Activity'}
              </div>
            </div>
            <div className="p-4 bg-card rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-lg font-bold text-success">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'حالة النظام' : 'System Status'}
              </div>
            </div>
          </div>
        </div>

        {/* Developer Note */}
        <div className="card-government p-6 border-2 border-primary/30 bg-primary/5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === 'ar' ? 'ملاحظة المطور' : 'Developer Note'}
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {language === 'ar' ? 'هذه الصفحة للاختبار والتطوير' : 'This page is for testing and development'}</li>
                <li>• {language === 'ar' ? 'استخدم "تحميل بيانات نموذجية" لإضافة تنبيهات اختبارية' : 'Use "Load Sample Alerts" to add test data'}</li>
                <li>• {language === 'ar' ? 'استخدم "مسح الكل" لإعادة تعيين النظام' : 'Use "Clear All Data" to reset the system'}</li>
                <li>• {language === 'ar' ? 'جميع البيانات في هذا النموذج الأولي محلية ومؤقتة' : 'All data in this prototype is local and temporary'}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
