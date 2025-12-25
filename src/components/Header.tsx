import { useApp, ROLE_NAMES } from '@/contexts/AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Shield, Globe, LayoutDashboard, CheckSquare, Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, setUser, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isMeteorology = user?.role === 'meteorology';

  const navLinks = isMeteorology ? [
    { to: '/admin-dashboard', label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: LayoutDashboard },
    { to: '/alert-approval', label: language === 'en' ? 'Approve' : 'الموافقة', icon: CheckSquare },
    { to: '/disseminate-alert', label: language === 'en' ? 'Disseminate' : 'نشر', icon: Send },
    { to: '/logs', label: language === 'en' ? 'Logs' : 'السجلات', icon: FileText },
  ] : [];

  return (
    <header className="gov-header">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold hidden sm:block">
            {language === 'en' ? 'Early Warning System' : 'نظام الإنذار المبكر'}
          </h1>
          <h1 className="text-xl font-bold sm:hidden">EWS</h1>
        </div>

        {user && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Globe className="w-4 h-4 mr-1" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>

        {user && (
          <>
            <span className="px-3 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium hidden sm:inline">
              {ROLE_NAMES[user.role]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
