import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserData } from '@/services/mockAuthService';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  userLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserData>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          // Try to get user from storage first
          const storedUser = authService.getCurrentUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }

          // Verify with server and refresh if needed
          if (authService.isTokenExpiringSoon()) {
            const refreshResult = await authService.refreshToken();
            if (refreshResult?.user) {
              setUser(refreshResult.user);
              setIsAuthenticated(true);
            } else {
              // Refresh failed, clear auth state
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // Token is still valid, verify with server
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            } else {
              // Server verification failed
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      if (authService.isTokenExpiringSoon()) {
        try {
          const refreshResult = await authService.refreshToken();
          if (refreshResult?.user) {
            setUser(refreshResult.user);
          } else {
            // Refresh failed, logout
            await logout();
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          await logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, message: 'Network error occurred during login' };
    }
  };

  const userLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.userLogin({ email, password });
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('User login error in context:', error);
      return { success: false, message: 'Network error occurred during user login' };
    }
  };

  const signup = async (email: string, password: string, userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const signupData = {
        email,
        password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber,
        country: userData.country || '',
        industry: userData.industry || '',
        companyName: userData.companyName,
        companyWebsite: userData.companyWebsite,
        preferences: userData.preferences ? JSON.stringify(userData.preferences) : undefined
      };

      const response = await authService.signup(signupData);
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Signup error in context:', error);
      return { success: false, message: 'Network error occurred during signup' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (userData: Partial<UserData>): Promise<boolean> => {
    try {
      const response = await authService.updateUser(userData);
      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error in context:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    userLogin,
    signup,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};