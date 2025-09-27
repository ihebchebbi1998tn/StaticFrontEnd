import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { LookupItem, CreateLookupRequest, UpdateLookupRequest } from '@/services/lookupsApi';

interface LookupTableProps {
  title?: string;
  items: LookupItem[];
  isLoading: boolean;
  onCreate: (data: CreateLookupRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateLookupRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showTypeFields?: {
    level?: boolean;
    isCompleted?: boolean;
    defaultDuration?: boolean;
    isAvailable?: boolean;
    isPaid?: boolean;
    category?: boolean;
  };
}

export function LookupTable({ 
  title = "Items", 
  items, 
  isLoading, 
  onCreate, 
  onUpdate, 
  onDelete,
  showTypeFields = {}
}: LookupTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LookupItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<CreateLookupRequest>({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
    sortOrder: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleCreate = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      await onCreate(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(editingItem.id, formData);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = (item: LookupItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      color: item.color || '#3B82F6',
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0,
      level: item.level,
      isCompleted: item.isCompleted,
      defaultDuration: item.defaultDuration,
      isAvailable: item.isAvailable,
      isPaid: item.isPaid,
      category: item.category,
    });
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading {title.toLowerCase()}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add {title.slice(0, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              {showTypeFields.level && (
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    type="number"
                    value={formData.level || ''}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || undefined })}
                    placeholder="Priority level (1-5)"
                  />
                </div>
              )}

              {showTypeFields.defaultDuration && (
                <div>
                  <Label htmlFor="defaultDuration">Default Duration (minutes)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    value={formData.defaultDuration || ''}
                    onChange={(e) => setFormData({ ...formData, defaultDuration: parseInt(e.target.value) || undefined })}
                    placeholder="Duration in minutes"
                  />
                </div>
              )}

              {showTypeFields.category && (
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Enter category"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {showTypeFields.isCompleted && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isCompleted"
                    checked={formData.isCompleted || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, isCompleted: checked })}
                  />
                  <Label htmlFor="isCompleted">Completed Status</Label>
                </div>
              )}

              {showTypeFields.isAvailable && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <Label htmlFor="isAvailable">Available</Label>
                </div>
              )}

              {showTypeFields.isPaid && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPaid"
                    checked={formData.isPaid || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                  />
                  <Label htmlFor="isPaid">Paid Leave</Label>
                </div>
              )}

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Button onClick={handleCreate} className="w-full" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No {title} Yet</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't added any {title.toLowerCase()} yet. Get started by creating your first entry.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                {showTypeFields.level && <TableHead>Level</TableHead>}
                {showTypeFields.isCompleted && <TableHead>Completed</TableHead>}
                {showTypeFields.defaultDuration && <TableHead>Duration</TableHead>}
                {showTypeFields.category && <TableHead>Category</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.color && (
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </TableCell>
                  {showTypeFields.level && <TableCell>{item.level}</TableCell>}
                  {showTypeFields.isCompleted && (
                    <TableCell>
                      {item.isCompleted !== undefined && (
                        <Badge variant={item.isCompleted ? "default" : "secondary"}>
                          {item.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  {showTypeFields.defaultDuration && (
                    <TableCell>{item.defaultDuration ? `${item.defaultDuration}min` : '-'}</TableCell>
                  )}
                  {showTypeFields.category && <TableCell>{item.category}</TableCell>}
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            {showTypeFields.level && (
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Input
                  id="edit-level"
                  type="number"
                  value={formData.level || ''}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || undefined })}
                  placeholder="Priority level (1-5)"
                />
              </div>
            )}

            {showTypeFields.defaultDuration && (
              <div>
                <Label htmlFor="edit-defaultDuration">Default Duration (minutes)</Label>
                <Input
                  id="edit-defaultDuration"
                  type="number"
                  value={formData.defaultDuration || ''}
                  onChange={(e) => setFormData({ ...formData, defaultDuration: parseInt(e.target.value) || undefined })}
                  placeholder="Duration in minutes"
                />
              </div>
            )}

            {showTypeFields.category && (
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>

            {showTypeFields.isCompleted && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isCompleted"
                  checked={formData.isCompleted || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isCompleted: checked })}
                />
                <Label htmlFor="edit-isCompleted">Completed Status</Label>
              </div>
            )}

            {showTypeFields.isAvailable && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isAvailable"
                  checked={formData.isAvailable || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="edit-isAvailable">Available</Label>
              </div>
            )}

            {showTypeFields.isPaid && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isPaid"
                  checked={formData.isPaid || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                />
                <Label htmlFor="edit-isPaid">Paid Leave</Label>
              </div>
            )}

            <div>
              <Label htmlFor="edit-sortOrder">Sort Order</Label>
              <Input
                id="edit-sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>

            <Button onClick={handleUpdate} className="w-full" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}