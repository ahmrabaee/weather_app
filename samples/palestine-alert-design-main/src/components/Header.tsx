import { Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">EWS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {t('login.title')}
              </h1>
              {username && (
                <p className="text-xs text-muted-foreground">
                  {username} {role && `- ${t(`role.${role}`)}`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </Button>

          {role && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {language === 'ar' ? 'خروج' : 'Logout'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
