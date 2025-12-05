import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, Clock, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/ews/Header';
import { Sidebar } from '@/components/ews/Sidebar';
import { AlertBadge } from '@/components/ews/AlertBadge';
import { useEWS, AlertLevel } from '@/contexts/EWSContext';
import { useState } from 'react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export default function AdminDashboard() {
  const { language, alerts } = useEWS();
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState<AlertLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'draft'>('all');

  const activeAlerts = alerts.filter(a => a.status === 'issued');
  const redAlerts = activeAlerts.filter(a => a.level === 'red').length;
  const orangeAlerts = activeAlerts.filter(a => a.level === 'orange').length;
  const yellowAlerts = activeAlerts.filter(a => a.level === 'yellow').length;

  const filteredAlerts = alerts.filter(alert => {
    if (levelFilter !== 'all' && alert.level !== levelFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const dateLocale = language === 'ar' ? ar : enUS;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'نظرة عامة على حالة النظام' : 'System status overview'}
              </p>
            </div>
            <Button onClick={() => navigate('/admin/create')} className="gap-2">
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إنشاء إنذار جديد' : 'Create New Alert'}
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'الإنذارات النشطة' : 'Active Alerts'}
                </CardTitle>
                <AlertTriangle className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeAlerts.length}</div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-alert-red">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إنذارات حمراء' : 'Red Alerts'}
                </CardTitle>
                <div className="w-4 h-4 rounded-full bg-alert-red" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-alert-red">{redAlerts}</div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-alert-orange">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إنذارات برتقالية' : 'Orange Alerts'}
                </CardTitle>
                <div className="w-4 h-4 rounded-full bg-alert-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-alert-orange">{orangeAlerts}</div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-alert-yellow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إنذارات صفراء' : 'Yellow Alerts'}
                </CardTitle>
                <div className="w-4 h-4 rounded-full bg-alert-yellow" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-alert-yellow">{yellowAlerts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'تصفية:' : 'Filter:'}
                  </span>
                </div>
                <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as AlertLevel | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</SelectItem>
                    <SelectItem value="red">{language === 'ar' ? 'أحمر' : 'Red'}</SelectItem>
                    <SelectItem value="orange">{language === 'ar' ? 'برتقالي' : 'Orange'}</SelectItem>
                    <SelectItem value="yellow">{language === 'ar' ? 'أصفر' : 'Yellow'}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'issued' | 'draft')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                    <SelectItem value="issued">{language === 'ar' ? 'صادر' : 'Issued'}</SelectItem>
                    <SelectItem value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'الإنذارات النشطة' : 'Active Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'ar' ? 'لا توجد إنذارات' : 'No alerts found'}</p>
                  <p className="text-sm mt-2">
                    {language === 'ar' 
                      ? 'اذهب إلى السجلات لتحميل إنذارات العينة'
                      : 'Go to Logs to load sample alerts'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'رقم الإنذار' : 'Alert ID'}</TableHead>
                      <TableHead>{language === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المستوى' : 'Level'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المناطق المتأثرة' : 'Affected Areas'}</TableHead>
                      <TableHead>{language === 'ar' ? 'صالح حتى' : 'Valid Until'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-mono">{alert.id}</TableCell>
                        <TableCell className="font-medium">
                          {language === 'ar' ? alert.title : alert.titleEn}
                        </TableCell>
                        <TableCell>
                          <AlertBadge level={alert.level} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedAreas.slice(0, 2).map((area, i) => (
                              <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs">
                                {area}
                              </span>
                            ))}
                            {alert.affectedAreas.length > 2 && (
                              <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                +{alert.affectedAreas.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {format(alert.validTo, 'PPp', { locale: dateLocale })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            alert.status === 'issued' 
                              ? 'bg-alert-green-bg text-alert-green' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {language === 'ar' 
                              ? (alert.status === 'issued' ? 'صادر' : 'مسودة')
                              : (alert.status === 'issued' ? 'Issued' : 'Draft')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/edit/${alert.id}`)}>
                            {language === 'ar' ? 'عرض' : 'View'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
