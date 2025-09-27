import { useEffect, useMemo, useState } from "react";
import { usePaginatedData } from "@/shared/hooks/usePagination";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { 
  Package, Filter, Calendar, User, Building, 
  Edit, Trash2, Eye, MoreVertical, Plus, MapPin, List, Table as TableIcon,
  ChevronDown, Shield, ShieldCheck, Wrench, Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Installation, InstallationFilters } from "../types";
import installationsData from "@/data/mock/installations.json";
import { ExportModal, ExportConfig } from "@/components/shared/ExportModal";

export default function InstallationsList() {
  console.log("InstallationsList rendering");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [installations] = useState<Installation[]>(
    installationsData.map(item => ({
      ...item,
      type: item.type as 'internal' | 'external',
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      warrantyFrom: item.warrantyFrom ? new Date(item.warrantyFrom) : undefined,
      warrantyTo: item.warrantyTo ? new Date(item.warrantyTo) : undefined,
    }))
  );
  const [filters, setFilters] = useState<InstallationFilters>({});
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [filterManufacturer, setFilterManufacturer] = useState<'all' | string>('all');
  const [filterWarranty, setFilterWarranty] = useState<'all' | 'with' | 'without'>('all');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    document.title = "Installations — List";
  }, []);

  const handleInstallationClick = (installation: Installation) => {
    navigate(`/dashboard/field/installations/${installation.id}`);
  };

  const getTypeColor = (type: Installation['type']) => {
    const colors = {
      internal: "status-success",
      external: "status-info"
    };
    return colors[type];
  };

  const getWarrantyStatus = (installation: Installation) => {
    if (!installation.hasWarranty) return { status: 'none', color: 'status-secondary', text: 'No Warranty' };
    
    if (installation.warrantyTo) {
      const now = new Date();
      const warrantyEnd = new Date(installation.warrantyTo);
      const daysUntilExpiry = Math.ceil((warrantyEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return { status: 'expired', color: 'status-destructive', text: 'Expired' };
      if (daysUntilExpiry < 30) return { status: 'expiring', color: 'status-warning', text: `${daysUntilExpiry}d left` };
      return { status: 'active', color: 'status-success', text: 'Active' };
    }
    
    return { status: 'active', color: 'status-success', text: 'Active' };
  };

  const _getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const filteredInstallations = useMemo(() => {
    return installations.filter(installation => {
      const matchesSearch = installation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || installation.type === filterType;
      const matchesManufacturer = filterManufacturer === 'all' || installation.manufacturer === filterManufacturer;
      const matchesWarranty = filterWarranty === 'all' || 
        (filterWarranty === 'with' && installation.hasWarranty) ||
        (filterWarranty === 'without' && !installation.hasWarranty);
      
      // Handle stat filters
      if (selectedStat === 'internal') return matchesSearch && installation.type === 'internal';
      if (selectedStat === 'external') return matchesSearch && installation.type === 'external';
      if (selectedStat === 'warranty') return matchesSearch && installation.hasWarranty;
      
      return matchesSearch && matchesType && matchesManufacturer && matchesWarranty;
    });
  }, [installations, searchTerm, filterType, filterManufacturer, filterWarranty, selectedStat]);

  const pagination = usePaginatedData(filteredInstallations, 5);

  const manufacturerOptions = useMemo(() => {
    return Array.from(new Set(installations.map(i => i.manufacturer)));
  }, [installations]);

  const statsData = [
    {
      label: "Total Installations",
      value: installations.length,
      icon: Package,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: "Internal",
      value: installations.filter(i => i.type === 'internal').length,
      icon: Wrench,
      color: "chart-2", 
      filter: 'internal'
    },
    {
      label: "External",
      value: installations.filter(i => i.type === 'external').length,
      icon: Package,
      color: "chart-3",
      filter: 'external'
    },
    {
      label: "Under Warranty",
      value: installations.filter(i => i.hasWarranty).length,
      icon: Shield,
      color: "chart-4",
      filter: 'warranty'
    }
  ];

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setFilterType('all');
      setFilterManufacturer('all');
      setFilterWarranty('all');
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportConfig: ExportConfig = {
    filename: 'installations-export',
    allDataTransform: (installation: any) => ({
      'ID': installation.id,
      'Name': installation.name,
      'Model': installation.model,
      'Type': installation.type,
      'Manufacturer': installation.manufacturer,
      'Serial Number': installation.serialNumber,
      'Customer Company': installation.customer.company,
      'Customer Contact': installation.customer.contactPerson,
      'Customer Phone': installation.customer.phone,
      'Customer Email': installation.customer.email,
      'Location': installation.location,
      'Description': installation.description,
      'Has Warranty': installation.hasWarranty ? 'Yes' : 'No',
      'Warranty From': installation.warrantyFrom ? new Date(installation.warrantyFrom).toLocaleDateString() : 'N/A',
      'Warranty To': installation.warrantyTo ? new Date(installation.warrantyTo).toLocaleDateString() : 'N/A',
      'Created At': new Date(installation.createdAt).toLocaleDateString(),
      'Updated At': new Date(installation.updatedAt).toLocaleDateString(),
    }),
    availableColumns: [
      { key: 'id', label: 'ID', category: 'Basic' },
      { key: 'name', label: 'Name', category: 'Basic' },
      { key: 'model', label: 'Model', category: 'Basic' },
      { key: 'type', label: 'Type', category: 'Basic' },
      { key: 'manufacturer', label: 'Manufacturer', category: 'Basic' },
      { key: 'serialNumber', label: 'Serial Number', category: 'Technical' },
      { key: 'customer.company', label: 'Customer Company', category: 'Customer' },
      { key: 'customer.contactPerson', label: 'Customer Contact', category: 'Customer' },
      { key: 'customer.phone', label: 'Customer Phone', category: 'Customer' },
      { key: 'customer.email', label: 'Customer Email', category: 'Customer' },
      { key: 'location', label: 'Location', category: 'Details' },
      { key: 'description', label: 'Description', category: 'Details' },
      { key: 'hasWarranty', label: 'Has Warranty', category: 'Warranty', transform: (value: boolean) => value ? 'Yes' : 'No' },
      { key: 'warrantyFrom', label: 'Warranty From', category: 'Warranty', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
      { key: 'warrantyTo', label: 'Warranty To', category: 'Warranty', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
      { key: 'createdAt', label: 'Created Date', category: 'Timeline', transform: (date: string) => new Date(date).toLocaleDateString() },
      { key: 'updatedAt', label: 'Updated Date', category: 'Timeline', transform: (date: string) => new Date(date).toLocaleDateString() },
    ]
  };

  return (
    <div className="flex flex-col">
      {/* Header - Hidden on mobile */}
      <header className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Installations</h1>
            <p className="text-[11px] text-muted-foreground">Manage customer installations and warranty tracking</p>
          </div>
        </div>
        <div>
          <Button className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift w-full sm:w-auto" onClick={() => navigate('/dashboard/field/installations/create')}>
            <Plus className="mr-2 h-4 w-4 text-white" />
            Add Installation
          </Button>
        </div>
      </header>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <Button size="sm" className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" onClick={() => navigate('/dashboard/field/installations/create')}>
          <Plus className="mr-2 h-4 w-4 text-white" />
          Add Installation
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
      <section className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full items-center">
            <div className="flex-1">
              <CollapsibleSearch 
                placeholder="Search installations..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {(filterType !== 'all' || filterManufacturer !== 'all' || filterWarranty !== 'all') && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {[
                      filterType !== 'all' ? 1 : 0,
                      filterManufacturer !== 'all' ? 1 : 0,
                      filterWarranty !== 'all' ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
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
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </section>

      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterManufacturer} onChange={e => setFilterManufacturer(e.target.value)}>
                  <option value="all">All Manufacturers</option>
                  {manufacturerOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterWarranty} onChange={e => setFilterWarranty(e.target.value as 'all' | 'with' | 'without')}>
                  <option value="all">All Warranty Status</option>
                  <option value="with">With Warranty</option>
                  <option value="without">No Warranty</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1">
        {viewMode === 'table' ? (
          <div className="p-3 sm:p-4">
            <Card className="shadow-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">Installation</TableHead>
                      <TableHead className="font-semibold text-foreground">Type</TableHead>
                      <TableHead className="font-semibold text-foreground">Manufacturer</TableHead>
                      <TableHead className="font-semibold text-foreground">Customer</TableHead>
                      <TableHead className="font-semibold text-foreground">Warranty</TableHead>
                      <TableHead className="font-semibold text-foreground">Location</TableHead>
                      <TableHead className="font-semibold text-foreground w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.data.map((installation) => {
                      const warrantyStatus = getWarrantyStatus(installation);
                      return (
                        <TableRow 
                          key={installation.id} 
                          className="cursor-pointer hover:bg-muted/50 border-border"
                          onClick={() => handleInstallationClick(installation)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {_getInitials(installation.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground truncate">{installation.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{installation.model}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(installation.type)}>
                              {installation.type === 'internal' ? 'Internal' : 'External'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground">{installation.manufacturer}</p>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{installation.customer.company}</p>
                              <p className="text-xs text-muted-foreground truncate">{installation.customer.contactPerson}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={warrantyStatus.color}>
                              {warrantyStatus.text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground truncate">{installation.location}</p>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/field/installations/${installation.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/field/installations/${installation.id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {filteredInstallations.length > 5 && (
                  <div className="border-t border-border">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredInstallations.length} results
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={pagination.actions.previousPage}
                          disabled={!pagination.info.hasPreviousPage}
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
                          {pagination.state.currentPage} of {pagination.info.totalPages}
                        </span>
                        <button
                          onClick={pagination.actions.nextPage}
                          disabled={!pagination.info.hasNextPage}
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pagination.data.map((installation) => {
                const warrantyStatus = getWarrantyStatus(installation);
                return (
                  <Card 
                    key={installation.id} 
                    className="shadow-card hover-lift gradient-card group cursor-pointer"
                    onClick={() => handleInstallationClick(installation)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {_getInitials(installation.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base text-foreground truncate">{installation.name}</CardTitle>
                            <CardDescription className="text-xs truncate">{installation.model}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/field/installations/${installation.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/field/installations/${installation.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(installation.type)}>
                          {installation.type === 'internal' ? 'Internal' : 'External'}
                        </Badge>
                        <Badge className={warrantyStatus.color}>
                          {warrantyStatus.text}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate">{installation.customer.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">{installation.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {installation.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Manufacturer: {installation.manufacturer}</span>
                        <span>{installation.relatedServiceOrders.length} SOs</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {filteredInstallations.length > 5 && (
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredInstallations.length} results
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={pagination.actions.previousPage}
                      disabled={!pagination.info.hasPreviousPage}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.state.currentPage} of {pagination.info.totalPages}
                    </span>
                    <button
                      onClick={pagination.actions.nextPage}
                      disabled={!pagination.info.hasNextPage}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {filteredInstallations.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No installations found</h3>
            <p className="text-muted-foreground mb-4">No installations match your current search and filters.</p>
            <Button onClick={() => navigate('/dashboard/field/installations/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Installation
            </Button>
          </div>
        )}
      </div>
      
      {/* Export Modal */}
      <ExportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={filteredInstallations}
        moduleName="Installations"
        exportConfig={exportConfig}
      />
    </div>
  );
}