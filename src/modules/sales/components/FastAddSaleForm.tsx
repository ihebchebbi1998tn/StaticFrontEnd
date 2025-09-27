import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import offerStatuses from '@/data/mock/offer-statuses.json';
import currencies from '@/data/mock/currencies.json';
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SalesService } from "../services/sales.service";

interface FastAddSaleFormProps {
  onSuccess: (saleId: string) => void;
  onSwitchToDetailed: () => void;
}

export function FastAddSaleForm({ onSuccess, onSwitchToDetailed }: FastAddSaleFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    amount: "",
    status: offerStatuses[0]?.id || 'draft'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const saleData = {
        title: formData.title,
        customerName: formData.customerName,
        amount: parseFloat(formData.amount) || 0,
        status: formData.status as any,
        description: "",
        customerId: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        priority: "medium" as any,
        currency: "USD",
        deliveryDate: undefined,
        items: [],
        notes: "",
        taxes: 0,
        discount: 0,
        shippingCost: 0,
        isRecurring: false,
        recurringInterval: "monthly"
      };

      const newSale = await SalesService.createSale(saleData);
      
      toast({
        title: "Success",
        description: "Sale created successfully! You can add more details later.",
      });

      onSuccess(newSale.id);
    } catch (error) {
      console.error("Error creating sale:", error);
      toast({
        title: "Error",
        description: "Failed to create sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.title && formData.customerName && formData.amount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Sale Creation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fast-title">Sale Title *</Label>
            <Input
              id="fast-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter sale title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fast-customer">Customer Name *</Label>
            <Input
              id="fast-customer"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fast-amount">Amount *</Label>
            <Input
              id="fast-amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0.00"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fast-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {offerStatuses.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSwitchToDetailed}
              className="flex-1"
            >
              Use Detailed Form
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Quick Sale
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          You can add more details after creation using the detailed form.
        </p>
      </CardContent>
    </Card>
  );
}