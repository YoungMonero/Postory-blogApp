// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken as setCookieToken, clearToken } from '../services/auth-storage';
import AuthRequiredModal from '../component/modals/AuthRequiredModal'; // We will create this next

interface AuthContextType {
  token: string | null;
  userName: string | null;
  isAuthModalOpen: boolean; // New state
  openAuthModal: () => void; // New action
  closeAuthModal: () => void; // New action
  login: (token: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = getToken(); 
    const storedUserName = localStorage.getItem('userName');

    if (storedToken) setToken(storedToken);
    if (storedUserName) setUserName(storedUserName);
    setLoading(false);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (newToken: string, name: string) => {
    setCookieToken(newToken);
    localStorage.setItem('userName', name);
    setToken(newToken);
    setUserName(name);
    setIsAuthModalOpen(false); // Auto-close modal on success
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      userName, 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal, 
      login, 
      logout 
    }}>
      {!loading && children}
      {/* Adding the modal here ensures it can be 
         triggered from anywhere in the app 
      */}
      <AuthRequiredModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}