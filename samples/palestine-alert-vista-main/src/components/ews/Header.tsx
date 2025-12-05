import { Globe, Bell, LogOut } from 'lucide-react';
import { useEWS, roleLabels } from '@/contexts/EWSContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { currentRole, language, setLanguage, setCurrentRole, alerts } = useEWS();
  const navigate = useNavigate();

  const activeAlerts = alerts.filter(a => a.status === 'issued').length;

  const handleLogout = () => {
    setCurrentRole(null);
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                {language === 'ar' ? 'نظام الإنذار المبكر' : 'Early Warning System'}
              </h1>
              <p className="text-xs text-primary-foreground/70">
                {language === 'ar' ? 'فلسطين' : 'Palestine'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentRole && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/10 rounded-lg">
              <span className="text-sm">
                {language === 'ar' ? roleLabels[currentRole].ar : roleLabels[currentRole].en}
              </span>
              {activeAlerts > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-alert-red text-primary-foreground rounded-full animate-pulse-alert">
                  {activeAlerts}
                </span>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Globe className="w-4 h-4 ml-2" />
            {language === 'ar' ? 'EN' : 'عربي'}
          </Button>

          {currentRole && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'خروج' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
