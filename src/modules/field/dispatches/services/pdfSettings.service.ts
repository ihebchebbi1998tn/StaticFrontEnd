import { PdfSettings, defaultSettings } from '../utils/pdfSettings.utils';

export class PdfSettingsService {
  private static readonly STORAGE_KEY = 'dispatch-pdf-settings';

  static loadSettings(): PdfSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load PDF settings:', error);
    }
    return defaultSettings;
  }

  static saveSettings(settings: PdfSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save PDF settings:', error);
      throw new Error('Failed to save settings to storage');
    }
  }

  static resetSettings(): PdfSettings {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
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
      link.download = 'dispatch-pdf-settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF settings:', error);
      throw new Error('Failed to export settings');
    }
  }

  static async importSettings(file: File): Promise<PdfSettings> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const imported = JSON.parse(content);
          
          // Validate the imported settings have the required structure
          if (!imported || typeof imported !== 'object') {
            throw new Error('Invalid settings file format');
          }
          
          // Merge with defaults to ensure all required properties exist
          const merged = { ...defaultSettings, ...imported };
          resolve(merged);
        } catch (error) {
          reject(new Error('Invalid settings file format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read settings file'));
      };
      
      reader.readAsText(file);
    });
  }

  static createFileInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    return input;
  }
}