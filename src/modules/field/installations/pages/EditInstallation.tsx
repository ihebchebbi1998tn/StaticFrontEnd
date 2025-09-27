import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Package } from "lucide-react";
import { CreateInstallationData } from "../types";
import { useToast } from "@/hooks/use-toast";
import installationsData from "@/data/mock/installations.json";

export default function EditInstallation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasWarranty, setHasWarranty] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<CreateInstallationData>();

  const installation = installationsData.find(item => item.id === id);

  useEffect(() => {
    if (installation) {
      // Pre-populate form with existing data
      reset({
        name: installation.name,
        model: installation.model,
        description: installation.description,
        location: installation.location,
        manufacturer: installation.manufacturer,
        hasWarranty: installation.hasWarranty,
        warrantyFrom: installation.warrantyFrom ? new Date(installation.warrantyFrom) : undefined,
        warrantyTo: installation.warrantyTo ? new Date(installation.warrantyTo) : undefined,
        type: installation.type as 'internal' | 'external',
        customer: installation.customer
      });
      setHasWarranty(installation.hasWarranty);
      setLoading(false);
    } else {
      toast({
        title: "Installation not found",
        description: "The installation you're trying to edit doesn't exist.",
        variant: "destructive"
      });
      navigate('/dashboard/field/installations');
    }
  }, [installation, reset, toast, navigate]);

  const onSubmit = (data: CreateInstallationData) => {
    console.log("Updating installation:", data);
    toast({
      title: "Installation updated",
      description: "The installation has been successfully updated.",
    });
    navigate(`/dashboard/field/installations/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!installation) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Installation not found</h1>
          <Button onClick={() => navigate('/dashboard/field/installations')}>
            Back to Installations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(`/dashboard/field/installations/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Installation</h1>
          <p className="text-muted-foreground">Update installation: {installation.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Installation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Installation Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Installation name is required" })}
                      placeholder="e.g., Production Server Alpha"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      {...register("model", { required: "Model is required" })}
                      placeholder="e.g., Dell PowerEdge R750"
                    />
                    {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer *</Label>
                    <Input
                      id="manufacturer"
                      {...register("manufacturer", { required: "Manufacturer is required" })}
                      placeholder="e.g., Dell Technologies"
                    />
                    {errors.manufacturer && <p className="text-sm text-destructive">{errors.manufacturer.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select onValueChange={(value) => setValue("type", value as "internal" | "external")} defaultValue={installation.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal (Sold by us)</SelectItem>
                        <SelectItem value="external">External (Customer owned)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Location is required" })}
                    placeholder="e.g., Data Center - Rack A12"
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Detailed description of the installation..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Warranty Information */}
            <Card>
              <CardHeader>
                <CardTitle>Warranty Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasWarranty"
                    checked={hasWarranty}
                    onCheckedChange={(checked) => {
                      setHasWarranty(checked);
                      setValue("hasWarranty", checked);
                    }}
                  />
                  <Label htmlFor="hasWarranty">This installation has warranty</Label>
                </div>

                {hasWarranty && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="warrantyFrom">Warranty Start Date *</Label>
                      <Input
                        id="warrantyFrom"
                        type="date"
                        {...register("warrantyFrom", { 
                          required: hasWarranty ? "Warranty start date is required" : false 
                        })}
                      />
                      {errors.warrantyFrom && <p className="text-sm text-destructive">{errors.warrantyFrom.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="warrantyTo">Warranty End Date *</Label>
                      <Input
                        id="warrantyTo"
                        type="date"
                        {...register("warrantyTo", { 
                          required: hasWarranty ? "Warranty end date is required" : false 
                        })}
                      />
                      {errors.warrantyTo && <p className="text-sm text-destructive">{errors.warrantyTo.message}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.company">Company *</Label>
                  <Input
                    id="customer.company"
                    {...register("customer.company", { required: "Company is required" })}
                    placeholder="e.g., TechCorp Industries"
                  />
                  {errors.customer?.company && <p className="text-sm text-destructive">{errors.customer.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer.contactPerson">Contact Person *</Label>
                  <Input
                    id="customer.contactPerson"
                    {...register("customer.contactPerson", { required: "Contact person is required" })}
                    placeholder="e.g., John Smith"
                  />
                  {errors.customer?.contactPerson && <p className="text-sm text-destructive">{errors.customer.contactPerson.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer.phone">Phone *</Label>
                  <Input
                    id="customer.phone"
                    {...register("customer.phone", { required: "Phone is required" })}
                    placeholder="e.g., +1-555-0123"
                  />
                  {errors.customer?.phone && <p className="text-sm text-destructive">{errors.customer.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer.email">Email *</Label>
                  <Input
                    id="customer.email"
                    type="email"
                    {...register("customer.email", { required: "Email is required" })}
                    placeholder="e.g., john.smith@techcorp.com"
                  />
                  {errors.customer?.email && <p className="text-sm text-destructive">{errors.customer.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer.address.street">Street Address *</Label>
                  <Input
                    id="customer.address.street"
                    {...register("customer.address.street", { required: "Street address is required" })}
                    placeholder="e.g., 123 Business Ave"
                  />
                  {errors.customer?.address?.street && <p className="text-sm text-destructive">{errors.customer.address.street.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer.address.city">City *</Label>
                    <Input
                      id="customer.address.city"
                      {...register("customer.address.city", { required: "City is required" })}
                      placeholder="e.g., New York"
                    />
                    {errors.customer?.address?.city && <p className="text-sm text-destructive">{errors.customer.address.city.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer.address.state">State *</Label>
                    <Input
                      id="customer.address.state"
                      {...register("customer.address.state", { required: "State is required" })}
                      placeholder="e.g., NY"
                    />
                    {errors.customer?.address?.state && <p className="text-sm text-destructive">{errors.customer.address.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer.address.zipCode">ZIP Code *</Label>
                    <Input
                      id="customer.address.zipCode"
                      {...register("customer.address.zipCode", { required: "ZIP code is required" })}
                      placeholder="e.g., 10001"
                    />
                    {errors.customer?.address?.zipCode && <p className="text-sm text-destructive">{errors.customer.address.zipCode.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer.address.country">Country *</Label>
                    <Input
                      id="customer.address.country"
                      {...register("customer.address.country", { required: "Country is required" })}
                      placeholder="e.g., USA"
                    />
                    {errors.customer?.address?.country && <p className="text-sm text-destructive">{errors.customer.address.country.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/field/installations/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}