import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Eye, Edit } from "lucide-react";
import { Sale } from "../../types";
import { useCurrency } from '@/shared/hooks/useCurrency';

interface ItemsTabProps {
  sale: Sale;
}

export function ItemsTab({ sale }: ItemsTabProps) {
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

  const totalAmount = sale.items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Sale Items ({sale.items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sale.items.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items added to this sale yet.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-[100px] text-center">Qty</TableHead>
                    <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                    <TableHead className="w-[120px] text-right">Total</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getItemTypeIcon(item.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{item.itemName}</div>
                          {item.itemCode && (
                            <div className="text-sm text-muted-foreground">
                              Code: {item.itemCode}
                            </div>
                          )}
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {getItemTypeBadge(item.type)}
                            {item.installationName && (
                              <Badge variant="secondary" className="text-xs">
                                {item.installationName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
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

            {/* Summary */}
            <div className="mt-6 space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Items Value:</span>
                  <span className="font-mono">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Additional Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {sale.items.filter(item => item.type === 'service').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Services</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {sale.items.filter(item => item.type === 'article').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Articles</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Quantity</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}