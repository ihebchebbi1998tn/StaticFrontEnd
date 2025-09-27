import { Button } from '@/components/ui/button';
import { Download, Settings, Share2, Printer } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DispatchPDFDocument } from '../DispatchPDFDocument';
import { PdfSettings } from '../../utils/pdfSettings.utils';

interface PDFMobileActionsProps {
  dispatch: any;
  customer: any;
  installation: any;
  timeData: any[];
  formatCurrency: (amount: number) => string;
  pdfSettings: PdfSettings;
  isGenerating: boolean;
  onPrint: () => void;
  onShare: () => void;
  onDownloadSuccess: () => void;
  onDownloadError: () => void;
}

export function PDFMobileActions({
  dispatch,
  customer,
  installation,
  timeData,
  formatCurrency,
  pdfSettings,
  isGenerating,
  onPrint,
  onShare,
  onDownloadSuccess,
  onDownloadError
}: PDFMobileActionsProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <PDFDownloadLink 
          document={<DispatchPDFDocument dispatch={dispatch} customer={customer} installation={installation} timeData={timeData} formatCurrency={formatCurrency} settings={pdfSettings} />} 
          fileName={`dispatch-report-${dispatch.dispatchNumber}.pdf`}
          onError={onDownloadError}
        >
          {({ loading }) => (
            <Button size="sm" disabled={loading} onClick={onDownloadSuccess}>
              <Download className="h-4 w-4 mr-1" />
              {loading ? 'Preparing...' : 'Download'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrint} disabled={isGenerating}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onShare} disabled={isGenerating}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}