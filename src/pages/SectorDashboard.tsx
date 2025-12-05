import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { PalestineMap } from '@/components/PalestineMap';
import { useApp, Alert, SectorStatus, ROLE_NAMES } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle, Calendar, MapPin, CheckCircle, Clock, Users } from 'lucide-react';

const STATUS_OPTIONS: { value: SectorStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function SectorDashboard() {
  const { alerts, updateAlert, user, language, addLog } = useApp();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<SectorStatus>('pending');
  const [notes, setNotes] = useState('');

  const activeAlerts = useMemo(() => {
    const now = new Date();
    return alerts.filter(
      (a) => a.status === 'issued' && new Date(a.validTo) > now
    );
  }, [alerts]);

  const selectedAlert = useMemo(() => {
    return alerts.find((a) => a.id === selectedAlertId);
  }, [alerts, selectedAlertId]);

  const currentSectorResponse = useMemo(() => {
    if (!selectedAlert || !user) return null;
    return selectedAlert.sectorResponses.find(
      (r) => r.sectorName === user.role
    );
  }, [selectedAlert, user]);

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    const alert = alerts.find((a) => a.id === alertId);
    if (alert && user) {
      const response = alert.sectorResponses.find(
        (r) => r.sectorName === user.role
      );
      setStatusUpdate(response?.status || 'pending');
      setNotes(response?.notes || '');
    }
  };

  const handleSaveStatus = () => {
    if (!selectedAlert || !user) return;

    const existingResponses = selectedAlert.sectorResponses.filter(
      (r) => r.sectorName !== user.role
    );

    const newResponse = {
      sectorName: user.role,
      status: statusUpdate,
      notes,
      timestamp: new Date().toISOString(),
    };

    updateAlert(selectedAlert.id, {
      sectorResponses: [...existingResponses, newResponse],
    });

    addLog({
      role: user.role,
      action: `Updated status to "${statusUpdate}" for ${selectedAlert.id}`,
      alertId: selectedAlert.id,
    });

    toast.success('Status updated successfully');
  };

  const getSectorRecommendation = (alert: Alert) => {
    if (!user) return '';
    return alert.sectorRecommendations[user.role] || 'No specific recommendations for your sector.';
  };

  return (
    <div className="page-container">
      <Header />

      <main className="page-content">
        <h1 className="page-title animate-fade-in">
          {user ? ROLE_NAMES[user.role] : ''}{' '}
          {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
        </h1>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Alerts List - Left Column */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-alert-orange" />
              {language === 'en' ? 'Active Alerts' : 'التنبيهات النشطة'}
              <span className="ml-auto text-sm text-muted-foreground">
                ({activeAlerts.length})
              </span>
            </h2>

            <div className="space-y-3">
              {activeAlerts.map((alert) => {
                const response = alert.sectorResponses.find(
                  (r) => r.sectorName === user?.role
                );
                return (
                  <button
                    key={alert.id}
                    onClick={() => handleSelectAlert(alert.id)}
                    className={`w-full text-start gov-card p-4 transition-all hover:scale-[1.02] ${selectedAlertId === alert.id
                        ? 'ring-2 ring-primary border-l-[6px] border-l-primary bg-primary/5'
                        : ''
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <AlertLevelBadge level={alert.level} size="sm" />
                      {response && (
                        <StatusBadge status={response.status} />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {language === 'en' ? alert.titleEn : alert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.affectedAreas.slice(0, 3).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Until: {format(new Date(alert.validTo), 'dd MMM, HH:mm')}
                    </p>
                  </button>
                );
              })}

              {activeAlerts.length === 0 && (
                <div className="gov-card p-8 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'No active alerts' : 'لا توجد تنبيهات نشطة'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Details - Right Column */}
          <div className="lg:col-span-8">
            {selectedAlert ? (
              <div className="gov-card animate-fade-in">
                {/* Alert Header */}
                <div className="border-b pb-4 mb-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {language === 'en'
                          ? selectedAlert.titleEn
                          : selectedAlert.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Issued:{' '}
                          {format(
                            new Date(selectedAlert.issueTime),
                            'dd MMM yyyy, HH:mm'
                          )}
                        </span>
                        <span>•</span>
                        <span>By: {selectedAlert.createdBy}</span>
                      </div>
                    </div>
                    <AlertLevelBadge level={selectedAlert.level} size="lg" />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Valid:{' '}
                        {format(new Date(selectedAlert.validFrom), 'dd MMM HH:mm')}{' '}
                        - {format(new Date(selectedAlert.validTo), 'dd MMM HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Affected Areas with Map */}
                <div className="mb-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    {language === 'en' ? 'Affected Areas' : 'المناطق المتأثرة'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <PalestineMap
                      affectedAreas={selectedAlert.affectedAreas}
                      level={selectedAlert.level}
                      className="h-[200px]"
                    />
                    <div className="flex flex-wrap gap-2 content-start">
                      {selectedAlert.affectedAreas.map((area) => (
                        <span
                          key={area}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">
                    {language === 'en' ? 'What is Happening?' : 'ماذا يحدث؟'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'en'
                      ? selectedAlert.technicalDescEn
                      : selectedAlert.technicalDescAr}
                  </p>
                </div>

                {/* Sector Recommendations */}
                <div className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <h3 className="font-semibold text-primary mb-3">
                    {language === 'en'
                      ? `Recommended Actions for ${user ? ROLE_NAMES[user.role] : 'Your Sector'}`
                      : 'الإجراءات الموصى بها'}
                  </h3>
                  <p className="text-foreground whitespace-pre-line">
                    {getSectorRecommendation(selectedAlert)}
                  </p>
                </div>

                {/* Other Sectors Status */}
                <div className="mb-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-info" />
                    {language === 'en'
                      ? "Other Ministries' Response"
                      : 'استجابة الوزارات الأخرى'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedAlert.sectorResponses
                      .filter((r) => r.sectorName !== user?.role)
                      .map((response) => (
                        <div
                          key={response.sectorName}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <span className="font-medium">
                            {ROLE_NAMES[response.sectorName as keyof typeof ROLE_NAMES]}
                          </span>
                          <StatusBadge status={response.status} />
                        </div>
                      ))}
                    {selectedAlert.sectorResponses.filter(
                      (r) => r.sectorName !== user?.role
                    ).length === 0 && (
                        <p className="text-muted-foreground col-span-2">
                          {language === 'en'
                            ? 'No responses from other sectors yet'
                            : 'لا توجد ردود من قطاعات أخرى بعد'}
                        </p>
                      )}
                  </div>
                </div>

                {/* Update Your Status */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">
                    {language === 'en' ? 'Update Your Status' : 'تحديث حالتك'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === 'en' ? 'Status' : 'الحالة'}
                      </label>
                      <Select
                        value={statusUpdate}
                        onValueChange={(v) => setStatusUpdate(v as SectorStatus)}
                      >
                        <SelectTrigger className="gov-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium">
                        {language === 'en' ? 'Notes (Optional)' : 'ملاحظات (اختياري)'}
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={
                          language === 'en'
                            ? 'Add any notes about your response...'
                            : 'أضف أي ملاحظات حول استجابتك...'
                        }
                        className="gov-input"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveStatus}
                    className="btn-gov-primary mt-4"
                  >
                    {language === 'en' ? 'Save Status' : 'حفظ الحالة'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="gov-card p-12 text-center">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  {language === 'en'
                    ? 'Select an alert to view details'
                    : 'اختر تنبيهًا لعرض التفاصيل'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Click on any alert from the list to see its full information and update your response status.'
                    : 'انقر على أي تنبيه من القائمة لمشاهدة معلوماته الكاملة وتحديث حالة استجابتك.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
