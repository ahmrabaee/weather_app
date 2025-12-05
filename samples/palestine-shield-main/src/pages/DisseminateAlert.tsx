import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { AlertLevelBadge } from '@/components/AlertLevelBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { MessageSquare, Mail, Phone, Send, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Recipient {
  id: string;
  name: string;
  nameAr: string;
  count: number;
  selected: boolean;
}

interface DisseminationLog {
  id: string;
  channel: 'sms' | 'whatsapp' | 'email';
  recipients: string;
  count: number;
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
}

const INITIAL_RECIPIENTS: Recipient[] = [
  { id: 'ramallah', name: 'Ramallah District', nameAr: 'منطقة رام الله', count: 120000, selected: false },
  { id: 'jericho', name: 'Jericho District', nameAr: 'منطقة أريحا', count: 45000, selected: false },
  { id: 'hebron', name: 'Hebron District', nameAr: 'منطقة الخليل', count: 200000, selected: false },
  { id: 'nablus', name: 'Nablus District', nameAr: 'منطقة نابلس', count: 150000, selected: false },
  { id: 'bethlehem', name: 'Bethlehem District', nameAr: 'منطقة بيت لحم', count: 80000, selected: false },
  { id: 'emergency', name: 'Emergency Response Teams', nameAr: 'فرق الاستجابة للطوارئ', count: 500, selected: false },
  { id: 'officials', name: 'Government Officials', nameAr: 'المسؤولون الحكوميون', count: 200, selected: false },
];

export default function DisseminateAlert() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alertId = searchParams.get('alertId');
  const { user, alerts, addLog, language } = useApp();
  
  const [selectedAlertId, setSelectedAlertId] = useState(alertId || '');
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [disseminationLogs, setDisseminationLogs] = useState<DisseminationLog[]>([]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const issuedAlerts = alerts.filter(a => a.status === 'issued');
  const selectedAlert = alerts.find(a => a.id === selectedAlertId);
  const selectedRecipients = recipients.filter(r => r.selected);
  const totalRecipients = selectedRecipients.reduce((sum, r) => sum + r.count, 0);

  const toggleRecipient = (id: string) => {
    setRecipients(prev => prev.map(r => 
      r.id === id ? { ...r, selected: !r.selected } : r
    ));
  };

  const handleSend = () => {
    if (!selectedAlert || selectedRecipients.length === 0) return;
    
    const newLog: DisseminationLog = {
      id: `LOG-${Date.now()}`,
      channel: activeTab,
      recipients: selectedRecipients.map(r => language === 'en' ? r.name : r.nameAr).join(', '),
      count: totalRecipients,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setDisseminationLogs(prev => [newLog, ...prev]);
    addLog({ 
      role: user.role, 
      action: `Sent ${activeTab.toUpperCase()} to ${totalRecipients.toLocaleString()} recipients for ${selectedAlert.id}`,
      alertId: selectedAlert.id 
    });
    
    toast.success(
      language === 'en' 
        ? `${activeTab.toUpperCase()} sent to ${totalRecipients.toLocaleString()} recipients!`
        : `تم إرسال ${activeTab === 'sms' ? 'رسالة نصية' : activeTab === 'whatsapp' ? 'واتساب' : 'بريد إلكتروني'} إلى ${totalRecipients.toLocaleString()} مستلم!`
    );
    
    setConfirmModalOpen(false);
    setRecipients(INITIAL_RECIPIENTS);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Phone className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderMessagePreview = () => {
    if (!selectedAlert) return null;

    const title = language === 'en' ? selectedAlert.titleEn : selectedAlert.title;
    const advice = language === 'en' ? selectedAlert.publicAdviceEn : selectedAlert.publicAdviceAr;

    if (activeTab === 'sms') {
      const message = `🚨 ALERT: ${title} (${selectedAlert.level.toUpperCase()})\n\n${advice.substring(0, 140)}...`;
      return (
        <div className="bg-muted rounded-2xl p-4 max-w-sm">
          <p className="text-sm whitespace-pre-line">{message}</p>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {message.length}/160 chars
          </p>
        </div>
      );
    }

    if (activeTab === 'whatsapp') {
      return (
        <div className="bg-[#dcf8c6] rounded-lg p-3 max-w-sm shadow">
          <p className="text-sm font-semibold mb-1">🚨 {title}</p>
          <p className="text-sm whitespace-pre-line">{advice}</p>
          <p className="text-xs text-gray-500 text-right mt-1">
            {format(new Date(), 'HH:mm')} ✓✓
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden max-w-md">
        <div className="bg-muted px-4 py-2 border-b">
          <p className="text-xs text-muted-foreground">From: Palestine EWS System</p>
          <p className="text-xs text-muted-foreground">Subject: 🚨 {title}</p>
        </div>
        <div className="p-4">
          <p className="font-semibold mb-2">{title}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{advice}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {language === 'en' ? 'Disseminate Alert' : 'نشر التنبيه'}
        </h1>

        {/* Alert Selection */}
        <div className="gov-card mb-6">
          <label className="text-sm font-medium mb-2 block">
            {language === 'en' ? 'Select Alert to Disseminate' : 'اختر التنبيه للنشر'}
          </label>
          <Select value={selectedAlertId} onValueChange={setSelectedAlertId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder={language === 'en' ? 'Select an alert...' : 'اختر تنبيه...'} />
            </SelectTrigger>
            <SelectContent>
              {issuedAlerts.map(alert => (
                <SelectItem key={alert.id} value={alert.id}>
                  <div className="flex items-center gap-2">
                    <AlertLevelBadge level={alert.level} size="sm" />
                    <span>{language === 'en' ? alert.titleEn : alert.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {issuedAlerts.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'No issued alerts available. Please approve alerts first.' : 'لا توجد تنبيهات صادرة. يرجى الموافقة على التنبيهات أولاً.'}
            </p>
          )}
        </div>

        {selectedAlert && (
          <div className="gov-card mb-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6">
                {/* Message Preview */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {language === 'en' ? 'Message Preview' : 'معاينة الرسالة'}
                  </h3>
                  {renderMessagePreview()}
                </div>

                {/* Recipients Selection */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {language === 'en' ? 'Recipients' : 'المستلمون'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => toggleRecipient(recipient.id)}
                        className={cn(
                          'p-4 rounded-lg border-2 cursor-pointer transition-all',
                          recipient.selected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={recipient.selected} />
                          <div>
                            <p className="font-medium">
                              {language === 'en' ? recipient.name : recipient.nameAr}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {recipient.count.toLocaleString()} {language === 'en' ? 'recipients' : 'مستلم'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'Total recipients:' : 'إجمالي المستلمين:'}{' '}
                    <span className="font-semibold text-foreground">{totalRecipients.toLocaleString()}</span>
                  </p>
                  <Button
                    className="btn-gov-primary"
                    disabled={selectedRecipients.length === 0}
                    onClick={() => setConfirmModalOpen(true)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'en' ? `Send ${activeTab.toUpperCase()}` : `إرسال ${activeTab === 'sms' ? 'رسالة نصية' : activeTab === 'whatsapp' ? 'واتساب' : 'بريد إلكتروني'}`}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Activity Log */}
        <div className="gov-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {language === 'en' ? 'Activity Log' : 'سجل النشاط'}
          </h2>
          
          {disseminationLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {language === 'en' ? 'No dissemination activity yet.' : 'لا يوجد نشاط نشر حتى الآن.'}
            </p>
          ) : (
            <div className="space-y-3">
              {disseminationLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {getChannelIcon(log.channel)}
                  <div className="flex-1">
                    <p className="font-medium">
                      {log.channel.toUpperCase()} {language === 'en' ? 'sent to' : 'أرسل إلى'} {log.recipients}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.count.toLocaleString()} {language === 'en' ? 'recipients' : 'مستلم'} • {format(new Date(log.timestamp), 'dd MMM HH:mm')}
                    </p>
                  </div>
                  {log.status === 'sent' && <CheckCircle className="w-5 h-5 text-success" />}
                  {log.status === 'pending' && <Clock className="w-5 h-5 text-warning" />}
                  {log.status === 'failed' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Confirm Dissemination' : 'تأكيد النشر'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              {language === 'en' 
                ? `You are about to send ${activeTab.toUpperCase()} messages to ${totalRecipients.toLocaleString()} recipients.`
                : `أنت على وشك إرسال رسائل ${activeTab === 'sms' ? 'نصية' : activeTab === 'whatsapp' ? 'واتساب' : 'بريد إلكتروني'} إلى ${totalRecipients.toLocaleString()} مستلم.`
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'This action cannot be undone.' : 'لا يمكن التراجع عن هذا الإجراء.'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button className="btn-gov-primary" onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Confirm & Send' : 'تأكيد وإرسال'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
