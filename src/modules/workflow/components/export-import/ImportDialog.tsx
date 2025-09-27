import { useState, useRef } from 'react';
import '../../styles/workflow.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Code, AlertCircle, CheckCircle } from "lucide-react";
import { Node, Edge } from '@xyflow/react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (nodes: Node[], edges: Edge[], name?: string) => void;
}

interface WorkflowData {
  name?: string;
  nodes: Node[];
  edges: Edge[];
  version?: string;
  metadata?: any;
}

export function ImportDialog({ isOpen, onClose, onImport }: ImportDialogProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("file");
  const [textContent, setTextContent] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
    data?: WorkflowData;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateWorkflowData = (data: any): { isValid: boolean; error?: string; data?: WorkflowData } => {
    try {
      if (!data || typeof data !== 'object') {
  return { isValid: false, error: t('import.errors.invalidJson') || 'File must contain a valid JSON object' };
      }

      if (!Array.isArray(data.nodes)) {
  return { isValid: false, error: t('import.errors.nodesRequired') || "'nodes' field is required and must be an array" };
      }

      if (!Array.isArray(data.edges)) {
  return { isValid: false, error: t('import.errors.edgesRequired') || "'edges' field is required and must be an array" };
      }

      // Validate nodes structure
      for (const node of data.nodes) {
        if (!node.id || !node.type || !node.position || !node.data) {
          return { isValid: false, error: t('import.errors.nodeStructure') || 'Each node must have id, type, position and data' };
        }
      }

      // Validate edges structure
      for (const edge of data.edges) {
        if (!edge.id || !edge.source || !edge.target) {
          return { isValid: false, error: t('import.errors.edgeStructure') || 'Each connection must have id, source and target' };
        }
      }

          return { 
        isValid: true, 
        data: {
          name: data.name || t('import.importedDefaultName') || 'Imported Workflow',
          nodes: data.nodes,
          edges: data.edges,
          version: data.version,
          metadata: data.metadata
        }
      };
    } catch (error) {
      return { isValid: false, error: "Erreur lors de la validation: " + (error as Error).message };
    }
  };

  const parseContent = (content: string, isYAML = false) => {
    try {
      let data;
      
      if (isYAML) {
        // Simple YAML parsing (basic implementation)
        // For production, you'd want to use a proper YAML parser
        data = JSON.parse(content.replace(/^(\s*)([^:\s]+):\s*$/gm, '$1"$2":'));
      } else {
        data = JSON.parse(content);
      }

      const result = validateWorkflowData(data);
      setValidationResult(result);
      return result;
    } catch (error) {
      const errorResult = { 
        isValid: false, 
        error: `${t('import.errors.parsingError', { format: isYAML ? 'YAML' : 'JSON' }) || `Parsing error ${isYAML ? 'YAML' : 'JSON'}`}: ${(error as Error).message}` 
      };
      setValidationResult(errorResult);
      return errorResult;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const isYAML = file.name.endsWith('.yaml') || file.name.endsWith('.yml');
      parseContent(content, isYAML);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (content: string) => {
    setTextContent(content);
    if (content.trim()) {
      parseContent(content);
    } else {
      setValidationResult(null);
    }
  };

  const handleImport = () => {
    if (validationResult?.isValid && validationResult.data) {
      onImport(
        validationResult.data.nodes,
        validationResult.data.edges,
        validationResult.data.name
      );
  toast.success(t('import.success', { name: validationResult.data.name }) || `Workflow "${validationResult.data.name}" imported successfully!`);
      onClose();
    }
  };

  const renderValidationStatus = () => {
    if (!validationResult) return null;

    if (validationResult.isValid) {
      return (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Workflow valide</p>
            {validationResult.data && (
              <div className="text-xs text-green-700 mt-1">
                <div>Nom: {validationResult.data.name}</div>
                <div>Nœuds: {validationResult.data.nodes.length}</div>
                <div>Connexions: {validationResult.data.edges.length}</div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Erreur de validation</p>
            <p className="text-xs text-red-700 mt-1">{validationResult.error}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="workflow-module max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importer un workflow
          </DialogTitle>
          <DialogDescription>
            Importez un workflow depuis un fichier JSON/YAML ou en collant le contenu directement.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Fichier
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Texte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="flex-1 flex flex-col space-y-4">
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('import.selectFile') || 'Select a file'}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('import.supportedFormats') || 'Supported formats: JSON (.json), YAML (.yaml, .yml)'}
              </p>
              <Button variant="outline">
                {t('import.browseFiles') || 'Browse files'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {renderValidationStatus()}
          </TabsContent>

          <TabsContent value="text" className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium mb-2">
                {t('import.pasteContent') || 'Workflow content (JSON or YAML)'}
              </label>
              <Textarea
                placeholder="Collez ici le contenu de votre workflow..."
                value={textContent}
                onChange={(e) => handleTextChange(e.target.value)}
                className="flex-1 min-h-[200px] font-mono text-sm"
              />
            </div>
            {renderValidationStatus()}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {validationResult?.isValid ? (
              <span className="text-green-600">✓ Prêt à importer</span>
            ) : validationResult?.error ? (
              <span className="text-red-600">✗ Correction nécessaire</span>
            ) : (
              "En attente de données..."
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleImport}
              disabled={!validationResult?.isValid}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}