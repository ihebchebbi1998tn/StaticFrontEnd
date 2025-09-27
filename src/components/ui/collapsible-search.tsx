import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapsibleSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CollapsibleSearch({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className 
}: CollapsibleSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!value) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, value]);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    onChange("");
    setIsExpanded(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {!isExpanded ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchClick}
          className="h-9 sm:h-10 px-3 gap-2 hover:bg-muted/50 transition-all"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline text-muted-foreground">Search</span>
        </Button>
      ) : (
        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              className="pl-10 pr-10 h-9 sm:h-10 border-border bg-background text-sm min-w-[200px] sm:min-w-[300px]"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted/50"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {!value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-9 sm:h-10 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}