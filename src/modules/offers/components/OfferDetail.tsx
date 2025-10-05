import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Edit, Trash2, FileDown, RefreshCw, Send, Check, X, MoreVertical } from "lucide-react";
import { OffersService } from "../services/offers.service";
import { Offer } from "../types";
import { useCurrency } from '@/shared/hooks/useCurrency';
import { toast } from "sonner";
import { OfferPDFPreviewModal } from "./OfferPDFPreviewModal";
import { OverviewTab } from "./tabs/OverviewTab";
import { ItemsTab } from "./tabs/ItemsTab";
import { NotesTab } from "./tabs/NotesTab";
import { AttachmentsTab } from "./tabs/AttachmentsTab";
import { ActivityTab } from "./tabs/ActivityTab";

export function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrency();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchOffer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const offerData = await OffersService.getOfferById(id);
        setOffer(offerData);
      } catch (error) {
        toast.error(t('failedToFetchOffer'));
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  const handleSendOffer = async () => {
    if (!offer) return;
    try {
      await OffersService.updateOffer(offer.id, { status: 'sent' });
      setOffer({ ...offer, status: 'sent' });
      toast.success(t('offer_sent'));
    } catch (error) {
      toast.error(t('failedToSendOffer'));
    }
  };

  const handleAcceptOffer = async () => {
    if (!offer) return;
    try {
      await OffersService.updateOffer(offer.id, { status: 'accepted' });
      setOffer({ ...offer, status: 'accepted' });
      toast.success(t('offer_accepted'));
    } catch (error) {
      toast.error(t('failedToAcceptOffer'));
    }
  };

  const handleDeclineOffer = async () => {
    if (!offer) return;
    try {
      await OffersService.updateOffer(offer.id, { status: 'declined' });
      setOffer({ ...offer, status: 'declined' });
      toast.success(t('offer_declined'));
    } catch (error) {
      toast.error(t('failedToDeclineOffer'));
    }
  };

  const handleRenewOffer = async () => {
    if (!offer) return;
    try {
      await OffersService.renewOffer(offer.id);
      toast.success(t('offer_renewed'));
      navigate('/dashboard/offers');
    } catch (error) {
      toast.error(t('failedToRenewOffer'));
    }
  };

  const handleDeleteOffer = async () => {
    if (!offer) return;
    try {
      await OffersService.deleteOffer(offer.id);
      toast.success(t('offer_deleted'));
      navigate('/dashboard/offers');
    } catch (error) {
      toast.error(t('failedToDeleteOffer'));
    }
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
        <h2 className="text-2xl font-semibold text-foreground mb-2">{t('offerNotFound')}</h2>
        <p className="text-muted-foreground mb-4">{t('offerNotFoundDescription', { id })}</p>
        <Button onClick={() => navigate('/dashboard/offers')} variant="outline">
          {t('backToOffers')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/offers')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            <div className="h-8 w-px bg-border/50" />
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {offer.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsPDFModalOpen(true)}>
              <FileDown className="h-4 w-4 mr-2" />
              {t('download_pdf')}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/dashboard/offers/${offer.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                {t('edit_offer')}
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeleteOffer} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('delete')}
            </Button>
          </div>
        </div>
      </div>

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
            <OverviewTab offer={offer} />
          </TabsContent>

          <TabsContent value="items">
            <ItemsTab offer={offer} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab offer={offer} />
          </TabsContent>

          <TabsContent value="attachments">
            <AttachmentsTab offer={offer} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab offer={offer} />
          </TabsContent>
        </Tabs>
      </div>

      {isPDFModalOpen && offer && (
        <OfferPDFPreviewModal
          offer={offer}
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}