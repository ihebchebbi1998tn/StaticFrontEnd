import { useState } from "react";
import { ArrowLeft, Save, FileText, Zap, Send, Search, Plus, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { OffersService } from "../services/offers.service";
import { OfferItemsSelectorAdvanced } from "../components/OfferItemsSelectorAdvanced";
import { ContactSelectorWithType } from "../components/ContactSelectorWithType";
import { CreateOfferData, OfferItem } from "../types";
import { useLookups } from '@/shared/contexts/LookupsContext';

const statuses = [
  "draft",
  "sent"
];



const currencies = [
  { value: "TND", label: "TND - Tunisian Dinar" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" }
];

export function AddOffer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { priorities: lookupPriorities } = useLookups();
  const [validUntil, setValidUntil] = useState<Date>();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateOfferData>({
    title: "",
    description: "",
    contactId: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    status: "draft",
    category: "potential",
    source: "direct_customer",
    amount: 0,
    currency: "TND",
    validUntil: undefined,
    items: [],
    notes: "",
    taxes: 0,
    discount: 0
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactSelect = (contact: any) => {
    setFormData(prev => ({
      ...prev,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email || "",
      contactPhone: contact.phone || "",
      contactAddress: contact.address || ""
    }));
  };

  const handleItemsChange = (items: OfferItem[]) => {
    const itemsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({
      ...prev,
      items,
      amount: itemsTotal
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    
    if (!formData.title || !formData.contactName) {
      toast({
        title: t("Error"),
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const offerData = {
        ...formData,
        validUntil,
        status: isDraft ? 'draft' as const : 'sent' as const
      };
      
      const newOffer = await OffersService.createOffer(offerData);
      
      toast({
        title: t("Success"),
        description: isDraft ? t("offer_created") : t("offer_sent"),
      });
      
      navigate(`/dashboard/offers/${newOffer.id}`);
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: t("Error"),
        description: "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.amount + formData.taxes - formData.discount;
  };

  const isFormValid = formData.title && formData.contactName;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/offers" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Offers
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-medium">Create New Offer</h1>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Information */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="inline-flex items-center gap-2">
                    {t("offer_title")} * 
                    <InfoTip title={t("offer_title")} description="A descriptive name for this offer" tooltip="What is this?" />
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Enterprise Software Package"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="inline-flex items-center gap-2">
                      Category * 
                      <InfoTip title="Offer Category" description="Classify the type and potential of this offer" tooltip="What is this?" />
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="potential">Potential</SelectItem>
                        <SelectItem value="big_project">Big Project</SelectItem>
                        <SelectItem value="likely_to_close">Likely to Close</SelectItem>
                        <SelectItem value="unlikely_to_close">Unlikely to Close</SelectItem>
                        <SelectItem value="follow_up_required">Follow-up Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source" className="inline-flex items-center gap-2">
                      Source * 
                      <InfoTip title="Offer Source" description="How did this offer opportunity come to us" tooltip="What is this?" />
                    </Label>
                    <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct_customer">Direct Customer</SelectItem>
                        <SelectItem value="social_media">Social Media</SelectItem>
                        <SelectItem value="email_marketing">Email Marketing</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="trade_show">Trade Show</SelectItem>
                        <SelectItem value="cold_call">Cold Call</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="inline-flex items-center gap-2">
                    {t("offer_description")}
                    <InfoTip title={t("offer_description")} description="Details about what's being offered" tooltip="What's this?" />
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the offer details..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="pt-6">
                <ContactSelectorWithType
                  onContactSelect={handleContactSelect}
                  selectedContact={formData.contactName ? {
                    id: formData.contactId,
                    name: formData.contactName,
                    email: formData.contactEmail,
                    phone: formData.contactPhone,
                    address: formData.contactAddress
                  } : null}
                />
              </CardContent>
            </Card>

            {/* Offer Items */}
            <Card>
              <CardContent className="pt-6">
                <OfferItemsSelectorAdvanced
                  items={formData.items}
                  onUpdateItems={handleItemsChange}
                  currency={formData.currency}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("Currency")}</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("valid_until")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validUntil && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validUntil ? format(validUntil, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={validUntil}
                        onSelect={setValidUntil}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxes">Taxes</Label>
                    <Input
                      id="taxes"
                      type="number"
                      step="0.01"
                      value={formData.taxes}
                      onChange={(e) => handleInputChange("taxes", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => handleInputChange("discount", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span>{formData.amount.toLocaleString()} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span>{formData.taxes.toLocaleString()} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formData.discount.toLocaleString()} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total:</span>
                    <span>{calculateTotal().toLocaleString()} {formData.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Internal notes..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/offers')}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !isFormValid}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading || !isFormValid}
            className="gradient-primary"
          >
            <Send className="h-4 w-4 mr-2" />
            Create & Send
          </Button>
        </div>
      </form>
    </div>
  );
}