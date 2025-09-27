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
  
  if (!hasValidClerk) {
    return (
      <div className="space-y-3">
        <div className="text-center p-4 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            OAuth login will be available once you set up your Clerk API key
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}