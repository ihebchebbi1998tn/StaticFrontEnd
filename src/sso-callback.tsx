import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function SSOCallback() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (isLoaded && user) {
        const email = user.primaryEmailAddress?.emailAddress;
        
        if (email) {
          try {
            // Check if user exists in our database
            const oauthResult = await authService.oAuthLogin(email);
            
            if (oauthResult.success) {
              // User exists, log them in
              toast({
                title: 'Welcome back!',
                description: 'Successfully signed in',
              });
              navigate('/dashboard');
            } else {
              // User doesn't exist, redirect to onboarding with pre-filled data
              const userData = {
                email,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                isOAuth: true
              };
              
              navigate('/onboarding', { state: userData });
            }
          } catch (error) {
            console.error('OAuth callback error:', error);
            toast({
              title: 'Error',
              description: 'Authentication failed. Please try again.',
              variant: 'destructive',
            });
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      }
    };

    handleOAuthCallback();
  }, [isLoaded, user, navigate, login]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}