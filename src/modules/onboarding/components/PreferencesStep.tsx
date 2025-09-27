import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "../pages/Onboarding";
import { useTheme } from "@/hooks/useTheme";
import { Palette, Globe2, Sun, Moon, Monitor, ArrowLeft, Sidebar, Layout, Table, List, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoading } from "@/shared/contexts/LoadingContext";
interface PreferencesStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirst: boolean;
}
const languages = [{
  code: 'en',
  name: 'English'
}, {
  code: 'fr',
  name: 'French'
}, {
  code: 'de',
  name: 'German'
}];

const primaryColors = [{
  value: 'blue',
  name: 'Ocean Blue',
  color: 'bg-blue-500',
  preview: 'from-blue-500 to-blue-600'
}, {
  value: 'red',
  name: 'Ruby Red',
  color: 'bg-red-500',
  preview: 'from-red-500 to-red-600'
}, {
  value: 'green',
  name: 'Forest Green',
  color: 'bg-green-500',
  preview: 'from-green-500 to-green-600'
}, {
  value: 'purple',
  name: 'Royal Purple',
  color: 'bg-purple-500',
  preview: 'from-purple-500 to-purple-600'
}, {
  value: 'orange',
  name: 'Sunset Orange',
  color: 'bg-orange-500',
  preview: 'from-orange-500 to-orange-600'
}, {
  value: 'indigo',
  name: 'Deep Indigo',
  color: 'bg-indigo-500',
  preview: 'from-indigo-500 to-indigo-600'
}];

const layoutModes = [{
  value: 'sidebar',
  label: 'Sidebar Navigation',
  description: 'Classic navigation on the left side',
  icon: Sidebar
}, {
  value: 'topbar',
  label: 'Top Navigation',
  description: 'Modern horizontal navigation bar',
  icon: Layout
}] as const;

const dataViews = [{
  value: 'table',
  label: 'Table View',
  description: 'Structured rows and columns',
  icon: Table
}, {
  value: 'list',
  label: 'List View',
  description: 'Simplified vertical listing',
  icon: List
}] as const;
const themes = [{
  value: 'light',
  label: 'Light',
  icon: Sun,
  description: 'Clean and bright interface'
}, {
  value: 'dark',
  label: 'Dark',
  icon: Moon,
  description: 'Easy on the eyes'
}, {
  value: 'system',
  label: 'System',
  icon: Monitor,
  description: 'Matches your device setting'
}] as const;
export function PreferencesStep({
  data,
  onNext,
  onBack,
  isFirst: _isFirst
}: PreferencesStepProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState(data.preferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    setTheme
  } = useTheme();

  // Apply theme changes in real-time
  useEffect(() => {
    setTheme(formData.theme);
  }, [formData.theme, setTheme]);
  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await withLoading(async () => {
        // Get current user from localStorage to get userId
        const userData = localStorage.getItem('user_data');
        if (!userData) {
          throw new Error('No user data found');
        }

        const user = JSON.parse(userData);
        
        // Create preferences using preferences service
        const { preferencesService } = await import('@/services/preferencesService');
        
        const response = await preferencesService.createUserPreferencesWithUserId(user.id.toString(), formData);
        
        if (!response.success) {
          console.warn('Failed to save preferences to server, keeping local copy:', response.message);
          localStorage.setItem('user-preferences', JSON.stringify(formData));
        }
        
        onNext({ preferences: formData });
      }, 'Saving your preferences...');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="max-w-3xl mx-auto">
      <div className="space-y-10">
        {/* Theme Selection */}
        <div className="space-y-6">
          <Label className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Palette className="h-5 w-5" />
            </div>
            {t('onboarding.steps.preferences.theme.title')}
          </Label>
          <p className="text-muted-foreground mb-6">
            {t('onboarding.steps.preferences.theme.description')}
          </p>
          <RadioGroup value={formData.theme} onValueChange={(value: 'light' | 'dark' | 'system') => {
          const next = { ...formData, theme: value };
          setFormData(next);
        }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map(theme => {
            const IconComponent = theme.icon;
            return <div key={theme.value} className="relative group">
                  <RadioGroupItem value={theme.value} id={theme.value} className="peer sr-only" />
                  <Label htmlFor={theme.value} className="flex flex-col items-center justify-center p-4 sm:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover-lift peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-medium group-hover:shadow-soft">
                    <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground mb-2 shadow-soft">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-base mb-2">{t(`onboarding.steps.preferences.theme.${theme.value}`)}</span>
                    
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-300 ${formData.theme === theme.value ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                      {formData.theme === theme.value && <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>}
                    </div>
                  </Label>
                </div>;
          })}
          </RadioGroup>
        </div>

        {/* Language Selection */}
        <div className="space-y-6">
          <Label htmlFor="language" className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Globe2 className="h-5 w-5" />
            </div>
            {t('onboarding.steps.preferences.language.title')}
          </Label>
          <p className="text-muted-foreground mb-4">
            {t('onboarding.steps.preferences.language.description')}
          </p>
          <div className="max-w-md">
            <Select value={formData.language} onValueChange={value => {
            const next = { ...formData, language: value };
            setFormData(next);
          }}>
              <SelectTrigger className="h-14 text-base border-2 hover:border-accent/50 focus:border-accent transition-all duration-200">
                <SelectValue placeholder={t('onboarding.steps.preferences.language.placeholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {languages.map(language => <SelectItem key={language.code} value={language.code} className="text-base py-3">
                    {t(`onboarding.languages.${language.code}`, language.name)}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary Color Selection */}
        <div className="space-y-6">
          <Label className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Palette className="h-5 w-5" />
            </div>
            Choose Your Primary Color
          </Label>
          <p className="text-muted-foreground mb-6">
            Select a color that represents your brand or preference.
          </p>
          <RadioGroup value={formData.primaryColor} onValueChange={(value: string) => {
            const next = { ...formData, primaryColor: value };
            setFormData(next);
          }} className="flex flex-wrap justify-center gap-4">
            {primaryColors.map(color => (
              <div key={color.value} className="relative group">
                <RadioGroupItem value={color.value} id={color.value} className="peer sr-only" />
                <Label htmlFor={color.value} className="flex items-center justify-center w-16 h-16 cursor-pointer transition-all duration-300 hover-lift group-hover:shadow-soft">
                  <div className={`w-12 h-12 rounded-full ${color.color} shadow-medium ring-2 transition-all duration-300 ${formData.primaryColor === color.value ? 'ring-primary ring-4 scale-110' : 'ring-white dark:ring-gray-800 hover:ring-primary/50 hover:ring-4'}`} />
                  
                  {formData.primaryColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Layout Mode Selection */}
        <div className="space-y-6">
          <Label className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Layout className="h-5 w-5" />
            </div>
            Layout Preference
          </Label>
          <p className="text-muted-foreground mb-6">
            Choose how you prefer to navigate through the application.
          </p>
          <RadioGroup value={formData.layoutMode} onValueChange={(value: 'sidebar' | 'topbar') => {
            const next = { ...formData, layoutMode: value };
            setFormData(next);
          }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {layoutModes.map(layout => {
              const IconComponent = layout.icon;
              return (
                <div key={layout.value} className="relative group">
                  <RadioGroupItem value={layout.value} id={layout.value} className="peer sr-only" />
                  <Label htmlFor={layout.value} className="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover-lift peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-medium group-hover:shadow-soft">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent shadow-soft">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-base block">{layout.label}</span>
                      <span className="text-sm text-muted-foreground">{layout.description}</span>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${formData.layoutMode === layout.value ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                      {formData.layoutMode === layout.value && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Data View Selection */}
        <div className="space-y-6">
          <Label className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Table className="h-5 w-5" />
            </div>
            Default Data View
          </Label>
          <p className="text-muted-foreground mb-6">
            How would you like to view your data by default?
          </p>
          <RadioGroup value={formData.dataView} onValueChange={(value: 'table' | 'list') => {
            const next = { ...formData, dataView: value };
            setFormData(next);
          }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dataViews.map(view => {
              const IconComponent = view.icon;
              return (
                <div key={view.value} className="relative group">
                  <RadioGroupItem value={view.value} id={view.value} className="peer sr-only" />
                  <Label htmlFor={view.value} className="flex flex-col items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover-lift peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-medium group-hover:shadow-soft min-h-[120px]">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 shadow-soft">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-base mb-1 text-center">{view.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{view.description}</span>
                    
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-300 ${formData.dataView === view.value ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                      {formData.dataView === view.value && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between items-center pt-12">
        <Button variant="outline" onClick={onBack} className="px-8 py-3 h-12 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-smooth rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('onboarding.back')}
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting} className="px-12 py-3 h-12 text-base font-semibold gradient-primary text-white hover-lift shadow-medium hover:shadow-strong transition-smooth rounded-xl">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t('onboarding.steps.preferences.button')}
              <span className="ml-2 text-lg">→</span>
            </>
          )}
        </Button>
      </div>
    </div>;
}