import { useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useContactImport } from '../../hooks/useContactImport';

interface StructuredImportTabProps {
  importHook: ReturnType<typeof useContactImport>;
  onDownloadTemplate: () => void;
}

export function StructuredImportTab({ importHook, onDownloadTemplate }: StructuredImportTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }
    
    setSelectedFile(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      importHook.processFile(selectedFile, 'structured');
    }
  }, [selectedFile, importHook]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            1. Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download our Excel template with all available headers. Fill it with your contact data and upload it back.
            </p>
            <Button onClick={onDownloadTemplate} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Excel Template
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            2. Upload Filled Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  {selectedFile ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <h4 className="font-medium">{selectedFile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button onClick={handleUpload} disabled={importHook.isLoading}>
                      {importHook.isLoading ? 'Processing...' : 'Process File'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium">Upload your filled template</h4>
                    <p className="text-sm text-muted-foreground">
                      Drop your Excel file here or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button variant="outline" type="button" onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}>
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {importHook.isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{importHook.uploadProgress}%</span>
                </div>
                <Progress value={importHook.uploadProgress} />
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Use the downloaded template and keep the exact header structure. 
                Fill in at least one name field (Full Name or Company Name) for each contact.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}