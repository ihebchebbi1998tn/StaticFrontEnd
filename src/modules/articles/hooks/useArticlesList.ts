import { useMemo, useState } from "react";
import { ArticlesService, type InventoryArticle } from "../services/articles.service";
import { Package, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

export type ListViewMode = "grid" | "list";

export function useArticlesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ListViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [filterCategory, setFilterCategory] = useState<"all" | string>("all");

  const allArticles = ArticlesService.list();

  const filteredArticles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allArticles.filter((article) => {
      const matchesSearch =
        article.name.toLowerCase().includes(term) ||
        article.sku.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term) ||
        (article.supplier?.toLowerCase().includes(term) ?? false);
      const matchesStatus = filterStatus === "all" || article.status === filterStatus;
      const matchesCategory = filterCategory === "all" || article.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [allArticles, searchTerm, filterStatus, filterCategory]);

  const stats = useMemo(() => {
    const totalValue = allArticles.reduce((sum, a) => sum + a.stock * a.sellPrice, 0);
    return [
      { label: "stats.total_articles", value: allArticles.length, change: "+12%", icon: Package, color: "chart-1" },
      { label: "stats.available", value: allArticles.filter(a => a.status === "available").length, change: "+8%", icon: CheckCircle, color: "chart-2" },
      { label: "stats.low_stock", value: allArticles.filter(a => a.status === "low_stock").length, change: "+3%", icon: AlertTriangle, color: "chart-3" },
      { label: "stats.total_value", value: `${totalValue.toLocaleString()} TND`, change: "+15%", icon: DollarSign, color: "chart-4" },
    ];
  }, [allArticles]);

  return {
    // state
    searchTerm, setSearchTerm,
    viewMode, setViewMode,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,

    // data
    allArticles,
    filteredArticles,
    stats,
  } as const;
}
