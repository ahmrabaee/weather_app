import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { SECTORS, UserRole } from '@/types/alert';
import { Shield, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Login() {
  const [role, setRole] = useState<UserRole>('meteorology');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, language } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSector = SECTORS.find(s => s.value === role);
    setUser({
      role,
      name: username || (language === 'ar' ? selectedSector?.labelAr : selectedSector?.label) || 'User',
    });
    
    if (role === 'meteorology') {
      navigate('/admin-dashboard');
    } else {
      navigate('/sector-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="header-government">
        <div className="container mx-auto h-full flex items-center justify-center px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <h1 className="text-xl font-bold">
              {language === 'ar' ? 'نظام الإنذار المبكر' : 'Early Warning System'}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card-government w-full max-w-md p-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بك للوصول' : 'Enter your credentials to access the system'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {language === 'ar' ? 'اختر دورك' : 'Select your role'}
              </label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="input-government">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-xl z-50">
                  {SECTORS.map(sector => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {language === 'ar' ? sector.labelAr : sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {language === 'ar' ? 'اسم المستخدم' : 'Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-government pl-10"
                  placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-government pl-10"
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                />
              </div>
            </div>

            <Button type="submit" className="btn-government w-full text-lg">
              {language === 'ar' ? 'تسجيل الدخول' : 'Log in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {language === 'ar' 
              ? 'هذا نموذج أولي للتوضيح - لا يلزم تسجيل دخول حقيقي'
              : 'This is a demonstration prototype - no real authentication required'}
          </p>
        </div>
      </main>
    </div>
  );
}
