import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { AlertBadge } from '@/components/AlertBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Phone, Send, Clock, CheckCircle, Users, Building } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DisseminationLog {
  id: string;
  channel: 'sms' | 'whatsapp' | 'email';
  recipients: string;
  count: number;
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
}

const recipientGroups = [
  { id: 'ramallah', label: 'Ramallah District', count: 120000, labelAr: 'محافظة رام الله' },
  { id: 'jericho', label: 'Jericho District', count: 45000, labelAr: 'محافظة أريحا' },
  { id: 'gaza', label: 'Gaza Strip', count: 2100000, labelAr: 'قطاع غزة' },
  { id: 'hebron', label: 'Hebron District', count: 700000, labelAr: 'محافظة الخليل' },
  { id: 'emergency', label: 'Emergency Response Teams', count: 500, labelAr: 'فرق الاستجابة للطوارئ' },
  { id: 'government', label: 'Government Officials', count: 200, labelAr: 'المسؤولون الحكوميون' },
];

export default function DisseminateAlert() {
  const { alerts, language, addLog, user } = useApp();
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [disseminationLogs, setDisseminationLogs] = useState<DisseminationLog[]>([]);
  const [activeTab, setActiveTab] = useState('sms');

  const issuedAlerts = alerts.filter(a => a.status === 'issued');
  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  const totalRecipients = selectedRecipients.reduce((sum, id) => {
    const group = recipientGroups.find(g => g.id === id);
    return sum + (group?.count || 0);
  }, 0);

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (!selectedAlert || selectedRecipients.length === 0) return;

    const newLog: DisseminationLog = {
      id: `LOG-${Date.now()}`,
      channel: activeTab as 'sms' | 'whatsapp' | 'email',
      recipients: selectedRecipients.map(id => recipientGroups.find(g => g.id === id)?.label).join(', '),
      count: totalRecipients,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setDisseminationLogs(prev => [newLog, ...prev]);
    
    addLog({
      sector: user?.name || 'Meteorology',
      action: 'disseminated',
      alertId: selectedAlert.id,
      details: `Sent ${activeTab.toUpperCase()} to ${totalRecipients.toLocaleString()} recipients`,
    });

    toast.success(
      language === 'ar' 
        ? `تم إرسال ${activeTab.toUpperCase()} إلى ${totalRecipients.toLocaleString()} مستلم`
        : `${activeTab.toUpperCase()} sent to ${totalRecipients.toLocaleString()} recipients`
    );
    
    setSelectedRecipients([]);
  };

  const getMessagePreview = () => {
    if (!selectedAlert) return '';
    const level = selectedAlert.level.toUpperCase();
    const title = language === 'ar' ? selectedAlert.titleAr : selectedAlert.title;
    const advice = language === 'ar' ? selectedAlert.publicAdviceAr : selectedAlert.publicAdviceEn;
    
    return `🚨 ALERT: ${title} (${level})\n\n${advice?.slice(0, 200)}...`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="page-title animate-fade-in">
          {language === 'ar' ? 'نشر التنبيه' : 'Disseminate Alert'}
        </h1>

        {/* Alert Selector */}
        <div className="card-government card-accent-left p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            {language === 'ar' ? 'اختر التنبيه للنشر' : 'Select Alert to Disseminate'}
          </label>
          <Select value={selectedAlertId} onValueChange={setSelectedAlertId}>
            <SelectTrigger className="input-government max-w-md">
              <SelectValue placeholder={language === 'ar' ? 'اختر تنبيهاً...' : 'Select an alert...'} />
            </SelectTrigger>
            <SelectContent className="bg-card border shadow-xl z-50">
              {issuedAlerts.map(alert => (
                <SelectItem key={alert.id} value={alert.id}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      alert.level === 'yellow' ? 'bg-alert-yellow' :
                      alert.level === 'orange' ? 'bg-alert-orange' :
                      'bg-alert-red'
                    )} />
                    {language === 'ar' ? alert.titleAr : alert.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAlert && (
          <div className="card-government card-accent-left p-6 mb-6 animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
                <TabsTrigger value="sms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sms" className="space-y-6">
                <MessagePreview type="sms" content={getMessagePreview()} alert={selectedAlert} />
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-6">
                <MessagePreview type="whatsapp" content={getMessagePreview()} alert={selectedAlert} />
              </TabsContent>
              
              <TabsContent value="email" className="space-y-6">
                <MessagePreview type="email" content={getMessagePreview()} alert={selectedAlert} />
              </TabsContent>
            </Tabs>

            {/* Recipients */}
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'المستلمون' : 'Recipients'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recipientGroups.map(group => (
                  <label
                    key={group.id}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      selectedRecipients.includes(group.id)
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted border-transparent'
                    )}
                  >
                    <Checkbox
                      checked={selectedRecipients.includes(group.id)}
                      onCheckedChange={() => toggleRecipient(group.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {language === 'ar' ? group.labelAr : group.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {group.count.toLocaleString()} {language === 'ar' ? 'مستلم' : 'recipients'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إجمالي المستلمين:' : 'Total recipients:'}{' '}
                <span className="font-bold text-foreground">{totalRecipients.toLocaleString()}</span>
              </div>
              <Button
                onClick={handleSend}
                disabled={selectedRecipients.length === 0}
                className="btn-government"
              >
                <Send className="w-4 h-4 mr-2" />
                {language === 'ar' ? `إرسال ${activeTab.toUpperCase()}` : `Send ${activeTab.toUpperCase()}`}
              </Button>
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="card-government card-accent-left p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {language === 'ar' ? 'سجل النشر' : 'Dissemination Activity Log'}
          </h3>
          
          {disseminationLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {language === 'ar' ? 'لا يوجد سجل نشر بعد' : 'No dissemination activity yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {disseminationLogs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div className="flex-1">
                    <div className="font-medium">
                      {log.channel.toUpperCase()} {language === 'ar' ? 'أُرسل إلى' : 'sent to'} {log.recipients}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.count.toLocaleString()} {language === 'ar' ? 'مستلم' : 'recipients'} • {format(new Date(log.timestamp), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MessagePreview({ type, content, alert }: { type: string; content: string; alert: any }) {
  const { language } = useApp();
  
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        {language === 'ar' ? 'معاينة الرسالة' : 'Message Preview'}
      </h4>
      
      {type === 'sms' && (
        <div className="bg-card p-4 rounded-lg border max-w-sm">
          <p className="text-sm whitespace-pre-line">{content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {content.length}/320 {language === 'ar' ? 'حرف' : 'characters'}
          </p>
        </div>
      )}
      
      {type === 'whatsapp' && (
        <div className="bg-[#dcf8c6] p-4 rounded-lg max-w-sm">
          <p className="text-sm whitespace-pre-line text-foreground">{content}</p>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {format(new Date(), 'HH:mm')} ✓✓
          </p>
        </div>
      )}
      
      {type === 'email' && (
        <div className="bg-card p-4 rounded-lg border max-w-md">
          <div className="border-b pb-2 mb-3">
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'من:' : 'From:'} Palestine EWS System</p>
            <p className="text-sm font-semibold">
              {language === 'ar' ? 'الموضوع:' : 'Subject:'} 🚨 {alert.level.toUpperCase()} ALERT: {alert.title}
            </p>
          </div>
          <p className="text-sm whitespace-pre-line">{content}</p>
        </div>
      )}
    </div>
  );
}
