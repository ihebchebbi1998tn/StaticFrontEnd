import { useEffect, useRef, useState } from "react";
import { OnboardingData } from "../pages/Onboarding";
import { CheckCircle, Loader2, Sparkles, Rocket, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';

interface SetupLoadingStepProps {
  data: OnboardingData;
  onComplete: () => void;
}

const setupSteps = [
  { id: 'profile', label: 'Creating your profile', duration: 1000 },
  { id: 'preferences', label: 'Setting up preferences', duration: 1500 },
  { id: 'workspace', label: 'Preparing workspace', duration: 2000 },
  { id: 'features', label: 'Configuring features', duration: 1200 },
  { id: 'finalize', label: 'You\'re all set!\nCreating your personalized workspace', duration: 800 }
];

export function SetupLoadingStep({ data, onComplete }: SetupLoadingStepProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Utility to avoid being stuck if APIs hang
  const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      promise
        .then((res) => {
          clearTimeout(id);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(id);
          reject(err);
        });
    });
  };

const startedRef = useRef(false);
const mountedRef = useRef(true);

useEffect(() => {
  if (startedRef.current) {
    console.warn('[Onboarding] SetupLoadingStep already started; skipping duplicate run');
    return;
  }
  startedRef.current = true;
  mountedRef.current = true;

  let timeoutId: NodeJS.Timeout | undefined;

  const processStep = async (stepIndex: number) => {
    if (!mountedRef.current) return;

    if (stepIndex < setupSteps.length) {
      const step = setupSteps[stepIndex];
      console.log('[Onboarding] Entering step', { index: stepIndex, id: step.id, label: step.label });
      try {
        // Static data processing - no API calls
        if (step.id === 'profile') {
          console.log('[Onboarding] Profile: processing static profile data');
          // Store profile data locally
          const userData = localStorage.getItem('user_data');
          if (userData) {
            const user = JSON.parse(userData);
            const updatedUser = {
              ...user,
              firstName: data.personalInfo.firstName || user.firstName,
              lastName: data.personalInfo.lastName || user.lastName,
              phoneNumber: data.personalInfo.phone || user.phoneNumber,
              country: data.personalInfo.country || user.country
            };
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
            console.log('[Onboarding] Profile: updated user data locally', updatedUser);
          }
        } else if (step.id === 'preferences') {
          console.log('[Onboarding] Preferences: storing preferences locally');
          // Store preferences locally
          localStorage.setItem('user-preferences', JSON.stringify(data.preferences));
          console.log('[Onboarding] Preferences: stored locally', data.preferences);
        } else if (step.id === 'workspace') {
          console.log('[Onboarding] Workspace: processing workspace data');
          // Store workspace data locally
          const userData = localStorage.getItem('user_data');
          if (userData) {
            const user = JSON.parse(userData);
            const updatedUser = {
              ...user,
              industry: data.workArea || user.industry,
              companyName: data.companyInfo?.name || user.companyName,
              companyWebsite: data.companyInfo?.website || user.companyWebsite
            };
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
            console.log('[Onboarding] Workspace: updated workspace data locally', updatedUser);
          }
        }

        timeoutId = setTimeout(() => {
          if (!mountedRef.current) return;
          console.log('[Onboarding] Step completed (timer)', { id: step.id, index: stepIndex });
          setCompletedSteps(prev => [...prev, step.id]);
          setCurrentStep(stepIndex + 1);
          
          if (stepIndex === setupSteps.length - 1) {
            // Last step completed, wait a bit then finish
            setTimeout(() => {
              if (!mountedRef.current) return;
              console.log('[Onboarding] All steps completed, calling onComplete');
              onComplete();
            }, 1000);
          } else {
            processStep(stepIndex + 1);
          }
        }, step.duration);
      } catch (err: any) {
        console.error(`Error in step ${step.id}:`, err);
        setError(err.message || 'An error occurred during setup');
        // Continue anyway after a delay
        timeoutId = setTimeout(() => {
          if (!mountedRef.current) return;
          setCompletedSteps(prev => [...prev, step.id]);
          setCurrentStep(stepIndex + 1);
          
          if (stepIndex === setupSteps.length - 1) {
            setTimeout(() => {
              if (!mountedRef.current) return;
              onComplete();
            }, 1000);
          } else {
            processStep(stepIndex + 1);
          }
        }, 2000);
      }
    }
  };

  processStep(0);

  return () => {
    mountedRef.current = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, []);

  const isCompleted = completedSteps.length === setupSteps.length;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-1000 ${
            error
              ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
              : isCompleted 
              ? 'bg-green-500/10 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-gradient-primary text-white animate-pulse'
          }`}>
            {error ? (
              <AlertCircle className="h-12 w-12" />
            ) : isCompleted ? (
              <CheckCircle className="h-12 w-12" />
            ) : (
              <Rocket className="h-12 w-12" />
            )}
          </div>
          
          {!isCompleted && !error && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          )}
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            {error 
              ? 'Setup encountered an issue'
              : isCompleted 
              ? t('onboarding.steps.setup.complete') 
              : t('onboarding.steps.setup.loading')
            }
          </h3>
          <p className="text-muted-foreground">
            {error
              ? 'Continuing setup anyway...'
              : isCompleted 
              ? 'Welcome to FlowSolution!'
              : t('onboarding.steps.setup.description')
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index && !isCompleted;
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'
                    : isCurrent
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-muted-foreground/30'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <span className="font-medium whitespace-pre-line text-left">{step.label}</span>
                
                {isCompleted && (
                  <Sparkles className="h-4 w-4 ml-auto text-green-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${(completedSteps.length / setupSteps.length) * 100}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {t('onboarding.step', { current: completedSteps.length, total: setupSteps.length })}
        </p>
      </div>
    </div>
  );
}