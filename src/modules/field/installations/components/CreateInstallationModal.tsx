import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Package } from "lucide-react";
import { CreateInstallationData, Installation } from "../types";
import { useToast } from "@/hooks/use-toast";
import CustomerSearch from "../../service-orders/components/CustomerSearch";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  type: string;
}

interface CreateInstallationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstallationCreated: (installation: any) => void;
}

export function CreateInstallationModal({ open, onOpenChange, onInstallationCreated }: CreateInstallationModalProps) {
  const { toast } = useToast();
  const [hasWarranty, setHasWarranty] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<CreateInstallationData>();

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    
    // Auto-populate customer data in form
    setValue('customer.company', customer.company);
    setValue('customer.contactPerson', customer.name);
    setValue('customer.email', customer.email);
    setValue('customer.phone', customer.phone);
  };

  const onSubmit = (data: CreateInstallationData) => {
    if (!selectedCustomer) {
      toast({
        title: "Customer Required",
        description: "Please select a customer to assign this installation to.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new installation object
    const newInstallation: Installation = {
      id: `inst-${Date.now()}`,
      name: data.name,
      model: data.model,
      description: data.description || '',
      location: data.location,
      manufacturer: data.manufacturer,
      hasWarranty: data.hasWarranty,
      warrantyFrom: data.warrantyFrom,
      warrantyTo: data.warrantyTo,
      type: data.type,
      customer: {
        id: selectedCustomer.id.toString(),
        company: selectedCustomer.company,
        contactPerson: selectedCustomer.name,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email,
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      relatedServiceOrders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      modifiedBy: 'current-user'
    };

    onInstallationCreated(newInstallation);
    
    toast({
      title: "Installation created",
      description: "The installation has been successfully created.",
    });

    // Reset form and close modal
    reset();
    setSelectedCustomer(null);
    setHasWarranty(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    setSelectedCustomer(null);
    setHasWarranty(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Installation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Installation Details</CardTitle>
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
                      <Select onValueChange={(value) => setValue("type", value as "internal" | "external")}>
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
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Warranty Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Warranty Information</CardTitle>
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
                  <CardTitle className="text-lg font-semibold">Customer Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerSearch 
                    onSelect={handleCustomerSelect}
                    selectedCustomer={selectedCustomer}
                  />
                  
                  {selectedCustomer && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Installation will be assigned to this customer. Customer details are now linked to this installation.
                    </div>
                  )}
                  
                  {!selectedCustomer && (
                    <div className="mt-4 p-3 border border-warning/20 bg-warning/10 rounded-lg">
                      <p className="text-sm text-warning-foreground">
                        Please select a customer to assign this installation to.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Create Installation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}