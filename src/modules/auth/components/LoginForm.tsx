import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { OAuthLogin } from './OAuthLogin';

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, userData?: any) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSignIn, onSignUp, isLoading = false }: LoginFormProps) {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (isSignUp) {
      if (!email || !password || !confirmPassword) {
        toast({
          title: t('auth.error'),
          description: t('auth.please_fill_all_fields'),
          variant: 'destructive',
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: t('auth.error'),
          description: t('auth.passwords_dont_match_signup'),
          variant: 'destructive',
        });
        return;
      }
      if (password.length < 6) {
        toast({
          title: t('auth.error'),
          description: t('auth.password_too_short_signup'),
          variant: 'destructive',
        });
        return;
      }
      
      // Call the onSignUp function to trigger the signup flow
      const userData = {
        firstName: 'User', 
        lastName: 'Name',
        country: 'US',
        industry: 'technology'
      };
      
      await onSignUp(email, password, userData);
    } else {
      if (!email || !password) {
        toast({
          title: t('auth.error'),
          description: t('auth.please_fill_all_fields'),
          variant: 'destructive',
        });
        return;
      }
      
      await onSignIn(email, password);
    }
  };


  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        onBack={() => setShowForgotPassword(false)} 
      />
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <img 
            src="/lovable-uploads/c403237c-2c76-4f0c-8c9f-882975ce290f.png" 
            alt="FlowSolution" 
            className="h-16 mx-auto dark:block hidden"
          />
          <img 
            src="/lovable-uploads/54cf69f6-1a17-4c11-bf6f-0fef42eb25bb.png" 
            alt="FlowSolution" 
            className="h-16 mx-auto dark:hidden block"
          />
        </div>
      </div>

      {/* Auth Form */}
      <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
        <CardHeader className="space-y-4 pb-4 px-6 sm:px-8 pt-6">
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-foreground/90">
                {t('auth.email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-background/80 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-lg text-sm transition-all duration-200"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-foreground/90">
                {t('auth.password')}  
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-background/80 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-lg text-sm pr-10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted/50"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/90">
                  {t('auth.confirm_password')}  
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('auth.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 bg-background/80 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-lg text-sm pr-10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted/50"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-3.5 h-3.5 text-primary border-border/60 rounded focus:ring-2 focus:ring-primary/20"
                  />
                  <label htmlFor="remember" className="text-xs text-foreground/80">
                    {t('auth.rememberMe')}
                  </label>
                </div>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t('auth.forgotPassword')}
                </a>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 px-6 sm:px-8 pb-6">
          <Button
            onClick={handleSubmit}
            className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{isSignUp ? t('auth.creating_account') : t('auth.signing_in')}</span>
              </div>
            ) : (
              <span>{isSignUp ? t('auth.createAccount') : t('auth.signIn')}</span>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground font-medium">{t('auth.continue_with')}</span>
            </div>
          </div>

          {/* OAuth Login Buttons */}
          <OAuthLogin />

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center pt-1">
            <p className="text-xs text-muted-foreground">
              {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="ml-1.5 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isSignUp ? t('auth.signIn') : t('auth.signUp')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}