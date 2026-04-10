import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('grocery_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('grocery_token') || '');

  const saveSession = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('grocery_user', JSON.stringify(nextUser));
    localStorage.setItem('grocery_token', nextToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('grocery_user');
    localStorage.removeItem('grocery_token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      setUser,
      setToken,
      saveSession,
      clearSession
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
