import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { AlertBadge } from '@/components/AlertBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Clock, Plus, Eye, Edit, Filter,
  TrendingUp, Activity, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { alerts, language } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  const activeAlerts = alerts.filter(a => a.status === 'issued' || a.status === 'pending');
  const yellowAlerts = alerts.filter(a => a.level === 'yellow' && a.status === 'issued');
  const orangeAlerts = alerts.filter(a => a.level === 'orange' && a.status === 'issued');
  const redAlerts = alerts.filter(a => a.level === 'red' && a.status === 'issued');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.status === 'issued' || alert.status === 'pending';
    if (filter === 'past') return alert.status === 'cancelled';
    return true;
  });

  const stats = [
    { label: language === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts', value: activeAlerts.length, icon: AlertTriangle, color: 'text-primary' },
    { label: language === 'ar' ? 'أصفر' : 'Yellow', value: yellowAlerts.length, icon: Activity, color: 'text-alert-yellow', bgBadge: 'alert-badge-yellow' },
    { label: language === 'ar' ? 'برتقالي' : 'Orange', value: orangeAlerts.length, icon: TrendingUp, color: 'text-alert-orange', bgBadge: 'alert-badge-orange' },
    { label: language === 'ar' ? 'أحمر' : 'Red', value: redAlerts.length, icon: BarChart3, color: 'text-alert-red', bgBadge: 'alert-badge-red' },
    { label: language === 'ar' ? 'متوسط الاستجابة' : 'Avg Response', value: '2.5h', icon: Clock, color: 'text-info' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="page-title animate-fade-in">
          {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label} 
              className="stat-card animate-fade-in hover-lift"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex bg-muted rounded-lg p-1">
              {(['all', 'active', 'past'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? (language === 'ar' ? 'الكل' : 'All') :
                   f === 'active' ? (language === 'ar' ? 'نشط' : 'Active') :
                   (language === 'ar' ? 'منتهي' : 'Past')}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/create-alert')}
            className="btn-government"
          >
            <Plus className="w-5 h-5 mr-2" />
            {language === 'ar' ? 'إنشاء تنبيه جديد' : 'Create New Alert'}
          </Button>
        </div>

        {/* Alerts Table */}
        <div className="card-government card-accent-left overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'المعرف' : 'ID'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'العنوان' : 'Title'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'المستوى' : 'Level'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'المناطق' : 'Areas'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'صالح حتى' : 'Valid Until'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert, idx) => (
                  <tr 
                    key={alert.id}
                    className="border-b hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {alert.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {language === 'ar' ? alert.titleAr : alert.title}
                      </span>
                    </td>
                    <td className="p-4">
                      <AlertBadge level={alert.level} size="sm" />
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {alert.affectedAreas.slice(0, 2).join(', ')}
                        {alert.affectedAreas.length > 2 && ` +${alert.affectedAreas.length - 2}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {format(new Date(alert.validTo), 'MMM dd, HH:mm')}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/public-alert/${alert.id}`)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/edit-alert/${alert.id}`)}
                          className="hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAlerts.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'ar' ? 'لا توجد تنبيهات' : 'No alerts found'}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="btn-government-secondary h-auto py-4"
            onClick={() => navigate('/alert-approval')}
          >
            <div className="text-left">
              <div className="font-semibold">{language === 'ar' ? 'الموافقة على التنبيهات' : 'Approve Alerts'}</div>
              <div className="text-sm opacity-70">{alerts.filter(a => a.status === 'pending').length} pending</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="btn-government-secondary h-auto py-4"
            onClick={() => navigate('/disseminate-alert')}
          >
            <div className="text-left">
              <div className="font-semibold">{language === 'ar' ? 'نشر التنبيه' : 'Disseminate Alert'}</div>
              <div className="text-sm opacity-70">{language === 'ar' ? 'SMS, WhatsApp, Email' : 'SMS, WhatsApp, Email'}</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="btn-government-secondary h-auto py-4"
            onClick={() => navigate('/logs')}
          >
            <div className="text-left">
              <div className="font-semibold">{language === 'ar' ? 'سجلات النشاط' : 'Activity Logs'}</div>
              <div className="text-sm opacity-70">{language === 'ar' ? 'عرض سجل النظام' : 'View system history'}</div>
            </div>
          </Button>
        </div>
      </main>
    </div>
  );
}
