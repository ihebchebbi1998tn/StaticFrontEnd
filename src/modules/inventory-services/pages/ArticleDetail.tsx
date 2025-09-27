import { useState } from "react";
import { ArrowLeft, Edit, Package, AlertTriangle, CheckCircle, MapPin, Plus, Minus, History, DollarSign, Warehouse, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - replace with real data from Supabase
const mockArticle = {
  id: "1",
  name: "Screwdriver Set",
  sku: "TOOL-001",
  description: "Professional 10-piece screwdriver set with various head types and ergonomic handles. Includes both Phillips and flathead screwdrivers in multiple sizes.",
  category: "Tools",
  stock: 25,
  minStock: 10,
  maxStock: 50,
  price: 29.99,
  sellPrice: 49.99,
  status: "available",
  location: "Warehouse A",
  supplier: "ToolCorp Industries",
  notes: "High-quality set suitable for professional use. Store in dry conditions.",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
  reorderPoint: 10,
  weight: "1.5 kg",
  dimensions: "30cm x 15cm x 5cm"
};

const mockUsageLogs = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:30",
    user: "John Smith",
    action: "Used",
    quantity: 2,
    remainingStock: 25,
    project: "Kitchen Installation - Project #1234",
    notes: "Used for cabinet assembly",
    location: "Customer Site A"
  },
  {
    id: "2", 
    date: "2024-01-14",
    time: "09:15",
    user: "Mike Johnson",
    action: "Returned",
    quantity: 1,
    remainingStock: 27,
    project: "Bathroom Renovation - Project #1235",
    notes: "Returned after job completion",
    location: "Warehouse A"
  },
  {
    id: "3",
    date: "2024-01-12", 
    time: "16:45",
    user: "Sarah Davis",
    action: "Restocked",
    quantity: 10,
    remainingStock: 26,
    project: "Inventory Replenishment",
    notes: "Monthly restock from supplier",
    location: "Warehouse A"
  },
  {
    id: "4",
    date: "2024-01-10", 
    time: "11:20",
    user: "Tom Wilson",
    action: "Used",
    quantity: 3,
    remainingStock: 16,
    project: "Office Repair - Project #1236",
    notes: "Used for electrical panel work",
    location: "Customer Site B"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "status-success";
    case "low_stock":
      return "status-warning";
    case "out_of_stock":
      return "status-error";
    default:
      return "status-info";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
      return CheckCircle;
    case "low_stock":
    case "out_of_stock":
      return AlertTriangle;
    default:
      return Package;
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "Used":
      return TrendingDown;
    case "Returned":
    case "Restocked":
      return TrendingUp;
    default:
      return History;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "Used":
      return "text-destructive";
    case "Returned":
    case "Restocked":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};

const ArticleDetail = () => {
  const { id: _id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [stockAdjustment, setStockAdjustment] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  
  // In a real app, you'd fetch the article data based on the ID
  const article = mockArticle;
  const StatusIcon = getStatusIcon(article.status);

  const handleStockAdjustment = () => {
    const adjustment = parseInt(stockAdjustment);
    if (!adjustment || adjustment <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    if (!adjustmentReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the stock adjustment.",
        variant: "destructive",
      });
      return;
    }

    // Here you would update the stock in Supabase
    toast({
      title: "Stock Updated",
      description: `Successfully ${adjustmentType === 'add' ? 'added' : 'removed'} ${adjustment} units.`,
    });

    setStockAdjustment("");
    setAdjustmentReason("");
  };

  const stockPercentage = (article.stock / article.maxStock) * 100;
  const isLowStock = article.stock <= article.minStock;
  const margin = article.sellPrice - article.price;
  const marginPercentage = ((margin / article.price) * 100).toFixed(1);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-border bg-background/95 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 shadow-soft">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              {article.name}
            </h1>
            <p className="text-muted-foreground mt-1">SKU: {article.sku} • {article.category}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Package className="h-4 w-4 mr-2" />
                Adjust Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adjust Stock Level</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Current Stock: {article.stock} units</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={adjustmentType === 'add' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAdjustmentType('add')}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAdjustmentType('remove')}
                      className="flex-1"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(e.target.value)}
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Reason for adjustment..."
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleStockAdjustment} className="w-full">
                  {adjustmentType === 'add' ? 'Add' : 'Remove'} Stock
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="flex-1 sm:flex-none">
            <Edit className="h-4 w-4 mr-2" />
            Edit Article
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="text-xl font-bold">{article.stock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLowStock ? 'bg-warning/10' : 'bg-success/10'}`}>
                  <StatusIcon className={`h-5 w-5 ${isLowStock ? 'text-warning' : 'text-success'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(article.status)}>
                    {article.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-xl font-bold">{(article.stock * article.sellPrice).toFixed(2)} TND</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Warehouse className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{article.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border px-4 sm:px-6">
            <TabsList className="grid w-full sm:w-fit grid-cols-3 h-auto">
              <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm py-2 sm:py-3">
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2 text-xs sm:text-sm py-2 sm:py-3">
                <Warehouse className="h-3 w-3 sm:h-4 sm:w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 text-xs sm:text-sm py-2 sm:py-3">
                <History className="h-3 w-3 sm:h-4 sm:w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Article Details */}
              <Card className="lg:col-span-2 shadow-card border-0">
                <CardHeader>
                  <CardTitle>Article Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground">{article.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Category</h4>
                      <p className="text-muted-foreground">{article.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Supplier</h4>
                      <p className="text-muted-foreground">{article.supplier}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Weight</h4>
                      <p className="text-muted-foreground">{article.weight}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Dimensions</h4>
                      <p className="text-muted-foreground">{article.dimensions}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-muted-foreground">{article.notes}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Quick Stats */}
              <div className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Price:</span>
                      <span className="font-semibold">{article.price} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sell Price:</span>
                      <span className="font-semibold">{article.sellPrice} TND</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Margin:</span>
                      <div className="text-right">
                        <span className="font-semibold text-success">{margin.toFixed(2)} TND</span>
                        <span className="text-xs text-muted-foreground ml-1">({marginPercentage}%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Location:</span>
                        <span className="font-semibold">{article.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-semibold">{article.updatedAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Stock Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Stock</span>
                      <span className="font-semibold">{article.stock}/{article.maxStock}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isLowStock ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: {article.minStock}</span>
                      <span>Max: {article.maxStock}</span>
                    </div>
                  </div>
                  
                  {isLowStock && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Low Stock Alert</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stock is below minimum level. Consider reordering.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Reorder Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reorder Point:</span>
                    <span className="font-semibold">{article.reorderPoint} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suggested Order:</span>
                    <span className="font-semibold">{article.maxStock - article.stock} units</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Create Purchase Order
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Stock</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="add-quantity">Quantity to Add</Label>
                          <Input
                            id="add-quantity"
                            type="number"
                            placeholder="Enter quantity"
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="add-reason">Reason</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="purchase">New Purchase</SelectItem>
                              <SelectItem value="return">Customer Return</SelectItem>
                              <SelectItem value="adjustment">Inventory Adjustment</SelectItem>
                              <SelectItem value="transfer">Transfer In</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Add Stock</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Minus className="h-4 w-4 mr-2" />
                        Remove Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Remove Stock</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="remove-quantity">Quantity to Remove</Label>
                          <Input
                            id="remove-quantity"
                            type="number"
                            placeholder="Enter quantity"
                            min="1"
                            max={article.stock}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="remove-reason">Reason</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="used">Used in Project</SelectItem>
                              <SelectItem value="damaged">Damaged/Defective</SelectItem>
                              <SelectItem value="lost">Lost/Missing</SelectItem>
                              <SelectItem value="transfer">Transfer Out</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full" variant="destructive">Remove Stock</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 p-4 sm:p-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Stock Movement History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsageLogs.map((log) => {
                    const ActionIcon = getActionIcon(log.action);
                    return (
                      <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-lg ${log.action === 'Used' ? 'bg-destructive/10' : 'bg-success/10'}`}>
                          <ActionIcon className={`h-4 w-4 ${getActionColor(log.action)}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{log.user}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {log.date} at {log.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.project}</p>
                          <p className="text-sm text-muted-foreground">{log.location}</p>
                          {log.notes && (
                            <p className="text-xs text-muted-foreground italic">{log.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${log.action === 'Used' ? 'text-destructive' : 'text-success'}`}>
                            {log.action === 'Used' ? '-' : '+'}{log.quantity}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Balance: {log.remainingStock}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArticleDetail;