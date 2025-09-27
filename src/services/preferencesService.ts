const API_URL = import.meta.env.REACT_APP_API_URL || 'https://flowservicebackend.onrender.com';

export interface UserPreferences {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  primaryColor: string;
  layoutMode: 'sidebar' | 'topbar';
  dataView: 'table' | 'list' | 'grid';
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  notifications?: any;
  sidebarCollapsed?: boolean;
  compactMode?: boolean;
  showTooltips?: boolean;
  animationsEnabled?: boolean;
  soundEnabled?: boolean;
  autoSave?: boolean;
  workArea?: string;
  dashboardLayout?: any;
  quickAccessItems?: string[];
}

export interface CreatePreferencesRequest {
  theme: 'light' | 'dark' | 'system';
  language: string;
  primaryColor: string;
  layoutMode: 'sidebar' | 'topbar';
  dataView: 'table' | 'list' | 'grid';
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  notifications?: any;
  sidebarCollapsed?: boolean;
  compactMode?: boolean;
  showTooltips?: boolean;
  animationsEnabled?: boolean;
  soundEnabled?: boolean;
  autoSave?: boolean;
  workArea?: string;
  dashboardLayout?: any;
  quickAccessItems?: string[];
}

export interface UpdatePreferencesRequest extends Partial<CreatePreferencesRequest> {}

export interface PreferencesResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class PreferencesService {
  private baseUrl = `${API_URL}/api/Preferences`;

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // New API methods for onboarding
  async createUserPreferencesWithUserId(userId: string, preferences: any): Promise<PreferencesResponse> {
    try {
      const preferencesPayload = {
        theme: preferences.theme,
        language: preferences.language,
        primaryColor: preferences.primaryColor,
        layoutMode: preferences.layoutMode,
        dataView: preferences.dataView,
        timezone: preferences.timezone || 'UTC',
        dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
        timeFormat: preferences.timeFormat || '12h',
        currency: preferences.currency || 'USD',
        numberFormat: preferences.numberFormat || 'comma',
        notifications: preferences.notifications || '{}',
        sidebarCollapsed: preferences.sidebarCollapsed || false,
        compactMode: preferences.compactMode || false,
        showTooltips: preferences.showTooltips !== false,
        animationsEnabled: preferences.animationsEnabled !== false,
        soundEnabled: preferences.soundEnabled !== false,
        autoSave: preferences.autoSave !== false,
        workArea: preferences.workArea || 'development',
        dashboardLayout: preferences.dashboardLayout || '{}',
        quickAccessItems: preferences.quickAccessItems || '[]'
      };

      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesPayload),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create preferences error:', error);
      return {
        success: false,
        message: 'Network error occurred while creating preferences',
      };
    }
  }
  
  async updateUserPreferencesWithUserId(userId: string, preferences: any): Promise<PreferencesResponse> {
    try {
      const preferencesPayload = {
        theme: preferences.theme,
        language: preferences.language,
        primaryColor: preferences.primaryColor,
        layoutMode: preferences.layoutMode,
        dataView: preferences.dataView,
        timezone: preferences.timezone || 'UTC',
        dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
        timeFormat: preferences.timeFormat || '12h',
        currency: preferences.currency || 'USD',
        numberFormat: preferences.numberFormat || 'comma',
        notifications: preferences.notifications || '{}',
        sidebarCollapsed: preferences.sidebarCollapsed || false,
        compactMode: preferences.compactMode || false,
        showTooltips: preferences.showTooltips !== false,
        animationsEnabled: preferences.animationsEnabled !== false,
        soundEnabled: preferences.soundEnabled !== false,
        autoSave: preferences.autoSave !== false,
        workArea: preferences.workArea || 'development',
        dashboardLayout: preferences.dashboardLayout || '{}',
        quickAccessItems: preferences.quickAccessItems || '[]'
      };

      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesPayload),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update preferences error:', error);
      return {
        success: false,
        message: 'Network error occurred while updating preferences',
      };
    }
  }

  // Legacy API methods for backward compatibility
  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
  }

  async createUserPreferences(preferences: CreatePreferencesRequest): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error creating preferences:', error);
      return null;
    }
  }

  async updateUserPreferences(preferences: UpdatePreferencesRequest): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return null;
    }
  }

  savePreferencesLocally(preferences: UserPreferences): void {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
  }

  getLocalPreferences(): UserPreferences {
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing local preferences:', error);
      }
    }
    return {
      theme: 'system',
      language: 'en',
      primaryColor: 'blue',
      layoutMode: 'sidebar',
      dataView: 'table',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
    } as UserPreferences;
  }

  async deleteUserPreferences(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'DELETE',
        headers: this.getAuthHeader(),
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting preferences:', error);
      return false;
    }
  }
}

export const preferencesService = new PreferencesService();