import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Building, User, Phone, Mail, Calendar, FileText, DollarSign, Wrench } from "lucide-react";
import { Offer } from "../../types";
import { useCurrency } from '@/shared/hooks/useCurrency';

// Mock service orders data - in real app this would come from API
const mockServiceOrders = [
  {
    id: "so-001",
    orderNumber: "SO-2024-001",
    saleId: "sale-001",
    offerId: "offer-001",
    title: "Server Maintenance Implementation",
    status: "in_progress"
  },
  {
    id: "so-002", 
    orderNumber: "SO-2024-002",
    saleId: "sale-003",
    offerId: "offer-003",
    title: "Enterprise Security Audit Implementation", 
    status: "scheduled"
  }
];

interface OverviewTabProps {
  offer: Offer;
}

export function OverviewTab({ offer }: OverviewTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { format: formatCurrency } = useCurrency();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'status-info';
      case 'accepted':
        return 'status-success';
      case 'declined':
        return 'status-destructive';
      case 'cancelled':
        return 'status-destructive';
      case 'modified':
        return 'status-warning';
      default:
        return 'status-secondary';
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const totalItemsValue = offer.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const hasServices = offer.items.some(item => item.type === 'service');
  const relatedServiceOrder = mockServiceOrders.find(so => so.offerId === offer.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Offer Details - Consolidated */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Offer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer ID</label>
                <p className="text-foreground font-medium mt-1">{offer.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer Title</label>
                <p className="text-foreground font-medium mt-1">{offer.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Offer Description</label>
                <p className="text-foreground font-medium mt-1">{offer.description || 'No description provided'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Affected Company</label>
                <div className="mt-1">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                    onClick={() => navigate(`/dashboard/contacts/${offer.contactId}`)}
                  >
                    <span className="truncate">{offer.contactCompany || offer.contactName}</span>
                    <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                <p className="text-foreground font-medium mt-1">
                  {offer.contactEmail || "Not specified"}
                </p>
              </div>

              {/* Service Order - Only show if there are services */}
              {hasServices && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Related Service Order</label>
                  <div className="mt-1">
                    {relatedServiceOrder ? (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-left font-semibold text-primary hover:underline inline-flex items-center md:max-w-none max-w-[200px] truncate"
                        onClick={() => navigate(`/dashboard/field/service-orders/${relatedServiceOrder.id}`)}
                      >
                        <Wrench className="mr-2 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{relatedServiceOrder.orderNumber}</span>
                        <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                      </Button>
                    ) : (
                      <p className="text-muted-foreground font-medium">-</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Offer Amount</label>
                  <p className="text-foreground font-medium mt-1">{formatCurrency(offer.totalAmount || offer.amount)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Valid Until</label>
                <p className="text-foreground font-medium mt-1">{formatDate(offer.validUntil)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                <div className="mt-1">
                  <Badge className={`${getPriorityColor(offer.priority)} font-medium`}>
                    {t(offer.priority)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(offer.status)} font-medium`}>
                    <span className="ml-1">{t(offer.status)}</span>
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="mt-1">
                  <Badge variant="outline" className="font-medium">
                    {offer.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Source</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="font-medium">
                    {offer.source?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="text-foreground font-medium mt-1">
                  {offer.assignedToName || 'Unassigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground">Financial Overview</label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Offer Summary Card */}
              <Card className="shadow-card">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">Offer Summary</h4>
                    <Badge variant="outline" className={getStatusColor(offer.status)}>
                      {offer.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Amount:</span>
                      <span className="font-medium">{formatCurrency(offer.amount)}</span>
                    </div>
                    {offer.taxes && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes:</span>
                        <span className="font-medium">+{formatCurrency(offer.taxes)}</span>
                      </div>
                    )}
                    {offer.discount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium text-red-600">-{formatCurrency(offer.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-semibold">{formatCurrency(offer.totalAmount || offer.amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Summary Card */}
              <Card className="shadow-card">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">Items Summary</h4>
                    <span className="text-xs text-muted-foreground">{offer.items.length} items</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Services:</span>
                      <span className="font-medium">{offer.items.filter(item => item.type === 'service').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Articles:</span>
                      <span className="font-medium">{offer.items.filter(item => item.type === 'article').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items Total Value:</span>
                      <span className="font-medium">{formatCurrency(totalItemsValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}