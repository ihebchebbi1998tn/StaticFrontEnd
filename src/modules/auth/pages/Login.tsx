import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, signup } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check onboarding status from user data, not localStorage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const hasCompletedOnboarding = user.onboardingCompleted || localStorage.getItem('onboarding-completed');
          
          if (hasCompletedOnboarding) {
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } catch (error) {
          // Fallback to dashboard if parsing fails
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } else {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location]);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Get fresh user data to check onboarding status
        const userData = localStorage.getItem('user_data');
        let hasCompletedOnboarding = false;
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            hasCompletedOnboarding = user.onboardingCompleted || false;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        
        if (hasCompletedOnboarding) {
          toast({
            title: 'Welcome back!',
            description: 'Redirecting to your dashboard',
          });
          // Navigation will be handled by useEffect
        } else {
          toast({
            title: 'Welcome!',
            description: 'Let\'s complete your profile setup',
          });
          // Navigation will be handled by useEffect
        }
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      // Try to signup the user directly
      const result = await signup(email, password, {
        firstName: 'User',
        lastName: 'Name', 
        country: 'US',
        industry: 'technology',
        phoneNumber: '',
        companyName: '',
        companyWebsite: '',
        preferences: null
      });
      
      if (result.success) {
        // New users always need onboarding (onboardingCompleted will be false by default)
        toast({
          title: 'Success',
          description: 'Let\'s complete your profile!',
        });
        // Navigation will be handled by useEffect
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to create account. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthLayout>
      <div className="space-y-6">
        <LoginForm 
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          isLoading={isLoading} 
        />
      </div>
    </AuthLayout>
  );
};

export default Index;
