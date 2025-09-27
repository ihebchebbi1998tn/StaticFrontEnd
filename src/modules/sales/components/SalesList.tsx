import { useMemo, useState } from "react";
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
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Target, 
  Trophy,
  Edit, 
  Trash2, 
  Eye,
  MoreVertical, 
  Calendar,
  User,
  Building2,
  List, 
  Table as TableIcon,
  ChevronDown,
  Map, Download
} from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TableLayout from '@/components/shared/TableLayout';

// Import mock data
import { Sale } from "../types";
import { useCurrency } from '@/shared/hooks/useCurrency';
import { useSalesList } from "../hooks/useSalesList";
import { getSales } from "../services/sales.service";
import { getPriorityColor, getStatusColor, formatDate } from "../utils/presentation";
import { useLookups } from '@/shared/contexts/LookupsContext';
import { MapOverlay } from "@/components/shared/MapOverlay";
import { mapSalesToMapItems } from "@/components/shared/mappers";
import { ExportModal, ExportConfig } from "@/components/shared/ExportModal";

export function SalesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sales = getSales();
  const {
  viewMode, setViewMode,
  searchTerm, setSearchTerm,
  filterStatus, setFilterStatus,
  filterStage, setFilterStage,
  filterPriority, setFilterPriority,
  filterAssigned, setFilterAssigned,
  selectedStat, 
    filteredSales,
    handleStatClick,
  } = useSalesList(sales);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSaleClick = (sale: Sale) => {
    navigate(`/dashboard/sales/${sale.id}`);
  };

  const handleAddSale = () => {
    navigate('/dashboard/sales/add');
  };

  const handleViewSale = (sale: any) => {
    navigate(`/dashboard/sales/${sale.id}`);
  };

  const handleEditSale = (sale: any) => {
    navigate(`/dashboard/sales/${sale.id}/edit`);
  };

  const { format: formatCurrency } = useCurrency();
  const { priorities: lookupPriorities } = useLookups();
  
  const totalValue = useMemo(() => sales.reduce((sum, sale) => sum + sale.amount, 0), [sales]);
  const wonSales = useMemo(() => sales.filter(s => s.status === 'won'), [sales]);

  const exportConfig: ExportConfig = {
    filename: 'sales-export',
    allDataTransform: (sale: any) => ({
      'ID': sale.id,
      'Title': sale.title,
      'Contact Name': sale.contactName,
      'Contact Company': sale.contactCompany,
      'Contact Email': sale.contactEmail,
      'Status': sale.status,
      'Priority': sale.priority,
      'Stage': sale.stage,
      'Amount': sale.amount,
      'Currency': sale.currency,
      'Assigned To': sale.assignedToName || 'Unassigned',
      'Tags': sale.tags.join(', '),
      'Estimated Close Date': sale.estimatedCloseDate ? new Date(sale.estimatedCloseDate).toLocaleDateString() : 'Not set',
      'Created At': new Date(sale.createdAt).toLocaleDateString(),
      'Updated At': new Date(sale.updatedAt).toLocaleDateString(),
      'Notes': sale.notes || '',
    }),
    availableColumns: [
      { key: 'id', label: 'ID', category: 'Basic' },
      { key: 'title', label: 'Title', category: 'Basic' },
      { key: 'status', label: 'Status', category: 'Basic' },
      { key: 'priority', label: 'Priority', category: 'Basic' },
      { key: 'stage', label: 'Stage', category: 'Basic' },
      { key: 'contactName', label: 'Contact Name', category: 'Contact' },
      { key: 'contactCompany', label: 'Contact Company', category: 'Contact' },
      { key: 'contactEmail', label: 'Contact Email', category: 'Contact' },
      { key: 'amount', label: 'Amount', category: 'Financial' },
      { key: 'currency', label: 'Currency', category: 'Financial' },
      { key: 'assignedToName', label: 'Assigned To', category: 'Assignment' },
      { key: 'tags', label: 'Tags', category: 'Details', transform: (tags: string[]) => Array.isArray(tags) ? tags.join(', ') : '' },
      { key: 'estimatedCloseDate', label: 'Est. Close Date', category: 'Timeline', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'Not set' },
      { key: 'createdAt', label: 'Created Date', category: 'Timeline', transform: (date: string) => new Date(date).toLocaleDateString() },
      { key: 'updatedAt', label: 'Updated Date', category: 'Timeline', transform: (date: string) => new Date(date).toLocaleDateString() },
      { key: 'notes', label: 'Notes', category: 'Details' },
    ]
  };
  
  const stats = [
    {
      label: t("totalSales"),
      value: sales.length,
      icon: TrendingUp,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: t("activeSales"),
      value: sales.filter(s => s.status === 'new_offer' || s.status === 'redefined').length,
      icon: Target,
      color: "chart-2", 
      filter: 'active'
    },
    {
      label: t("wonSales"),
      value: wonSales.length,
      icon: Trophy,
      color: "chart-3",
      filter: 'won'
    },
    {
      label: t("totalValue"),
  value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "chart-4",
      filter: 'value'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Header (workflow style) - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("salesManagement")}</h1>
            <p className="text-[11px] text-muted-foreground">{t("manageSalesAndOffers")}</p>
          </div>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift w-full sm:w-auto" 
          onClick={handleAddSale}
        >
          <Plus className="mr-2 h-4 w-4 text-white" />
          {t("addSale")}
        </Button>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <Button 
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" 
          onClick={handleAddSale}
        >
          <Plus className="mr-2 h-4 w-4 text-white" />
          {t("addSale")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
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
                placeholder={t("searchSales")} 
                value={searchTerm} 
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {(filterStatus !== 'all' || filterStage !== 'all' || filterPriority !== 'all') && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[
                      filterStatus !== 'all' ? 1 : 0,
                      filterStage !== 'all' ? 1 : 0,
                      filterPriority !== 'all' ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
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
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">{t('allStatus', 'All Status')}</option>
                  <option value="new_offer">{t('new_offer', 'New Offer')}</option>
                  <option value="won">{t('won', 'Won')}</option>
                  <option value="lost">{t('lost', 'Lost')}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  {lookupPriorities.map((p:any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
                  <option value="all">All Stages</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)}>
                  <option value="all">All Assignees</option>
                  {/* derive assignees from filteredSales or sales list - using static placeholder list for now */}
                  <option value="john">John Sales</option>
                  <option value="jane">Jane Manager</option>
                  <option value="mike">Mike Designer</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setShowFilterBar(false); }}>{t('clear')}</button>
            </div>
          </div>
        </div>
      )}
      {viewMode === 'list' ? (
        <div className="p-3 sm:p-4 lg:p-6">
          <Card className="shadow-card border-0 bg-card text-[0.85rem]">
            <MapOverlay 
              items={mapSalesToMapItems(filteredSales)}
              onViewItem={handleViewSale}
              onEditItem={handleEditSale}
              onClose={() => setShowMap(false)}
              isVisible={showMap}
            />
            <CardContent className="p-0">
              {filteredSales.length === 0 ? (
                <div className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("noSalesFound")}</h3>
                  <p className="text-muted-foreground">{t("createFirstSale")}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredSales.map((sale) => (
                    <div 
                      key={sale.id} 
                      className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer" 
                      onClick={() => handleSaleClick(sale)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                              <Building2 className="h-4 w-4 sm:h-6 sm:w-6" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">{sale.title}</h3>
                                <Badge className={`${getStatusColor(sale.status)} text-xs`}>
                                  {t(sale.status)}
                                </Badge>
                              </div>
                              <Badge className={`${getPriorityColor(sale.priority)} text-xs`}>
                                {t(sale.priority)}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                              <span className="truncate">{sale.contactName} - {sale.contactCompany}</span>
                                <span className="font-semibold text-foreground">{formatCurrency(sale.amount)}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{sale.assignedToName || t('unassigned')}</span>
                              </div>
                              
                              <div className="hidden sm:flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>
                                  {sale.estimatedCloseDate ? formatDate(sale.estimatedCloseDate) : t('noDateSet')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                          <div className="flex gap-1 flex-wrap flex-1 sm:flex-none">
                            {sale.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {sale.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                +{sale.tags.length - 2}
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
                              <DropdownMenuItem className="gap-2" onClick={(e: any) => { e.stopPropagation(); handleSaleClick(sale); }}>
                                <Eye className="h-4 w-4" />
                                {t("viewSale")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={(e: any) => { e.stopPropagation(); navigate(`/dashboard/sales/${sale.id}/edit`); }}>
                                <Edit className="h-4 w-4" />
                                {t("editSale")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                {t("deleteSale")}
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
        <div className="p-3 sm:p-4 lg:p-6">
          <Card className="shadow-card border-0 bg-card">
            <MapOverlay 
              items={mapSalesToMapItems(filteredSales)}
              onViewItem={handleViewSale}
              onEditItem={handleEditSale}
              onClose={() => setShowMap(false)}
              isVisible={showMap}
            />
            <CardContent className="p-0">
              {filteredSales.length === 0 ? (
                <div className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("noSalesFound")}</h3>
                  <p className="text-muted-foreground">{t("createFirstSale")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                     style={{ WebkitOverflowScrolling: 'touch' }}>
                  {/* @ts-ignore */}
                  <TableLayout
                    items={filteredSales}
                    rowKey={(s: any) => s.id}
                    onRowClick={handleSaleClick}
                    columns={[
                      {
                        key: 'sale',
                        title: t('sale'),
                        width: 'w-[250px]',
                        render: (sale: any) => (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">{sale.title}</div>
                              <div className="text-sm text-muted-foreground truncate">{sale.id}</div>
                            </div>
                          </div>
                        )
                      },
                      {
                        key: 'contact',
                        title: t('contact'),
                        render: (sale: any) => (
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">{sale.contactName}</div>
                            <div className="text-sm text-muted-foreground truncate">{sale.contactCompany}</div>
                          </div>
                        )
                      },
                      {
                        key: 'amount',
                        title: t('amount'),
                        render: (sale: any) => <span className="font-semibold text-foreground">{formatCurrency(sale.amount)}</span>
                      },
                      {
                        key: 'status',
                        title: t('status'),
                        render: (sale: any) => <Badge className={`${getStatusColor(sale.status)} text-xs`}>{t(sale.status)}</Badge>
                      },
                      {
                        key: 'priority',
                        title: t('priority'),
                        render: (sale: any) => <Badge className={`${getPriorityColor(sale.priority)} text-xs`}>{t(sale.priority)}</Badge>
                      },
                      {
                        key: 'estimatedCloseDate',
                        title: t('estimatedCloseDate'),
                        render: (sale: any) => <span className="text-sm text-muted-foreground">{sale.estimatedCloseDate ? formatDate(sale.estimatedCloseDate) : 'No date set'}</span>
                      },
                      {
                        key: 'actions',
                        title: '',
                        width: 'w-[50px]',
                        render: (sale: any) => (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e:any) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={(e:any) => { e.stopPropagation(); handleSaleClick(sale); }}>
                                <Eye className="h-4 w-4" />
                                {t('viewSale')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={(e:any) => { e.stopPropagation(); navigate(`/dashboard/sales/${sale.id}/edit`); }}>
                                <Edit className="h-4 w-4" />
                                {t('editSale')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                {t('deleteSale')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )
                      }
                    ]}
                  />
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
        data={filteredSales}
        moduleName="Sales"
        exportConfig={exportConfig}
      />
    </div>
  );
}