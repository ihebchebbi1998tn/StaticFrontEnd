import { useState, useEffect } from "react";
import { PersonalInfoStep } from "../components/PersonalInfoStep";
import { PreferencesStep } from "../components/PreferencesStep";
import { WorkAreaStep } from "../components/WorkAreaStep";
import { CompanyInfoStep } from "../components/CompanyInfoStep";
import { SetupLoadingStep } from "../components/SetupLoadingStep";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { authService } from '@/services/authService';
import { useTranslation } from 'react-i18next';
import useOnboardingTranslations from '../hooks/useOnboardingTranslations';
export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    country: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    primaryColor: string;
    layoutMode: 'sidebar' | 'topbar';
    dataView: 'table' | 'list' | 'grid';
  };
  workArea: string;
  companyInfo?: {
    name?: string;
  // logo can be a File during upload or a data-URL string for persistence
  logo?: File | string | null;
    website?: string;
  };
}
const Onboarding = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUserFromStorage();
  const { t } = useTranslation();
  useOnboardingTranslations(); // Load onboarding translations
  const [currentStep, setCurrentStep] = useState(0); // Start at first step
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      country: ''
    },
    preferences: {
      theme: 'system',
      language: 'en',
      primaryColor: 'blue',
      layoutMode: 'sidebar',
      dataView: 'table'
    },
    workArea: '',
    companyInfo: {
      name: '',
      logo: null,
      website: ''
    }
  });

  // Check if user is authenticated 
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    // Check onboarding status from server data, not just localStorage
    const userData = authService.getCurrentUserFromStorage();
    const hasCompletedOnboarding = userData?.onboardingCompleted || localStorage.getItem('onboarding-completed');
    
    if (hasCompletedOnboarding) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Pre-fill user information from auth if available
  useEffect(() => {
    if (currentUser && 
        (!data.personalInfo.firstName || 
         !data.personalInfo.lastName || 
         !data.workArea)) {
      setData(prev => ({
        ...prev,
        personalInfo: {
          firstName: currentUser.firstName || prev.personalInfo.firstName,
          lastName: currentUser.lastName || prev.personalInfo.lastName,
          phone: currentUser.phoneNumber || prev.personalInfo.phone || '',
          country: currentUser.country || prev.personalInfo.country
        },
        workArea: currentUser.industry || prev.workArea
      }));
    }
  }, []); // Run only once on mount
  const steps = [{
    component: PersonalInfoStep,
    title: t('onboarding.steps.personal.title'),
    description: t('onboarding.steps.personal.description'),
    icon: "👋"
  }, {
    component: PreferencesStep,
    title: t('onboarding.steps.preferences.title'),
    description: t('onboarding.steps.preferences.description'),
    icon: "🎨"
  }, {
    component: WorkAreaStep,
    title: t('onboarding.steps.workArea.title'),
    description: t('onboarding.steps.workArea.description'),
    icon: "🏢"
  }, {
    component: CompanyInfoStep,
     title: t('onboarding.steps.company.title'),
     description: t('onboarding.steps.company.description'),
     icon: "🏷️"
   }, {
     component: SetupLoadingStep,
     title: t('onboarding.steps.setup.title'),
     description: t('onboarding.steps.setup.description'),
     icon: "🚀"
   }];

  // Display steps (merge Company details and Setup into one visible step)
  const displaySteps = [
    steps[0],
    steps[1],
    steps[2],
    { ...steps[3], title: t('onboarding.steps.company.finalize'), description: t('onboarding.steps.company.finalizeDesc') }
  ];
  const displayIndex = currentStep <= 2 ? currentStep : 3;
  const displayTotal = displaySteps.length;
  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({
      ...prev,
      ...stepData
    }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleComplete = async () => {
    try {
      console.log('[Onboarding] handleComplete called');
      console.log('[Onboarding] User already authenticated, completing onboarding flow');

      // Mark onboarding as completed on the server
      const { authService } = await import('@/services/authService');
      await authService.markOnboardingCompleted();

      // Save onboarding completion status and data locally
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.setItem('user-onboarding-data', JSON.stringify(data));

      // Persist pdf-settings/logo if provided
      try {
        const storedPdf = localStorage.getItem('pdf-settings');
        const pdfSettings = storedPdf ? JSON.parse(storedPdf) : null;
        const updatedPdf = pdfSettings ? { ...pdfSettings } : null;
        const companyLogo = data.companyInfo?.logo;
        if (companyLogo && typeof companyLogo === 'string') {
          const base = updatedPdf || {
            company: { name: data.companyInfo?.name || '' },
            showElements: { logo: true }
          };
          base.company = { ...base.company, logo: companyLogo };
          base.showElements = { ...(base.showElements || {}), logo: true };
          localStorage.setItem('pdf-settings', JSON.stringify(base));
        }
      } catch (err) {
        console.error('Failed to persist pdf-settings during onboarding:', err);
      }

      console.log('[Onboarding] Navigating to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      throw err;
    }
  };
  const progressPercentage = (displayIndex + 1) / displayTotal * 100;
  return <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Progress Header */}
          <header className="max-w-4xl mx-auto mb-8" aria-label={t('onboarding.progress')}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  aria-label={t('onboarding.back')}
                  disabled={currentStep === 0}
                  className="p-2 rounded-full bg-muted/70 dark:bg-white/10 backdrop-blur-sm hover:bg-muted transition-smooth border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-foreground text-xl" aria-hidden>←</span>
                </button>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">FlowSolution</p>
                  <p className="text-muted-foreground text-sm">{t('onboarding.progress')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher variant="minimal" />
                <div className="text-muted-foreground text-sm font-medium" aria-live="polite">
                  {t('onboarding.step', { current: displayIndex + 1, total: displayTotal })}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div
                className="w-full bg-muted/60 dark:bg-white/20 rounded-full h-3 overflow-hidden"
                role="progressbar"
                aria-label={t('onboarding.progress') + `: ${Math.round(progressPercentage)}%`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressPercentage)}
              >
                <div
                  className="bg-primary rounded-full h-3 transition-all duration-700 ease-out shadow-glow"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <ol className="flex justify-between mt-2">
                {displaySteps.map((step, index) => {
                  const isDone = index < displayIndex;
                  const isCurrent = index === displayIndex;
                  return (
                    <li
                      key={index}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`flex flex-col items-center transition-all duration-300 ${index <= displayIndex ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${index <= displayIndex ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-foreground'}`}
                        title={`${index + 1}. ${step.title}`}
                      >
                        {isDone ? '✓' : index + 1}
                      </div>
                      <span className="sr-only">{`Step ${index + 1}: ${step.title}`}</span>
                      <span className="text-xs mt-1 font-medium hidden md:block">
                        {step.title}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </header>

        {/* Step Content Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl shadow-strong p-8 md:p-12 animate-scale-in">
            {/* Step Header */}
            <div className="text-center mb-10">
              
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Step Content */}
            <div className="animate-fade-in">
              {currentStep === steps.length - 1 ? (
                <SetupLoadingStep data={data} onComplete={handleComplete} />
              ) : currentStep === 0 ? (
                <PersonalInfoStep data={data} onNext={handleNext} isFirst={true} />
              ) : currentStep === 1 ? (
                <PreferencesStep data={data} onNext={handleNext} onBack={handleBack} isFirst={false} />
              ) : currentStep === 2 ? (
                <WorkAreaStep data={data} onNext={handleNext} onBack={handleBack} isFirst={false} />
              ) : (
                <CompanyInfoStep data={data} onNext={handleNext} onBack={handleBack} isFirst={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Onboarding;