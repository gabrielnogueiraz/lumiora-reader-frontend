import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../service/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const savedUser = authService.getUserData();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    authService.saveUserData(response);
    setUser(response.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });
    authService.saveUserData(response);
    setUser(response.user);
  };

  const signOut = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};