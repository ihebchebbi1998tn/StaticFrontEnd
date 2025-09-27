import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, ShoppingCart, Wrench } from "lucide-react";
import { Offer } from "../types";

interface ConvertOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  onConvert: (data: { convertToSale: boolean; convertToServiceOrder: boolean }) => void;
}

export function ConvertOfferModal({ 
  open, 
  onOpenChange, 
  offer, 
  onConvert 
}: ConvertOfferModalProps) {
  const { t } = useTranslation();
  const [convertToSale, setConvertToSale] = useState(true);
  const [convertToServiceOrder, setConvertToServiceOrder] = useState(false);

  const handleConvert = () => {
    if (!convertToSale && !convertToServiceOrder) {
      return; // At least one option should be selected
    }
    
    onConvert({ convertToSale, convertToServiceOrder });
    onOpenChange(false);
    
    // Reset state
    setConvertToSale(true);
    setConvertToServiceOrder(false);
  };

  if (!offer) return null;

  // Check if offer contains services
  const hasServices = offer.items.some(item => item.type === 'service');
  const hasProducts = offer.items.some(item => item.type === 'article');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            {t('conversion.convert_offer')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{offer.title}</h3>
            <p className="text-muted-foreground">
              {offer.contactName} • {offer.totalAmount?.toLocaleString() || offer.amount.toLocaleString()} {offer.currency}
            </p>
          </div>

          <div className="grid gap-4">
            <Card className={convertToSale ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="convert-sale"
                    checked={convertToSale}
                    onCheckedChange={(checked) => setConvertToSale(!!checked)}
                  />
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-chart-2" />
                    <CardTitle className="text-base">{t('actions.convert_to_sale')}</CardTitle>
                  </div>
                </div>
                <CardDescription className="ml-7">
                  {t('conversion.convert_to_sale_description')}
                </CardDescription>
              </CardHeader>
              {hasProducts && (
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground ml-7">
                    Will convert {offer.items.filter(item => item.type === 'article').length} product(s) to sale items
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className={convertToServiceOrder ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="convert-service"
                    checked={convertToServiceOrder}
                    onCheckedChange={(checked) => setConvertToServiceOrder(!!checked)}
                    disabled={!hasServices}
                  />
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-chart-3" />
                    <CardTitle className="text-base">{t('actions.convert_to_service_order')}</CardTitle>
                  </div>
                </div>
                <CardDescription className="ml-7">
                  {t('conversion.convert_to_service_order_description')}
                  {!hasServices && " (No services in this offer)"}
                </CardDescription>
              </CardHeader>
              {hasServices && (
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground ml-7">
                    Will convert {offer.items.filter(item => item.type === 'service').length} service(s) to service order
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Conversion Summary:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Offer status will be changed to "Accepted"</li>
              {convertToSale && <li>• A new Sales Order will be created</li>}
              {convertToServiceOrder && hasServices && <li>• A new Service Order will be created</li>}
              <li>• Original offer will remain for reference</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConvert}
              disabled={!convertToSale && !convertToServiceOrder}
              className="bg-primary hover:bg-primary/90"
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Convert Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}