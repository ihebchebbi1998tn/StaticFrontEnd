import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarRange, MoreVertical } from "lucide-react";

interface DispatcherHeaderProps {
  onDispatchJobs: () => void;
}

export function DispatcherHeader({ onDispatchJobs }: DispatcherHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <CalendarRange className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('dispatcher.title')}</h1>
          <p className="text-[11px] text-muted-foreground">{t('dispatcher.description')}</p>
        </div>
      </div>
      {/* Desktop Button */}
      <Button 
        className="hidden sm:flex bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift px-4 py-2"
        onClick={onDispatchJobs}
      >
        <CalendarRange className="mr-2 h-4 w-4" />
        {t('dispatcher.dispatch_jobs')}
      </Button>

      {/* Mobile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden p-2 hover:bg-primary/10"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
          <DropdownMenuItem onClick={onDispatchJobs} className="cursor-pointer">
            <CalendarRange className="mr-2 h-4 w-4" />
            {t('dispatcher.dispatch_jobs')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}