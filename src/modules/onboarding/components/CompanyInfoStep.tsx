import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "../pages/Onboarding";
import { Building2, Upload, Globe, ArrowLeft, ArrowRight, X, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLoading } from "@/shared/contexts/LoadingContext";

interface CompanyInfoStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirst: boolean;
}

export function CompanyInfoStep({ data, onNext, onBack, isFirst }: CompanyInfoStepProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState(data.companyInfo || { name: '', website: '', logo: null });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await withLoading(async () => {
        // Get current user from localStorage to get userId
        const userData = localStorage.getItem('user_data');
        if (userData && (formData.name || formData.website)) {
          const user = JSON.parse(userData);
          
          // Update user with company info
          const { authService } = await import('@/services/authService');
          
          const updatePayload: any = {};
          if (formData.name) updatePayload.companyName = formData.name;
          if (formData.website) updatePayload.companyWebsite = formData.website;
          
          const response = await authService.updateUser(updatePayload);
          
          if (!response.success) {
            console.warn('Failed to update company info:', response.message);
          }
        }
        
        onNext({ companyInfo: formData });
      }, 'Updating company information...');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData(prev => ({ ...prev, logo: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-base font-semibold">
            {t('onboarding.steps.company.fields.name')}
          </Label>
          <Input
            id="companyName"
            placeholder={t('onboarding.steps.company.fields.namePlaceholder')}
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="h-12 text-base border-2 hover:border-primary/50 focus:border-primary transition-smooth"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2 text-base font-semibold">
            <Globe className="h-4 w-4 text-primary" />
            {t('onboarding.steps.company.fields.website')}
          </Label>
          <Input
            id="website"
            type="url"
            placeholder={t('onboarding.steps.company.fields.websitePlaceholder')}
            value={formData.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            className="h-12 text-base border-2 hover:border-primary/50 focus:border-primary transition-smooth"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Upload className="h-4 w-4 text-primary" />
            {t('onboarding.steps.company.fields.logo')}
          </Label>
          
          {formData.logo ? (
            <div className="relative group">
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-primary/50 rounded-xl bg-primary/5">
                <img 
                  src={typeof formData.logo === 'string' ? formData.logo : ''} 
                  alt="Company logo" 
                  className="w-16 h-16 object-contain rounded-lg bg-background shadow-soft"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{t('onboarding.steps.company.fields.logoChange')}</p>
                  <p className="text-sm text-muted-foreground">{t('onboarding.steps.company.fields.logoDesc')}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeLogo}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="sr-only"
              />
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t('onboarding.steps.company.fields.logoButton')}</p>
                  <p className="text-sm text-muted-foreground">{t('onboarding.steps.company.fields.logoDesc')}</p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-12">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 h-12 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-smooth rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('onboarding.back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-12 py-3 h-12 text-base font-semibold gradient-primary text-white hover-lift shadow-medium hover:shadow-strong transition-smooth rounded-xl"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t('onboarding.steps.company.button')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}