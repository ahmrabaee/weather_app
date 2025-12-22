import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Alert } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { AlertTriangle, Clock, MapPin, User, FileText, Eye, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AlertApproval() {
  const navigate = useNavigate();
  const { user, alerts, updateAlert, addLog, language } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const pendingAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'draft');

  const handleApprove = (alert: Alert) => {
    updateAlert(alert.id, { status: 'issued' });
    addLog({ role: user.role, action: `Approved ${alert.id} - ${alert.titleEn}`, alertId: alert.id });
    toast.success(language === 'en' ? 'Alert approved and issued!' : 'تم الموافقة على التنبيه وإصداره!');
    setSelectedAlert(null);
  };

  const handleReject = () => {
    if (selectedAlert && rejectReason.trim()) {
      updateAlert(selectedAlert.id, { status: 'cancelled' });
      addLog({ role: user.role, action: `Rejected ${selectedAlert.id} - Reason: ${rejectReason}`, alertId: selectedAlert.id });
      toast.error(language === 'en' ? 'Alert rejected' : 'تم رفض التنبيه');
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedAlert(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {language === 'en' ? 'Approve Alerts' : 'الموافقة على التنبيهات'}
        </h1>

        {pendingAlerts.length === 0 ? (
          <div className="gov-card text-center py-16">
            <Check className="w-16 h-16 mx-auto mb-4 text-success" />
            <h2 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'No Pending Alerts' : 'لا توجد تنبيهات معلقة'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'en' ? 'All alerts have been reviewed.' : 'تمت مراجعة جميع التنبيهات.'}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[350px_1fr] gap-6">
            {/* Pending Alerts List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                {language === 'en' ? 'Pending Review' : 'في انتظار المراجعة'} ({pendingAlerts.length})
              </h2>
              {pendingAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    'gov-card cursor-pointer transition-all hover:shadow-md',
                    selectedAlert?.id === alert.id && 'ring-2 ring-primary bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
                      alert.level === 'yellow' && 'bg-alert-yellow',
                      alert.level === 'orange' && 'bg-alert-orange',
                      alert.level === 'red' && 'bg-alert-red'
                    )} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {language === 'en' ? alert.titleEn : alert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" />
                        {alert.createdBy}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(alert.createdAt), 'dd MMM, HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Details Panel */}
            <div className="gov-card">
              {selectedAlert ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {language === 'en' ? selectedAlert.titleEn : selectedAlert.title}
                      </h2>
                      <p className="text-muted-foreground mt-1">ID: {selectedAlert.id}</p>
                    </div>
                    <AlertLevelBadge level={selectedAlert.level} size="lg" />
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      {language === 'en' ? 'Description' : 'الوصف'}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      {language === 'en' ? selectedAlert.technicalDescEn : selectedAlert.technicalDescAr}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === 'en' ? 'Hazard Type' : 'نوع الخطر'}
                      </p>
                      <p className="font-semibold capitalize">{selectedAlert.hazardType}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === 'en' ? 'Sent By' : 'أرسل بواسطة'}
                      </p>
                      <p className="font-semibold">{selectedAlert.createdBy}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {language === 'en' ? 'Valid From' : 'صالح من'}
                      </p>
                      <p className="font-semibold">{format(new Date(selectedAlert.validFrom), 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {language === 'en' ? 'Valid To' : 'صالح حتى'}
                      </p>
                      <p className="font-semibold">{format(new Date(selectedAlert.validTo), 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>

                  {/* Affected Areas */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4" />
                      {language === 'en' ? 'Affected Areas' : 'المناطق المتأثرة'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.affectedAreas.map((area) => (
                        <span key={area} className="px-3 py-1 bg-muted rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Public Message Preview */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4" />
                      {language === 'en' ? 'Public Message Preview' : 'معاينة الرسالة العامة'}
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="font-semibold mb-2">
                        {language === 'en' ? selectedAlert.titleEn : selectedAlert.title}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {language === 'en' ? selectedAlert.publicAdviceEn : selectedAlert.publicAdviceAr}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => setRejectModalOpen(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Reject' : 'رفض'}
                    </Button>
                    <Button
                      className="flex-1 btn-gov-primary"
                      onClick={() => handleApprove(selectedAlert)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Approve & Issue' : 'موافقة وإصدار'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">
                    {language === 'en' ? 'Select an Alert' : 'اختر تنبيه'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'Click on an alert from the list to review its details.' : 'انقر على تنبيه من القائمة لمراجعة تفاصيله.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Reject Alert' : 'رفض التنبيه'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {language === 'en' ? 'Reason for rejection' : 'سبب الرفض'}
            </label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={language === 'en' ? 'Please provide a reason...' : 'يرجى تقديم سبب...'}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              {language === 'en' ? 'Confirm Rejection' : 'تأكيد الرفض'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
