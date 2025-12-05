import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/ews/Header';
import { Sidebar } from '@/components/ews/Sidebar';
import { AlertBadge } from '@/components/ews/AlertBadge';
import { StatusBadge } from '@/components/ews/StatusBadge';
import { MapPlaceholder } from '@/components/ews/MapPlaceholder';
import { useEWS, Alert, SectorStatus, roleLabels, statusLabels } from '@/contexts/EWSContext';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

export default function SectorDashboard() {
  const { language, currentRole, alerts, setAlerts, addLog } = useEWS();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [newStatus, setNewStatus] = useState<SectorStatus>('pending');
  const [notes, setNotes] = useState('');

  const dateLocale = language === 'ar' ? ar : enUS;
  const activeAlerts = alerts.filter(a => a.status === 'issued');

  const getCurrentSectorStatus = (alert: Alert): SectorStatus => {
    const response = alert.sectorResponses.find(r => r.role === currentRole);
    return response?.status || 'pending';
  };

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setNewStatus(getCurrentSectorStatus(alert));
    setNotes('');
  };

  const handleSaveStatus = () => {
    if (!selectedAlert || !currentRole) return;

    setAlerts(prev => prev.map(alert => {
      if (alert.id !== selectedAlert.id) return alert;
      
      const existingIndex = alert.sectorResponses.findIndex(r => r.role === currentRole);
      const newResponse = {
        role: currentRole,
        status: newStatus,
        notes,
        updatedAt: new Date(),
      };

      const updatedResponses = existingIndex >= 0
        ? alert.sectorResponses.map((r, i) => i === existingIndex ? newResponse : r)
        : [...alert.sectorResponses, newResponse];

      return { ...alert, sectorResponses: updatedResponses };
    }));

    addLog(currentRole, `تم تحديث حالة الإنذار ${selectedAlert.id} إلى ${statusLabels[newStatus].ar}`);
    
    toast.success(
      language === 'ar' ? 'تم حفظ الحالة بنجاح' : 'Status saved successfully'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Alert List */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {language === 'ar' ? 'الإنذارات النشطة' : 'Active Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-auto max-h-[calc(100vh-14rem)]">
                {activeAlerts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'ar' ? 'لا توجد إنذارات نشطة' : 'No active alerts'}</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {activeAlerts.map((alert) => {
                      const status = getCurrentSectorStatus(alert);
                      return (
                        <button
                          key={alert.id}
                          onClick={() => handleSelectAlert(alert)}
                          className={`w-full p-4 text-right hover:bg-muted/50 transition-colors ${
                            selectedAlert?.id === alert.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {language === 'ar' ? alert.title : alert.titleEn}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {format(alert.validTo, 'PPp', { locale: dateLocale })}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <AlertBadge level={alert.level} size="sm" />
                              <StatusBadge status={status} size="sm" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alert Details */}
            <div className="space-y-4 overflow-auto max-h-[calc(100vh-8rem)]">
              {selectedAlert ? (
                <>
                  {/* Alert Info */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {language === 'ar' ? selectedAlert.title : selectedAlert.titleEn}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedAlert.id}
                          </p>
                        </div>
                        <AlertBadge level={selectedAlert.level} size="lg" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          {language === 'ar' ? 'الوصف' : 'Description'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? selectedAlert.descriptionAr : selectedAlert.descriptionEn}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'ar' ? 'صالح من:' : 'Valid From:'}
                          </span>
                          <p className="font-medium">{format(selectedAlert.validFrom, 'PPp', { locale: dateLocale })}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'ar' ? 'صالح حتى:' : 'Valid Until:'}
                          </span>
                          <p className="font-medium">{format(selectedAlert.validTo, 'PPp', { locale: dateLocale })}</p>
                        </div>
                      </div>

                      <MapPlaceholder
                        affectedAreas={selectedAlert.affectedAreas}
                        level={selectedAlert.level}
                        className="h-48"
                      />
                    </CardContent>
                  </Card>

                  {/* My Recommendations */}
                  {currentRole && selectedAlert.sectorRecommendations[currentRole] && (
                    <Card className="border-primary">
                      <CardHeader className="bg-primary/5">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          {language === 'ar' ? 'توصياتي' : 'My Recommendations'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm whitespace-pre-line">
                          {selectedAlert.sectorRecommendations[currentRole]}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Other Sectors Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {language === 'ar' ? 'حالة القطاعات الأخرى' : 'Other Sectors Status'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedAlert.sectorResponses
                          .filter(r => r.role !== currentRole)
                          .map((response) => (
                            <div key={response.role} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">
                                {language === 'ar' ? roleLabels[response.role].ar : roleLabels[response.role].en}
                              </span>
                              <StatusBadge status={response.status} size="sm" />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Update Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {language === 'ar' ? 'تحديث حالتي' : 'Update My Status'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>{language === 'ar' ? 'الحالة الجديدة' : 'New Status'}</Label>
                        <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SectorStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                            <SelectItem value="acknowledged">{language === 'ar' ? 'تم الإقرار' : 'Acknowledged'}</SelectItem>
                            <SelectItem value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                            <SelectItem value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'}</Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder={language === 'ar' ? 'أضف ملاحظاتك...' : 'Add your notes...'}
                        />
                      </div>
                      <Button onClick={handleSaveStatus} className="w-full">
                        {language === 'ar' ? 'حفظ الحالة' : 'Save Status'}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'ar' ? 'اختر إنذاراً لعرض التفاصيل' : 'Select an alert to view details'}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
