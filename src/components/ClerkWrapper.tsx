import { ReactNode } from 'react';

interface ClerkWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// This component safely checks if we're inside a ClerkProvider
export function ClerkWrapper({ children, fallback }: ClerkWrapperProps) {
  // Check if we have access to Clerk context by checking for valid key
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const hasValidClerk =
    typeof clerkKey === 'string' &&
    /^pk_(test|live)_.{80,}$/.test(clerkKey as string);
  
  if (!hasValidClerk && fallback) {
    return <>{fallback}</>;
  }
  
  // Always render children - no API key message
  if (!hasValidClerk) {
    return <>{children}</>;
  }
  
  return <>{children}</>;
}