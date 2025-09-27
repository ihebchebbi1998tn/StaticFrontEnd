import { useState, useEffect } from "react";
import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTip } from "@/shared/components";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { SalesService } from "../services/sales.service";
import { Sale, SaleItem } from "../types";
import { SaleItemsManager } from "../components/SaleItemsManager";

import currencies from '@/data/mock/currencies.json';
import offerStatuses from '@/data/mock/offer-statuses.json';
import { useLookups } from '@/shared/contexts/LookupsContext';

const statuses = [...new Set(['new_offer', ...offerStatuses.map(s => s.id)])];

export function EditSale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { priorities: lookupPriorities } = useLookups();
  const priorities = lookupPriorities.map(p => p.id);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [formData, setFormData] = useState<Partial<Sale>>({
    title: "",
    description: "",
    status: "new_offer",
    priority: "medium",
    amount: 0,
    currency: "USD",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
    taxes: 0,
    discount: 0,
    shippingCost: 0,
    items: []
  });

  // Load sale data
  useEffect(() => {
    const loadSale = async () => {
      if (!id) return;
      
      try {
        const sale = await SalesService.getSaleById(id);
            if (sale) {
              setFormData(sale);
              // normalize deliveryDate to Date object when possible
              try {
                const d = sale.deliveryDate ? new Date(sale.deliveryDate) : undefined;
                setDeliveryDate(d as any);
              } catch (e) {
                setDeliveryDate(undefined);
              }
            }
      } catch (error) {
        console.error("Error loading sale:", error);
        toast({
          title: "Error",
          description: "Failed to load sale details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSale();
  }, [id, toast]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemsChange = (items: SaleItem[]) => {
    const itemsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({
      ...prev,
      items,
      amount: itemsTotal
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      const updateData = {
        ...formData,
        deliveryDate,
        totalAmount: (formData.amount || 0) + (formData.taxes || 0) + (formData.shippingCost || 0) - (formData.discount || 0)
      };
      
      await SalesService.updateSale(id, updateData);
      
      toast({
        title: "Success",
        description: "Sale has been updated successfully.",
      });
      
      navigate(`/dashboard/sales/${id}`);
    } catch (error) {
      console.error("Error updating sale:", error);
      toast({
        title: "Error",
        description: "Failed to update sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sale details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/sales/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sale
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Edit Sale</h1>
          <p className="text-muted-foreground">Update sale information and manage items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sale Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="inline-flex items-center gap-2">
                      Sale Title * 
                      <InfoTip title="Sale Title" description="A descriptive name for this sale order." tooltip="What is this?" />
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter sale title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="inline-flex items-center gap-2">
                      Status * 
                      <InfoTip title="Status" description="Current stage of the sale process." tooltip="What is this?" />
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s} value={s}>{offerStatuses.find(os => os.id === s)?.name ?? (s === 'new_offer' ? 'New Offer' : s)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="inline-flex items-center gap-2">
                    Description 
                    <InfoTip title="Description" description="Details about what's being sold." tooltip="What's this?" />
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter sale description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="inline-flex items-center gap-2">
                      Priority 
                      <InfoTip title="Priority" description="Urgency level for this sale." tooltip="What's this?" />
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(p => (
                          <SelectItem key={p} value={p}>{lookupPriorities.find(x => x.id === p)?.name ?? p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-2">
                      Delivery Date 
                      <InfoTip title="Delivery Date" description="Expected delivery or completion date." tooltip="What's this?" />
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="inline-flex items-center gap-2">
                    Base Amount 
                    <InfoTip title="Base Amount" description="The base price from items (auto-calculated)." tooltip="What's this?" />
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">This is automatically calculated from sale items</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxes" className="inline-flex items-center gap-2">
                    Taxes 
                    <InfoTip title="Taxes" description="Tax amount to be added." tooltip="What's this?" />
                  </Label>
                  <Input
                    id="taxes"
                    type="number"
                    step="0.01"
                    value={formData.taxes}
                    onChange={(e) => handleInputChange("taxes", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="inline-flex items-center gap-2">
                    Discount 
                    <InfoTip title="Discount" description="Discount amount to be deducted." tooltip="What's this?" />
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost" className="inline-flex items-center gap-2">
                    Shipping Cost 
                    <InfoTip title="Shipping Cost" description="Cost of shipping or delivery." tooltip="What's this?" />
                  </Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={formData.shippingCost}
                    onChange={(e) => handleInputChange("shippingCost", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                  />
                </div>

                {/* Total Display */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount:</span>
                    <span>
                      {formData.currency} {((formData.amount || 0) + (formData.taxes || 0) + (formData.shippingCost || 0) - (formData.discount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Sale Items Management */}
        <SaleItemsManager
          items={formData.items || []}
          onUpdateItems={handleItemsChange}
          currency={formData.currency}
        />

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="inline-flex items-center gap-2">
                  Customer Name * 
                  <InfoTip title="Customer Name" description="Name of the customer or company." tooltip="What's this?" />
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="inline-flex items-center gap-2">
                  Customer Email 
                  <InfoTip title="Customer Email" description="Email address for communication." tooltip="What's this?" />
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="Enter customer email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="inline-flex items-center gap-2">
                  Customer Phone 
                  <InfoTip title="Customer Phone" description="Phone number for contact." tooltip="What's this?" />
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="Enter customer phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="inline-flex items-center gap-2">
                  Customer Address 
                  <InfoTip title="Customer Address" description="Delivery or billing address." tooltip="What's this?" />
                </Label>
                <Input
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                  placeholder="Enter customer address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes" className="inline-flex items-center gap-2">
                Notes 
                <InfoTip title="Notes" description="Any additional notes or special instructions." tooltip="What's this?" />
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or specifications"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link to={`/dashboard/sales/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Update Sale
          </Button>
        </div>
      </form>
    </div>
  );
}