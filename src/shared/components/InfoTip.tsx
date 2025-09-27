import * as React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface InfoTipProps {
  title?: string;
  description?: string;
  tooltip?: string;
  className?: string;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * InfoTip
 * A small reusable info helper to place next to inputs/labels.
 * - Hover: shows a brief tooltip
 * - Click: opens a compact popover with richer help content
 */
export function InfoTip({
  title = "More information",
  description,
  tooltip = "More info",
  className,
  children,
  side,
}: InfoTipProps) {
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-5 w-5 p-0 text-muted-foreground hover:text-foreground",
                  className
                )}
                aria-label={tooltip}
              >
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

    <PopoverContent className="w-80" side={side}>
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        {children}
      </PopoverContent>
    </Popover>
  );
}
