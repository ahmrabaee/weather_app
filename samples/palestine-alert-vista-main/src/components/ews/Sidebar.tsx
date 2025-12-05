import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, AlertTriangle, Eye } from 'lucide-react';
import { useEWS } from '@/contexts/EWSContext';
import { cn } from '@/lib/utils';

interface SidebarLink {
  to: string;
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
}

const adminLinks: SidebarLink[] = [
  { to: '/admin', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  { to: '/admin/create', icon: Plus, labelAr: 'إنشاء إنذار', labelEn: 'Create Alert' },
  { to: '/admin/logs', icon: FileText, labelAr: 'السجلات', labelEn: 'System Logs' },
  { to: '/public', icon: Eye, labelAr: 'العرض العام', labelEn: 'Public View' },
];

const sectorLinks: SidebarLink[] = [
  { to: '/sector', icon: AlertTriangle, labelAr: 'الإنذارات', labelEn: 'Alerts' },
  { to: '/public', icon: Eye, labelAr: 'العرض العام', labelEn: 'Public View' },
];

export function Sidebar() {
  const { currentRole, language, alerts } = useEWS();

  const isAdmin = currentRole === 'meteorology';
  const links = isAdmin ? adminLinks : sectorLinks;

  const activeAlerts = alerts.filter(a => a.status === 'issued');

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              )
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">
              {language === 'ar' ? link.labelAr : link.labelEn}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-4 border-t border-sidebar-border">
        <h3 className="text-sm font-semibold mb-3 text-sidebar-foreground/70">
          {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{language === 'ar' ? 'إنذارات نشطة' : 'Active Alerts'}</span>
            <span className="px-2 py-0.5 bg-alert-red rounded text-primary-foreground font-bold">
              {activeAlerts.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-alert-red" />
              {language === 'ar' ? 'أحمر' : 'Red'}
            </span>
            <span>{activeAlerts.filter(a => a.level === 'red').length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-alert-orange" />
              {language === 'ar' ? 'برتقالي' : 'Orange'}
            </span>
            <span>{activeAlerts.filter(a => a.level === 'orange').length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-alert-yellow" />
              {language === 'ar' ? 'أصفر' : 'Yellow'}
            </span>
            <span>{activeAlerts.filter(a => a.level === 'yellow').length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
