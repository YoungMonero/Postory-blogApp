// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken as setCookieToken, clearToken } from '../services/auth-storage';

interface AuthContextType {
  token: string | null;
  userName: string | null;
  login: (token: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken(); // Reads from Cookie
    const storedUserName = localStorage.getItem('userName');

    if (storedToken) setToken(storedToken);
    if (storedUserName) setUserName(storedUserName);
    setLoading(false);
  }, []);

  const login = (newToken: string, name: string) => {
    setCookieToken(newToken); // ✅ Sets the Cookie for Middleware
    localStorage.setItem('userName', name);
    
    setToken(newToken);
    setUserName(name);
  };

  const logout = () => {
    clearToken(); // ✅ Clears Cookie
    localStorage.removeItem('userName');
    localStorage.removeItem('user');

    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userName, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}