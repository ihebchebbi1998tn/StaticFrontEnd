// Centralized prefetchers for lazy route chunks
// Vite will create separate chunks for these dynamic imports.

export const preloadDashboard = () => import("@/modules/dashboard/pages/Dashboard");
export const preloadSupport = () => import("@/modules/support/SupportModuleRoutes");
export const preloadOnboarding = () => import("@/modules/onboarding/pages/Onboarding");
export const preloadLogin = () => import("@/modules/auth/pages/Login");
export const preloadNotFound = () => import("@/pages/NotFound");

// Small helper to schedule work during idle time
export function runWhenIdle(fn: () => void, timeout = 1500) {
  if (typeof (window as any).requestIdleCallback === "function") {
    (window as any).requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, timeout);
  }
}
