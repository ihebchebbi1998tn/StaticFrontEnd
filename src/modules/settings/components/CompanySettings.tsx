import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CompanySettings() {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    phone: "",
    fax: "",
    website: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Company settings have been updated successfully.",
    });
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    toast({
      title: "Upload feature",
      description: `${type === 'logo' ? 'Logo' : 'Favicon'} upload will be implemented.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Company Information Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Company Information</h2>
        <p className="text-sm text-muted-foreground mb-4">Provide the company information below</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={companyData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter company name"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="text-sm font-medium">
              Company Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={companyData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phoneNumber"
              value={companyData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fax" className="text-sm font-medium">Fax</Label>
            <Input
              id="fax"
              value={companyData.fax}
              onChange={(e) => handleInputChange('fax', e.target.value)}
              placeholder="Enter fax number"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">Website</Label>
            <Input
              id="website"
              value={companyData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Enter website URL"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Company Image Section */}
      <div className="pt-6 border-t border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">Company Image</h2>
        <p className="text-sm text-muted-foreground mb-6">Provide the company image</p>
        
        <div className="max-w-md">
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <Button 
                  onClick={() => handleFileUpload('logo')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Upload Logo of your company to display in website. Recommended size is 250 px*100 px
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
