import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, SectorStatus } from '@/types/alert';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Mock alerts
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
    technicalDescAr: 'متوقع هطول أمطار غزيرة قد تؤدي إلى فيضانات في المناطق المنخفضة. يُتوقع أن تصل كميات الأمطار إلى 50-80 ملم خلال 24 ساعة.',
    technicalDescEn: 'Heavy rainfall expected that may lead to flooding in low-lying areas. Rainfall amounts are expected to reach 50-80mm within 24 hours.',
    publicAdviceAr: '• تجنب المناطق المنخفضة والوديان\n• لا تحاول عبور الطرق المغمورة\n• ابقَ في مكان آمن حتى انتهاء التحذير',
    publicAdviceEn: '• Avoid low-lying areas and valleys\n• Do not attempt to cross flooded roads\n• Stay in a safe location until warning ends',
    sectorRecommendations: {
      civilDefense: 'تجهيز فرق الإنقاذ وتفعيل خطط الطوارئ. نشر فرق المراقبة في المناطق المعرضة للخطر.',
      agriculture: 'حماية المحاصيل والماشية. تأمين البيوت البلاستيكية والمعدات الزراعية.',
      water: 'مراقبة منسوب المياه في السدود والخزانات. فتح قنوات التصريف.',
      environment: 'مراقبة جودة المياه ومنع التلوث. الاستعداد للتعامل مع النفايات المحتملة.',
    },
    status: 'issued',
    sectorResponses: [
      { role: 'civilDefense', status: 'inProgress', updatedAt: '2024-01-15T10:30:00' },
      { role: 'water', status: 'acknowledged', updatedAt: '2024-01-15T09:15:00' },
    ],
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
    technicalDescAr: 'درجات حرارة قياسية متوقعة تتجاوز 42 درجة مئوية مع رطوبة عالية تصل إلى 70%.',
    technicalDescEn: 'Record temperatures expected exceeding 42°C with high humidity reaching 70%.',
    publicAdviceAr: '• تجنب التعرض لأشعة الشمس المباشرة\n• شرب كميات كافية من المياه\n• البقاء في أماكن مكيفة قدر الإمكان',
    publicAdviceEn: '• Avoid direct sun exposure\n• Drink plenty of water\n• Stay in air-conditioned spaces when possible',
    sectorRecommendations: {
      civilDefense: 'فتح مراكز الإيواء المكيفة للمواطنين. توزيع المياه في الأماكن العامة.',
      agriculture: 'زيادة معدلات الري وحماية المحاصيل الحساسة. توفير الظل للماشية.',
    },
    status: 'issued',
    sectorResponses: [],
    createdBy: 'الأرصاد الجوية',
    createdAt: '2024-01-15T09:00:00',
  },
];

const SectorDashboard = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(mockAlerts[0]);
  const [myStatus, setMyStatus] = useState<SectorStatus>('pending');
  const [notes, setNotes] = useState('');

  const handleSaveStatus = () => {
    toast.success('تم حفظ الحالة بنجاح');
  };

  const getLevelBadge = (level: string) => {
    const config = {
      yellow: 'alert-yellow',
      orange: 'alert-orange',
      red: 'alert-red',
    };
    return config[level as keyof typeof config] || 'bg-muted';
  };

  const getStatusIcon = (status: SectorStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-status-completed" />;
      case 'inProgress':
        return <Clock className="h-4 w-4 text-status-in-progress" />;
      case 'acknowledged':
        return <AlertCircle className="h-4 w-4 text-status-acknowledged" />;
      default:
        return <Clock className="h-4 w-4 text-status-pending" />;
    }
  };

  const getMyRecommendations = (alert: Alert) => {
    const roleMap = {
      civilDefense: alert.sectorRecommendations.civilDefense,
      agriculture: alert.sectorRecommendations.agriculture,
      water: alert.sectorRecommendations.water,
      environment: alert.sectorRecommendations.environment,
      security: alert.sectorRecommendations.security,
    };
    return roleMap[role as keyof typeof roleMap] || 'لا توجد توصيات محددة لهذا القطاع.';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('sector.myAlerts')}</h1>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel - Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>{t('dashboard.activeAlerts')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAlert?.id === alert.id
                        ? 'border-primary bg-primary/5 shadow-card'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {alert.id}
                        </Badge>
                        <Badge className={`${getLevelBadge(alert.level)} text-xs`}>
                          {t(`alert.${alert.level}`)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.validTo).toLocaleDateString('ar')}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('sector.viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Alert Details */}
          <div className="lg:col-span-3 space-y-6">
            {selectedAlert ? (
              <>
                {/* Alert Details */}
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getLevelBadge(selectedAlert.level)} text-lg px-4 py-2`}>
                        {t(`alert.${selectedAlert.level}`)}
                      </Badge>
                      <div>
                        <CardTitle className="text-2xl">{selectedAlert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(`hazard.${selectedAlert.hazardType}`)} • {selectedAlert.id}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">{t('public.when')}</span>
                        <p className="text-muted-foreground">
                          {new Date(selectedAlert.validFrom).toLocaleString('ar')} - {new Date(selectedAlert.validTo).toLocaleString('ar')}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">{t('public.where')}</span>
                        <p className="text-muted-foreground">
                          {selectedAlert.affectedAreas.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">{t('public.what')}</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedAlert.technicalDescAr}
                      </p>
                    </div>

                    <MapPlaceholder
                      level={selectedAlert.level}
                      areas={selectedAlert.affectedAreas}
                      className="min-h-[250px]"
                    />
                  </CardContent>
                </Card>

                {/* My Recommendations */}
                <Card className="shadow-card border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('sector.myRecommendations')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="whitespace-pre-line">{getMyRecommendations(selectedAlert)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Sectors Status */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>{t('sector.otherSectors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAlert.sectorResponses.map((response) => (
                        <div
                          key={response.role}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(response.status)}
                            <span className="font-medium">{t(`role.${response.role}`)}</span>
                          </div>
                          <Badge variant="outline">{t(`status.${response.status}`)}</Badge>
                        </div>
                      ))}
                      {selectedAlert.sectorResponses.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          {t('common.noData')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Update My Status */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>{t('sector.updateStatus')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">{t('sector.updateStatus')}</Label>
                      <Select value={myStatus} onValueChange={(value) => setMyStatus(value as SectorStatus)}>
                        <SelectTrigger id="status" className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="pending">{t('status.pending')}</SelectItem>
                          <SelectItem value="acknowledged">{t('status.acknowledged')}</SelectItem>
                          <SelectItem value="inProgress">{t('status.inProgress')}</SelectItem>
                          <SelectItem value="completed">{t('status.completed')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">{t('sector.notes')}</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أضف أي ملاحظات أو تعليقات..."
                        rows={4}
                        className="bg-background"
                      />
                    </div>

                    <Button
                      onClick={handleSaveStatus}
                      className="w-full gradient-primary text-white"
                      size="lg"
                    >
                      {t('sector.saveStatus')}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center text-muted-foreground">
                  {t('common.noData')}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorDashboard;
