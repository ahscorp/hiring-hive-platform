import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client'; // Assuming this is the correct path

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email_param: string, password_param: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email_param: string, password_param: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email_param,
      password: password_param,
    });
    if (error) {
      console.error('Login error:', error);
    } else {
      setSession(data.session);
      setUser(data.user);
    }
    setLoading(false);
    return { error };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      setSession(null);
      setUser(null);
    }
    setLoading(false);
    return { error };
  };

  const value = {
    user,
    session,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
