import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'meteorology' | 'civilDefense' | 'agriculture' | 'water' | 'environment' | 'security' | null;

interface AuthContextType {
  role: UserRole;
  username: string;
  setRole: (role: UserRole) => void;
  setUsername: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [username, setUsername] = useState<string>('');

  const logout = () => {
    setRole(null);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ role, username, setRole, setUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
