import { useState } from "react";
import { ArrowLeft, Save, Package, Wrench, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { InfoTip } from "@/shared/components";
import technicianData from "@/data/mock/technicians.json";

const categories = [
  "Tools", "Electrical", "Plumbing", "Safety", "Hardware", "Materials", "Equipment",
  "Automotive", "HVAC", "Appliance Repair", "Maintenance", "Installation", "Diagnostic", "Other"
];

const locations = [
  "Warehouse A", "Warehouse B", "Service Van 1", "Service Van 2", "Main Office"
];

const subLocations = [
  "Section A", "Section B", "Section C", "Shelf 1", "Shelf 2", "Storage Room"
];

const availableSkills = [
  "Basic Mechanics", "Advanced Mechanics", "Brake Systems", "Engine Diagnostics",
  "Electronics", "Painting", "Body Work", "Electrical Systems", "HVAC Systems",
  "Plumbing", "Welding", "Fabrication"
];

const availableEquipment = [
  "Hydraulic Lift", "Engine Hoist", "Diagnostic Scanner", "Paint Booth",
  "Welding Equipment", "Air Compressor", "Hand Tools", "Power Tools",
  "Pressure Washer", "Oil Drain Pan", "Filter Wrench"
];

const availableMaterials = [
  "Motor Oil", "Oil Filter", "Brake Pads", "Brake Fluid", "Coolant",
  "Spark Plugs", "Air Filter", "Paint", "Primer", "Gaskets", "Seals", "Fasteners"
];

const AddUnifiedArticle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articleType, setArticleType] = useState<'material' | 'service'>('material');
  const [addMode, setAddMode] = useState<'quick' | 'detailed'>('quick');
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    status: articleType === 'material' ? "available" : "active",
    
    // Inventory fields
    stock: "",
    minStock: "",
    costPrice: "",
    sellPrice: "",
    supplier: "",
    location: "",
    subLocation: "",
    
    // Service fields
    basePrice: "",
    duration: "120", // Default 2 hours
    skillsRequired: [] as string[],
    materialsNeeded: [] as string[],
    preferredUsers: [] as string[],
    
    // Common
    tags: [] as string[],
    notes: ""
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type: 'material' | 'service') => {
    setArticleType(type);
    setFormData(prev => ({
      ...prev,
      status: type === 'material' ? "available" : "active"
    }));
  };

  // Helper functions for arrays
  const addToArray = (field: string, value: string, currentArray: string[]) => {
    if (!currentArray.includes(value)) {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const removeFromArray = (field: string, value: string, currentArray: string[]) => {
    handleInputChange(field, currentArray.filter(item => item !== value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const articleData = {
        ...formData,
        type: articleType,
        id: `${articleType}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user-id", // Replace with actual user ID
        modifiedBy: "current-user-id"
      };

      console.log("Saving article:", articleData);
      
      toast({
        title: "Success",
        description: `${articleType === 'material' ? 'Material' : 'Service'} has been added successfully.`,
      });
      
      navigate("/dashboard/inventory-services");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add ${articleType}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.name && formData.category && 
    (articleType === 'material' ? (formData.location && formData.sellPrice) : (formData.basePrice && formData.duration));

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/inventory-services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Add New Article</h1>
            <p className="text-muted-foreground">Create a new material or service</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={addMode === 'quick' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAddMode('quick')}
            className="flex-1 sm:flex-none"
          >
            Quick Add
          </Button>
          <Button
            variant={addMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAddMode('detailed')}
            className="flex-1 sm:flex-none"
          >
            Detailed Add
          </Button>
        </div>
      </div>

      {/* Article Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Article Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                articleType === 'material' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40'
              }`} onClick={() => handleTypeChange('material')}>
                <Package className="h-6 w-6" />
              </div>
              <div>
                <Label className="text-base font-medium">Material</Label>
                <p className="text-sm text-muted-foreground">Physical items with stock tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                articleType === 'service' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40'
              }`} onClick={() => handleTypeChange('service')}>
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <Label className="text-base font-medium">Service</Label>
                <p className="text-sm text-muted-foreground">Services with duration and requirements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {addMode === 'quick' ? (
          // Quick Add Mode
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {articleType === 'material' ? <Package className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                {articleType === 'material' ? 'Material Information' : 'Service Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="inline-flex items-center gap-2">
                    Name * <InfoTip title="Name" description={`The name of the ${articleType}`} tooltip="What is this?" />
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={`Enter ${articleType} name`}
                    required
                  />
                </div>
                {articleType === 'material' && (
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="inline-flex items-center gap-2">
                      SKU <InfoTip title="SKU" description="Stock keeping unit for tracking" tooltip="What is this?" />
                    </Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={`Brief description of the ${articleType}`}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
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
                {articleType === 'material' && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
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
                )}
              </div>

              {articleType === 'material' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Current Stock</Label>
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
                    <Label htmlFor="minStock">Min Stock</Label>
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
                    <Label htmlFor="sellPrice">Sell Price (TND) *</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Price (TND) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange("basePrice", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="120"
                      min="1"
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Detailed Add Mode
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">{articleType === 'material' ? 'Stock & Pricing' : 'Requirements'}</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={`Enter ${articleType} name`}
                        required
                      />
                    </div>
                    {articleType === 'material' && (
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => handleInputChange("sku", e.target.value)}
                          placeholder="Enter SKU"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={`Detailed description of the ${articleType}`}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
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
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {articleType === 'material' ? (
                            <>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="low_stock">Low Stock</SelectItem>
                              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                              <SelectItem value="discontinued">Discontinued</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {articleType === 'material' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Stock Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="subLocation">Sub Location (Optional)</Label>
                        <Select value={formData.subLocation} onValueChange={(value) => handleInputChange("subLocation", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub location" />
                          </SelectTrigger>
                          <SelectContent>
                            {subLocations.map((subLocation) => (
                              <SelectItem key={subLocation} value={subLocation}>
                                {subLocation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock">Current Stock</Label>
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
                          <Label htmlFor="minStock">Min Stock</Label>
                          <Input
                            id="minStock"
                            type="number"
                            value={formData.minStock}
                            onChange={(e) => handleInputChange("minStock", e.target.value)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Input
                          id="supplier"
                          value={formData.supplier}
                          onChange={(e) => handleInputChange("supplier", e.target.value)}
                          placeholder="Enter supplier name"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="costPrice">Cost Price (TND)</Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          value={formData.costPrice}
                          onChange={(e) => handleInputChange("costPrice", e.target.value)}
                          placeholder="0.00"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellPrice">Sell Price (TND) *</Label>
                        <Input
                          id="sellPrice"
                          type="number"
                          step="0.01"
                          value={formData.sellPrice}
                          onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                          placeholder="0.00"
                          min="0"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Service Pricing & Duration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="basePrice">Base Price (TND) *</Label>
                          <Input
                            id="basePrice"
                            type="number"
                            step="0.01"
                            value={formData.basePrice}
                            onChange={(e) => handleInputChange("basePrice", e.target.value)}
                            placeholder="0.00"
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (minutes) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                            placeholder="120"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills Required */}
                    <Card className="shadow-card border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Skills Required</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select onValueChange={(value) => addToArray("skillsRequired", value, formData.skillsRequired)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSkills
                              .filter(skill => !formData.skillsRequired.includes(skill))
                              .map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2">
                          {formData.skillsRequired.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeFromArray("skillsRequired", skill, formData.skillsRequired)}
                                className="ml-1 hover:text-destructive"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Materials Needed */}
                    <Card className="shadow-card border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Materials Needed</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select onValueChange={(value) => addToArray("materialsNeeded", value, formData.materialsNeeded)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add material" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMaterials
                              .filter(material => !formData.materialsNeeded.includes(material))
                              .map((material) => (
                                <SelectItem key={material} value={material}>
                                  {material}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2">
                          {formData.materialsNeeded.map((material) => (
                            <Badge key={material} variant="secondary" className="flex items-center gap-1">
                              {material}
                              <button
                                type="button"
                                onClick={() => removeFromArray("materialsNeeded", material, formData.materialsNeeded)}
                                className="ml-1 hover:text-destructive"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Preferred Users */}
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Preferred Technicians</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Select onValueChange={(value) => addToArray("preferredUsers", value, formData.preferredUsers)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add preferred technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicianData
                            .filter(tech => !formData.preferredUsers.includes(tech.id))
                            .map((tech) => (
                              <SelectItem key={tech.id} value={tech.id}>
                                {tech.name} - {tech.position}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {formData.preferredUsers.map((userId) => {
                          const user = technicianData.find(tech => tech.id === userId);
                          return (
                            <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                              {user?.name || userId}
                              <button
                                type="button"
                                onClick={() => removeFromArray("preferredUsers", userId, formData.preferredUsers)}
                                className="ml-1 hover:text-destructive"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes & Instructions</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Special instructions, safety notes, or additional information"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/dashboard/inventory-services">Cancel</Link>
          </Button>
          <Button type="submit" disabled={!isFormValid} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save {articleType === 'material' ? 'Material' : 'Service'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUnifiedArticle;