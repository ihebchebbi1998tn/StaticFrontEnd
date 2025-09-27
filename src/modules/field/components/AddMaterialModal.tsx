import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Article } from "@/modules/inventory-services/types";
import FileUploader from "@/modules/support/components/FileUploader";

interface MaterialUsage {
  articleId: string;
  articleName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  jobId?: string; // Optional job ID for service order context
  internalComment?: string;
  externalComment?: string;
  replacing: boolean;
  oldArticleModel?: string;
  oldArticleStatus?: 'broken' | 'not_broken' | 'unknown';
  photos: File[];
}

interface Job {
  id: string;
  title: string;
  description?: string;
}

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialUsage) => void;
  availableMaterials?: Article[];
  availableJobs?: Job[]; // Jobs available for selection (only for service orders)
  context?: 'service_order' | 'dispatch'; // Context to determine if job selection is needed
}

export function AddMaterialModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availableMaterials = [],
  availableJobs = [],
  context = 'dispatch'
}: AddMaterialModalProps) {
  const { t } = useTranslation();
  const { t: tCommon } = useTranslation("common");

  const materialArticles = availableMaterials.filter(article => article.type === 'material');

  const [formData, setFormData] = useState<MaterialUsage>({
    articleId: materialArticles[0]?.id || "",
    articleName: materialArticles[0]?.name || "",
    sku: materialArticles[0]?.sku || "",
    quantity: 1,
    unitPrice: materialArticles[0]?.sellPrice || materialArticles[0]?.costPrice || 0,
    jobId: availableJobs[0]?.id || "",
    internalComment: "",
    externalComment: "",
    replacing: false,
    oldArticleModel: "",
    oldArticleStatus: "unknown",
    photos: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form
    setFormData({
      articleId: materialArticles[0]?.id || "",
      articleName: materialArticles[0]?.name || "",
      sku: materialArticles[0]?.sku || "",
      quantity: 1,
      unitPrice: materialArticles[0]?.sellPrice || materialArticles[0]?.costPrice || 0,
      jobId: availableJobs[0]?.id || "",
      internalComment: "",
      externalComment: "",
      replacing: false,
      oldArticleModel: "",
      oldArticleStatus: "unknown",
      photos: [],
    });
    onClose();
  };

  const handleMaterialChange = (articleId: string) => {
    const selected = materialArticles.find(article => article.id === articleId);
    if (selected) {
      setFormData({
        ...formData,
        articleId,
        articleName: selected.name,
        sku: selected.sku || "",
        unitPrice: selected.sellPrice || selected.costPrice || 0,
      });
    }
  };

  const handlePhotosChange = (files: File[]) => {
    setFormData({ ...formData, photos: files });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Material
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Material Selection */}
          <div className="space-y-2">
            <Label htmlFor="material" className="text-sm font-medium">
              Material <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.articleId} onValueChange={handleMaterialChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a material..." />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {materialArticles.map((article) => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.name} {article.sku ? `(${article.sku})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Selection - Only show for service orders */}
          {context === 'service_order' && availableJobs.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="job" className="text-sm font-medium">
                Assign to Job <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.jobId} 
                onValueChange={(value) => setFormData({ ...formData, jobId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job..." />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {availableJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-sm font-medium">
                Unit Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="internalComment" className="text-sm font-medium">
                Internal Comment
              </Label>
              <Textarea
                id="internalComment"
                placeholder="Internal notes for team members..."
                value={formData.internalComment}
                onChange={(e) => setFormData({ ...formData, internalComment: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalComment" className="text-sm font-medium">
                External Comment
              </Label>
              <Textarea
                id="externalComment"
                placeholder="Notes visible to customer..."
                value={formData.externalComment}
                onChange={(e) => setFormData({ ...formData, externalComment: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Replacing Article Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="replacing"
                checked={formData.replacing}
                onCheckedChange={(checked) => setFormData({ ...formData, replacing: checked as boolean })}
              />
              <Label htmlFor="replacing" className="text-sm font-medium cursor-pointer">
                This is replacing an existing article
              </Label>
            </div>

            {formData.replacing && (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                <h4 className="font-medium text-sm">Replacement Details</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="oldArticleModel" className="text-sm font-medium">
                    Old Article Model/Serial
                  </Label>
                  <Input
                    id="oldArticleModel"
                    placeholder="Enter model number or serial..."
                    value={formData.oldArticleModel}
                    onChange={(e) => setFormData({ ...formData, oldArticleModel: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oldStatus" className="text-sm font-medium">
                    Old Article Status
                  </Label>
                  <Select
                    value={formData.oldArticleStatus}
                    onValueChange={(value: 'broken' | 'not_broken' | 'unknown') => 
                      setFormData({ ...formData, oldArticleStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="unknown">Unknown</SelectItem>
                      <SelectItem value="broken">Broken</SelectItem>
                      <SelectItem value="not_broken">Not Broken</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Photos of Old Article
                  </Label>
                  <FileUploader
                    files={formData.photos}
                    setFiles={handlePhotosChange}
                    maxFiles={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Material
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {tCommon("cancel") || "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}