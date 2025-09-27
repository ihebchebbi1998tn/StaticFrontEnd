import { useState } from 'react';
import { Search, List, Table, Filter, ChevronDown } from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// dropdown-menu removed in favor of inline filters

import inventoryFilterTypes from '@/data/mock/inventory-filter-types.json';

export function InventorySearchControls({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  serviceCategories,
  viewMode,
  setViewMode,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterType: string;
  setFilterType: (v: any) => void;
  serviceCategories: { id: string; name: string }[];
  viewMode: 'list' | 'table';
  setViewMode: (v: 'list' | 'table') => void;
}) {
  const activeFilterCount = filterType === 'all' ? 0 : 1;

  // local UI state for inline selects when desired in future
  const [localShowFilters, setLocalShowFilters] = useState(false);

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 sm:gap-3 flex-1 w-full">
          <CollapsibleSearch 
            placeholder="Search items and services..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setLocalShowFilters(v => !v)}>
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">{activeFilterCount}</Badge>
              )}
            </Button>

            {localShowFilters && (
              <div className="flex gap-2 items-end">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <div className="relative">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground text-sm">
                      <option value="all">All</option>
                      {inventoryFilterTypes.map((t:any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                      {serviceCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('list')} 
            className={`flex-1 sm:flex-none ${viewMode === 'list' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
          >
            <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-white' : ''}`} />
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('table')} 
            className={`flex-1 sm:flex-none ${viewMode === 'table' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
          >
            <Table className={`h-4 w-4 ${viewMode === 'table' ? 'text-white' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
