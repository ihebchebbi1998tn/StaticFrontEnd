import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const categories = ["Tools", "Electrical", "Plumbing", "Safety", "Hardware", "Materials", "Equipment"];
const locations = ["Warehouse A", "Warehouse B", "Service Van 1", "Service Van 2", "Main Office"];

interface FastAddFormProps {
  onSuccess?: () => void;
  onSwitchToDetailed?: () => void;
}

export function FastAddForm({ onSuccess, onSwitchToDetailed }: FastAddFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    location: "",
    stock: "",
    sellPrice: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would save to Supabase
      console.log("Quick saving article:", formData);
      
      toast({
        title: "Success",
        description: "Article added quickly!",
      });
      
      // Reset form
      setFormData({
        name: "",
        sku: "",
        category: "",
        location: "",
        stock: "",
        sellPrice: ""
      });
      
      onSuccess?.();
    } catch (error) {
  const _err = error;
      toast({
        title: "Error",
        description: "Failed to add article.",
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.name && formData.sku && formData.category && formData.location;

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Add Article</span>
          <Button variant="outline" size="sm" onClick={onSwitchToDetailed}>
            Detailed Form
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fast-name">Article Name *</Label>
              <Input
                id="fast-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fast-sku">SKU *</Label>
              <Input
                id="fast-sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fast-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fast-location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fast-stock">Current Stock</Label>
              <Input
                id="fast-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fast-sellPrice">Sell Price</Label>
              <Input
                id="fast-sellPrice"
                type="number"
                step="0.01"
                value={formData.sellPrice}
                onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          <Button type="submit" disabled={!isFormValid} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}