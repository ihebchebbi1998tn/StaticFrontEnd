import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDisplayName } from '../../utils/pdfSettings.utils';
import { PdfSettings } from '../../utils/pdfSettings.utils';
import { Building2, Upload, X } from 'lucide-react';

interface DataTabProps {
  settings: PdfSettings;
  onSettingsChange: (path: string, value: any) => void;
  applyColorTheme?: (theme: any) => void;
}

export function DataTab({ settings, onSettingsChange }: DataTabProps) {
  const fileInputId = 'pdf-logo-upload-input';

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSettingsChange('company.logo', result);
        onSettingsChange('showElements.logo', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onSettingsChange('company.logo', undefined);
    onSettingsChange('showElements.logo', false);
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Configure your company details that appear on quotes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.company.name}
                onChange={(e) => onSettingsChange('company.name', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-tagline">Tagline</Label>
              <Input
                id="company-tagline"
                value={settings.company.tagline}
                onChange={(e) => onSettingsChange('company.tagline', e.target.value)}
                placeholder="Your company tagline"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-address">Address</Label>
            <Textarea
              id="company-address"
              value={settings.company.address}
              onChange={(e) => onSettingsChange('company.address', e.target.value)}
              placeholder="Full company address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone</Label>
              <Input
                id="company-phone"
                value={settings.company.phone}
                onChange={(e) => onSettingsChange('company.phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={settings.company.email}
                onChange={(e) => onSettingsChange('company.email', e.target.value)}
                placeholder="quotes@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={settings.company.website}
                onChange={(e) => onSettingsChange('company.website', e.target.value)}
                placeholder="www.company.com"
              />
            </div>
          </div>

          <Separator />

          {/* Logo Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <p className="text-xs text-muted-foreground">Used in PDF header</p>
            </div>
            
            {settings.company.logo ? (
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <img 
                  src={settings.company.logo} 
                  alt="Company Logo" 
                  className="w-12 h-12 object-contain bg-muted rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Logo uploaded</p>
                  <p className="text-xs text-muted-foreground">Click remove to change or delete</p>
                </div>
                <Button variant="outline" size="sm" onClick={removeLogo}>
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <Label htmlFor={fileInputId} className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Upload Logo</span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            )}
            
            <input
              id={fileInputId}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Content Visibility</CardTitle>
          <CardDescription>Choose which sections to include in your quote PDFs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.showElements).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between space-x-2">
                <Label htmlFor={`show-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {formatDisplayName(key)}
                </Label>
                <Switch
                  id={`show-${key}`}
                  checked={value}
                  onCheckedChange={(checked) => onSettingsChange(`showElements.${key}`, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}