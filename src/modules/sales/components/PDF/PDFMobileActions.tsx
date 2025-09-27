import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Settings, MoreVertical, Printer, Share2, MessageCircle, Mail, Eye } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { SalePDFDocument } from '../SalePDFDocument';
import { PdfSettingsModal } from '../PdfSettingsModal';
import { PdfSettings } from '../../utils/pdfSettings.utils';

interface PDFMobileActionsProps {
  sale: any;
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
  sale,
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
  return (
    <div className="flex items-center gap-2">
      <PDFDownloadLink 
        document={<SalePDFDocument sale={sale} formatCurrency={formatCurrency} settings={pdfSettings} />} 
        fileName={`sale-order-${sale.id}.pdf`} 
        className="inline-flex" 
        onError={onDownloadError}
      >
        {({ loading }) => (
          <Button 
            size="sm" 
            disabled={loading} 
            onClick={onDownloadSuccess}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Preparing...' : 'Download'}
          </Button>
        )}
      </PDFDownloadLink>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>PDF Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <PdfSettingsModal
              isOpen={true}
              onClose={() => {}}
              settings={pdfSettings}
              onSettingsChange={onSettingsChange}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onPrint} disabled={isGenerating}>
            <Printer className="h-4 w-4 mr-2" />
            Print PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare()} disabled={isGenerating}>
            <Share2 className="h-4 w-4 mr-2" />
            Share PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('whatsapp')} disabled={isGenerating}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('facebook')} disabled={isGenerating}>
            <Share2 className="h-4 w-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('email')} disabled={isGenerating}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewModeChange(viewMode === 'fit' ? 'width' : 'fit')}>
            <Eye className="h-4 w-4 mr-2" />
            Toggle View Mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}