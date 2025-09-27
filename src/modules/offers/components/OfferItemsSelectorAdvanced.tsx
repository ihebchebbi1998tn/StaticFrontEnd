import { useState } from "react";
import { Package, Wrench, Edit, Trash2, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OfferItem } from "../types";
import { EditOfferItemModal } from "./EditOfferItemModal";
import { InstallationSelector } from "@/modules/field/installations/components/InstallationSelector";
import { CreateInstallationModal } from "@/modules/field/installations/components/CreateInstallationModal";

// Import articles and services data
import articlesData from "@/data/mock/articles.json";
import servicesData from "@/data/mock/services.json";

interface OfferItemsSelectorAdvancedProps {
  items: OfferItem[];
  onUpdateItems: (items: OfferItem[]) => void;
  currency?: string;
  readonly?: boolean;
}

export function OfferItemsSelectorAdvanced({ items, onUpdateItems, currency = 'TND', readonly = false }: OfferItemsSelectorAdvancedProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<'article' | 'service'>('article');
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [editingItem, setEditingItem] = useState<OfferItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedInstallation, setSelectedInstallation] = useState<any | null>(null);
  const [showCreateInstallation, setShowCreateInstallation] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const filteredArticles = articlesData.filter(article => 
    article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = servicesData.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableItems = selectedType === 'article' ? filteredArticles : filteredServices;

  const handleSelectItem = (item: any) => {
    const unitPrice = selectedType === 'article' ? item.sellPrice : item.basePrice;
    const totalPrice = unitPrice * selectedQuantity;

    const newOfferItem: OfferItem = {
      id: `item-${Date.now()}`,
      offerId: '', // Will be set when offer is created
      type: selectedType,
      itemId: item.id,
      itemName: item.name,
      itemCode: selectedType === 'article' ? item.sku : item.serviceCode,
      quantity: selectedQuantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      description: item.description || undefined,
      installationId: selectedType === 'service' ? selectedInstallation?.id : undefined,
      installationName: selectedType === 'service' ? selectedInstallation?.name : undefined
    };

    onUpdateItems([...items, newOfferItem]);
    setShowItemSelector(false);
    setSearchTerm("");
    setSelectedQuantity(1);
    setSelectedInstallation(null);
  };

  const handleEditItem = (updatedItem: OfferItem) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    onUpdateItems(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onUpdateItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select items to sell</h3>
        {!readonly && (
          <Button variant="outline" onClick={() => setShowItemSelector(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Items
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No items added yet</p>
          {!readonly && (
            <p className="text-sm">Click "Add Items" to get started</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'article' ? (
                        <Package className="h-4 w-4" />
                      ) : (
                        <Wrench className="h-4 w-4" />
                      )}
                      <span className="font-medium">{item.itemName}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      {item.itemCode && (
                        <Badge variant="secondary" className="text-xs">
                          {item.itemCode}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description && (
                        <p className="mb-1">{item.description}</p>
                       )}
                       <div className="flex items-center gap-4">
                         <span>Qty: {item.quantity}</span>
                         <span>Unit: {formatCurrency(item.unitPrice)}</span>
                         {item.discount && item.discount > 0 && (
                           <span>Discount: {item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}</span>
                         )}
                       </div>
                       {item.type === 'service' && item.installationName && (
                         <div className="text-xs text-muted-foreground mt-1">
                           Installation: {item.installationName}
                         </div>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                    {!readonly && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {items.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Item Selector Dialog */}
      <Dialog open={showItemSelector} onOpenChange={setShowItemSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Items to Add
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Type and Search */}
            <div className="flex gap-4">
              <div className="w-48">
                <Label>Item Type</Label>
                <Select value={selectedType} onValueChange={(value: 'article' | 'service') => {
                  setSelectedType(value);
                  setSearchTerm("");
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${selectedType}s...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-24">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Installation Selection for Services */}
            {selectedType === 'service' && (
              <div className="border-t pt-4">
                <InstallationSelector
                  onSelect={setSelectedInstallation}
                  selectedInstallation={selectedInstallation}
                  onCreateNew={() => setShowCreateInstallation(true)}
                />
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {availableItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {selectedType === 'article' ? (
                          <Package className="h-4 w-4 text-primary" />
                        ) : (
                          <Wrench className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedType === 'article' ? item.sku : item.serviceCode}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {formatCurrency(selectedType === 'article' ? item.sellPrice : item.basePrice)}
                        </p>
                        {selectedType === 'article' && (
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {availableItems.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No {selectedType}s found matching "{searchTerm}"</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowItemSelector(false);
                  setSelectedInstallation(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      {editingItem && (
        <EditOfferItemModal
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onUpdateItem={handleEditItem}
          currency={currency}
        />
      )}

      {/* Create Installation Modal */}
      <CreateInstallationModal
        open={showCreateInstallation}
        onOpenChange={setShowCreateInstallation}
        onInstallationCreated={(installation) => {
          setSelectedInstallation(installation);
          setShowCreateInstallation(false);
        }}
      />
    </div>
  );
}