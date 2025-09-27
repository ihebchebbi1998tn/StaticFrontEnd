import { useState, useEffect } from "react";
import { ArrowLeft, Save, Package } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTip } from "@/shared/components";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Tools",
  "Electrical",
  "Plumbing", 
  "Safety",
  "Hardware",
  "Materials",
  "Equipment"
];

const locations = [
  "Warehouse A",
  "Warehouse B", 
  "Service Van 1",
  "Service Van 2",
  "Main Office"
];

// Mock article data - replace with actual data fetch
const mockArticleData = {
  "1": {
    name: "Screwdriver Set",
    sku: "TOOL-001",
    description: "Professional 10-piece screwdriver set with various head types",
    category: "Tools",
    location: "Warehouse A",
    stock: "25",
    minStock: "10",
    price: "29.99",
    sellPrice: "49.99",
    supplier: "ToolCorp Industries",
    notes: "Preferred brand for professional use"
  }
};

const EditArticle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    location: "",
    stock: "",
    minStock: "",
    price: "",
    sellPrice: "",
    supplier: "",
    notes: ""
  });

  useEffect(() => {
    if (id && mockArticleData[id as keyof typeof mockArticleData]) {
      setFormData(mockArticleData[id as keyof typeof mockArticleData]);
    }
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would typically update in Supabase
      console.log("Updating article:", formData);
      
      toast({
        title: "Success",
        description: "Article has been updated successfully.",
      });
      
      navigate("/dashboard/articles");
    } catch (error) {
      const _err = error as any;
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.name && formData.sku && formData.category && formData.location;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Edit Article</h1>
          <p className="text-muted-foreground">Update item information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="inline-flex items-center gap-2">Article Name * <InfoTip title="Article Name" description="The name customers and staff will recognize." tooltip="What is this?" /></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter article name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku" className="inline-flex items-center gap-2">SKU * <InfoTip title="SKU" description="Unique stock keeping unit used to track inventory." tooltip="What is this?" /></Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter SKU code"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="inline-flex items-center gap-2">Description <InfoTip title="Description" description="A short overview of the item, its purpose or specs." tooltip="What's this?" /></Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter article description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="inline-flex items-center gap-2">Category * <InfoTip title="Category" description="Choose the group that best fits this item for easier filtering." tooltip="What's this?" /></Label>
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
                  <Label htmlFor="location" className="inline-flex items-center gap-2">Location * <InfoTip title="Location" description="Where this item is stored or primarily used." tooltip="What's this?" /></Label>
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
            </CardContent>
          </Card>

          {/* Inventory & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="inline-flex items-center gap-2">Current Stock <InfoTip title="Current Stock" description="How many units you currently have on hand." tooltip="What's this?" /></Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock" className="inline-flex items-center gap-2">Minimum Stock <InfoTip title="Minimum Stock" description="Threshold at which you want to be alerted to reorder." tooltip="What's this?" /></Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="inline-flex items-center gap-2">Cost Price <InfoTip title="Cost Price" description="Your purchase cost per unit (not shown to customers)." tooltip="What's this?" /></Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellPrice" className="inline-flex items-center gap-2">Sell Price <InfoTip title="Sell Price" description="The price at which you sell this item." tooltip="What's this?" /></Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier" className="inline-flex items-center gap-2">Supplier <InfoTip title="Supplier" description="Who you purchase this item from." tooltip="What's this?" /></Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes" className="inline-flex items-center gap-2">Notes <InfoTip title="Notes" description="Any internal details, handling instructions, or special cases." tooltip="What's this?" /></Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes or specifications"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link to="/dashboard/articles">Cancel</Link>
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            <Save className="h-4 w-4 mr-2" />
            Update Article
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;