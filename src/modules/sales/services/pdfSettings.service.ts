import { PdfSettings, defaultSettings } from '../utils/pdfSettings.utils';

const STORAGE_KEY = 'pdf-settings';

export class PdfSettingsService {
  static saveSettings(settings: PdfSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save PDF settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  static loadSettings(): PdfSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Failed to load PDF settings:', error);
      return defaultSettings;
    }
  }

  static resetSettings(): PdfSettings {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Failed to reset PDF settings:', error);
      throw new Error('Failed to reset settings');
    }
  }

  static exportSettings(settings: PdfSettings): void {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pdf-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF settings:', error);
      throw new Error('Failed to export settings');
    }
  }

  static importSettings(file: File): Promise<PdfSettings> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            // Validate that the imported data has the required structure
            if (this.validateSettings(imported)) {
              const mergedSettings = { ...defaultSettings, ...imported };
              resolve(mergedSettings);
            } else {
              reject(new Error('Invalid settings file format'));
            }
          } catch (parseError) {
            reject(new Error('Failed to parse settings file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      } catch (error) {
        reject(new Error('Failed to import settings'));
      }
    });
  }

  private static validateSettings(settings: any): boolean {
    // Basic validation to ensure the settings object has the expected structure
    return (
      settings &&
      typeof settings === 'object' &&
      settings.fontFamily &&
      settings.fontSize &&
      settings.colors &&
      settings.company
    );
  }

  static createFileInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    return input;
  }
}