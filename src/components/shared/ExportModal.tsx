import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileSpreadsheet, CheckSquare } from "lucide-react";
import { ColumnSelectionModal } from "./ColumnSelectionModal";
import * as XLSX from 'xlsx';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
  moduleName: string;
  exportConfig: ExportConfig;
}

export interface ExportConfig {
  filename: string;
  allDataTransform: (item: any) => Record<string, any>;
  availableColumns: Array<{
    key: string;
    label: string;
    category: string;
    transform?: (value: any, item: any) => any;
  }>;
}

export function ExportModal({ open, onOpenChange, data, moduleName, exportConfig }: ExportModalProps) {
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  const exportAllData = () => {
    const exportData = data.map(exportConfig.allDataTransform);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, moduleName);
    
    const fileName = `${exportConfig.filename}-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    onOpenChange(false);
  };

  const handleColumnSelection = () => {
    setShowColumnSelection(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export {moduleName} Data
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Choose how you want to export your {moduleName.toLowerCase()} data:
            </div>
            
            <div className="grid gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportAllData}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <FileSpreadsheet className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Export All Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Export all available fields for {data.length} {moduleName.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleColumnSelection}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Custom Selection</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose specific columns to include in your export
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ColumnSelectionModal 
        open={showColumnSelection}
        onOpenChange={setShowColumnSelection}
        data={data}
        onExportComplete={() => onOpenChange(false)}
        exportConfig={exportConfig}
        moduleName={moduleName}
      />
    </>
  );
}