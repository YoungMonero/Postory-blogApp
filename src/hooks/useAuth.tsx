import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken as setCookieToken, clearToken } from '../services/auth-storage';
import AuthRequiredModal from '../component/modals/AuthRequiredModal';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  userName: string | null;
  userId: string | null;       
  email: string | null;         
  role: string | null;         
  hasBlog: boolean;           
  tenantId: string | null;    
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hasBlog, setHasBlog] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  const decodeAndSetUser = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      console.log(' Decoded token:', decoded);
      
      setUserName(decoded.username || decoded.userId || null);
      setUserId(decoded.userId || decoded.sub || null);
      setEmail(decoded.email || null);
      setRole(decoded.role || null);
      setHasBlog(decoded.hasBlog || false);
      setTenantId(decoded.tenantId || null);
      

      localStorage.setItem('userData', JSON.stringify({
        userName: decoded.username,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        hasBlog: decoded.hasBlog,
        tenantId: decoded.tenantId
      }));
    } catch (error) {
      console.error(' Failed to decode token:', error);
    }
  };

  useEffect(() => {
    const storedToken = getToken();
    
    if (storedToken) {
      setToken(storedToken);
      decodeAndSetUser(storedToken);
    } else {

      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUserName(userData.userName);
          setUserId(userData.userId);
          setEmail(userData.email);
          setRole(userData.role);
          setHasBlog(userData.hasBlog);
          setTenantId(userData.tenantId);
        } catch (e) {
          console.error('Failed to restore user data:', e);
        }
      }
    }
    
    setLoading(false);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (newToken: string) => {
    setCookieToken(newToken);
    setToken(newToken);
    decodeAndSetUser(newToken);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('userData');
    localStorage.removeItem('userName'); 
    localStorage.removeItem('user');      
    setToken(null);
    setUserName(null);
    setUserId(null);
    setEmail(null);
    setRole(null);
    setHasBlog(false);
    setTenantId(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      userName,
      userId,         
      email,          
      role,          
      hasBlog,       
      tenantId,    
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      login,
      logout
    }}>
      {!loading && children}
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