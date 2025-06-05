import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signUp, signOut, continueAsGuest, type AuthUser, type AuthResult } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<{ error: string | null }>;
  continueAsGuest: () => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔐 AuthContext: Initializing authentication...');
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      console.log('🔐 AuthContext: Auth initialized:', { 
        hasUser: !!currentUser, 
        isGuest: currentUser?.isGuest 
      });
    } catch (error) {
      console.error('❌ AuthContext: Failed to initialize auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('❌ AuthContext: Failed to refresh user:', error);
    }
  };

  const handleSignIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await signIn(email, password);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Sign in error:', error);
      return { user: null, error: 'Failed to sign in' };
    }
  };

  const handleSignUp = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await signUp(email, password);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Sign up error:', error);
      return { user: null, error: 'Failed to sign up' };
    }
  };

  const handleSignOut = async (): Promise<{ error: string | null }> => {
    try {
      const result = await signOut();
      if (!result.error) {
        setUser(null);
      }
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Sign out error:', error);
      return { error: 'Failed to sign out' };
    }
  };

  const handleContinueAsGuest = async (): Promise<AuthResult> => {
    try {
      const result = await continueAsGuest();
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Guest mode error:', error);
      return { user: null, error: 'Failed to continue as guest' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    continueAsGuest: handleContinueAsGuest,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 