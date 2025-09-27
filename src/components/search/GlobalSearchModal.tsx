import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  X, 
  Users, 
  Wrench, 
  Package, 
  CheckSquare, 
  FileText, 
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data types
export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'service-order' | 'contact' | 'installation' | 'project' | 'article' | 'dispatch';
  status?: string;
  priority?: string;
  location?: string;
  date?: string;
  cost?: string;
  description?: string;
  url: string;
}

// Mock data
const mockSearchData: SearchResultItem[] = [
  // Service Orders
  {
    id: 'SO-2024-001',
    title: 'HVAC System Maintenance',
    subtitle: 'Johnson Manufacturing',
    type: 'service-order',
    status: 'In Progress',
    priority: 'High',
    location: '123 Industrial Blvd',
    date: '2024-01-15',
    cost: '$450.00',
    description: 'Routine maintenance on industrial HVAC system',
    url: '/dashboard/field/service-orders/SO-2024-001'
  },
  {
    id: 'SO-2024-002',
    title: 'Electrical Panel Upgrade',
    subtitle: 'Tech Solutions Inc',
    type: 'service-order',
    status: 'Scheduled',
    priority: 'Medium',
    location: '456 Business Park',
    date: '2024-01-18',
    cost: '$1,200.00',
    description: 'Complete electrical panel replacement and upgrade',
    url: '/dashboard/field/service-orders/SO-2024-002'
  },
  // Contacts
  {
    id: 'C-001',
    title: 'Sarah Johnson',
    subtitle: 'Johnson Manufacturing - Facilities Manager',
    type: 'contact',
    location: '123 Industrial Blvd',
    description: 'Primary contact for HVAC and electrical systems',
    url: '/dashboard/contacts/C-001'
  },
  {
    id: 'C-002',
    title: 'Mike Chen',
    subtitle: 'Tech Solutions Inc - IT Director',
    type: 'contact',
    location: '456 Business Park',
    description: 'Technical infrastructure and facilities management',
    url: '/dashboard/contacts/C-002'
  },
  // Installations
  {
    id: 'I-2024-001',
    title: 'Security Camera System',
    subtitle: 'Downtown Office Complex',
    type: 'installation',
    status: 'Completed',
    location: '789 Main Street',
    date: '2024-01-10',
    cost: '$3,500.00',
    description: '16-camera surveillance system installation',
    url: '/dashboard/field/installations/I-2024-001'
  },
  {
    id: 'I-2024-002',
    title: 'Network Infrastructure',
    subtitle: 'StartupHub Co-working',
    type: 'installation',
    status: 'In Progress',
    location: '321 Innovation Drive',
    date: '2024-01-20',
    cost: '$2,800.00',
    description: 'Complete network cabling and equipment installation',
    url: '/dashboard/field/installations/I-2024-002'
  },
  // Projects
  {
    id: 'P-001',
    title: 'Q1 Office Renovations',
    subtitle: 'Multiple locations facility updates',
    type: 'project',
    status: 'Active',
    date: '2024-03-31',
    description: 'Complete renovation of 3 office locations including HVAC, electrical, and security updates',
    url: '/dashboard/tasks/projects/P-001'
  },
  {
    id: 'P-002',
    title: 'Annual Maintenance Program',
    subtitle: 'Preventive maintenance schedule',
    type: 'project',
    status: 'Planning',
    date: '2024-12-31',
    description: 'Quarterly maintenance program for all managed facilities',
    url: '/dashboard/tasks/projects/P-002'
  },
  // Articles/Knowledge Base
  {
    id: 'A-001',
    title: 'HVAC Troubleshooting Guide',
    subtitle: 'Technical Documentation',
    type: 'article',
    description: 'Comprehensive guide for diagnosing common HVAC system issues',
    url: '/dashboard/knowledge/articles/A-001'
  },
  {
    id: 'A-002',
    title: 'Electrical Safety Protocols',
    subtitle: 'Safety Guidelines',
    type: 'article',
    description: 'Standard operating procedures for electrical work safety',
    url: '/dashboard/knowledge/articles/A-002'
  },
  // Dispatches
  {
    id: 'D-2024-001',
    title: 'Emergency Repair - Building 42',
    subtitle: 'Urgent electrical failure response',
    type: 'dispatch',
    status: 'En Route',
    priority: 'Emergency',
    location: 'Industrial Park East',
    date: '2024-01-16',
    description: 'Power outage in main production facility',
    url: '/dashboard/field/dispatcher/D-2024-001'
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'service-order': return Wrench;
    case 'contact': return Users;
    case 'installation': return Package;
    case 'project': return CheckSquare;
    case 'article': return FileText;
    case 'dispatch': return Clock;
    default: return Search;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'service-order': return 'Service Order';
    case 'contact': return 'Contact';
    case 'installation': return 'Installation';
    case 'project': return 'Project';
    case 'article': return 'Article';
    case 'dispatch': return 'Dispatch';
    default: return type;
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'bg-success/10 text-success border-success/20';
    case 'in progress': case 'active': return 'bg-primary/10 text-primary border-primary/20';
    case 'scheduled': case 'planning': return 'bg-warning/10 text-warning border-warning/20';
    case 'emergency': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'en route': return 'bg-info/10 text-info border-info/20';
    default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
};

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const navigate = useNavigate();

  // Filter results based on search term and type
  const filteredResults = useMemo(() => {
    let results = mockSearchData;

    // Filter by type
    if (selectedType !== 'all') {
      results = results.filter(item => item.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.subtitle.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }

    return results;
  }, [searchTerm, selectedType]);

  const handleResultClick = (result: SearchResultItem) => {
    navigate(result.url);
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedType('all');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Focus search input when modal opens
      setTimeout(() => {
        const input = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const typeFilters = [
    { value: 'all', label: 'All Results', count: mockSearchData.length },
    { value: 'service-order', label: 'Service Orders', count: mockSearchData.filter(i => i.type === 'service-order').length },
    { value: 'contact', label: 'Contacts', count: mockSearchData.filter(i => i.type === 'contact').length },
    { value: 'installation', label: 'Installations', count: mockSearchData.filter(i => i.type === 'installation').length },
    { value: 'project', label: 'Projects', count: mockSearchData.filter(i => i.type === 'project').length },
    { value: 'article', label: 'Articles', count: mockSearchData.filter(i => i.type === 'article').length },
    { value: 'dispatch', label: 'Dispatches', count: mockSearchData.filter(i => i.type === 'dispatch').length },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-screen h-screen sm:w-[95vw] sm:max-w-4xl sm:max-h-[90vh] sm:h-auto p-0 gap-0 m-0 sm:mx-auto sm:rounded-lg rounded-none border-0 sm:border">
        {/* Header */}
        <DialogHeader className="p-3 sm:p-4 pb-2 sm:pb-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg font-semibold">Search Everything</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 sm:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative mt-2 sm:mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-search-input
              placeholder="Search service orders, contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {/* Type Filters */}
          <ScrollArea className="w-full">
            <div className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 pb-2">
              {typeFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedType === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(filter.value)}
                  className="whitespace-nowrap text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                  <span className="ml-1">({filter.count})</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogHeader>

        {/* Results */}
        <ScrollArea className="flex-1 min-h-0 overflow-auto">
          <div className="p-2 sm:p-4 min-h-0">
            {filteredResults.length === 0 ? (
              <div className="text-center py-6 sm:py-8 px-4">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
                  {searchTerm ? 'No results found' : 'Start typing to search'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters'
                    : 'Search across service orders, contacts, installations, projects and more'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredResults.map((result) => {
                  const IconComponent = getTypeIcon(result.type);
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 text-left transition-colors"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5 sm:mt-1">
                          <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                            <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{result.title}</h4>
                            <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">
                              {getTypeLabel(result.type)}
                            </Badge>
                            {result.status && (
                              <Badge className={`text-[10px] sm:text-xs shrink-0 ${getStatusColor(result.status)}`}>
                                {result.status}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{result.subtitle}</p>
                          
                          {result.description && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground/80 line-clamp-2 mb-1 sm:mb-2 hidden sm:block">
                              {result.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                            {result.location && (
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                <span className="truncate">{result.location}</span>
                              </div>
                            )}
                            {result.date && (
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                <span>{result.date}</span>
                              </div>
                            )}
                            {result.cost && (
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                                <span>{result.cost}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}