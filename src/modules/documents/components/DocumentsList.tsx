import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search,
  Filter,
  Upload,
  FileText,
  Image,
  Download,
  Share2,
  MessageSquare,
  Trash2,
  Eye,
  Calendar,
  User,
  List,
  Table as TableIcon,
  MoreVertical,
  FolderOpen,
  Files,
  HardDrive,
  Activity
} from 'lucide-react';
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { useDocuments } from '../hooks/useDocuments';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { DocumentFilters } from './DocumentFilters';
import { DocumentUploadModal } from './DocumentUploadModal';
import { Document, DocumentFilters as FilterType } from '../types';
import { DocumentsService } from '../services/documents.service';

export function DocumentsList() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'crm' | 'field'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState<FilterType>({});
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);

  const activeFilters = useMemo(() => {
    const tabFilter = activeTab === 'all' ? {} : { module: activeTab };
    const searchFilter = searchQuery ? { search: searchQuery } : {};
    return { ...tabFilter, ...searchFilter, ...filters };
  }, [activeTab, searchQuery, filters]);

  const { documents, stats, loading, refetch, deleteDocument } = useDocuments(activeFilters);

  const handleDeleteDocument = async (document: Document) => {
    const confirmed = window.confirm(t('documents.confirmDelete'));
    if (confirmed) {
      await deleteDocument(document.id);
      refetch();
    }
  };

  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return FileText;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const getModuleColor = (moduleType: string) => {
    switch (moduleType) {
      case 'contacts': return 'text-blue-600 bg-blue-100';
      case 'sales': return 'text-green-600 bg-green-100';
      case 'offers': return 'text-purple-600 bg-purple-100';
      case 'services': return 'text-orange-600 bg-orange-100';
      case 'projects': return 'text-red-600 bg-red-100';
      case 'field': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const statsData = useMemo(() => [
    {
      label: t('documents.totalFiles'),
      value: stats?.totalFiles || 0,
      icon: Files,
      color: "chart-1",
      filter: 'all'
    },
    {
      label: t('documents.crmFiles'),
      value: stats?.crmFiles || 0,
      icon: FolderOpen,
      color: "chart-2",
      filter: 'crm'
    },
    {
      label: t('documents.fieldFiles'),
      value: stats?.fieldFiles || 0,
      icon: Activity,
      color: "chart-3",
      filter: 'field'
    }
  ], [stats, t]);

  const handleStatClick = (stat: any) => {
    setSelectedStat(stat.filter);
    if (stat.filter === 'all') {
      setActiveTab('all');
    } else if (stat.filter === 'crm') {
      setActiveTab('crm');
    } else if (stat.filter === 'field') {
      setActiveTab('field');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('documents.loadingDocuments')}</p>
        </div>
      </div>
    );
  }

  // Header - match workflow dashboard style
  // (icon wrapper p-2 rounded-lg bg-primary/10, icon h-6 w-6, title text-xl font-semibold, subtitle text-[11px])
  const Header = () => (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Files className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('documents.title', 'Documents')}</h1>
          <p className="text-[11px] text-muted-foreground">{t('documents.subtitle', 'Manage and share files across modules')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setShowUpload(true)}>
          <Upload className="mr-2 h-4 w-4" />
          {t('documents.upload')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header />

      {/* Stats Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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
                placeholder={t('documents.searchDocuments')} 
                value={searchQuery} 
                onChange={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" className="h-9 sm:h-10 px-3 sm:px-4 whitespace-nowrap" onClick={() => setShowFilterBar(s => !s)}>
                <Filter className="h-4 w-4 mr-2" />
                {t('documents.filters')}
              </Button>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {/* InfoTip removed per request */}
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

      {/* Slide-down Document Filters */}
      {showFilterBar && (
        <div className="p-3 sm:p-4 border-b border-border bg-background/50">
          <DocumentFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      )}

      {/* List/Table View */}
      {viewMode === 'list' ? (
        <div className="p-3 sm:p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'crm' | 'field')}>
            <div className="flex items-center gap-3 mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">{t('documents.allDocuments')}</TabsTrigger>
                <TabsTrigger value="crm">{t('documents.crmFiles')}</TabsTrigger>
                <TabsTrigger value="field">{t('documents.fieldFiles')}</TabsTrigger>
              </TabsList>
              {/* InfoTip removed per request */}
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              {documents.length === 0 ? (
                <Card className="p-8 text-center text-[0.85rem]">
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">{t('documents.noDocuments')}</h3>
                      <p className="text-muted-foreground">{t('documents.noDocumentsDescription')}</p>
                    </div>
                    <Button onClick={() => setShowUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('documents.uploadFiles')}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((document) => {
                    const FileIcon = getFileIcon(document.fileType);
                    return (
                      <Card key={document.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-muted">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{document.fileName}</h3>
                                <Badge variant="secondary" className={getModuleColor(document.moduleType)}>
                                  {t(`documents.${document.moduleType}`)}
                                </Badge>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  {t('documents.preview')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  {t('documents.download')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  {t('documents.share')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteDocument(document)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t('documents.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(document.uploadedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{document.uploadedByName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{DocumentsService.formatFileSize(document.fileSize)}</span>
                              <span>{document.fileType.toUpperCase()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="p-3 sm:p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'crm' | 'field')}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">{t('documents.allDocuments')}</TabsTrigger>
              <TabsTrigger value="crm">{t('documents.crmFiles')}</TabsTrigger>
              <TabsTrigger value="field">{t('documents.fieldFiles')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {documents.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">{t('documents.noDocuments')}</h3>
                      <p className="text-muted-foreground">{t('documents.noDocumentsDescription')}</p>
                    </div>
                    <Button onClick={() => setShowUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('documents.uploadFiles')}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('documents.fileName')}</TableHead>
                        <TableHead>{t('documents.module')}</TableHead>
                        <TableHead>{t('documents.fileType')}</TableHead>
                        <TableHead>{t('documents.fileSize')}</TableHead>
                        <TableHead>{t('documents.uploadDate')}</TableHead>
                        <TableHead>{t('documents.uploadedBy')}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => {
                        const FileIcon = getFileIcon(document.fileType);
                        return (
                          <TableRow key={document.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <FileIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{document.fileName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getModuleColor(document.moduleType)}>
                                {t(`documents.${document.moduleType}`)}
                              </Badge>
                            </TableCell>
                            <TableCell>{document.fileType.toUpperCase()}</TableCell>
                            <TableCell>{DocumentsService.formatFileSize(document.fileSize)}</TableCell>
                            <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                            <TableCell>{document.uploadedByName}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {t('documents.preview')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    {t('documents.download')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {t('documents.share')}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteDocument(document)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('documents.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Modals */}
      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {showUpload && (
        <DocumentUploadModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {
            setShowUpload(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}