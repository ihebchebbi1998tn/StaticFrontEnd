import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import offerStatuses from '@/data/mock/offer-statuses.json';
import { useLookups } from '@/shared/contexts/LookupsContext';
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { OfferFilters } from "../types";

interface OffersSearchControlsProps {
  filters: OfferFilters;
  onFiltersChange: (filters: OfferFilters) => void;
}

export function OffersSearchControls({ filters, onFiltersChange }: OffersSearchControlsProps) {
  const { t } = useTranslation();
  const { priorities } = useLookups();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === 'all' ? undefined : value 
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      priority: value === 'all' ? undefined : value 
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value 
    });
  };

  const handleSourceChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      source: value === 'all' ? undefined : value 
    });
  };

  const handleRecurringFilter = () => {
    onFiltersChange({ 
      ...filters, 
      isRecurring: filters.isRecurring === undefined ? true : undefined 
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.status || filters.priority || filters.category || filters.source || filters.isRecurring !== undefined || filters.search;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('searchOffers')}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('filters.by_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.all_offers')}</SelectItem>
              {offerStatuses.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.priority || 'all'} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('filters.by_priority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.all_priorities') || 'All priorities'}</SelectItem>
              {priorities.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="potential">Potential</SelectItem>
              <SelectItem value="big_project">Big Project</SelectItem>
              <SelectItem value="likely_to_close">Likely to Close</SelectItem>
              <SelectItem value="unlikely_to_close">Unlikely to Close</SelectItem>
              <SelectItem value="follow_up_required">Follow-up Required</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.source || 'all'} onValueChange={handleSourceChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="direct_customer">Direct Customer</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="email_marketing">Email Marketing</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="trade_show">Trade Show</SelectItem>
              <SelectItem value="cold_call">Cold Call</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={filters.isRecurring ? "default" : "outline"}
            onClick={handleRecurringFilter}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('filters.recurring_only')}
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{t('filters.active') || 'Active filters:'}</span>
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {t(`status.${filters.status}`)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusChange('all')}
              />
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              Priority: {t(`priority.${filters.priority}`)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePriorityChange('all')}
              />
            </Badge>
           )}
           {filters.category && (
             <Badge variant="secondary" className="gap-1">
               Category: {filters.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
               <X 
                 className="h-3 w-3 cursor-pointer" 
                 onClick={() => handleCategoryChange('all')}
               />
             </Badge>
           )}
           {filters.source && (
             <Badge variant="secondary" className="gap-1">
               Source: {filters.source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
               <X 
                 className="h-3 w-3 cursor-pointer" 
                 onClick={() => handleSourceChange('all')}
               />
             </Badge>
           )}
           {filters.isRecurring && (
             <Badge variant="secondary" className="gap-1">
               {t('filters.recurring_only')}
               <X 
                 className="h-3 w-3 cursor-pointer" 
                 onClick={handleRecurringFilter}
               />
             </Badge>
           )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            {t('clearFilters') || 'Clear all'}
          </Button>
        </div>
      )}
    </div>
  );
}