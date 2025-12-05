import { Database, Trash2, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/ews/Header';
import { Sidebar } from '@/components/ews/Sidebar';
import { useEWS, roleLabels } from '@/contexts/EWSContext';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

export default function SystemLogs() {
  const { language, logs, loadSampleAlerts, clearAllAlerts, alerts } = useEWS();
  const dateLocale = language === 'ar' ? ar : enUS;

  const handleLoadSamples = () => {
    loadSampleAlerts();
    toast.success(
      language === 'ar' ? 'تم تحميل إنذارات العينة' : 'Sample alerts loaded'
    );
  };

  const handleClearAll = () => {
    clearAllAlerts();
    toast.success(
      language === 'ar' ? 'تم مسح جميع الإنذارات' : 'All alerts cleared'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'السجلات وبيانات الاختبار' : 'Logs & Test Data'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'إدارة بيانات الاختبار وعرض سجل الأنشطة' : 'Manage test data and view activity logs'}
              </p>
            </div>

            {/* Test Data Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  {language === 'ar' ? 'التحكم في البيانات' : 'Data Controls'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleLoadSamples} className="gap-2">
                    <Download className="w-4 h-4" />
                    {language === 'ar' ? 'تحميل إنذارات العينة' : 'Load Sample Alerts'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearAll}
                    disabled={alerts.length === 0}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {language === 'ar' ? 'مسح جميع الإنذارات' : 'Clear All Alerts'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {language === 'ar' 
                    ? `عدد الإنذارات الحالية: ${alerts.length}`
                    : `Current alerts count: ${alerts.length}`}
                </p>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {language === 'ar' ? 'سجل الأنشطة' : 'Activity Log'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'ar' ? 'لا توجد أنشطة مسجلة بعد' : 'No activities logged yet'}</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">{language === 'ar' ? 'الوقت' : 'Time'}</TableHead>
                        <TableHead className="w-40">{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                        <TableHead>{language === 'ar' ? 'الإجراء' : 'Action'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">
                            {format(log.timestamp, 'PPp', { locale: dateLocale })}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                              {language === 'ar' ? roleLabels[log.role].ar : roleLabels[log.role].en}
                            </span>
                          </TableCell>
                          <TableCell>{log.action}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
