import { useState, useEffect } from "react";
import { usePaginatedData } from "@/shared/hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Search, Filter, Building2, List, Table as TableIcon, Star, Mail, Phone, Calendar, MoreVertical, Eye, Edit, Trash2, Upload, ChevronDown } from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import TableLayout from '@/components/shared/TableLayout';
import { useContactsData } from '../hooks/useContactsData';
import { contactsApi } from '@/services/contactsApi';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export function ContactsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterCompany, setFilterCompany] = useState<'all' | string>('all');
  const [filterTimeframe, setFilterTimeframe] = useState('all');
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);

  // Build search parameters for API
  const searchParams = {
    searchTerm: searchTerm || undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    type: filterType !== 'all' ? filterType : undefined,
    pageSize: 100, // Load more for local filtering
  };

  // Fetch contacts from API
  const { data: contacts, error, isLoading: loading, refresh } = useContactsData(searchParams);

  const handleContactClick = (contact: any) => {
    navigate(`/dashboard/contacts/${contact.id}`);
  };
  
  const handleAddContact = () => {
    navigate('/dashboard/contacts/add');
  };
  
  const handleImportContacts = () => {
    navigate('/dashboard/contacts/import');
  };

  const handleEditContact = (contactId: number) => {
    navigate(`/dashboard/contacts/edit/${contactId}`);
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      await contactsApi.deleteContact(contactId);
      toast({
        title: "Contact deleted",
        description: "Contact has been successfully removed.",
      });
      refresh(); // Refresh the contacts list
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive"
      });
    }
    setDeleteContactId(null);
  };

  // Filter contacts locally for additional filtering
  const companies = contacts ? Array.from(new Set(contacts.map((c: any) => c.company).filter(Boolean))).sort() : [];
  
  const filteredContacts = contacts ? contacts.filter(contact => {
    const matchesCompany = filterCompany === 'all' || contact.company === filterCompany;
    return matchesCompany;
  }) : [];

  const pagination = usePaginatedData(filteredContacts, 10);
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Customer':
        return 'status-success';
      case 'Lead':
        return 'status-warning';
      case 'Prospect':
        return 'status-info';
      default:
        return 'status-info';
    }
  };
  const stats = [{
    label: "Total Contacts",
    value: contacts?.length || 0,
    icon: Users,
    color: "chart-1",
    filter: 'all'
  }, {
    label: "Active Leads",
    value: contacts?.filter(c => c.status === 'active').length || 0,
    icon: Users,
    color: "chart-2",
    filter: 'active'
  }, {
    label: "Customers",
    value: contacts?.filter(c => c.status === 'customer').length || 0,
    icon: Users,
    color: "chart-3",
    filter: 'customer'
  }, {
    label: "Companies",
    value: contacts?.filter(c => c.type === 'company').length || 0,
    icon: Building2,
    color: "chart-4",
    filter: 'company'
  }];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load contacts</p>
          <Button onClick={() => refresh()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setFilterStatus('all');
      setFilterType('all');
    } else if (stat.filter === 'company') {
      setFilterType('company');
      setFilterStatus('all');
    } else {
      setFilterStatus(stat.filter);
      setFilterType('all');
    }
  };
  
  return <div className="flex flex-col">
      {/* Header (workflow style) - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('contacts.title', 'Contacts')}</h1>
            <p className="text-[11px] text-muted-foreground">{t('contacts.subtitle', 'Manage your customer database')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImportContacts}>
            <Upload className="mr-2 h-4 w-4" />
            {t('contacts.import')}
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4 text-white" />
            {t('contacts.add')}
          </Button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImportContacts}>
            <Upload className="mr-2 h-4 w-4" />
            {t('contacts.import')}
          </Button>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift" onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4 text-white" />
            {t('contacts.add')}
          </Button>
        </div>
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
              placeholder="Search contacts..." 
              value={searchTerm} 
              onChange={setSearchTerm}
              className="w-full"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={() => setShowFilterBar(s => !s)}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {(filterStatus !== 'all' || filterType !== 'all' || filterCompany !== 'all') && <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                  {[filterStatus !== 'all' ? 1 : 0, filterType !== 'all' ? 1 : 0, filterCompany !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
                </Badge>}
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
          </div>
        </div>
      </div>

      {/* Slide-down Filter Bar */}
      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); }}>
                  <option value="all">All Statuses</option>
                  <option value="Customer">Customer</option>
                  <option value="Lead">Lead</option>
                  <option value="Prospect">Prospect</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterType} onChange={e => { setFilterType(e.target.value); }}>
                  <option value="all">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                  <option value="all">All Companies</option>
                  {companies.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full" value={filterTimeframe} onChange={e => { setFilterTimeframe(e.target.value); }}>
                  <option value="all">Any time</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterType('all'); setFilterCompany('all'); setShowFilterBar(false); }}>{t('clear')}</button>
              <div className="flex items-center gap-2">
                {/* Favorite filter removed per request */}
                {/* theme buttons removed */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List/Table View */}
      {viewMode === 'list' ? <div className="p-3 sm:p-4 lg:p-6">
        <Card className="shadow-card border-0 bg-card text-[0.85rem]">
          
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pagination.data.map(contact => <div key={contact.id} className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => handleContactClick(contact)}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                          {contact.type === 'company' ? <Building2 className="h-4 w-4 sm:h-6 sm:w-6" /> : getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">{contact.name}</h3>
                            {contact.favorite && <Star className="h-3 w-3 sm:h-4 sm:w-4 text-warning fill-warning flex-shrink-0" />}
                          </div>
                          <Badge className={`${getStatusColor(contact.status)} text-xs`}>{contact.status}</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                          <span className="truncate">{contact.position} at {contact.company}</span>
                          {contact.type === 'company' && contact.tags.length && (
                            <span className="text-xs">
                              {contact.tags.length} tags
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{contact.phone}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>Last: {contact.lastContactDate ? new Date(contact.lastContactDate).toLocaleDateString() : 'Never'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                      <div className="flex gap-1 flex-wrap flex-1 sm:flex-none">
                        {contact.tags.slice(0, 1).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                            {tag.name}
                          </Badge>
                        ))}
                        {contact.tags.length > 1 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            +{contact.tags.length - 1}
                          </Badge>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={e => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => handleContactClick(contact)}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>)}
            </div>
            {filteredContacts.length > 5 && (
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {pagination.info.startIndex + 1} to {pagination.info.endIndex} of {filteredContacts.length} results
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
    </div> : <div className="p-3 sm:p-4 lg:p-6">
      <Card className="shadow-card border-0 bg-card text-[0.95rem]">
          
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                   style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* TableLayout - keeps structure identical to OffersList */}
                {/* columns preserve widths and renderers from previous implementation */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <TableLayout
                  items={pagination.data}
                  rowKey={(c: any) => c.id}
                  onRowClick={handleContactClick}
                  enablePagination={true}
                  itemsPerPage={5}
                  currentPage={pagination.state.currentPage}
                  onPageChange={pagination.actions.goToPage}
                  totalItems={filteredContacts.length}
                  columns={[
                    {
                      key: 'contact',
                      title: 'Contact',
                      width: 'w-[200px]',
                      render: (contact: any) => (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="text-sm bg-primary/10 text-primary">
                              {contact.type === 'company' ? <Building2 className="h-5 w-5" /> : getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground truncate">{contact.name}</p>
                              {contact.favorite && <Star className="h-4 w-4 text-warning fill-warning flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{contact.type}</p>
                          </div>
                        </div>
                      )
                    },
                    {
                      key: 'company',
                      title: 'Company & Position',
                      render: (contact: any) => (
                        <div>
                          <p className="font-medium text-foreground">{contact.company}</p>
                          <p className="text-sm text-muted-foreground">{contact.position}</p>
                          {contact.type === 'company' && contact.keyUsers && <p className="text-xs text-muted-foreground">{contact.keyUsers.length} key users</p>}
                        </div>
                      )
                    },
                    {
                      key: 'contactInfo',
                      title: 'Contact Info',
                      render: (contact: any) => (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{contact.phone}</span>
                          </div>
                        </div>
                      )
                    },
                    {
                      key: 'status',
                      title: 'Status',
                      render: (contact: any) => <Badge className={`${getStatusColor(contact.status)} text-xs`}>{contact.status}</Badge>
                    },
                    {
                      key: 'tags',
                      title: 'Tags',
                      render: (contact: any) => (
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>
                          ))}
                          {contact.tags.length > 2 && <Badge variant="outline" className="text-xs px-1.5 py-0.5">+{contact.tags.length - 2}</Badge>}
                        </div>
                      )
                    },
                    {
                      key: 'lastContact',
                      title: 'Last Contact',
                      render: (contact: any) => (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{contact.lastContact}</span>
                        </div>
                      )
                    },
                    {
                      key: 'actions',
                      title: '',
                      width: 'w-[50px]',
                      render: (contact: any) => (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e:any) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={(e:any) => { e.stopPropagation(); handleContactClick(contact); }}>
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={(e:any) => e.stopPropagation()}>
                              <Edit className="h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={(e:any) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  ]}
                />
                </div>
            </CardContent>
          </Card>
        </div>}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteContactId !== null} onOpenChange={() => setDeleteContactId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this contact? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteContactId && handleDeleteContact(deleteContactId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>;
}