import { useState } from "react";
import { Plus, Search, Filter, Package, AlertTriangle, CheckCircle, List, Grid, DollarSign, Clock, Warehouse, MoreVertical, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

import articlesData from '@/data/mock/articles.json';
import articleStatuses from '@/data/mock/article-statuses.json';

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "status-success";
    case "low_stock":
      return "status-warning";
    case "out_of_stock":
      return "status-error";
    default:
      return "status-info";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
      return CheckCircle;
    case "low_stock":
    case "out_of_stock":
      return AlertTriangle;
    default:
      return Package;
  }
};

export function ArticlesList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');
  const [filterLocation, setFilterLocation] = useState<'all' | string>('all');
  const [filterSupplier, setFilterSupplier] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleArticleClick = (article: any) => {
    navigate(`/dashboard/articles/${article.id}`);
  };

  const handleAddArticle = () => {
    navigate('/dashboard/articles/add');
  };

  const filteredArticles = (articlesData as any[]).filter(article => {
    const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesLocation = filterLocation === 'all' || article.location === filterLocation;
    const matchesSupplier = filterSupplier === 'all' || article.supplier === filterSupplier;
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesSupplier;
  });

  const categories = Array.from(new Set((articlesData as any[]).map(a => a.category))).filter(Boolean);
  const locations = Array.from(new Set((articlesData as any[]).map(a => a.location))).filter(Boolean);
  const suppliers = Array.from(new Set((articlesData as any[]).map(a => a.supplier))).filter(Boolean);

  const stats = [
    { 
      label: "Total Articles", 
      value: (articlesData as any[]).length, 
      change: "+12%", 
      icon: Package, 
      color: "chart-1" 
    },
    { 
      label: "Available", 
      value: (articlesData as any[]).filter(a => a.status === "available").length, 
      change: "+8%", 
      icon: CheckCircle, 
      color: "chart-2" 
    },
    { 
      label: "Low Stock", 
      value: (articlesData as any[]).filter(a => a.status === "low_stock").length, 
      change: "+3%", 
      icon: AlertTriangle, 
      color: "chart-3" 
    },
    { 
      label: "Total Value", 
      value: `${(articlesData as any[]).reduce((sum, a) => sum + (a.stock * a.sellPrice), 0).toLocaleString()} TND`, 
      change: "+15%", 
      icon: DollarSign, 
      color: "chart-4" 
    },
  ];

  const Header = () => (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('articles.title', 'Articles & Materials')}</h1>
            <p className="text-[11px] text-muted-foreground">{t('articles.subtitle', 'Manage your inventory, stock levels, and material usage')}</p>
          </div>
        </div>
        <div>
          <Button 
            className="gradient-primary text-primary-foreground shadow-medium hover-lift w-full sm:w-auto"
            onClick={handleAddArticle}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-end p-4 border-b border-border bg-card/50 backdrop-blur">
        <Button 
          size="sm"
          className="gradient-primary text-primary-foreground shadow-medium hover-lift"
          onClick={handleAddArticle}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col">
      <Header />

      {/* Stats Cards */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0 hover-lift gradient-card group">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 sm:p-2.5 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-all`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}`} />
                  </div>
                  <Badge className="status-success text-xs px-1.5 py-0.5">{stat.change}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1 w-full items-center">
            <div className="flex-1">
              <CollapsibleSearch 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3" onClick={() => setShowFilterBar(s => !s)}>
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-1 sm:gap-2 flex-1 sm:flex-none"
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-1 sm:gap-2 flex-1 sm:flex-none"
            >
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </Button>
          </div>
        </div>
        </div>

        {showFilterBar && (
          <div className="p-3 sm:p-4 border-b border-border bg-background/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    {articleStatuses.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                    <option value="all">All Locations</option>
                    {locations.map((l, i) => <option key={i} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <select className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground w-full text-sm" value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}>
                    <option value="all">All Suppliers</option>
                    {suppliers.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-full border border-border text-sm" onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setFilterLocation('all'); setFilterSupplier('all'); setShowFilterBar(false); }}>{t('clear')}</button>
              </div>
            </div>
          </div>
        )}

        {/* Articles List */}
      <div>
        {viewMode === 'list' ? (
          <div className="p-3 sm:p-4 lg:p-6">
            <Card className="shadow-card border-0 bg-card">
              
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredArticles.map((article) => {
                    const StatusIcon = getStatusIcon(article.status);
                    return (
                      <div 
                        key={article.id} 
                        className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => handleArticleClick(article)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                              <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                                <Package className="h-4 w-4 sm:h-6 sm:w-6" />
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{article.name}</h3>
                                </div>
                                <Badge className={`${getStatusColor(article.status)} text-xs`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {article.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                                <span className="truncate">SKU: {article.sku} • {article.category}</span>
                                <span className="text-xs">Stock: {article.stock} units</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Warehouse className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{article.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{article.sellPrice} TND</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  <span>Last: {article.lastUsed}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                            <div className="flex gap-1 flex-wrap flex-1 sm:flex-none">
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                {article.lastUsedBy}
                              </Badge>
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
                                  onClick={() => handleArticleClick(article)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit Article
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredArticles.map((article) => {
                const StatusIcon = getStatusIcon(article.status);
                return (
                  <Card 
                    key={article.id} 
                    className="shadow-card border-0 hover-lift transition-all duration-200 bg-card group cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                            <Package className="h-4 w-4 sm:h-6 sm:w-6" />
                          </AvatarFallback>
                        </Avatar>
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
                              onClick={() => handleArticleClick(article)}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Article
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mb-3 sm:mb-4">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 truncate">{article.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">SKU: {article.sku} • {article.category}</p>
                        <Badge className={`${getStatusColor(article.status)} text-xs`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {article.status.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Stock:</span>
                          <span className="font-medium">{article.stock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">{article.sellPrice} TND</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium truncate">{article.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first article"}
            </p>
            <Button onClick={handleAddArticle}>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}