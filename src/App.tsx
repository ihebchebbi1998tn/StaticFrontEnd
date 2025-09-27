import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import Login from "./modules/auth/pages/Login";
import UserLogin from "./modules/auth/pages/UserLogin";
import SSOCallback from "./sso-callback";
// Dashboard is gated to show a preloading screen and warm data/assets
import DashboardGate from "./modules/dashboard/components/DashboardGate";
import Onboarding from "./modules/onboarding/pages/Onboarding";
import NotFound from "./pages/NotFound";
import SupportModuleRoutes from "./modules/support/SupportModuleRoutes";
import { LookupsProvider } from "./shared/contexts/LookupsContext";
import { LoadingProvider } from "./shared";
import { TopProgressBar } from "./shared/components/TopProgressBar";
import "./lib/i18n";
import { ScrollToTop } from "./shared/components/ScrollToTop";
import AppLoader from "./shared/components/AppLoader";
import { runWhenIdle, preloadDashboard, preloadSupport, preloadOnboarding, preloadLogin } from "./shared/prefetch";
import { AuthProvider } from "./contexts/AuthContext";
import { PreferencesProvider } from "./contexts/PreferencesProvider";
import { PreferencesLoader } from "./components/PreferencesLoader";

const queryClient = new QueryClient();

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Oops! Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              We encountered an unexpected error while loading the application. Please try reloading the page.
            </p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() { /* log to monitoring if needed */ }
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children as any;
  }
}

const App = () => {
  useEffect(() => {
    // Initialize theme on app start
    const savedTheme = localStorage.getItem('flowsolution-theme') || 'system';
    const root = window.document.documentElement;
    
    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }

    // Warm critical routes during idle to improve perceived nav speed
    runWhenIdle(() => {
      preloadDashboard();
      preloadOnboarding();
      preloadSupport();
      preloadLogin();
    }, 800);

    // Log a simple visit message to ntfy (https://ntfy.sh/flowservice)
    // This is non-blocking and uses fetch with keepalive so page unloads still allow sending.
    // Remove or guard this in production if you don't want visit telemetry.
    (async function logVisit() {
      try {
        const msg = `Visit: ${window.location.pathname} @ ${new Date().toISOString()}\nUA: ${navigator.userAgent}`;
        // ntfy accepts a simple POST of text to publish to the topic
        await fetch('https://ntfy.sh/flowservice', {
          method: 'POST',
          headers: {
            'Title': 'Website visit',
            'Content-Type': 'text/plain'
          },
          body: msg,
          // keepalive helps the browser send during unload
          keepalive: true
        });
      } catch (e) {
        // don't fail the app if logging fails
        // console.debug('ntfy log failed', e);
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <PreferencesLoader />
          <LoadingProvider>
          <LookupsProvider>
            <TooltipProvider>
              <TopProgressBar />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <AppErrorBoundary>
                  <Suspense fallback={<AppLoader />}>
                   <Routes>
                     <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-login" element={<UserLogin />} />
                    <Route path="/sso-callback" element={<SSOCallback />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    {/* Redirect standalone paths into dashboard so sidebar shows */}
                    <Route path="/offers" element={<Navigate to="/dashboard/offers" replace />} />
                    <Route path="/offers/*" element={<Navigate to="/dashboard/offers" replace />} />
                    <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
                    <Route path="/calendar/*" element={<Navigate to="/dashboard/calendar" replace />} />
                   <Route path="/dashboard/*" element={<DashboardGate />} />
                    {/* Customer Support Module */}
                    <Route path="/support/*" element={<SupportModuleRoutes />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </Suspense>
                </AppErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </LookupsProvider>
          </LoadingProvider>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
