import { useState, useMemo } from "react";
import { usePaginatedData } from "@/shared/hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Target, 
  CheckCircle,
  XCircle,
  Edit, 
  Trash2,
  Eye, 
  MoreVertical, 
  Calendar,
  User,
  Building2,
  List, 
  Table as TableIcon,
  Send,
  RefreshCw,
  GitBranch,
  Map, Download
} from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { ChevronDown } from "lucide-react";
import { Offer } from "../types";
import { useOffers } from "../hooks/useOffers";
import { useLookups } from '@/shared/contexts/LookupsContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from "date-fns";
import { MapOverlay } from "@/components/shared/MapOverlay";
import { mapOffersToMapItems } from "@/components/shared/mappers";
import { ExportModal, ExportConfig } from "@/components/shared/ExportModal";

export function OffersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState<'all' | string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'any' | '7' | '30' | '365'>('any');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showMap, setShowMap] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    offers,
    stats,
    loading,
    sendOffer,
    acceptOffer,
    declineOffer,
    deleteOffer,
    renewOffer,
    convertOffer
  } = useOffers();

  const { priorities: lookupPriorities } = useLookups();

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
      const matchesAssigned = filterAssigned === 'all' || (offer.assignedToName || '').toLowerCase() === filterAssigned.toLowerCase();
      // simple date range filter on createdAt
      const matchesDate = (() => {
        if (filterDateRange === 'any') return true;
        const days = Number(filterDateRange);
        if (!offer.createdAt) return true;
        const created = new Date(offer.createdAt);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return created >= cutoff;
      })();
      
      // Handle stat filters
      if (selectedStat === 'active') return matchesSearch && ['draft', 'sent'].includes(offer.status);
      if (selectedStat === 'accepted') return matchesSearch && offer.status === 'accepted';
      if (selectedStat === 'declined') return matchesSearch && ['declined', 'cancelled'].includes(offer.status);
      
  return matchesSearch && matchesStatus && matchesAssigned && matchesDate;
    });
  }, [offers, searchTerm, filterStatus, selectedStat, filterAssigned, filterDateRange]);

  const pagination = usePaginatedData(filteredOffers, 5);

  const assignedOptions = useMemo(() => {
    return Array.from(new Set(offers.map(o => (o.assignedToName || '').trim()).filter(Boolean)));
  }, [offers]);

  const handleOfferClick = (offer: Offer) => {
    navigate(`/dashboard/offers/${offer.id}`);
  };

  const handleAddOffer = () => {
    navigate('/dashboard/offers/add');
  };

  const handleViewOffer = (offer: any) => {
    navigate(`/dashboard/offers/${offer.id}`);
  };

  const handleEditOffer = (offer: any) => {
    navigate(`/dashboard/offers/${offer.id}/edit`);
  };

  const totalValue = useMemo(() => offers.reduce((sum, offer) => sum + (offer.totalAmount || offer.amount), 0), [offers]);

  const exportConfig: ExportConfig = {
    filename: 'offers-export',
    allDataTransform: (offer: any) => ({
      'ID': offer.id,
      'Title': offer.title,
      'Contact Name': offer.contactName,
      'Contact Company': offer.contactCompany,
      'Contact Email': offer.contactEmail || 'N/A',
      'Status': offer.status,
      'Total Amount': offer.totalAmount || offer.amount,
      'Currency': offer.currency || 'TND',
      'Valid Until': offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'Not set',
      'Assigned To': offer.assignedToName || 'Unassigned',
      'Created At': offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A',
      'Updated At': offer.updatedAt ? new Date(offer.updatedAt).toLocaleDateString() : 'N/A',
      'Description': offer.description || '',
    }),
    availableColumns: [
      { key: 'id', label: 'ID', category: 'Basic' },
      { key: 'title', label: 'Title', category: 'Basic' },
      { key: 'status', label: 'Status', category: 'Basic' },
      { key: 'priority', label: 'Priority', category: 'Basic' },
      { key: 'contactName', label: 'Contact Name', category: 'Contact' },
      { key: 'contactCompany', label: 'Contact Company', category: 'Contact' },
      { key: 'contactEmail', label: 'Contact Email', category: 'Contact' },
      { key: 'totalAmount', label: 'Total Amount', category: 'Financial' },
      { key: 'amount', label: 'Amount', category: 'Financial' },
      { key: 'currency', label: 'Currency', category: 'Financial' },
      { key: 'validUntil', label: 'Valid Until', category: 'Timeline', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'Not set' },
      { key: 'assignedToName', label: 'Assigned To', category: 'Assignment' },
      { key: 'createdAt', label: 'Created Date', category: 'Timeline', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
      { key: 'updatedAt', label: 'Updated Date', category: 'Timeline', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
      { key: 'description', label: 'Description', category: 'Details' },
    ]
  };

  const statsData = [
    {
      label: t("offers.total_offers"),
      value: offers.length,
      icon: FileText,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: t("offers.active_offers"),
      value: offers.filter(o => ['draft', 'sent'].includes(o.status)).length,
      icon: Target,
      color: "chart-2", 
      filter: 'active'
    },
    {
      label: t("offers.accepted_offers"),
      value: offers.filter(o => o.status === 'accepted').length,
      icon: CheckCircle,
      color: "chart-3",
      filter: 'accepted'
    },
    {
      label: t("offers.total_value"),
      value: `${totalValue.toLocaleString()} TND`,
      icon: DollarSign,
      color: "chart-4",
      filter: 'value'
    }
  ];

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setFilterStatus('all');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'modified': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (loading && !offers.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('loading_offers')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header (workflow style) - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('offers.title', 'Offers')}</h1>
            <p className="text-[11px] text-muted-foreground">{t('offers.subtitle', 'Manage quotes and proposals')}</p>
          </div>
        </div>
        <div>
          <Button className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift w-full sm:w-auto" onClick={handleAddOffer}>
            <Plus className="mr-2 h-4 w-4 text-white" />
            {t("add_offer")}
          </Button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <Button size="sm" className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" onClick={handleAddOffer}>
          <Plus className="mr-2 h-4 w-4 text-white" />
          {t("add_offer")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => {
            const isSelected = selectedStat === stat.filter;
            return (
              <Card 
                key={index} 
                className={`shadow-card hover-lift gradient-card group cursor-pointer transition-all hover:shadow-lg ${
                  isSelected 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border-0'
                }`}
                onClick={() => handleStatClick(stat)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        isSelected 
                          ? 'bg-primary/20' 
                          : `bg-${stat.color}/10 group-hover:bg-${stat.color}/20`
                      }`}>
                        <stat.icon className={`h-4 w-4 transition-all ${
                          isSelected 
                            ? 'text-primary' 
                            : `text-${stat.color}`
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium truncate">{stat.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full items-center">
            <div className="flex-1">
              <CollapsibleSearch 
                placeholder={t("searchOffers")} 
                value={searchTerm} 
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            {/* Filter dropdown replaced by slide-down filter bar (see below) */}
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {filterStatus !== 'all' && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    1
                  </Badge>
                )}
              </Button>
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
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
              <TableIcon className={`h-4 w-4 ${viewMode === 'table' ? 'text-white' : ''}`} />
            </Button>
            <Button 
              variant={showMap ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setShowMap(!showMap)} 
              className={`flex-1 sm:flex-none ${showMap ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
            >
              <Map className={`h-4 w-4 ${showMap ? 'text-white' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* List/Table View */}
      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)}>
                  <option value="all">All Assignees</option>
                  {assignedOptions.map((a, i) => (
                    <option key={i} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterDateRange} onChange={e => setFilterDateRange(e.target.value as any)}>
                  <option value="any">Any Time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="365">Last year</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterAssigned('all'); setFilterDateRange('any'); setShowFilterBar(false); }}>{t('clear')}</button>
            </div>
          </div>
        </div>
      )}
      {viewMode === 'list' ? (
  <div className="p-2 sm:p-3 lg:p-4">
          <Card className="shadow-card border-0 bg-card text-[0.85rem]">
            <MapOverlay 
              items={mapOffersToMapItems(filteredOffers)}
              onViewItem={handleViewOffer}
              onEditItem={handleEditOffer}
              onClose={() => setShowMap(false)}
              isVisible={showMap}
            />
            <CardContent className="p-0">
              {filteredOffers.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("no_offers_found")}</h3>
                  <p className="text-muted-foreground">Start by creating your first offer</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pagination.data.map((offer) => (
                    <div 
                      key={offer.id} 
                      className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer" 
                      onClick={() => handleOfferClick(offer)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                              <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
                            </AvatarFallback>
                          </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{offer.title}</h3>
                                <Badge className={`${getStatusColor(offer.status)} text-xs`}>
                                  {t(offer.status)}
                                </Badge>
                              </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                              <span className="truncate">{offer.contactName} - {offer.contactCompany}</span>
                              <span className="font-semibold text-foreground">
                                {(offer.totalAmount || offer.amount).toLocaleString()} {offer.currency}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{offer.assignedToName || t('unassigned')}</span>
                              </div>
                              
                              <div className="hidden sm:flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>
                                  {offer.validUntil ? formatDate(offer.validUntil) : t('noExpiryDate')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                          <div className="flex gap-1 flex-wrap flex-1 sm:flex-none">
                            {offer.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {offer.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                +{offer.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="gap-2" 
                                onClick={(e: any) => { e.stopPropagation(); handleOfferClick(offer); }}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2" 
                                onClick={(e: any) => { e.stopPropagation(); navigate(`/dashboard/offers/edit/${offer.id}`); }}
                              >
                                <Edit className="h-4 w-4" />
                                Edit Offer
                              </DropdownMenuItem>
                              {['draft', 'modified'].includes(offer.status) && (
                                <DropdownMenuItem 
                                  className="gap-2" 
                                  onClick={(e: any) => { e.stopPropagation(); sendOffer(offer.id); }}
                                >
                                  <Send className="h-4 w-4" />
                                  {t('send_offer')}
                                </DropdownMenuItem>
                              )}
                              {offer.status === 'accepted' && (
                                <DropdownMenuItem 
                                  className="gap-2" 
                                  onClick={(e: any) => { e.stopPropagation(); }}
                                >
                                  <GitBranch className="h-4 w-4" />
                                  Convert to Sale
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="gap-2 text-destructive"
                                onClick={(e: any) => { e.stopPropagation(); deleteOffer(offer.id); }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Offer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-3 sm:p-4 lg:p-6 w-full">
        <Card className="shadow-card border-0 bg-card w-full">
            <MapOverlay 
              items={mapOffersToMapItems(filteredOffers)}
              onViewItem={handleViewOffer}
              onEditItem={handleEditOffer}
              onClose={() => setShowMap(false)}
              isVisible={showMap}
            />
            <CardContent className="p-0">
              {filteredOffers.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("no_offers_found")}</h3>
                  <p className="text-muted-foreground">Start by creating your first offer</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                     style={{ WebkitOverflowScrolling: 'touch' }}>
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="w-[200px] font-semibold text-foreground">Offer</TableHead>
                        <TableHead className="font-semibold text-foreground">Contact</TableHead>
                        <TableHead className="font-semibold text-foreground">Amount</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="font-semibold text-foreground">Valid Until</TableHead>
                        <TableHead className="w-[50px] font-semibold text-foreground"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagination.data.map((offer) => (
                        <TableRow 
                          key={offer.id} 
                          className="border-border hover:bg-muted/50 cursor-pointer group" 
                          onClick={() => handleOfferClick(offer)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  <FileText className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="truncate">
                                <div className="font-semibold text-foreground truncate">{offer.title}</div>
                                <div className="text-xs text-muted-foreground">#{offer.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-foreground">{offer.contactName}</div>
                              <div className="text-muted-foreground">{offer.contactCompany}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-foreground">
                              {(offer.totalAmount || offer.amount).toLocaleString()} {offer.currency}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(offer.status)}>
                              {t(offer.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {offer.validUntil ? formatDate(offer.validUntil) : t('noExpiryDate')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="gap-2" 
                                  onClick={(e: any) => { e.stopPropagation(); handleOfferClick(offer); }}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2" 
                                  onClick={(e: any) => { e.stopPropagation(); navigate(`/dashboard/offers/edit/${offer.id}`); }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit Offer
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2 text-destructive"
                                  onClick={(e: any) => { e.stopPropagation(); deleteOffer(offer.id); }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete Offer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Export Modal */}
      <ExportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={filteredOffers}
        moduleName="Offers"
        exportConfig={exportConfig}
      />
    </div>
  );
}