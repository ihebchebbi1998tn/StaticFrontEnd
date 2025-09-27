import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/dashboard/components/AppSidebar";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { DashboardContent } from "@/modules/dashboard/components/DashboardContent";
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { LayoutModeProvider } from "@/components/providers/LayoutModeProvider";
import { useLayoutModeContext } from "@/hooks/useLayoutMode";
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "@/services/authService";

function DashboardLayout() {
  const { layoutMode, isMobile } = useLayoutModeContext();
  const location = useLocation();
  const _isOnDashboardHome = location.pathname === "/dashboard";
  
  // Check if user has completed onboarding from server data
  const userData = authService.getCurrentUserFromStorage();
  const hasCompletedOnboarding = userData?.onboardingCompleted || localStorage.getItem('onboarding-completed');
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Mobile view - always render content (dashboard home is empty for now)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <main className="flex-1">
          <DashboardContent />
        </main>
      </div>
    );
  }

  // Desktop/Tablet view - respect layout mode preference
  if (layoutMode === 'topbar') {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <TopNavigation />
        <main className="flex-1">
          <DashboardContent />
        </main>
      </div>
    );
  }

  // Auto-collapse sidebar on specific routes
  function SidebarWrapper() {
    const location = useLocation();
    const { state, setOpen, open } = useSidebar();
    
    useEffect(() => {
      // Auto-collapse behavior for dispatcher interface.
      // Remember previous open state so we can restore it when the user navigates back.
      const key = 'sidebar:auto-collapsed-prev-open';
      if (location.pathname === '/dashboard/field/dispatcher/interface') {
        try { sessionStorage.setItem(key, JSON.stringify(open)); } catch (e) { /* ignore */ }
        setOpen(false);
      } else {
        // Leaving the interface: always open sidebar when navigating away from planner
        try {
          const prev = sessionStorage.getItem(key);
          if (prev !== null) {
            // User was on planner and is now navigating away - always open sidebar
            setOpen(true);
            sessionStorage.removeItem(key);
          }
        } catch (e) { /* ignore */ }
      }
    }, [location.pathname, setOpen, open]);

    return (
      <>
        <AppSidebar />
        <div className="flex-1 flex flex-col relative">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <DashboardContent />
          </main>
        </div>
      </>
    );
  }

  // Default sidebar layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SidebarWrapper />
      </div>
    </SidebarProvider>
  );
}

const Dashboard = () => {
  return (
    <LayoutModeProvider>
      <DashboardLayout />
    </LayoutModeProvider>
  );
};

export default Dashboard;