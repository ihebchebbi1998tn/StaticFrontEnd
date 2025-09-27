import React, { useState } from "react";
import { AlertTriangle, Package, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLookups } from "@/shared/contexts/LookupsContext";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats, type InventoryStat } from "./InventoryStats";
import { InventorySearchControls } from "./InventorySearchControls";
// import { getStatusColor } from "./utils"; // currently unused
import { InventoryListView } from "./InventoryListView";
import { InventoryTableView } from "./InventoryTableView";
import { ArticlesService, type InventoryArticle } from "@/modules/articles/services/articles.service";

// Convert InventoryArticle to Article format for compatibility
const convertToArticleFormat = (article: InventoryArticle) => ({
  id: article.id,
  type: 'material' as const,
  name: article.name,
  sku: article.sku,
  category: article.category,
  stock: article.stock,
  minStock: article.minStock,
  costPrice: article.price,
  sellPrice: article.sellPrice,
  supplier: article.supplier,
  location: article.location || "Warehouse A",
  subLocation: undefined,
  basePrice: undefined,
  duration: undefined,
  skillsRequired: undefined,
  materialsNeeded: [],
  preferredUsers: [],
  lastUsed: article.lastUsed ? new Date(article.lastUsed) : undefined,
  lastUsedBy: article.lastUsedBy,
  tags: [],
  notes: article.description,
  status: article.status as any,
  description: article.description,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "system",
  modifiedBy: "system"
});
export function InventoryServicesList() {
  const { t: _t } = useTranslation();
  const { serviceCategories } = useLookups();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  
  // Get articles from unified service
  const allArticles = ArticlesService.list();
  const allItems = allArticles.map(convertToArticleFormat);
  const mockInventoryItems = allItems; // All are materials in this case
  const mockServices: any[] = []; // No services in the unified data
  const [filterType, setFilterType] = useState<'all' | 'material' | 'service' | 'low_stock'>('all');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const handleItemClick = (item: any) => {
    navigate(`/dashboard/inventory-services/article/${item.id}`);
  };
  const handleAddArticle = () => {
    navigate('/dashboard/inventory-services/add-article');
  };
  const handleStatClick = (statType: 'all' | 'material' | 'service' | 'low_stock') => {
    setSelectedStat(statType);
    setFilterType(statType);
  };

  const handleFilterChange = (value: 'all' | 'material' | 'service' | 'low_stock') => {
    setFilterType(value);
    setSelectedStat(value);
  };
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item as any).sku && (item as any).sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       item.type === filterType || 
                       (filterType === 'low_stock' && item.type === 'material' && (item as any).stock < (item as any).minStock) ||
                       (serviceCategories.some(cat => cat.id === filterType) && item.category.toLowerCase() === filterType.toLowerCase());
    
    return matchesSearch && matchesType;
  });
  const lowStockItems = mockInventoryItems.filter(item => item.stock < item.minStock);
  
  const stats: InventoryStat[] = [{
    label: "Total Items",
    value: allItems.length,
    icon: Package,
    color: "chart-1",
    filter: "all"
  }, {
    label: "Materials",
    value: mockInventoryItems.length,
    icon: Package,
    color: "chart-2",
    filter: "material"
  }, {
    label: "Services",
    value: mockServices.length,
    icon: Wrench,
    color: "chart-3",
    filter: "service"
  }, {
    label: "Low Stock",
    value: lowStockItems.length,
    icon: AlertTriangle,
    color: "chart-4",
    filter: "low_stock"
  }];
  return <div className="flex flex-col">
      <InventoryHeader onAddArticle={handleAddArticle} />

      <InventoryStats stats={stats} selected={selectedStat} onSelect={handleStatClick} />

      <InventorySearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={handleFilterChange}
        serviceCategories={serviceCategories}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Items List */}
      <div>
        {viewMode === 'list' ? (
          <InventoryListView items={filteredItems} onClick={handleItemClick} />
        ) : (
          <InventoryTableView items={filteredItems} onClick={handleItemClick} />
        )}
      </div>
    </div>;
}