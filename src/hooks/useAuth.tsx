import React, { createContext, useContext, useState } from 'react';

const AUTH_KEY = 'portfolio_admin_auth';
const EXPIRY_KEY = 'portfolio_admin_auth_expiry';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkValidAuth = (): boolean => {
  const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
  const expiryStr = localStorage.getItem(EXPIRY_KEY);

  if (!isAuth || !expiryStr) {
    return false;
  }

  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return false;
  }

  return true;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    sessionStorage.removeItem(AUTH_KEY);
    return checkValidAuth();
  });

  const login = () => {
    const expiryTime = Date.now() + SEVEN_DAYS_MS;
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
