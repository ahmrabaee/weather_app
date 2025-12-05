import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEWS, UserRole, roleLabels } from '@/contexts/EWSContext';

const roles: UserRole[] = ['meteorology', 'civil_defense', 'agriculture', 'water_authority', 'environment', 'security'];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { setCurrentRole, language, setLanguage } = useEWS();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      setCurrentRole(selectedRole);
      if (selectedRole === 'meteorology') {
        navigate('/admin');
      } else {
        navigate('/sector');
      }
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Language Toggle */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <Bell className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">
              {language === 'ar' ? 'نظام الإنذار المبكر' : 'Early Warning System'}
            </h1>
            <p className="text-primary-foreground/70">
              {language === 'ar' ? 'فلسطين' : 'Palestine'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  {language === 'ar' ? 'اختر دورك' : 'Select Your Role'}
                </label>
                <Select onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder={language === 'ar' ? 'اختر دورك...' : 'Choose your role...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {language === 'ar' ? roleLabels[role].ar : roleLabels[role].en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleLogin}
                disabled={!selectedRole}
                className="w-full h-12 text-lg font-semibold"
              >
                {language === 'ar' ? 'دخول النظام' : 'Enter System'}
              </Button>
            </div>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              {language === 'ar' 
                ? 'هذا نموذج أولي يستخدم بيانات اختبار فقط'
                : 'This is a prototype using test data only'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-primary-foreground/50 text-sm">
        {language === 'ar' ? '© 2024 نظام الإنذار المبكر - فلسطين' : '© 2024 Early Warning System - Palestine'}
      </div>
    </div>
  );
}
