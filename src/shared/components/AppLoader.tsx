import React from "react";
import { cn } from "@/lib/utils";

export type AppLoaderProps = {
  message?: string;
  className?: string;
};

export const AppLoader: React.FC<AppLoaderProps> = ({ message = "Loading...", className }) => {
  return (
    <div className={cn("fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-background to-muted/30", className)}>
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Loader card */}
      <div className="relative flex flex-col items-center rounded-2xl border bg-background/80 p-8 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/70">
        {/* Brand mark */}
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Please wait a second</p>
          </div>
        </div>

        {/* Progress bar shimmer */}
        <div className="relative h-2 w-64 overflow-hidden rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-primary/60" />
        </div>

        {/* Message */}
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(30%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  );
};

export default AppLoader;
