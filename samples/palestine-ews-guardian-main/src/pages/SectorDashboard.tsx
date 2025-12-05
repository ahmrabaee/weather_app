import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { AlertBadge } from '@/components/AlertBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { PalestineMap } from '@/components/PalestineMap';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, SectorStatus, SECTORS } from '@/types/alert';
import { AlertTriangle, Clock, MapPin, CheckCircle, Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SectorDashboard() {
  const { alerts, updateAlert, user, language, addLog } = useApp();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<SectorStatus>('pending');
  const [notes, setNotes] = useState('');

  const sectorAlerts = alerts.filter(a => 
    (a.status === 'issued' || a.status === 'pending') &&
    a.sectorRecommendations[user?.role || '']
  );

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  const getSectorLabel = () => {
    if (!user) return '';
    const sector = SECTORS.find(s => s.value === user.role);
    return language === 'ar' ? sector?.labelAr : sector?.label;
  };

  const getCurrentSectorResponse = () => {
    if (!selectedAlert || !user) return null;
    return selectedAlert.sectorResponses.find(r => r.sectorName === user.role);
  };

  const handleSaveStatus = () => {
    if (!selectedAlert || !user) return;

    const updatedResponses = selectedAlert.sectorResponses.filter(
      r => r.sectorName !== user.role
    );
    
    updatedResponses.push({
      sectorName: user.role,
      status: statusUpdate,
      notes,
      timestamp: new Date().toISOString(),
    });

    updateAlert(selectedAlert.id, { sectorResponses: updatedResponses });
    
    addLog({
      sector: getSectorLabel() || user.role,
      action: 'status_update',
      alertId: selectedAlert.id,
      details: `Updated status to "${statusUpdate}" for ${selectedAlert.title}`,
    });

    toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="page-title animate-fade-in">
          {getSectorLabel()} {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts'}
            </h2>

            {sectorAlerts.length === 0 ? (
              <div className="card-government p-8 text-center text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'ar' ? 'لا توجد تنبيهات حالياً' : 'No active alerts for your sector'}</p>
              </div>
            ) : (
              sectorAlerts.map((alert, idx) => {
                const sectorResponse = alert.sectorResponses.find(r => r.sectorName === user?.role);
                return (
                  <button
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlertId(alert.id);
                      const response = alert.sectorResponses.find(r => r.sectorName === user?.role);
                      setStatusUpdate(response?.status || 'pending');
                      setNotes(response?.notes || '');
                    }}
                    className={cn(
                      'w-full text-left card-government p-4 transition-all hover-lift animate-fade-in',
                      selectedAlertId === alert.id
                        ? 'ring-2 ring-primary border-l-[6px] border-l-primary bg-primary/5'
                        : ''
                    )}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <AlertBadge level={alert.level} size="sm" />
                      {sectorResponse && (
                        <StatusBadge status={sectorResponse.status} />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {language === 'ar' ? alert.titleAr : alert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.affectedAreas.slice(0, 3).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {language === 'ar' ? 'حتى' : 'Until'} {format(new Date(alert.validTo), 'MMM dd, HH:mm')}
                    </p>
                  </button>
                );
              })
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
                      ? 'اختر تنبيهاً لعرض التفاصيل' 
                      : 'Select an alert to view details'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="card-government card-accent-left p-6 animate-fade-in">
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <AlertBadge level={selectedAlert.level} size="lg" className="mb-3" />
                    <h2 className="text-2xl font-bold text-foreground">
                      {language === 'ar' ? selectedAlert.titleAr : selectedAlert.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {language === 'ar' ? 'صدر' : 'Issued'}: {format(new Date(selectedAlert.issueTime), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Geographic Info */}
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
                    ))
                    }
                  </div>
                  <PalestineMap
                    highlightedAreas={selectedAlert.affectedAreas}
                    alertLevel={selectedAlert.level}
                    className="h-[200px]"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {language === 'ar' ? 'ماذا يحدث؟' : 'What is Happening?'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar' ? selectedAlert.technicalDescAr : selectedAlert.technicalDescEn}
                  </p>
                </div>

                {/* Sector Recommendations */}
                {user && selectedAlert.sectorRecommendations[user.role] && (
                  <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {language === 'ar' ? 'الإجراءات الموصى بها لك' : 'Recommended Actions for You'}
                    </h3>
                    <p className="text-foreground whitespace-pre-line">
                      {selectedAlert.sectorRecommendations[user.role]}
                    </p>
                  </div>
                )}

                {/* Other Sectors Status */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {language === 'ar' ? 'حالة القطاعات الأخرى' : "Other Ministries' Response"}
                  </h3>
                  <div className="space-y-2">
                    {SECTORS.filter(s => s.value !== 'meteorology' && s.value !== user?.role).map(sector => {
                      const response = selectedAlert.sectorResponses.find(r => r.sectorName === sector.value);
                      return (
                        <div key={sector.value} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium">
                            {language === 'ar' ? sector.labelAr : sector.label}
                          </span>
                          <StatusBadge status={response?.status || 'pending'} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Update Status */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    {language === 'ar' ? 'تحديث حالتك' : 'Update Your Status'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </label>
                      <Select value={statusUpdate} onValueChange={(v) => setStatusUpdate(v as SectorStatus)}>
                        <SelectTrigger className="input-government">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border shadow-xl z-50">
                          <SelectItem value="pending">
                            {language === 'ar' ? 'معلق' : 'Pending'}
                          </SelectItem>
                          <SelectItem value="acknowledged">
                            {language === 'ar' ? 'تم الإقرار' : 'Acknowledged'}
                          </SelectItem>
                          <SelectItem value="in-progress">
                            {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}
                          </SelectItem>
                          <SelectItem value="completed">
                            {language === 'ar' ? 'مكتمل' : 'Completed'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'ملاحظات' : 'Notes/Comments'}
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input-government"
                        placeholder={language === 'ar' ? 'أضف ملاحظات...' : 'Add notes...'}
                      />
                    </div>

                    <Button onClick={handleSaveStatus} className="btn-government">
                      <Save className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'حفظ الحالة' : 'Save Status'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
