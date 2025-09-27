import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, Edit, Star, Tag, Trash2 } from "lucide-react";
import { LookupItem } from "@/shared/contexts/LookupsContext";
import { getCategoryIcon } from "../types";

export function CategoryList({
  title,
  items,
  category,
  onEdit,
  onDelete,
  setDefault,
}: {
  title: string;
  items: LookupItem[];
  category: import('../types').Category;
  onEdit: (item: LookupItem) => void;
  onDelete: (id: string) => void;
  setDefault: (id: string) => void;
}) {
  const Icon = getCategoryIcon(category);
  const renderList = () => (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div key={item.id} className="p-3 sm:p-4 lg:p-6 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {category !== 'currencies' && (
                <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">
                    {item.name}
                    {category === 'currencies' && item.description && (
                      <span className="text-muted-foreground text-xs ml-2">({item.description})</span>
                    )}
                  </h4>
                  {item.isDefault && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      {category === 'currencies' && <Star className="h-3 w-3" />}
                      Default
                    </Badge>
                  )}
                </div>
                {category !== 'currencies' && item.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-0 sm:ml-4">
              {category === 'currencies' ? (
                !item.isDefault && (
                  <Button size="sm" variant="outline" onClick={() => setDefault(item.id)}>
                    Set Default
                  </Button>
                )
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 px-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="h-8 px-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="shadow-card border-0 bg-card">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" /> {title}
        </CardTitle>
        <CardDescription>
          {items.length} {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">{items.length === 0 ? (
        <div className="p-8 text-center">
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        renderList()
      )}</CardContent>
    </Card>
  );
}

export function CategoryTable({
  title,
  items,
  category,
  onEdit,
  onDelete,
  setDefault,
}: {
  title: string;
  items: LookupItem[];
  category: import('../types').Category;
  onEdit: (item: LookupItem) => void;
  onDelete: (id: string) => void;
  setDefault: (id: string) => void;
}) {
  const Icon = getCategoryIcon(category);
  return (
    <Card className="shadow-card border-0 bg-card">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" /> {title}
        </CardTitle>
        <CardDescription>
          {items.length} {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                {category !== 'currencies' && <TableHead>Description</TableHead>}
                {category !== 'currencies' && <TableHead>Color</TableHead>}
                {category === 'currencies' && <TableHead>Code</TableHead>}
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {category !== 'currencies' ? (
                      <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color }} />
                    ) : (
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  {category !== 'currencies' && <TableCell className="text-muted-foreground">{item.description}</TableCell>}
                  {category !== 'currencies' && (
                    <TableCell>
                      <Badge variant="outline">{item.color || '-'}</Badge>
                    </TableCell>
                  )}
                  {category === 'currencies' && (
                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  )}
                  <TableCell>
                    {item.isDefault ? (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {category === 'currencies' && <Star className="h-3 w-3" />}
                        Default
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {category === 'currencies' ? (
                      !item.isDefault && (
                        <Button size="sm" variant="outline" onClick={() => setDefault(item.id)}>
                          Set Default
                        </Button>
                      )
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="h-8 px-2">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
