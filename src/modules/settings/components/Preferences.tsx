
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ColorPicker } from "@/components/ui/color-picker";
import { usePreferences } from "@/hooks/usePreferences";
import { Palette, Bell, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

export function Preferences() {
  const { t } = useTranslation();
  const { preferences, updatePreferences, loading } = usePreferences();

  // Map color names to hex values for the color picker
  const colorToHex = {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f97316',
    indigo: '#6366f1'
  };

  // Map hex values back to color names
  const hexToColor = {
    '#3b82f6': 'blue',
    '#ef4444': 'red',
    '#10b981': 'green',
    '#8b5cf6': 'purple',
    '#f97316': 'orange',
    '#6366f1': 'indigo'
  };

  const handleColorChange = async (hexColor: string) => {
    try {
      // Convert hex to color name if it's a preset, otherwise use hex directly
      const colorName = hexToColor[hexColor as keyof typeof hexToColor] || hexColor;
      
      await updatePreferences({ primaryColor: colorName });
      
      toast({
        title: "Primary color updated",
        description: "Your brand color has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to update primary color:', error);
      toast({
        title: "Failed to update color",
        description: "There was an error saving your color preference.",
        variant: "destructive"
      });
    }
  };

  const handleColorReset = async () => {
    try {
      await updatePreferences({ primaryColor: 'blue' });
      
      toast({
        title: "Color reset",
        description: "Primary color has been reset to default.",
      });
    } catch (error) {
      console.error('Failed to reset primary color:', error);
      toast({
        title: "Failed to reset color",
        description: "There was an error resetting your color preference.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Appearance Settings */}
      <Card className="shadow-card border-0 bg-card">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-chart-6/10">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-chart-6" />
            </div>
            Appearance & Display
          </CardTitle>
          <CardDescription>Customize how the application looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Theme Preference</Label>
              <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Primary Color</Label>
              <p className="text-sm text-muted-foreground">Customize your brand color</p>
            </div>
            <ColorPicker
              value={colorToHex[preferences?.primaryColor as keyof typeof colorToHex] || '#6366f1'}
              onChange={handleColorChange}
              onReset={handleColorReset}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">{t('language')}</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Use smaller interface elements for more content</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sidebar Auto-collapse</Label>
              <p className="text-sm text-muted-foreground">Automatically collapse sidebar on smaller screens</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-card border-0 bg-card">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-chart-1" />
            </div>
            Notifications & Alerts
          </CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive important updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">Show browser push notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Deal Updates</Label>
              <p className="text-sm text-muted-foreground">Notifications when deals change status</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
