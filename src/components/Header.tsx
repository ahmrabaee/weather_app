import { useState } from 'react';
import { useApp, ROLE_NAMES } from '@/contexts/AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Globe, LayoutDashboard, CheckSquare, Send, FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, setUser, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="gov-header relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {user && navLinks.length > 0 && (
            <button
              className="md:hidden p-1 text-primary-foreground hover:bg-white/10 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={cn(
            "fixed top-0 left-0 bottom-0 w-[280px] bg-primary z-[70] shadow-2xl md:hidden flex flex-col transition-transform duration-300 transform",
            language === 'ar' ? "left-auto right-0 translate-x-0" : "translate-x-0"
          )}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg text-primary-foreground uppercase">EWS</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    location.pathname === link.to
                      ? 'bg-primary-foreground text-primary shadow-lg'
                      : 'text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-4">
              <div className="px-4 py-2 bg-white/5 rounded-lg">
                <p className="text-xs text-primary-foreground/50 mb-1">{language === 'en' ? 'Logged in as' : 'مسجل كـ'}</p>
                <p className="text-sm font-semibold text-primary-foreground">{user?.name}</p>
                <p className="text-xs text-primary-foreground/70">{ROLE_NAMES[user?.role || '']}</p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-primary-foreground hover:bg-red-500/20 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
