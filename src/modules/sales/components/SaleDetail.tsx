import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  FileDown,
  Send,
  MoreVertical,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// Import mock data
import salesData from "@/data/mock/sales.json";
import { Sale } from "../types";
import { useCurrency } from '@/shared/hooks/useCurrency';
import { toast } from "sonner";
import { SalePDFPreviewModal } from "./SalePDFPreviewModal";

// Import tab components
import { OverviewTab } from "./tabs/OverviewTab";
import { ItemsTab } from "./tabs/ItemsTab";
import { NotesTab } from "./tabs/NotesTab";
import { AttachmentsTab } from "./tabs/AttachmentsTab";
import { ActivityTab } from "./tabs/ActivityTab";

export function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrency();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const foundSale = salesData.find((s: any) => s.id === id);
    setSale((foundSale as unknown as Sale) || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sale details...</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Sale Not Found</h2>
        <p className="text-muted-foreground mb-4">The sale with ID "{id}" could not be found</p>
        <Button onClick={() => navigate('/dashboard/sales')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sales
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
      case 'completed':
        return 'status-success';
      case 'new_offer':
        return 'status-info';
      case 'redefined':
        return 'status-warning';
      case 'lost':
      case 'cancelled':
        return 'status-destructive';
      default:
        return 'status-info';
    }
  };

  const handleSendInvoice = () => {
    toast.success("Invoice sent successfully");
  };

  const handleDownloadPDF = () => {
    setIsPDFModalOpen(true);
  };

  const handleEditSale = () => {
    navigate(`/dashboard/sales/${id}/edit`);
  };

  const handleDeleteSale = () => {
    // In real app, would show confirmation dialog
    toast.success("Sale deleted successfully");
    navigate('/dashboard/sales');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/sales')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-sm border border-border/50">
                <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSendInvoice} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditSale} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Sale
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteSale} className="gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete Sale
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground mb-1">
                  {sale.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                  <Badge variant="outline" className="text-xs">{formatCurrency(sale.amount)}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between p-6 lg:p-8">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/sales')}
                className="gap-2 hover:bg-background/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-8 w-px bg-border/50" />
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {sale.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(sale.status)} variant="outline">
                      {sale.status}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">{formatCurrency(sale.amount)}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadPDF}
                className="gap-2 hover:bg-background/80 border-border/50"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendInvoice}
                className="gap-2 hover:bg-background/80 border-border/50"
              >
                <Send className="h-4 w-4" />
                Send Invoice
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEditSale}
                className="gap-2 hover:bg-background/80 border-border/50"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteSale}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-border/50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="w-full mb-6">
            <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-lg grid grid-cols-5">
              <TabsTrigger value="overview" className="px-4 py-2.5 text-sm font-medium">
                Overview
              </TabsTrigger>
              <TabsTrigger value="items" className="px-4 py-2.5 text-sm font-medium">
                Items
              </TabsTrigger>
              <TabsTrigger value="notes" className="px-4 py-2.5 text-sm font-medium">
                Notes
              </TabsTrigger>
              <TabsTrigger value="attachments" className="px-4 py-2.5 text-sm font-medium">
                Attachments
              </TabsTrigger>
              <TabsTrigger value="activity" className="px-4 py-2.5 text-sm font-medium">
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <OverviewTab sale={sale} />
          </TabsContent>

          <TabsContent value="items">
            <ItemsTab sale={sale} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab sale={sale} />
          </TabsContent>

          <TabsContent value="attachments">
            <AttachmentsTab sale={sale} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab sale={sale} />
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Preview Modal */}
      {isPDFModalOpen && sale && (
        <SalePDFPreviewModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          sale={sale}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}