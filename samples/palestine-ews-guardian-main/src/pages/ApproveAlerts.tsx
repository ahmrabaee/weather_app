import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { AlertBadge } from '@/components/AlertBadge';
import { PalestineMap } from '@/components/PalestineMap';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert } from '@/types/alert';
import { Clock, User, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ApproveAlerts() {
  const { alerts, updateAlert, language, addLog, user } = useApp();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  const handleApprove = () => {
    if (!selectedAlert) return;
    
    updateAlert(selectedAlert.id, { status: 'issued', issueTime: new Date().toISOString() });
    
    addLog({
      sector: user?.name || 'Admin',
      action: 'approved',
      alertId: selectedAlert.id,
      details: `Approved alert: ${selectedAlert.title}`,
    });

    toast.success(language === 'ar' ? 'تمت الموافقة على التنبيه' : 'Alert approved and issued');
    setSelectedAlertId(null);
  };

  const handleReject = () => {
    if (!selectedAlert || !rejectReason) return;
    
    updateAlert(selectedAlert.id, { status: 'cancelled' });
    
    addLog({
      sector: user?.name || 'Admin',
      action: 'rejected',
      alertId: selectedAlert.id,
      details: `Rejected alert: ${selectedAlert.title}. Reason: ${rejectReason}`,
    });

    toast.success(language === 'ar' ? 'تم رفض التنبيه' : 'Alert rejected');
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelectedAlertId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="page-title animate-fade-in">
          {language === 'ar' ? 'الموافقة على التنبيهات' : 'Approve Alerts'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              {language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval'}
              <span className="ml-2 px-2 py-0.5 bg-warning/20 text-warning rounded-full text-sm">
                {pendingAlerts.length}
              </span>
            </h2>

            {pendingAlerts.length === 0 ? (
              <div className="card-government p-8 text-center text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
                <p>{language === 'ar' ? 'لا توجد تنبيهات معلقة' : 'No pending alerts'}</p>
              </div>
            ) : (
              pendingAlerts.map((alert, idx) => (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={cn(
                    'w-full text-left card-government p-4 transition-all hover-lift animate-fade-in',
                    selectedAlertId === alert.id
                      ? 'ring-2 ring-primary border-l-[6px] border-l-primary bg-primary/5'
                      : ''
                  )}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      alert.level === 'yellow' ? 'bg-alert-yellow' :
                      alert.level === 'orange' ? 'bg-alert-orange' :
                      'bg-alert-red'
                    )} />
                    <span className="text-sm font-medium text-muted-foreground uppercase">
                      {alert.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {language === 'ar' ? alert.titleAr : alert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <User className="w-3 h-3" />
                    {alert.createdBy}
                    <span className="mx-1">•</span>
                    {format(new Date(alert.createdAt), 'HH:mm')}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Alert Details */}
          <div className="lg:col-span-2">
            {!selectedAlert ? (
              <div className="card-government p-12 text-center text-muted-foreground h-full flex items-center justify-center">
                <div>
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    {language === 'ar' 
                      ? 'اختر تنبيهاً للمراجعة' 
                      : 'Select an alert to review'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="card-government card-accent-left p-6 animate-fade-in">
                {/* Header */}
                <div className="mb-6">
                  <AlertBadge level={selectedAlert.level} size="lg" className="mb-3" />
                  <h2 className="text-2xl font-bold text-foreground">
                    {language === 'ar' ? selectedAlert.titleAr : selectedAlert.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar' ? selectedAlert.technicalDescAr : selectedAlert.technicalDescEn}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === 'ar' ? 'نوع الخطر' : 'Hazard Type'}
                    </div>
                    <div className="font-semibold capitalize">{selectedAlert.hazardType}</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === 'ar' ? 'المستوى' : 'Severity Level'}
                    </div>
                    <div className="font-semibold uppercase">{selectedAlert.level}</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === 'ar' ? 'من' : 'Valid From'}
                    </div>
                    <div className="font-semibold">
                      {format(new Date(selectedAlert.validFrom), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === 'ar' ? 'حتى' : 'Valid To'}
                    </div>
                    <div className="font-semibold">
                      {format(new Date(selectedAlert.validTo), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                </div>

                {/* Affected Areas */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {language === 'ar' ? 'المناطق المتأثرة' : 'Affected Areas'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedAlert.affectedAreas.map(area => (
                      <span key={area} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Public Message Preview */}
                <div className="mb-6 p-4 border-2 border-dashed border-primary/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'معاينة الرسالة العامة' : 'Public Message Preview'}
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {language === 'ar' ? selectedAlert.publicAdviceAr : selectedAlert.publicAdviceEn}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setRejectDialogOpen(true)}
                    className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'رفض' : 'Reject'}
                  </Button>
                  <Button onClick={handleApprove} className="btn-government bg-success hover:bg-success/90">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'موافقة' : 'Approve'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="input-government min-h-[100px]"
            placeholder={language === 'ar' ? 'أدخل سبب الرفض...' : 'Enter rejection reason...'}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleReject}
              disabled={!rejectReason}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {language === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
