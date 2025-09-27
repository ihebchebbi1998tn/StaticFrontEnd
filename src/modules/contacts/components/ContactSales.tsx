import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Eye, 
  Target, 
  Calendar, 
  User
} from "lucide-react";

// Import sales data
import salesData from "@/data/mock/sales.json";
import { useCurrency } from '@/shared/hooks/useCurrency';

interface ContactSalesProps {
  contactId: string;
  contactName: string;
}

export function ContactSales({ contactId, contactName: _contactName }: ContactSalesProps) {
  const navigate = useNavigate();

  // Filter sales for this specific contact
  const contactSales = salesData.filter((sale: any) => sale.contactId === contactId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'status-success';
      case 'new_offer':
        return 'status-info';
      case 'redefined':
        return 'status-warning';
      case 'lost':
        return 'status-destructive';
      default:
        return 'status-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const { format: formatCurrency } = useCurrency();

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewSale = (saleId: string) => {
    navigate(`/dashboard/sales/${saleId}`);
  };

  if (contactSales.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Sales Yet</h3>
        <p className="text-muted-foreground mb-4">
          This contact doesn't have any sales in the pipeline yet.
        </p>
        <Button 
          onClick={() => navigate(`/dashboard/sales/add?contactId=${contactId}`)}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Create First Sale
        </Button>
      </div>
    );
  }

  const totalSalesValue = contactSales.reduce((sum, sale: any) => sum + sale.amount, 0);
  const activeSales = contactSales.filter((sale: any) => sale.status === 'new_offer' || sale.status === 'redefined');
  const wonSales = contactSales.filter((sale: any) => sale.status === 'won');

  return (
    <div className="space-y-6">
      {/* Sales Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Total Sales</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{contactSales.length}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(totalSalesValue)} total value
          </p>
        </div>
        
        <div className="p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{activeSales.length}</p>
          <p className="text-sm text-muted-foreground">In pipeline</p>
        </div>
        
        <div className="p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Won</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{wonSales.length}</p>
          <p className="text-sm text-muted-foreground">Closed deals</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Sales History</h4>
        {contactSales.map((sale: any) => (
          <div key={sale.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="font-semibold text-foreground truncate">{sale.title}</h5>
                  <Badge className={`${getStatusColor(sale.status)} text-xs`}>
                    {sale.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${getPriorityColor(sale.priority)} text-xs`}>
                    {sale.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {formatCurrency(sale.amount)}
                    </span>
                  </div>
                  {sale.estimatedCloseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expected: {formatDate(sale.estimatedCloseDate)}</span>
                    </div>
                  )}
                </div>
                
                {sale.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {sale.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{sale.assignedToName || 'Unassigned'}</span>
                  </div>
                  <span>•</span>
                  <span>Created: {formatDate(sale.createdAt)}</span>
                  {sale.items && sale.items.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{sale.items.length} items</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSale(sale.id)}
                  className="gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}