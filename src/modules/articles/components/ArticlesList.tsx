import { Plus, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
//
import { ArticlesHeader } from "./ArticlesHeader";
import { ArticlesStats, type Stat } from "./ArticlesStats";
import { ArticlesSearchControls } from "./ArticlesSearchControls";
import { ArticlesListView } from "./ArticlesListView";
import { ArticlesGridView } from "./ArticlesGridView";
import { TransferModal } from "./TransferModal";
import { ExportModal, ExportConfig } from "@/components/shared/ExportModal";

import { useArticlesList } from "../hooks/useArticlesList";

// presentational helpers are moved to components/utils.ts

export function ArticlesList() {
  const { t } = useTranslation('articles');
  const navigate = useNavigate();
  const {
    searchTerm, setSearchTerm,
    viewMode, setViewMode,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filteredArticles,
    stats,
  } = useArticlesList();
  const [transferModal, setTransferModal] = useState<{isOpen: boolean, article?: any}>({isOpen: false});
  const [showExportModal, setShowExportModal] = useState(false);

  const handleArticleClick = (article: any) => {
    navigate(`/dashboard/articles/${article.id}`);
  };

  const handleAddArticle = () => {
    navigate('/dashboard/articles/add');
  };

  const handleEditArticle = (article: any) => {
    navigate(`/dashboard/articles/edit/${article.id}`);
  };

  const handleTransferArticle = (article: any) => {
    setTransferModal({isOpen: true, article});
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const exportConfig: ExportConfig = {
    filename: 'articles-export',
    allDataTransform: (article: any) => ({
      'ID': article.id,
      'Name': article.name,
      'SKU': article.sku,
      'Category': article.category,
      'Status': article.status,
      'Stock': article.stock,
      'Min Stock': article.minStock,
      'Cost Price': article.price,
      'Sell Price': article.sellPrice,
      'Supplier': article.supplier,
      'Location': article.location,
      'Description': article.description,
      'Last Used': article.lastUsed ? new Date(article.lastUsed).toLocaleDateString() : 'N/A',
      'Last Used By': article.lastUsedBy || 'N/A',
      'Created At': new Date().toLocaleDateString(),
      'Updated At': new Date().toLocaleDateString(),
    }),
    availableColumns: [
      { key: 'id', label: 'ID', category: 'Basic' },
      { key: 'name', label: 'Name', category: 'Basic' },
      { key: 'sku', label: 'SKU', category: 'Basic' },
      { key: 'category', label: 'Category', category: 'Basic' },
      { key: 'status', label: 'Status', category: 'Basic' },
      { key: 'stock', label: 'Current Stock', category: 'Inventory' },
      { key: 'minStock', label: 'Minimum Stock', category: 'Inventory' },
      { key: 'location', label: 'Location', category: 'Inventory' },
      { key: 'price', label: 'Cost Price', category: 'Financial' },
      { key: 'sellPrice', label: 'Sell Price', category: 'Financial' },
      { key: 'supplier', label: 'Supplier', category: 'Supply Chain' },
      { key: 'description', label: 'Description', category: 'Details' },
      { key: 'lastUsed', label: 'Last Used Date', category: 'Usage', transform: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A' },
      { key: 'lastUsedBy', label: 'Last Used By', category: 'Usage' },
    ]
  };

  const typedStats = stats as Stat[];

  return (
    <div className="flex flex-col">
      <ArticlesHeader onAdd={handleAddArticle} />

  <ArticlesStats stats={typedStats} />

      <ArticlesSearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExport={handleExport}
      />

      {/* Articles List */}
      <div>
        {viewMode === 'list' ? (
          <ArticlesListView
            items={filteredArticles}
            onView={handleArticleClick}
            onEdit={handleEditArticle}
            onTransfer={handleTransferArticle}
          />
        ) : (
          <ArticlesGridView
            items={filteredArticles}
            onView={handleArticleClick}
            onEdit={handleEditArticle}
            onTransfer={handleTransferArticle}
          />
        )}

  {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t("no_articles_found")}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? t("no_articles_description") : t("no_articles_description_empty")}
            </p>
            <Button onClick={handleAddArticle}>
              <Plus className="h-4 w-4 mr-2" />
              {t("add_article")}
            </Button>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
  <TransferModal
        isOpen={transferModal.isOpen}
        onClose={() => setTransferModal({isOpen: false})}
        article={transferModal.article}
      />

      {/* Export Modal */}
      <ExportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={filteredArticles}
        moduleName={t("title")}
        exportConfig={exportConfig}
      />
    </div>
  );
}