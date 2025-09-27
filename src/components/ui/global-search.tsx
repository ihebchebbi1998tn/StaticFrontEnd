import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  TrendingUp, 
  Package, 
  Wrench, 
  CheckSquare, 
  Calendar,
  X,
  Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Import data sources
import contactsData from "@/data/mock/contacts.json";
import salesData from "@/data/mock/sales.json";
import articlesData from "@/data/mock/articles.json";
import servicesData from "@/data/mock/services.json";
import projectsData from "@/data/mock/projects.json";
import calendarData from "@/data/mock/calendarData.json";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'contact' | 'sale' | 'article' | 'service' | 'project' | 'calendar';
  route: string;
  icon: any;
  status?: string;
  amount?: number;
  currency?: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { t: _t } = useTranslation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Navigate to a selected result (declared early to avoid TDZ issues in effects)
  const handleSelectResult = useCallback((result: SearchResult) => {
    navigate(result.route);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelectResult]);

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().trim();
    const allResults: SearchResult[] = [];

    // Search contacts
    contactsData.forEach((contact: any) => {
      const searchFields = [
        contact.name,
        contact.email,
        contact.company,
        contact.position,
        contact.status,
        ...(contact.tags || [])
      ].join(' ').toLowerCase();

      if (searchFields.includes(searchTerms)) {
        allResults.push({
          id: contact.id.toString(),
          title: contact.name,
          subtitle: `${contact.position} at ${contact.company}`,
          type: 'contact',
          route: `/dashboard/contacts/${contact.id}`,
          icon: Users,
          status: contact.status
        });
      }
    });

    // Search sales
    salesData.forEach((sale: any) => {
      const searchFields = [
        sale.title,
        sale.contactName,
        sale.contactCompany,
        sale.status,
        sale.description,
        ...(sale.tags || [])
      ].join(' ').toLowerCase();

      if (searchFields.includes(searchTerms)) {
        allResults.push({
          id: sale.id,
          title: sale.title,
          subtitle: `${sale.contactName} - ${sale.contactCompany}`,
          type: 'sale',
          route: `/dashboard/sales/${sale.id}`,
          icon: TrendingUp,
          status: sale.status,
          amount: sale.amount,
          currency: sale.currency
        });
      }
    });

    // Search articles
    if (articlesData && Array.isArray(articlesData)) {
      articlesData.forEach((article: any) => {
        const searchFields = [
          article.name,
          article.description,
          article.category,
          article.supplier,
          article.reference
        ].join(' ').toLowerCase();

        if (searchFields.includes(searchTerms)) {
          allResults.push({
            id: article.id.toString(),
            title: article.name,
            subtitle: `${article.category} - ${article.supplier}`,
            type: 'article',
            route: `/dashboard/inventory-services/${article.id}`,
            icon: Package,
            status: article.stock > 0 ? 'In Stock' : 'Out of Stock'
          });
        }
      });
    }

    // Search services
    if (servicesData && Array.isArray(servicesData)) {
      servicesData.forEach((service: any) => {
        const searchFields = [
          service.name,
          service.description,
          service.category
        ].join(' ').toLowerCase();

        if (searchFields.includes(searchTerms)) {
          allResults.push({
            id: service.id.toString(),
            title: service.name,
            subtitle: service.description,
            type: 'service',
            route: `/dashboard/inventory-services/services/${service.id}`,
            icon: Wrench,
            amount: service.price,
            currency: 'USD'
          });
        }
      });
    }

    // Search projects
    if (projectsData && Array.isArray(projectsData)) {
      projectsData.forEach((project: any) => {
        const searchFields = [
          project.name,
          project.description,
          project.status,
          project.ownerName
        ].join(' ').toLowerCase();

        if (searchFields.includes(searchTerms)) {
          allResults.push({
            id: project.id.toString(),
            title: project.name,
            subtitle: `Owner: ${project.ownerName}`,
            type: 'project',
            route: `/dashboard/tasks/projects/${project.id}`,
            icon: CheckSquare,
            status: project.status
          });
        }
      });
    }

    // Search calendar events
    if (calendarData && Array.isArray(calendarData)) {
      calendarData.forEach((event: any) => {
        const searchFields = [
          event.title,
          event.description,
          event.type,
          event.location
        ].join(' ').toLowerCase();

        if (searchFields.includes(searchTerms)) {
          allResults.push({
            id: event.id.toString(),
            title: event.title,
            subtitle: event.description || event.location,
            type: 'calendar',
            route: `/dashboard/calendar?eventId=${event.id}`,
            icon: Calendar,
            status: event.type
          });
        }
      });
    }

    // Sort results by relevance and limit to 8
    const sortedResults = allResults
      .sort((a, b) => {
        const aExactMatch = a.title.toLowerCase().includes(searchTerms);
        const bExactMatch = b.title.toLowerCase().includes(searchTerms);
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      })
      .slice(0, 8);

    setResults(sortedResults);
    setSelectedIndex(-1);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  // handler defined earlier

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'sale': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'article': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'service': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'project': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'calendar': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search contacts, sales, articles, services..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-10 h-10 md:h-11 w-full bg-background border-border focus:border-primary transition-colors text-sm md:text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-border bg-muted/50">
            <p className="text-xs text-muted-foreground font-medium">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="py-1">
            {results.map((result, index) => {
              const Icon = result.icon;
              const isSelected = index === selectedIndex;
              
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  className={`w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-accent/70' : ''
                  }`}
                  onClick={() => handleSelectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-shrink-0">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {result.title}
                      </p>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                        {result.type}
                      </Badge>
                    </div>
                    
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      {result.status && (
                        <Badge variant="secondary" className="text-xs">
                          {result.status}
                        </Badge>
                      )}
                      {result.amount && (
                        <span className="text-xs font-medium text-primary">
                          {formatCurrency(result.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="p-2 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Use ↑↓ to navigate, Enter to select, Esc to close
            </p>
          </div>
        </div>
      )}
      
      {/* No results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No results found for "{query}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for contacts, sales, articles, or services
            </p>
          </div>
        </div>
      )}
    </div>
  );
}