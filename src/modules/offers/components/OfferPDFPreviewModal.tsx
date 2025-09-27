import { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Maximize2 } from 'lucide-react';
import { OfferPDFDocument } from './OfferPDFDocument';
import { defaultSettings } from '../utils/pdfSettings.utils';
import { PdfSettingsModal } from './PdfSettingsModal';
import { PDFPreviewActions } from './PDF/PDFPreviewActions';
import { PDFMobileActions } from './PDF/PDFMobileActions';
import { usePDFActions } from '../hooks/usePDFActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface OfferPDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
  formatCurrency: (amount: number) => string;
}

export function OfferPDFPreviewModal({
  isOpen,
  onClose,
  offer,
  formatCurrency
}: OfferPDFPreviewModalProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pdfSettings, setPdfSettings] = useState(defaultSettings);
  const [viewMode, setViewMode] = useState<'fit' | 'width' | 'zoom'>('fit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const isMobile = useIsMobile();

  const {
    isGenerating,
    handlePrint,
    handleShare,
    handleDownloadSuccess,
    handleDownloadError
  } = usePDFActions({ offer, formatCurrency, pdfSettings });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('offer-pdf-settings');
    if (savedSettings) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(savedSettings) };

        // If no logo is present in pdf-settings, try to pull onboarding logo (data URL)
        // so users who uploaded during onboarding see their logo automatically.
        if (!parsed.company?.logo) {
          try {
            const onboardRaw = localStorage.getItem('user-onboarding-data');
            if (onboardRaw) {
              const onboard = JSON.parse(onboardRaw);
              const candidate = onboard?.companyInfo?.logo;
              const candidateName = onboard?.companyInfo?.name;
              if (candidate && typeof candidate === 'string') {
                parsed.company = { ...(parsed.company || {}), logo: candidate, name: parsed.company?.name || candidateName || parsed.company?.name };
                parsed.showElements = { ...(parsed.showElements || {}), logo: true };
                // Persist the merged settings so subsequent openings reflect the logo
                try {
                  localStorage.setItem('offer-pdf-settings', JSON.stringify(parsed));
                } catch (e) {
                  // ignore storage errors
                }
              }
            }
          } catch (e) {
            // ignore parse errors from onboarding data
          }
        }

        setPdfSettings(parsed);
      } catch (error) {
        console.warn('Failed to parse saved PDF settings:', error);
      }
    }
  }, []);

  // Auto-save settings and force PDF re-render when settings change
  useEffect(() => {
    localStorage.setItem('offer-pdf-settings', JSON.stringify(pdfSettings));
    const timer = setTimeout(() => {
      setPdfKey(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [pdfSettings]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[95vh]' : 'max-w-7xl h-[90vh]'} flex flex-col`}>
        <DialogHeader className={`${isMobile ? 'pb-2' : ''} flex flex-row items-center justify-between space-y-0`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
                PDF Preview
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Quote #{offer.id}
                {!isMobile && ` - ${offer.title}`}
              </p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>

        <Separator />

        {/* Mobile vs Desktop Actions */}
        {isMobile ? (
          <PDFMobileActions
            offer={offer}
            formatCurrency={formatCurrency}
            pdfSettings={pdfSettings}
            isGenerating={isGenerating}
            viewMode={viewMode}
            onPrint={handlePrint}
            onShare={handleShare}
            onViewModeChange={setViewMode}
            onSettingsChange={setPdfSettings}
            onDownloadSuccess={handleDownloadSuccess}
            onDownloadError={handleDownloadError}
          />
        ) : (
          <PDFPreviewActions
            offer={offer}
            formatCurrency={formatCurrency}
            pdfSettings={pdfSettings}
            isGenerating={isGenerating}
            viewMode={viewMode}
            onPrint={handlePrint}
            onShare={handleShare}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewModeChange={setViewMode}
            onDownloadSuccess={handleDownloadSuccess}
            onDownloadError={handleDownloadError}
          />
        )}

        <Separator />

        {/* PDF Preview */}
        <div className="flex-1 min-h-0">
          <PDFViewer 
            key={pdfKey}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: isMobile ? '4px' : '8px',
              backgroundColor: '#f8fafc'
            }} 
            showToolbar={!isMobile}
          >
            <OfferPDFDocument offer={offer} formatCurrency={formatCurrency} settings={pdfSettings} />
          </PDFViewer>
        </div>

        {/* Footer Info */}
        {!isMobile && (
          <>
            <Separator />
            <div className="flex items-center justify-between py-2 px-1 text-xs text-muted-foreground">
              <span>Generated on {new Date().toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {Object.values(pdfSettings.showElements).filter(Boolean).length} sections enabled
                </Badge>
              </div>
            </div>
          </>
        )}

        {/* PDF Settings Modal */}
        <PdfSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={pdfSettings}
          onSettingsChange={setPdfSettings}
        />
      </DialogContent>
    </Dialog>
  );
}