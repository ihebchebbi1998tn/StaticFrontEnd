import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Settings, Share2, Printer, Eye, MessageCircle, Mail } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ServiceOrderPDFDocument } from '../ServiceOrderPDFDocument';
import { PdfSettingsModal } from '../PdfSettingsModal';
import { PdfSettings } from '../../utils/pdfSettings.utils';

interface PDFMobileActionsProps {
  serviceOrder: any;
  formatCurrency: (amount: number) => string;
  pdfSettings: PdfSettings;
  isGenerating: boolean;
  viewMode: 'fit' | 'width' | 'zoom';
  onPrint: () => void;
  onShare: (platform?: string) => void;
  onViewModeChange: (mode: 'fit' | 'width' | 'zoom') => void;
  onSettingsChange: (settings: PdfSettings) => void;
  onDownloadSuccess: () => void;
  onDownloadError: () => void;
}

export function PDFMobileActions({
  serviceOrder,
  formatCurrency,
  pdfSettings,
  isGenerating,
  viewMode,
  onPrint,
  onShare,
  onViewModeChange,
  onSettingsChange,
  onDownloadSuccess,
  onDownloadError
}: PDFMobileActionsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <PDFDownloadLink 
          document={<ServiceOrderPDFDocument serviceOrder={serviceOrder} formatCurrency={formatCurrency} settings={pdfSettings} />} 
          fileName={`service-report-${serviceOrder.orderNumber}.pdf`}
          onError={onDownloadError}
        >
          {({ loading }) => (
            <Button 
              size="sm" 
              disabled={loading} 
              onClick={onDownloadSuccess}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-1" />
              {loading ? 'Preparing...' : 'Download'}
            </Button>
          )}
        </PDFDownloadLink>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>PDF Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-4 h-full overflow-hidden">
              <PdfSettingsModal
                isOpen={true}
                onClose={() => {}}
                settings={pdfSettings}
                onSettingsChange={onSettingsChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrint}
          disabled={isGenerating}
        >
          <Printer className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isGenerating}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onShare()}>
              <Share2 className="h-4 w-4 mr-2" />
              Native Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('whatsapp')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('facebook')}>
              <Share2 className="h-4 w-4 mr-2" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex rounded border">
          <Button
            variant={viewMode === 'fit' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('fit')}
            className="h-8 px-2 text-xs"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === 'width' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('width')}
            className="h-8 px-2 text-xs"
          >
            Fit
          </Button>
        </div>
      </div>
    </div>
  );
}