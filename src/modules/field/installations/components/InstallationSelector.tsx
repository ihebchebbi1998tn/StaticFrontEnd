import { useState } from "react";
import { Search, Plus, Package, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Installation } from "../types";
import installationsData from "@/data/mock/installations.json";

interface InstallationSelectorProps {
  onSelect: (installation: any) => void;
  selectedInstallation?: any | null;
  onCreateNew?: () => void;
}

export function InstallationSelector({ onSelect, selectedInstallation, onCreateNew }: InstallationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  const filteredInstallations = installationsData.filter((installation: any) =>
    installation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installation.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installation.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installation.customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (installation: any) => {
    onSelect(installation);
    setShowSelector(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Installation Assignment</Label>
      
      {selectedInstallation ? (
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{selectedInstallation.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedInstallation.manufacturer} - {selectedInstallation.model}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      {selectedInstallation.customer.company}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {selectedInstallation.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {selectedInstallation.type === 'internal' ? 'Internal (Sold by us)' : 'External (Customer owned)'}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowSelector(true)}>
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSelector(true)}
            className="flex-1 justify-start gap-2"
          >
            <Search className="h-4 w-4" />
            Select Installation
          </Button>
          {onCreateNew && (
            <Button variant="outline" onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          )}
        </div>
      )}

      {/* Installation Selector Dialog */}
      <Dialog open={showSelector} onOpenChange={setShowSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Installation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label>Search Installations</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, model, manufacturer, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Installations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredInstallations.map((installation) => (
                <Card 
                  key={installation.id} 
                  className="border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(installation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{installation.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {installation.manufacturer} - {installation.model}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building className="h-3 w-3" />
                            {installation.customer.company}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {installation.location}
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {installation.type === 'internal' ? 'Internal' : 'External'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredInstallations.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No installations found matching "{searchTerm}"</p>
                {onCreateNew && (
                  <Button variant="outline" className="mt-4 gap-2" onClick={() => {
                    setShowSelector(false);
                    onCreateNew();
                  }}>
                    <Plus className="h-4 w-4" />
                    Create New Installation
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              {onCreateNew && (
                <Button variant="outline" onClick={() => {
                  setShowSelector(false);
                  onCreateNew();
                }} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Installation
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setShowSelector(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}