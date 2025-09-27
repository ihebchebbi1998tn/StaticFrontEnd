import { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Maximize2 } from 'lucide-react';
import { DispatchPDFDocument } from './DispatchPDFDocument';
import { defaultSettings } from '../utils/pdfSettings.utils';
import { PdfSettingsModal } from './PdfSettingsModal';
import { PDFPreviewActions } from './PDF/PDFPreviewActions';
import { PDFMobileActions } from './PDF/PDFMobileActions';
import { usePDFActions } from '../hooks/usePDFActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface DispatchPDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: any;
  customer: any;
  installation: any;
  timeData: any[];
  formatCurrency: (amount: number) => string;
}

export function DispatchPDFPreviewModal({
  isOpen,
  onClose,
  dispatch,
  customer,
  installation,
  timeData,
  formatCurrency
}: DispatchPDFPreviewModalProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pdfSettings, setPdfSettings] = useState(defaultSettings);
  const [viewMode, setViewMode] = useState<'fit' | 'width' | 'zoom'>('fit');
  const [pdfKey, setPdfKey] = useState(0);
  const isMobile = useIsMobile();

  const {
    isGenerating,
    handlePrint,
    handleShare,
    handleDownloadSuccess,
    handleDownloadError
  } = usePDFActions({ dispatch, formatCurrency, pdfSettings });

  useEffect(() => {
    const savedSettings = localStorage.getItem('dispatch-pdf-settings');
    if (savedSettings) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(savedSettings) };
        setPdfSettings(parsed);
      } catch (error) {
        console.warn('Failed to parse saved PDF settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dispatch-pdf-settings', JSON.stringify(pdfSettings));
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
                Dispatch Report #{dispatch.dispatchNumber}
              </p>
            </div>
          </div>
        </DialogHeader>

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
            <DispatchPDFDocument 
              dispatch={dispatch}
              customer={customer}
              installation={installation}
              timeData={timeData}
              formatCurrency={formatCurrency}
              settings={pdfSettings}
            />
          </PDFViewer>
        </div>

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