import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image, Eye, EyeOff, Grid } from 'lucide-react';
import { PdfSettings, formatDisplayName } from '../../utils/pdfSettings.utils';

interface DataTabProps {
  settings: PdfSettings;
  updateSettings: (path: string, value: any) => void;
}

export function DataTab({ settings, updateSettings }: DataTabProps) {
  const fileInputId = 'pdf-logo-upload-input';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // validate size and type like onboarding
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateSettings('company.logo', dataUrl);
      updateSettings('showElements.logo', true);
    };
    reader.readAsDataURL(file);
    // clear value so same file can be re-uploaded if needed
    (e.target as HTMLInputElement).value = '';
  };

  const applyPlaceholder = () => {
    const url = 'https://i.ibb.co/v4mr5WW1/elementor-placeholder-image.png';
    updateSettings('company.logo', url);
    updateSettings('showElements.logo', true);
  };
  return (
    <div className="mt-4 pb-4">
      <ScrollArea className="h-[55vh] pr-4">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Image className="h-4 w-4" />
                Company Information
              </CardTitle>
              <CardDescription className="text-xs">Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                {/* Logo preview and controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.company?.logo ? (
                      <img src={settings.company.logo} alt="logo-preview" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted/30 flex items-center justify-center text-xs">No logo</div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Company Logo</p>
                      <p className="text-xs text-muted-foreground">Used in PDF header</p>
                      <div className="mt-1 flex items-center gap-2">
                        <label htmlFor={fileInputId} className="text-xs px-2 py-1 border rounded bg-primary/5 text-primary cursor-pointer">
                          Upload
                        </label>
                        <input id={fileInputId} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <Button size="sm" variant="outline" onClick={applyPlaceholder} className="text-xs">Use placeholder</Button>
                        {settings.company?.logo && (
                          <button
                            type="button"
                            className="text-xs px-2 py-1 border rounded bg-destructive/5 text-destructive"
                            onClick={() => {
                              updateSettings('company.logo', undefined);
                              updateSettings('showElements.logo', false);
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* We'll show an indicator when logo is enabled */}
                    {settings.company?.logo ? (
                      <Badge variant="secondary" className="text-xs">Logo enabled</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No logo set</span>
                    )}
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="companyName" className="text-xs">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.company.name}
                    onChange={(e) => updateSettings('company.name', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="companyTagline" className="text-xs">Tagline</Label>
                  <Input
                    id="companyTagline"
                    value={settings.company.tagline}
                    onChange={(e) => updateSettings('company.tagline', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail" className="text-xs">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.company.email}
                    onChange={(e) => updateSettings('company.email', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone" className="text-xs">Phone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.company.phone}
                    onChange={(e) => updateSettings('company.phone', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="companyWebsite" className="text-xs">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={settings.company.website}
                    onChange={(e) => updateSettings('company.website', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="companyAddress" className="text-xs">Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.company.address}
                    onChange={(e) => updateSettings('company.address', e.target.value)}
                    className="min-h-[32px] text-xs resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Document Sections
                </CardTitle>
                <CardDescription className="text-xs">Control which sections appear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {Object.entries(settings.showElements).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {value ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                      <Label htmlFor={key} className="capitalize cursor-pointer text-xs">
                        {formatDisplayName(key)}
                      </Label>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateSettings(`showElements.${key}`, checked)}
                      className="scale-75"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Grid className="h-4 w-4" />
                  Table Configuration
                </CardTitle>
                <CardDescription className="text-xs">Customize table display</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-2">
                  {Object.entries(settings.table).filter(([key]) => !['borderStyle', 'headerStyle'].includes(key)).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50">
                      <Label htmlFor={`table-${key}`} className="capitalize cursor-pointer text-xs">
                        {formatDisplayName(key)}
                      </Label>
                      <Switch
                        id={`table-${key}`}
                        checked={value as boolean}
                        onCheckedChange={(checked) => updateSettings(`table.${key}`, checked)}
                        className="scale-75"
                      />
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Border Style</Label>
                    <Select 
                      value={settings.table.borderStyle} 
                      onValueChange={(value) => updateSettings('table.borderStyle', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Header Style</Label>
                    <Select 
                      value={settings.table.headerStyle} 
                      onValueChange={(value) => updateSettings('table.headerStyle', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filled">Filled</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}