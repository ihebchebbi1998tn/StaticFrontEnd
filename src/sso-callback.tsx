import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function SSOCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Since we're in demo mode, just show a message and redirect
    toast({
      title: 'Demo Mode',
      description: 'OAuth callback is not configured. Redirecting to login.',
      variant: 'default',
    });
    
    // Redirect to login after a brief delay
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}