import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Package, Building, MapPin, Shield, User, Calendar, ExternalLink } from "lucide-react";
import { Installation } from "../types";
import installationsData from "@/data/mock/installations.json";

export default function InstallationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const installation = installationsData.find(item => item.id === id);
  
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

  const getTypeColor = (type: string) => {
    const colors = {
      internal: "status-success",
      external: "status-info"
    };
    return colors[type as keyof typeof colors];
  };

  const getWarrantyStatus = (installation: any) => {
    if (!installation.hasWarranty) return { status: 'none', color: 'status-secondary', text: 'No Warranty' };
    
    if (installation.warrantyTo) {
      const now = new Date();
      const warrantyEnd = new Date(installation.warrantyTo);
      const daysUntilExpiry = Math.ceil((warrantyEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return { status: 'expired', color: 'status-destructive', text: 'Expired' };
      if (daysUntilExpiry < 30) return { status: 'expiring', color: 'status-warning', text: `Expires in ${daysUntilExpiry} days` };
      return { status: 'active', color: 'status-success', text: 'Active' };
    }
    
    return { status: 'active', color: 'status-success', text: 'Active' };
  };

  const warrantyStatus = getWarrantyStatus(installation);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/dashboard/field/installations')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Installations
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{installation.name}</h1>
            <p className="text-muted-foreground">{installation.model}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(installation.type)}>
            {installation.type === 'internal' ? 'Internal' : 'External'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/field/installations/${installation.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
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
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{installation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p className="text-foreground">{installation.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                  <p className="text-foreground">{installation.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div>
                    <Badge className={getTypeColor(installation.type)}>
                      {installation.type === 'internal' ? 'Internal' : 'External'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{installation.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground">{installation.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Warranty Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={warrantyStatus.color}>
                  {warrantyStatus.text}
                </Badge>
              </div>
              
              {installation.hasWarranty && installation.warrantyFrom && installation.warrantyTo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Warranty Start</label>
                    <p className="text-foreground">{new Date(installation.warrantyFrom).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Warranty End</label>
                    <p className="text-foreground">{new Date(installation.warrantyTo).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              {!installation.hasWarranty && (
                <p className="text-muted-foreground">This installation does not have warranty coverage.</p>
              )}
            </CardContent>
          </Card>

          {/* Related Service Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Related Service Orders
                </div>
                <Badge variant="secondary">{installation.relatedServiceOrders.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {installation.relatedServiceOrders.length > 0 ? (
                <div className="space-y-2">
                  {installation.relatedServiceOrders.map((soId) => (
                    <div key={soId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Service Order {soId}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/field/service-orders/${soId}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No related service orders found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="text-foreground">{installation.customer.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                <p className="text-foreground">{installation.customer.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-foreground">{installation.customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{installation.customer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <div className="text-foreground">
                  <p>{installation.customer.address.street}</p>
                  <p>{installation.customer.address.city}, {installation.customer.address.state} {installation.customer.address.zipCode}</p>
                  <p>{installation.customer.address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-foreground">{new Date(installation.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">by {installation.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p className="text-foreground">{new Date(installation.updatedAt).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">by {installation.modifiedBy}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}