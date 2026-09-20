import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginApi } from '../api/auth';
import { clearToken, getToken, saveToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const token = await getToken();
        if (!token) {
          if (active) setLoading(false);
          return;
        }

        const data = await getMe();
        if (active) setUser(data.user ?? null);
      } catch {
        if (active) {
          await clearToken();
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    await saveToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (signupPayload) => {
    const data = await import('../api/auth').then((m) => m.signup(signupPayload));
    await saveToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
