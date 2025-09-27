import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { getLocationIcon, getStatusColor, getStatusIcon, getTypeIcon } from "./utils";

export function InventoryTableView({ items, onClick }: { items: any[]; onClick: (item: any) => void }) {
  return (
    <div className="p-3 sm:p-4 lg:p-6 w-full">
      <Card className="shadow-card border-0 bg-card w-full">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
               style={{ WebkitOverflowScrolling: 'touch' }}>
            <TableComponent className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>Item/Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location/Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => {
                const StatusIcon = getStatusIcon(item.status);
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onClick(item)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <TypeIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {(item as any).sku && <div className="text-sm text-muted-foreground">{(item as any).sku}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {item.status?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.type === 'material' ? (
                        <div className="flex items-center gap-1">
                          {React.createElement(getLocationIcon((item as any).locationType), {
                            className: "h-3 w-3"
                          })}
                          <span className="text-sm">{(item as any).location}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">{(item as any).duration} min</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                      {item.type === 'material' ? `${(item as any).sellPrice} TND` : `${(item as any).basePrice} TND`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.type === 'material' ? (
                        <div className="text-sm">
                          <div>{(item as any).stock} units</div>
                          <div className="text-muted-foreground">Min: {(item as any).minStock}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </TableComponent>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
