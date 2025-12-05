import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, TrendingUp, Clock, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types/alert';

// Mock data
const mockAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    title: 'فيضانات محتملة في المناطق الشمالية',
    titleEn: 'Potential Flooding in Northern Areas',
    hazardType: 'flood',
    level: 'orange',
    issueTime: '2024-01-15T08:00:00',
    validFrom: '2024-01-15T12:00:00',
    validTo: '2024-01-16T18:00:00',
    affectedAreas: ['نابلس', 'جنين', 'طوباس'],
    technicalDescAr: 'متوقع هطول أمطار غزيرة قد تؤدي إلى فيضانات في المناطق المنخفضة',
    technicalDescEn: 'Heavy rainfall expected that may lead to flooding in low-lying areas',
    publicAdviceAr: 'تجنب المناطق المنخفضة والوديان',
    publicAdviceEn: 'Avoid low-lying areas and valleys',
    sectorRecommendations: {
      civilDefense: 'تجهيز فرق الإنقاذ وتفعيل خطط الطوارئ',
      water: 'مراقبة منسوب المياه في السدود والخزانات',
    },
    status: 'issued',
    sectorResponses: [],
    createdBy: 'الأرصاد الجوية',
    createdAt: '2024-01-15T08:00:00',
  },
  {
    id: 'ALERT-002',
    title: 'موجة حر شديدة متوقعة',
    titleEn: 'Severe Heatwave Expected',
    hazardType: 'heatwave',
    level: 'red',
    issueTime: '2024-01-15T09:00:00',
    validFrom: '2024-01-16T10:00:00',
    validTo: '2024-01-19T20:00:00',
    affectedAreas: ['غزة', 'خان يونس', 'رفح'],
    technicalDescAr: 'درجات حرارة قياسية متوقعة تتجاوز 42 درجة مئوية',
    technicalDescEn: 'Record temperatures expected exceeding 42°C',
    publicAdviceAr: 'تجنب التعرض لأشعة الشمس المباشرة وشرب كميات كافية من المياه',
    publicAdviceEn: 'Avoid direct sun exposure and drink plenty of water',
    sectorRecommendations: {
      civilDefense: 'فتح مراكز الإيواء المكيفة',
      agriculture: 'زيادة الري وحماية المحاصيل',
    },
    status: 'issued',
    sectorResponses: [],
    createdBy: 'الأرصاد الجوية',
    createdAt: '2024-01-15T09:00:00',
  },
];

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const stats = {
    activeAlerts: mockAlerts.length,
    yellowAlerts: mockAlerts.filter(a => a.level === 'yellow').length,
    orangeAlerts: mockAlerts.filter(a => a.level === 'orange').length,
    redAlerts: mockAlerts.filter(a => a.level === 'red').length,
    avgResponseTime: '2.5h',
  };

  const getLevelBadge = (level: string) => {
    const config = {
      yellow: 'alert-yellow',
      orange: 'alert-orange',
      red: 'alert-red',
    };
    return config[level as keyof typeof config] || 'bg-muted';
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: 'bg-status-pending text-white',
      issued: 'bg-status-completed text-white',
      cancelled: 'bg-muted text-muted-foreground',
    };
    return config[status as keyof typeof config] || 'bg-muted';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Title & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/logs')}
              variant="outline"
              size="lg"
            >
              السجلات
            </Button>
            <Button
              onClick={() => navigate('/public-alert')}
              variant="outline"
              size="lg"
            >
              العرض العام
            </Button>
            <Button
              onClick={() => navigate('/create-alert')}
              className="gradient-primary text-white gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              {t('dashboard.createAlert')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.activeAlerts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{stats.activeAlerts}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card alert-yellow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t('alert.yellow')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{stats.yellowAlerts}</span>
            </CardContent>
          </Card>

          <Card className="shadow-card alert-orange">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t('alert.orange')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{stats.orangeAlerts}</span>
            </CardContent>
          </Card>

          <Card className="shadow-card alert-red">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t('alert.red')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{stats.redAlerts}</span>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.avgResponse')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{stats.avgResponseTime}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('dashboard.filterAll')}
              </CardTitle>
              <div className="flex gap-2">
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">{t('dashboard.filterAll')}</SelectItem>
                    <SelectItem value="yellow">{t('alert.yellow')}</SelectItem>
                    <SelectItem value="orange">{t('alert.orange')}</SelectItem>
                    <SelectItem value="red">{t('alert.red')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="active">{t('dashboard.filterActive')}</SelectItem>
                    <SelectItem value="past">{t('dashboard.filterPast')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-card transition-shadow cursor-pointer"
                  onClick={() => navigate(`/create-alert?id=${alert.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {alert.id}
                        </Badge>
                        <Badge className={getLevelBadge(alert.level)}>
                          {t(`alert.${alert.level}`)}
                        </Badge>
                        <Badge className={getStatusBadge(alert.status)}>
                          {t(`status.${alert.status}`)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>📍 {alert.affectedAreas.join(', ')}</span>
                        <span>•</span>
                        <span>⏰ {new Date(alert.validTo).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('common.edit')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
