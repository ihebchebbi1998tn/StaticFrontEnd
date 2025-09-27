import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useLookups } from '@/shared/contexts/LookupsContext';
import { CollapsibleSearch } from "@/components/ui/collapsible-search";

export interface DispatcherFilters {
  searchTerm: string;
  status: string;
  priority: string;
}

interface DispatcherSearchControlsProps {
  filters: DispatcherFilters;
  onFiltersChange: (filters: DispatcherFilters) => void;
}

export function DispatcherSearchControls({ filters, onFiltersChange }: DispatcherSearchControlsProps) {
  const { t } = useTranslation();
  const [showFilterBar, setShowFilterBar] = useState(false);
  const { priorities: lookupPriorities } = useLookups();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ ...filters, priority: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      status: 'all',
      priority: 'all'
    });
    setShowFilterBar(false);
  };

  const activeFiltersCount = [
    filters.status !== 'all' ? 1 : 0,
    filters.priority !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return {
    searchComponent: (
      <CollapsibleSearch 
        placeholder={t("dispatcher.search_placeholder")}
        value={filters.searchTerm}
        onChange={handleSearchChange}
        className="w-full"
      />
    ),
    filterButton: (
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1 sm:gap-2 px-2 sm:px-3" 
        onClick={() => setShowFilterBar(s => !s)}
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">{t('dispatcher.filter')}</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    ),
    showFilterBar,
    filterBar: showFilterBar && (
      <div className="p-3 sm:p-4 border-b border-border bg-background/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <select 
                className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" 
                value={filters.status} 
                onChange={e => handleStatusChange(e.target.value)}
              >
                <option value="all">{t('dispatcher.by_status')}</option>
                <option value="unassigned">{t('dispatcher.status_unassigned')}</option>
                <option value="assigned">{t('dispatcher.status_assigned')}</option>
                <option value="in_progress">{t('dispatcher.status_in_progress')}</option>
                <option value="completed">{t('dispatcher.status_completed')}</option>
                <option value="cancelled">{t('dispatcher.status_cancelled')}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative">
              <select 
                className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" 
                value={filters.priority} 
                onChange={e => handlePriorityChange(e.target.value)}
              >
                <option value="all">{t('dispatcher.by_priority')}</option>
                {lookupPriorities.map((p:any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {t('dispatcher.clear')}
            </Button>
          </div>
        </div>
      </div>
    )
  };
}