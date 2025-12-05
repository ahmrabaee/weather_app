import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, UserRole, ROLE_NAMES } from '@/contexts/AppContext';
import { Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLES: UserRole[] = [
  'meteorology',
  'civil-defense',
  'agriculture',
  'water-authority',
  'environment',
  'security',
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('meteorology');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, language } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ role: selectedRole, name: username || ROLE_NAMES[selectedRole] });
    
    if (selectedRole === 'meteorology') {
      navigate('/admin-dashboard');
    } else {
      navigate('/sector-dashboard');
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col">
      {/* Header */}
      <header className="gov-header">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <h1 className="text-xl font-bold">
            {language === 'en' ? 'Early Warning System' : 'نظام الإنذار المبكر'}
          </h1>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="gov-card p-8 sm:p-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              {language === 'en' ? 'Login' : 'تسجيل الدخول'}
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'en' ? 'Select your role' : 'اختر دورك'}
                </label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                  <SelectTrigger className="gov-input h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role} className="cursor-pointer">
                        {ROLE_NAMES[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'en' ? 'Username' : 'اسم المستخدم'}
                </label>
                <Input
                  type="text"
                  placeholder={language === 'en' ? 'Username' : 'اسم المستخدم'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="gov-input h-12"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <Input
                  type="password"
                  placeholder={language === 'en' ? 'Password' : 'كلمة المرور'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="gov-input h-12"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="btn-gov-primary w-full h-14 text-lg"
              >
                {language === 'en' ? 'Log in' : 'تسجيل الدخول'}
              </Button>
            </form>

            {/* Demo Notice */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {language === 'en' 
                ? 'This is a demonstration prototype. No authentication required.'
                : 'هذا نموذج تجريبي. لا يتطلب مصادقة.'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
