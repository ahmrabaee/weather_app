import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

const Login = () => {
  const { t } = useLanguage();
  const { setRole, setUsername } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [usernameInput, setUsernameInput] = useState('');

  const roles: UserRole[] = [
    'meteorology',
    'civilDefense',
    'agriculture',
    'water',
    'environment',
    'security',
  ];

  const handleLogin = () => {
    if (!selectedRole) return;

    setRole(selectedRole);
    setUsername(usernameInput || t(`role.${selectedRole}`));

    if (selectedRole === 'meteorology') {
      navigate('/admin-dashboard');
    } else {
      navigate('/sector-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full gradient-primary flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.selectRole')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t('login.username')}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t('login.username')}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t('login.selectRole')}</Label>
            <Select
              value={selectedRole || undefined}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
            >
              <SelectTrigger id="role" className="bg-background">
                <SelectValue placeholder={t('login.selectRole')} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {t(`role.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full gradient-primary text-white font-semibold"
            size="lg"
          >
            {t('login.enter')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
