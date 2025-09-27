import { useEffect } from 'react';
import { usePreferences } from '@/hooks/usePreferences';

/**
 * Component that loads and applies user preferences on app startup
 * This component should be rendered early in the app to ensure preferences are applied
 */
export function PreferencesLoader() {
  const { preferences, refreshPreferences, applyColorTheme } = usePreferences();

  // Load preferences on mount with a slight delay to avoid blocking initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshPreferences();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [refreshPreferences]);

  // Apply color theme whenever primary color changes
  useEffect(() => {
    if (preferences?.primaryColor) {
      applyColorTheme(preferences.primaryColor);
    }
  }, [preferences?.primaryColor, applyColorTheme]);

  // This component doesn't render anything visible
  return null;
}