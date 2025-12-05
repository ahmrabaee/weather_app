import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SECTORS } from '@/types/alert';
import { InteractivePalestineMap } from '@/components/InteractivePalestineMap';

export function Header() {
  const { user, setUser, language, setLanguage, alerts } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const getSectorLabel = () => {
    if (!user) return '';
    const sector = SECTORS.find(s => s.value === user.role);
    return language === 'ar' ? sector?.labelAr : sector?.label;
  };

  // Show mini-map on specific pages that don't have a full map
  const showMiniMap = ['/alert-approval', '/disseminate-alert', '/logs'].includes(location.pathname);

  return (
    <header className="header-government">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <h1 className="text-xl font-bold">
            {language === 'ar' ? 'نظام الإنذار المبكر' : 'Early Warning System'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Mini Map for specific pages */}
          {showMiniMap && user && (
            <div 
              className="cursor-pointer"
              onClick={() => navigate('/admin-dashboard')}
            >
              <InteractivePalestineMap
                mode="mini"
                alerts={alerts.filter(a => a.status === 'issued' || a.status === 'pending')}
              />
            </div>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-medium">
                {getSectorLabel()}
              </span>
              <span className="text-sm opacity-90">{user.name}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Globe className="w-4 h-4 mr-1" />
            {language === 'en' ? 'العربية' : 'English'}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
