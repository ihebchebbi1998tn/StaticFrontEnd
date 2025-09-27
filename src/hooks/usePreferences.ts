import { useState, useEffect, createContext, useContext } from 'react';
import { preferencesService, UserPreferences, CreatePreferencesRequest, UpdatePreferencesRequest } from '@/services/preferencesService';
import { useTheme } from './useTheme';

interface PreferencesContextType {
  preferences: Partial<UserPreferences> | null;
  loading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  savePreferences: (prefs: CreatePreferencesRequest) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  applyColorTheme: (color: string) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

// Hook for managing preferences logic
export function usePreferencesManager() {
  const [preferences, setPreferences] = useState<Partial<UserPreferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  // Color mapping for CSS variables
  const colorMappings = {
    blue: {
      primary: '237 84% 67%',
      primaryHover: '237 84% 57%',
      accent: '214 100% 67%'
    },
    red: {
      primary: '0 84% 60%',
      primaryHover: '0 84% 50%',
      accent: '0 84% 70%'
    },
    green: {
      primary: '142 76% 36%',
      primaryHover: '142 76% 26%',
      accent: '142 76% 46%'
    },
    purple: {
      primary: '270 95% 75%',
      primaryHover: '270 95% 65%',
      accent: '270 95% 85%'
    },
    orange: {
      primary: '25 95% 53%',
      primaryHover: '25 95% 43%',
      accent: '25 95% 63%'
    },
    indigo: {
      primary: '239 84% 67%',
      primaryHover: '239 84% 57%',
      accent: '239 84% 77%'
    }
  };

  // Apply color theme to CSS variables
  const applyColorTheme = (color: string) => {
    const mapping = colorMappings[color as keyof typeof colorMappings];
    if (!mapping) return;

    const root = document.documentElement;
    root.style.setProperty('--primary', mapping.primary);
    root.style.setProperty('--primary-hover', mapping.primaryHover);
    root.style.setProperty('--accent', mapping.accent);
  };

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Apply preferences when they change
  useEffect(() => {
    if (preferences) {
      if (preferences.theme) {
        setTheme(preferences.theme);
      }
      if (preferences.primaryColor) {
        applyColorTheme(preferences.primaryColor);
      }
    }
  }, [preferences, setTheme]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated before trying server
      const token = localStorage.getItem('auth-token');
      let serverPrefs = null;
      
      if (token) {
        try {
          serverPrefs = await preferencesService.getUserPreferences();
        } catch (error) {
          // Server not available or user not authenticated, continue with local
          console.warn('Could not load server preferences, using local fallback');
        }
      }
      
      if (serverPrefs) {
        setPreferences(serverPrefs);
        preferencesService.savePreferencesLocally(serverPrefs);
      } else {
        // Fall back to local preferences
        const localPrefs = preferencesService.getLocalPreferences();
        setPreferences(Object.keys(localPrefs).length > 0 ? localPrefs : {
          theme: 'system',
          language: 'en',
          primaryColor: 'blue',
          layoutMode: 'sidebar',
          dataView: 'table'
        });
      }
    } catch (error) {
      // Use local preferences as fallback
      const localPrefs = preferencesService.getLocalPreferences();
      setPreferences(Object.keys(localPrefs).length > 0 ? localPrefs : {
        theme: 'system',
        language: 'en',
        primaryColor: 'blue',
        layoutMode: 'sidebar',
        dataView: 'table'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      
      // Update local state immediately for responsiveness
      setPreferences(newPreferences);
      preferencesService.savePreferencesLocally(updates as UserPreferences);

      // Try to update on server
      if (preferences?.id) {
        await preferencesService.updateUserPreferences(updates as UpdatePreferencesRequest);
      } else {
        // Create new preferences if they don't exist
        await preferencesService.createUserPreferences(newPreferences as CreatePreferencesRequest);
      }
      
      // Reload from server to get the latest
      await loadPreferences();
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Keep local changes even if server update fails
    }
  };

  const savePreferences = async (prefs: CreatePreferencesRequest) => {
    try {
      setLoading(true);
      
      // Save locally first for immediate feedback
      setPreferences(prefs);
      preferencesService.savePreferencesLocally(prefs);

      // Try to save to server
      const result = await preferencesService.createUserPreferences(prefs);
      if (result) {
        setPreferences(result);
        preferencesService.savePreferencesLocally(result);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Keep local preferences even if server save fails
    } finally {
      setLoading(false);
    }
  };

  const refreshPreferences = async () => {
    await loadPreferences();
  };

  return {
    preferences,
    loading,
    updatePreferences,
    savePreferences,
    refreshPreferences,
    applyColorTheme
  };
}
