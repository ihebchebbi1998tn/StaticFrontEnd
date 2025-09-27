import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, DollarSign, Edit, Eye, MoreVertical, Trash2, Wrench } from "lucide-react";
import { getLocationIcon, getStatusColor, getStatusIcon, getTypeIcon } from "./utils";

export function InventoryListView({ items, onClick }: { items: any[]; onClick: (item: any) => void; }) {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <Card className="shadow-card border-0 bg-card">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map(item => {
              const StatusIcon = getStatusIcon(item.status);
              const TypeIcon = getTypeIcon(item.type);
              const LocationIcon = item.type === 'material' ? getLocationIcon((item as any).locationType) : Wrench;
              return (
                <div key={item.id} className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => onClick(item)}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                          <TypeIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{item.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <Badge className={`${getStatusColor(item.status)} text-xs`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {item.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                          <span className="truncate">
                            {(item as any).sku ? `SKU: ${(item as any).sku} • ` : ""}{item.category}
                          </span>
                          {item.type === 'material' && <span className="text-xs">Stock: {(item as any).stock} units</span>}
                          {item.type === 'service' && <span className="text-xs">Duration: {(item as any).duration} min</span>}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          {item.type === 'material' && <div className="flex items-center gap-1">
                              <LocationIcon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{(item as any).location}</span>
                            </div>}
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                               {item.type === 'material' ? `${(item as any).sellPrice} TND` : `${(item as any).basePrice} TND`}
                            </span>
                          </div>
                          {(item as any).lastUsed && <div className="hidden sm:flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>Last: {(item as any).lastUsed}</span>
                            </div>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                      {(item as any).lastUsedBy && <div className="flex gap-1 flex-wrap flex-1 sm:flex-none">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {(item as any).lastUsedBy}
                          </Badge>
                        </div>}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={e => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => onClick(item)}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit {item.type}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InventoryTableView({ items: _items, onClick: _onClick }: { items: any[]; onClick: (item: any) => void; }) {
  return null; // Placeholder for future extraction
}
