import { useState } from "react";
import { ArrowRight, Package, User, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const technicians = [
  { id: "1", name: "John Smith", location: "Service Van 1" },
  { id: "2", name: "Mike Johnson", location: "Service Van 2" },
  { id: "3", name: "Sarah Davis", location: "Field Office" },
  { id: "4", name: "Tom Wilson", location: "Mobile Unit A" },
];

const locations = [
  "Warehouse A",
  "Warehouse B", 
  "Service Van 1",
  "Service Van 2",
  "Main Office",
  "Field Office",
  "Mobile Unit A",
  "Mobile Unit B"
];

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: {
    id: string;
    name: string;
    sku: string;
    stock: number;
    location: string;
  };
}

export function TransferModal({ isOpen, onClose, article }: TransferModalProps) {
  const { toast } = useToast();
  const [transferData, setTransferData] = useState({
    quantity: "",
    toLocation: "",
    toTechnician: "",
    reason: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setTransferData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would create a transfer transaction in Supabase
      console.log("Creating transfer:", {
        articleId: article?.id,
        ...transferData
      });
      
      toast({
        title: "Transfer Initiated",
        description: `${transferData.quantity} units of ${article?.name} transferred successfully.`,
      });
      
      // Reset form and close modal
      setTransferData({
        quantity: "",
        toLocation: "",
        toTechnician: "",
        reason: "",
        notes: ""
      });
      onClose();
    } catch (error) {
      const _err = error as any;
      toast({
        title: "Transfer Failed",
        description: "Could not complete the transfer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedTechnician = technicians.find(t => t.id === transferData.toTechnician);
  const isFormValid = transferData.quantity && (transferData.toLocation || transferData.toTechnician) && transferData.reason;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Transfer Article
          </DialogTitle>
        </DialogHeader>

        {article && (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{article.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {article.sku}</p>
                </div>
                <div className="text-right">
                  <Badge className="status-info">
                    <MapPin className="h-3 w-3 mr-1" />
                    {article.location}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available: {article.stock} units
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Transfer *</Label>
              <Input
                id="quantity"
                type="number"
                value={transferData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
                min="1"
                max={article?.stock}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Transfer Reason *</Label>
              <Select value={transferData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field_service">Field Service</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="restocking">Restocking</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="project">Project Assignment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Transfer Destination</Label>
            
            {/* Location Option */}
            <div className="space-y-2">
              <Label htmlFor="toLocation" className="text-sm font-normal">To Location</Label>
              <Select value={transferData.toLocation} onValueChange={(value) => handleInputChange("toLocation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            {/* Technician Option */}
            <div className="space-y-2">
              <Label htmlFor="toTechnician" className="text-sm font-normal">To Technician</Label>
              <Select value={transferData.toTechnician} onValueChange={(value) => handleInputChange("toTechnician", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{tech.name}</span>
                        <span className="text-muted-foreground">({tech.location})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTechnician && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Will be transferred to {selectedTechnician.name}'s {selectedTechnician.location}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={transferData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special instructions or notes for this transfer..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid} className="gradient-primary text-white">
              <ArrowRight className="h-4 w-4 mr-2" />
              Complete Transfer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}