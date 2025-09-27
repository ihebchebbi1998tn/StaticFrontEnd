import { useState } from "react";
import { Warehouse, Activity, Package } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
//
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TransferModal } from "../components/TransferModal";
import { ArticleDetailHeader } from "../components/detail/ArticleDetailHeader";
import { ArticleStatusCards } from "../components/detail/ArticleStatusCards";
import { ArticleOverviewTab } from "../components/detail/ArticleOverviewTab";
import { ArticleInventoryTab } from "../components/detail/ArticleInventoryTab";
import { ArticleHistoryTab } from "../components/detail/ArticleHistoryTab";

// Mock data - replace with real data from Supabase
const mockArticle = {
  id: "1",
  name: "Screwdriver Set",
  sku: "TOOL-001",
  description: "Professional 10-piece screwdriver set with various head types and ergonomic handles. Includes both Phillips and flathead screwdrivers in multiple sizes.",
  category: "Tools",
  stock: 25,
  minStock: 10,
  maxStock: 50,
  price: 29.99,
  sellPrice: 49.99,
  status: "available",
  location: "Warehouse A",
  supplier: "ToolCorp Industries",
  notes: "High-quality set suitable for professional use. Store in dry conditions.",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
  reorderPoint: 10,
  weight: "1.5 kg",
  dimensions: "30cm x 15cm x 5cm"
};

const mockUsageLogs = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:30",
    user: "John Smith",
    action: "Used",
    quantity: 2,
    remainingStock: 25,
    project: "Kitchen Installation - Project #1234",
    notes: "Used for cabinet assembly",
    location: "Customer Site A"
  },
  {
    id: "2", 
    date: "2024-01-14",
    time: "09:15",
    user: "Mike Johnson",
    action: "Returned",
    quantity: 1,
    remainingStock: 27,
    project: "Bathroom Renovation - Project #1235",
    notes: "Returned after job completion",
    location: "Warehouse A"
  },
  {
    id: "3",
    date: "2024-01-12", 
    time: "16:45",
    user: "Sarah Davis",
    action: "Restocked",
    quantity: 10,
    remainingStock: 26,
    project: "Inventory Replenishment",
    notes: "Monthly restock from supplier",
    location: "Warehouse A"
  },
  {
    id: "4",
    date: "2024-01-10", 
    time: "11:20",
    user: "Tom Wilson",
    action: "Used",
    quantity: 3,
    remainingStock: 16,
    project: "Office Repair - Project #1236",
    notes: "Used for electrical panel work",
    location: "Customer Site B"
  }
];

import { getStatusColor, getStatusIcon } from "../components/utils";

// History icon is used directly in tabs; action icon/color helpers moved into ArticleHistoryTab

const ArticleDetail = () => {
  const { t } = useTranslation('articles');
  const { id: _id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [stockAdjustment, setStockAdjustment] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [transferModal, setTransferModal] = useState<{isOpen: boolean, article?: any}>({isOpen: false});
  
  // In a real app, you'd fetch the article data based on the ID
  const article = mockArticle;
  const StatusIcon = getStatusIcon(article.status);

  const handleStockAdjustment = () => {
    const adjustment = parseInt(stockAdjustment);
    if (!adjustment || adjustment <= 0) {
      toast({
        title: t("detail.invalid_quantity"),
        description: t("detail.invalid_quantity_message"),
        variant: "destructive",
      });
      return;
    }

    if (!adjustmentReason.trim()) {
      toast({
        title: t("detail.reason_required"),
        description: t("detail.reason_required_message"),
        variant: "destructive",
      });
      return;
    }

    // Here you would update the stock in Supabase
    toast({
      title: t("detail.stock_updated"),
      description: t(
        adjustmentType === 'add' 
          ? "detail.stock_updated_message_add" 
          : "detail.stock_updated_message_remove", 
        { quantity: adjustment }
      ),
    });

    setStockAdjustment("");
    setAdjustmentReason("");
  };

  const handleTransferArticle = () => {
    setTransferModal({isOpen: true, article: {
      id: article.id,
      name: article.name,
      sku: article.sku,
      stock: article.stock,
      location: article.location
    }});
  };

  const stockPercentage = (article.stock / article.maxStock) * 100;
  const isLowStock = article.stock <= article.minStock;
  const margin = article.sellPrice - article.price;
  const marginPercentage = ((margin / article.price) * 100).toFixed(1);

  return (
    <div className="h-screen flex flex-col">
      <ArticleDetailHeader
        article={article}
        adjustmentType={adjustmentType}
        setAdjustmentType={setAdjustmentType}
        stockAdjustment={stockAdjustment}
        setStockAdjustment={setStockAdjustment}
        adjustmentReason={adjustmentReason}
        setAdjustmentReason={setAdjustmentReason}
        onAdjust={handleStockAdjustment}
        onTransfer={handleTransferArticle}
      />

      <ArticleStatusCards article={article} StatusIcon={StatusIcon} getStatusColor={getStatusColor} isLowStock={isLowStock} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border px-3 sm:px-6">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg min-w-max">
                <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("detail.overview")}
                </TabsTrigger>
                <TabsTrigger value="inventory" className="gap-2 text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
                  <Warehouse className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("detail.inventory")}
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2 text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("detail.activity")}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
            <ArticleOverviewTab article={article} margin={margin} marginPercentage={marginPercentage} />
          </TabsContent>

          <TabsContent value="inventory" className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
            <ArticleInventoryTab article={article} stockPercentage={stockPercentage} isLowStock={isLowStock} />
          </TabsContent>

          <TabsContent value="activity" className="flex-1 p-3 sm:p-6">
            <ArticleHistoryTab logs={mockUsageLogs} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={transferModal.isOpen}
        onClose={() => setTransferModal({isOpen: false})}
        article={transferModal.article}
      />
    </div>
  );
};

export default ArticleDetail;