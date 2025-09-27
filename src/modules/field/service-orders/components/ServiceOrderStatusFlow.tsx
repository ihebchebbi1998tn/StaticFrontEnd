import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceOrderStatus = 
  | "open" 
  | "ready_for_planning" 
  | "planned" 
  | "technically_completed" 
  | "invoiced" 
  | "closed";

interface StatusStep {
  key: ServiceOrderStatus;
  label: string;
}

const statusSteps: StatusStep[] = [
  {
    key: "open",
    label: "Open"
  },
  {
    key: "ready_for_planning", 
    label: "Ready for Planning"
  },
  {
    key: "planned",
    label: "Planned"
  },
  {
    key: "technically_completed",
    label: "Technically Completed"
  },
  {
    key: "invoiced",
    label: "Invoiced"
  },
  {
    key: "closed",
    label: "Closed"
  }
];

interface ServiceOrderStatusFlowProps {
  currentStatus: ServiceOrderStatus;
  onStatusChange: (newStatus: ServiceOrderStatus) => void;
  disabled?: boolean;
}

export function ServiceOrderStatusFlow({ 
  currentStatus, 
  onStatusChange, 
  disabled = false 
}: ServiceOrderStatusFlowProps) {
  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < statusSteps.length - 1;

  // Always show exactly 3 steps for consistent spacing
  const getVisibleSteps = () => {
    const steps = [];
    
    // Previous step (or placeholder)
    if (currentIndex > 0) {
      steps.push({
        ...statusSteps[currentIndex - 1],
        index: currentIndex - 1,
        status: 'previous' as const
      });
    } else {
      steps.push({
        key: 'placeholder-prev' as ServiceOrderStatus,
        label: '',
        index: -1,
        status: 'placeholder' as const
      });
    }
    
    // Current step (always exists)
    steps.push({
      ...statusSteps[currentIndex],
      index: currentIndex,
      status: 'current' as const
    });
    
    // Next step (or placeholder)
    if (currentIndex < statusSteps.length - 1) {
      steps.push({
        ...statusSteps[currentIndex + 1],
        index: currentIndex + 1,
        status: 'next' as const
      });
    } else {
      steps.push({
        key: 'placeholder-next' as ServiceOrderStatus,
        label: '',
        index: -1,
        status: 'placeholder' as const
      });
    }
    
    return steps;
  };

  const handlePrevious = () => {
    if (canGoBack && !disabled) {
      onStatusChange(statusSteps[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (canGoForward && !disabled) {
      onStatusChange(statusSteps[currentIndex + 1].key);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (disabled) return;
    
    // Allow clicking on previous, current, or next step only
    if (stepIndex >= Math.max(0, currentIndex - 1) && stepIndex <= Math.min(statusSteps.length - 1, currentIndex + 1)) {
      onStatusChange(statusSteps[stepIndex].key);
    }
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between gap-2">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoBack || disabled}
            className={cn(
              "flex-shrink-0 w-8 h-8 p-0",
              canGoBack 
                ? "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20" 
                : "opacity-30"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Status Steps */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1">
              {visibleSteps.map((step, idx) => (
                <div key={step.key} className="flex items-center">
                  {step.status !== 'placeholder' ? (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleStepClick(step.index)}
                       disabled={disabled || step.index === -1}
                       className={cn(
                         "h-8 px-3 py-1 text-xs font-medium transition-all duration-200 min-w-[120px] flex items-center gap-2",
                         step.status === 'current' && "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
                         step.status === 'previous' && "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
                         step.status === 'next' && "text-muted-foreground hover:bg-muted/50",
                         "cursor-pointer"
                       )}
                     >
                       {step.status === 'previous' && (
                         <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                       )}
                       {step.status === 'current' && (
                         <Loader2 className="h-3 w-3 text-primary animate-spin" />
                       )}
                       <span className="truncate">
                         {step.label}
                       </span>
                     </Button>
                  ) : (
                    <div className="h-8 px-3 py-1 min-w-[120px]">
                      {/* Empty placeholder for spacing */}
                    </div>
                  )}
                  
                  {/* Arrow between steps */}
                  {idx < visibleSteps.length - 1 && step.status !== 'placeholder' && visibleSteps[idx + 1].status !== 'placeholder' && (
                    <ChevronRight className={cn(
                      "h-3 w-3 mx-1 flex-shrink-0",
                      step.status === 'previous' ? "text-primary" : "text-muted-foreground/50"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forward Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoForward || disabled}
            className={cn(
              "flex-shrink-0 w-8 h-8 p-0",
              canGoForward 
                ? "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20" 
                : "opacity-30"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoBack || disabled}
            className={cn(
              "w-8 h-8 p-0",
              !canGoBack && "opacity-30"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 text-center">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
              "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            )}>
              {currentIndex > 0 && (
                <Check className="h-3 w-3 text-primary-foreground opacity-60" />
              )}
              {statusSteps[currentIndex].label}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoForward || disabled}
            className={cn(
              "w-8 h-8 p-0",
              !canGoForward && "opacity-30"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-3">
          <div className="flex justify-center gap-1">
            {visibleSteps.filter(step => step.status !== 'placeholder').map((step) => (
              <div
                key={step.key}
                 className={cn(
                   "h-1.5 rounded-full transition-all duration-200",
                   step.status === 'current' ? "w-6 bg-blue-500" :
                   step.status === 'previous' ? "w-2 bg-green-500" : "w-2 bg-muted-foreground/30"
                 )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}