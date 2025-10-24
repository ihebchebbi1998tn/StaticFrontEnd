import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "../pages/Onboarding";
import { User, Phone, Globe, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoading } from "@/shared/contexts/LoadingContext";

interface PersonalInfoStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  isFirst: boolean;
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
];

export function PersonalInfoStep({ data, onNext, isFirst }: PersonalInfoStepProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState(data.personalInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = t('onboarding.steps.personal.validation.firstNameRequired');
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = t('onboarding.steps.personal.validation.lastNameRequired');
    }
    if (!formData.country) {
      newErrors.country = t('onboarding.steps.personal.validation.countryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const { authService } = await import('@/services/authService');

      // If already authenticated, update the profile instead of creating a new account
      if (authService.isAuthenticated()) {
        try {
          const updatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phone || '',
            country: formData.country,
          };
          console.log('[Onboarding][PersonalInfo] Updating authenticated user with payload', updatePayload);
          
          // Just proceed with local update for now since we're already authenticated
          onNext({ personalInfo: formData });
          return;
        } catch (error) {
          console.error('[Onboarding][PersonalInfo] Error updating profile:', error);
          // Continue anyway since we're authenticated
          onNext({ personalInfo: formData });
          return;
        }
      }

        // Fallback: create account using pending signup data (legacy flow)
        const pendingSignup = localStorage.getItem('pending-signup');
        if (!pendingSignup) {
          console.error('No pending signup data found');
          return;
        }

        const signupData = JSON.parse(pendingSignup);
        const signupPayload = {
          email: signupData.email,
          password: signupData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phone || '',
          country: formData.country,
          industry: '-', // Placeholder until user completes work area step
          companyName: '-', // Placeholder until user completes company step
          companyWebsite: '-', // Placeholder until user completes company step
          preferences: '-', // Placeholder until user completes preferences step
        };

        console.log('[Onboarding][PersonalInfo] Submitting signup payload (sanitized)', { ...signupPayload, password: '***' });
        const response = await authService.signup(signupPayload);
        console.log('[Onboarding][PersonalInfo] Signup API response', response);
        if (!response.success) {
          throw new Error(response.message || 'Failed to create account');
        }

        localStorage.removeItem('pending-signup');
        onNext({ personalInfo: formData });
      }, 'Creating your profile...');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base font-semibold">
              {t('onboarding.steps.personal.fields.firstName')} *
            </Label>
            <Input
              id="firstName"
              placeholder={t('onboarding.steps.personal.fields.firstNamePlaceholder')}
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={`h-12 text-base transition-smooth ${errors.firstName ? 'border-destructive' : 'border-2 hover:border-primary/50 focus:border-primary'}`}
            />
            {errors.firstName && (
              <p className="text-destructive text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-base font-semibold">
              {t('onboarding.steps.personal.fields.lastName')} *
            </Label>
            <Input
              id="lastName"
              placeholder={t('onboarding.steps.personal.fields.lastNamePlaceholder')}
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={`h-12 text-base transition-smooth ${errors.lastName ? 'border-destructive' : 'border-2 hover:border-primary/50 focus:border-primary'}`}
            />
            {errors.lastName && (
              <p className="text-destructive text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-base font-semibold">
            <Phone className="h-4 w-4 text-primary" />
            {t('onboarding.steps.personal.fields.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('onboarding.steps.personal.fields.phonePlaceholder')}
            value={formData.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className="h-12 text-base border-2 hover:border-primary/50 focus:border-primary transition-smooth"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2 text-base font-semibold">
            <Globe className="h-4 w-4 text-primary" />
            {t('onboarding.steps.personal.fields.country')} *
          </Label>
          <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
            <SelectTrigger className={`h-12 text-base transition-smooth ${errors.country ? 'border-destructive' : 'border-2 hover:border-primary/50 focus:border-primary'}`}>
              <SelectValue placeholder={t('onboarding.steps.personal.fields.countryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="text-base py-3">
                  {t(`onboarding.countries.${country.code}`, country.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-destructive text-sm mt-1">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-12">
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-12 py-3 h-12 text-base font-semibold gradient-primary text-white hover-lift shadow-medium hover:shadow-strong transition-smooth rounded-xl"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t('onboarding.steps.personal.button')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}