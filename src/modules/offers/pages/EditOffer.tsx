import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import offerStatuses from '@/data/mock/offer-statuses.json';
import currencies from '@/data/mock/currencies.json';
import { useLookups } from '@/shared/contexts/LookupsContext';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Save, Send, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ContactSelector } from "../components/ContactSelector";
import { OfferItemsManager } from "../components/OfferItemsManager";
import { OffersService } from "../services/offers.service";
import { CreateOfferData, Offer } from "../types";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  contactId: z.string().min(1, "Contact is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  amount: z.number().min(0, "Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum(["draft", "sent"]),
  validUntil: z.date().optional(),
  notes: z.string().optional(),
  taxes: z.number().min(0).default(0),
  discount: z.number().min(0).default(0)
});

type OfferFormData = z.infer<typeof offerSchema>;

export function EditOffer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [offerItems, setOfferItems] = useState<any[]>([]);
  
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      contactId: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      amount: 0,
      currency: "USD",
      status: "draft",
      notes: "",
      taxes: 0,
      discount: 0
    },
  });

  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const offerData = await OffersService.getOfferById(id);
        if (!offerData) {
          toast.error(t('offers.offerNotFound'));
          navigate('/dashboard/offers');
          return;
        }
        
        setOffer(offerData);
        setOfferItems(offerData.items || []);
        
        // Populate form with existing data
        form.reset({
          title: offerData.title,
          description: offerData.description || "",
          contactId: offerData.contactId,
          contactName: offerData.contactName,
          contactEmail: offerData.contactEmail || "",
          contactPhone: offerData.contactPhone || "",
          contactAddress: offerData.contactAddress || "",
          amount: offerData.amount,
          currency: offerData.currency,
          status: offerData.status as "draft" | "sent",
          notes: offerData.notes || "",
          taxes: offerData.taxes || 0,
          discount: offerData.discount || 0,
          validUntil: offerData.validUntil ? new Date(offerData.validUntil) : undefined,
        });

        // Set contact data
        setSelectedContact({
          id: offerData.contactId,
          name: offerData.contactName,
          email: offerData.contactEmail,
          phone: offerData.contactPhone,
          address: offerData.contactAddress,
          company: offerData.contactCompany,
        });
      } catch (error) {
        toast.error('Failed to fetch offer');
        navigate('/dashboard/offers');
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, form, navigate, t]);

  const watchAmount = form.watch("amount");
  const watchTaxes = form.watch("taxes");
  const watchDiscount = form.watch("discount");
  
  // Calculate total from items
  const itemsTotal = offerItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  
  // Calculate final total
  const baseAmount = itemsTotal > 0 ? itemsTotal : watchAmount;
  const totalAmount = baseAmount + watchTaxes - watchDiscount;

  const onSubmit = async (data: OfferFormData, shouldSend: boolean = false) => {
    if (!offer) return;
    
    setSaving(true);
    try {
      const updateData: Partial<Offer> = {
        title: data.title,
        description: data.description,
        contactId: data.contactId,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        amount: itemsTotal > 0 ? itemsTotal : data.amount,
        currency: data.currency as 'USD' | 'EUR' | 'GBP' | 'TND',
        status: shouldSend ? 'sent' : data.status,
        notes: data.notes,
        validUntil: data.validUntil,
        taxes: data.taxes,
        discount: data.discount,
        totalAmount: totalAmount,
        items: offerItems,
      };

      await OffersService.updateOffer(offer.id, updateData);
      
      const successMessage = shouldSend 
        ? t('offers.offer_sent') 
        : t('offers.offer_updated');
      toast.success(successMessage);
      navigate('/dashboard/offers');
    } catch (error) {
      toast.error(t('offers.failedToUpdateOffer'));
    } finally {
      setSaving(false);
    }
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    form.setValue("contactId", contact.id);
    form.setValue("contactName", contact.name);
    form.setValue("contactEmail", contact.email || "");
    form.setValue("contactPhone", contact.phone || "");
    form.setValue("contactAddress", contact.address || "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">{t('offers.offerNotFound')}</h2>
        <Button onClick={() => navigate('/dashboard/offers')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('offers.backToOffers')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-background/95">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/offers')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('offers.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('offers.edit_offer')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('offers.editOfferDescription')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
            disabled={saving}
            className="hover:bg-muted"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {t('offers.saveChanges')}
          </Button>
          <Button
            type="button"
            onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {t('offers.updateAndSend')}
          </Button>
        </div>
      </div>

      <form className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('offers.offer_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('offers.offer_title')} *</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder={t('offers.enterOfferTitle')}
                    className="mt-1"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">{t('offers.offer_description')}</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder={t('offers.enterOfferDescription')}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('offers.contact_information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactSelector
                  selectedContact={selectedContact}
                  onContactSelect={handleContactSelect}
                />
              </CardContent>
            </Card>

            {/* Offer Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('offers.offer_items')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OfferItemsManager
                  items={offerItems}
                  onUpdateItems={setOfferItems}
                  currency={form.watch("currency")}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t('offers.offerSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">{t('offers.offer_status')} *</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value: "draft" | "sent") => form.setValue("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {offerStatuses.filter(s => ['draft','sent'].includes(s.id)).map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label htmlFor="currency">{t('offers.currency')} *</Label>
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(value) => form.setValue("currency", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="validUntil">{t('offers.valid_until')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !form.watch("validUntil") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("validUntil") ? (
                          format(form.watch("validUntil")!, "PPP")
                        ) : (
                          <span>{t('offers.selectDate')}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch("validUntil")}
                        onSelect={(date) => form.setValue("validUntil", date)}
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
                <CardTitle>{t('offers.financialSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offerItems.length === 0 && (
                  <div>
                    <Label htmlFor="amount">{t('offers.offer_amount')} *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register("amount", { valueAsNumber: true })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="taxes">{t('offers.taxes')}</Label>
                  <Input
                    id="taxes"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register("taxes", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="discount">{t('offers.discount')}</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register("discount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  {offerItems.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('offers.itemsSubtotal')}</span>
                      <span>{itemsTotal.toFixed(2)} {form.watch("currency")}</span>
                    </div>
                  )}
                  
                  {watchTaxes > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('offers.taxes')}</span>
                      <span>+{watchTaxes.toFixed(2)} {form.watch("currency")}</span>
                    </div>
                  )}
                  
                  {watchDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('offers.discount')}</span>
                      <span className="text-destructive">-{watchDiscount.toFixed(2)} {form.watch("currency")}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>{t('offers.total')}</span>
                    <span>{totalAmount.toFixed(2)} {form.watch("currency")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('offers.offer_notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...form.register("notes")}
                  placeholder={t('offers.enterNotes')}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}