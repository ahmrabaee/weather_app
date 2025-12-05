import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { useApp, Alert } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Clock,
  Plus,
  Eye,
  Edit,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

type FilterType = 'all' | 'active' | 'past';

export default function AdminDashboard() {
  const { alerts, language } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  const stats = useMemo(() => {
    const now = new Date();
    const active = alerts.filter(a => a.status === 'issued' && new Date(a.validTo) > now);
    const yellow = active.filter(a => a.level === 'yellow').length;
    const orange = active.filter(a => a.level === 'orange').length;
    const red = active.filter(a => a.level === 'red').length;
    
    return {
      total: active.length,
      yellow,
      orange,
      red,
      avgResponse: '2.5h',
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case 'active':
        return alerts.filter(a => a.status === 'issued' && new Date(a.validTo) > now);
      case 'past':
        return alerts.filter(a => new Date(a.validTo) <= now);
      default:
        return alerts;
    }
  }, [alerts, filter]);

  return (
    <div className="page-container">
      <Header />
      
      <main className="page-content">
        <h1 className="page-title animate-fade-in">
          {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={AlertTriangle}
            value={stats.total}
            label={language === 'en' ? 'Active Alerts' : 'التنبيهات النشطة'}
            className="animate-fade-in"
          />
          <div className="gov-card-accent border-l-alert-yellow flex flex-col items-center justify-center p-6 animate-fade-in">
            <span className="alert-badge-yellow mb-2">{stats.yellow}</span>
            <span className="stat-label">{language === 'en' ? 'Yellow' : 'أصفر'}</span>
          </div>
          <div className="gov-card-accent border-l-alert-orange flex flex-col items-center justify-center p-6 animate-fade-in">
            <span className="alert-badge-orange mb-2">{stats.orange}</span>
            <span className="stat-label">{language === 'en' ? 'Orange' : 'برتقالي'}</span>
          </div>
          <div className="gov-card-accent border-l-alert-red flex flex-col items-center justify-center p-6 animate-fade-in">
            <span className="alert-badge-red mb-2">{stats.red}</span>
            <span className="stat-label">{language === 'en' ? 'Red' : 'أحمر'}</span>
          </div>
          <StatCard
            icon={Clock}
            value={stats.avgResponse}
            label={language === 'en' ? 'Avg Response' : 'متوسط الاستجابة'}
            className="animate-fade-in col-span-2 sm:col-span-1"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'active', 'past'] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? 'btn-gov-primary' : 'btn-gov-secondary'}
              >
                {f === 'all' && (language === 'en' ? 'All' : 'الكل')}
                {f === 'active' && (language === 'en' ? 'Active' : 'نشط')}
                {f === 'past' && (language === 'en' ? 'Past' : 'سابق')}
              </Button>
            ))}
          </div>

          {/* Create Button */}
          <Button
            onClick={() => navigate('/create-alert')}
            className="btn-gov-primary"
          >
            <Plus className="w-5 h-5" />
            {language === 'en' ? 'Create New Alert' : 'إنشاء تنبيه جديد'}
          </Button>
        </div>

        {/* Alerts Table */}
        <div className="gov-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Alert ID' : 'رقم التنبيه'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Title' : 'العنوان'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Level' : 'المستوى'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground hidden md:table-cell">
                    {language === 'en' ? 'Areas' : 'المناطق'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground hidden lg:table-cell">
                    {language === 'en' ? 'Valid Until' : 'صالح حتى'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Status' : 'الحالة'}
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">
                    {language === 'en' ? 'Actions' : 'الإجراءات'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="p-4">
                      <code className="text-sm text-muted-foreground font-mono">
                        {alert.id}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-foreground">
                        {language === 'en' ? alert.titleEn : alert.title}
                      </span>
                    </td>
                    <td className="p-4">
                      <AlertLevelBadge level={alert.level} size="sm" />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                        {alert.affectedAreas.slice(0, 2).join(', ')}
                        {alert.affectedAreas.length > 2 && '...'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(alert.validTo), 'dd MMM yyyy, HH:mm')}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/public-alert/${alert.id}`)}
                          className="hover:bg-info/10 hover:text-info"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/edit-alert/${alert.id}`)}
                          className="hover:bg-warning/10 hover:text-warning"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAlerts.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'en' ? 'No alerts found' : 'لا توجد تنبيهات'}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
