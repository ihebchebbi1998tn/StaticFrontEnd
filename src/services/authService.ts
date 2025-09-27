const API_URL = import.meta.env.REACT_APP_API_URL || 'https://flowservicebackend.onrender.com';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country: string;
  industry: string;
  companyName?: string;
  companyWebsite?: string;
  preferences?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: UserData;
}

export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country: string;
  industry: string;
  companyName?: string;
  companyWebsite?: string;
  preferences?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  industry?: string;
  companyName?: string;
  companyWebsite?: string;
  preferences?: string;
  onboardingCompleted?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  private baseUrl = `${API_URL}/api/Auth`;

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.saveUserSession(result);
      }

      // Return the actual backend response (success or failure)
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred during login',
      };
    }
  }

  async userLogin(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.saveUserSession(result);
      }

      // Return the actual backend response (success or failure)
      return result;
    } catch (error) {
      console.error('User login error:', error);
      return {
        success: false,
        message: 'Network error occurred during user login',
      };
    }
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.saveUserSession(result);
      }

      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error occurred during signup',
      };
    }
  }

  async oAuthLogin(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.saveUserSession(result);
      }

      return result;
    } catch (error) {
      console.error('OAuth login error:', error);
      return {
        success: false,
        message: 'Network error occurred during OAuth login',
      };
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.saveUserSession(result);
        return result;
      } else {
        this.clearUserSession();
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearUserSession();
      return null;
    }
  }

  async getCurrentUser(): Promise<UserData | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshResult = await this.refreshToken();
        if (refreshResult?.success) {
          // Retry with new token
          return this.getCurrentUser();
        }
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateUser(data: UpdateUserRequest): Promise<AuthResponse> {
    const token = this.getAccessToken();
    const userData = this.getCurrentUserFromStorage();
    
    if (!token || !userData) {
      return { success: false, message: 'No access token or user data available' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update stored user data
        const currentUser = this.getCurrentUserFromStorage();
        if (currentUser && result.user) {
          this.saveUserToStorage({ ...currentUser, ...result.user });
        }
      }

      return result;
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: 'Network error occurred during user update',
      };
    }
  }

  async logout(): Promise<boolean> {
    const token = this.getAccessToken();
    
    try {
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearUserSession();
    }
    
    return true;
  }

  async checkAuthStatus(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Auth status check error:', error);
      return false;
    }
  }

  // Local storage management
  private saveUserSession(authResponse: AuthResponse): void {
    if (authResponse.accessToken) {
      localStorage.setItem('access_token', authResponse.accessToken);
    }
    if (authResponse.refreshToken) {
      localStorage.setItem('refresh_token', authResponse.refreshToken);
    }
    if (authResponse.expiresAt) {
      localStorage.setItem('token_expires_at', authResponse.expiresAt);
    }
    if (authResponse.user) {
      this.saveUserToStorage(authResponse.user);
      // Update onboarding completion status based on server data
      if (authResponse.user.onboardingCompleted) {
        localStorage.setItem('onboarding-completed', 'true');
      } else {
        localStorage.removeItem('onboarding-completed');
      }
    }
  }

  private saveUserToStorage(user: UserData): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private clearUserSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_data');
    localStorage.removeItem('onboarding-completed');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getCurrentUserFromStorage(): UserData | null {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (!token || !expiresAt) return false;
    
    try {
      const expirationDate = new Date(expiresAt);
      return expirationDate > new Date();
    } catch (error) {
      return false;
    }
  }

  isTokenExpiringSoon(): boolean {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;

    try {
      const expirationDate = new Date(expiresAt);
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      return expirationDate <= fiveMinutesFromNow;
    } catch (error) {
      return true;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    const token = this.getAccessToken();
    
    if (!token) {
      return { success: false, message: 'No access token available' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error occurred during password change',
      };
    }
  }

  async markOnboardingCompleted(): Promise<AuthResponse> {
    return this.updateUser({ onboardingCompleted: true });
  }
}

export const authService = new AuthService();