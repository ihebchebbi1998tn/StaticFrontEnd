import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Eye, Edit } from "lucide-react";
import { Offer } from "../../types";
import { useCurrency } from '@/shared/hooks/useCurrency';

interface ItemsTabProps {
  offer: Offer;
}

export function ItemsTab({ offer }: ItemsTabProps) {
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrency();

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Wrench className="h-4 w-4" />;
      case 'article':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case 'service':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Service</Badge>;
      case 'article':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Article</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const totalAmount = offer.items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Offer Items ({offer.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {offer.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items in this offer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Installation</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offer.items.map((item, index) => (
                  <TableRow key={item.id || index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center">
                      {getItemTypeIcon(item.type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{item.itemName}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getItemTypeBadge(item.type)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.type === 'service' ? (
                        <span className="text-sm text-muted-foreground">Service item</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {offer.items.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {offer.items.filter(item => item.type === 'service').length} services, {' '}
                {offer.items.filter(item => item.type === 'article').length} articles
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Items Value</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}