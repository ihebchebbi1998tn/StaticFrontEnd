import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  GripVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Column } from "../types";


interface ColumnManagerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onUpdateColumns: (columns: Column[]) => void;
}

const availableColors = [
  'bg-slate-500',
  'bg-primary', 
  'bg-accent',
  'bg-success',
  'bg-warning',
  'bg-destructive',
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5'
];

export function ColumnManager({ isOpen, onClose, columns, onUpdateColumns }: ColumnManagerProps) {
  const { toast } = useToast();
  const [localColumns, setLocalColumns] = useState(columns);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSave = () => {
    onUpdateColumns(localColumns);
    toast({
      title: "Success",
      description: "Column configuration saved!",
    });
    onClose();
  };

  const handleAddColumn = () => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      color: availableColors[localColumns.length % availableColors.length],
      position: localColumns.length,
      isDefault: false,
      createdAt: new Date(),
    };
    setLocalColumns([...localColumns, newColumn]);
    setEditingId(newColumn.id);
    setEditName(newColumn.title);
  };

  const handleEditColumn = (column: Column) => {
    setEditingId(column.id);
    setEditName(column.title);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editingId) {
      setLocalColumns(localColumns.map(col => 
        col.id === editingId 
          ? { ...col, title: editName.trim() }
          : col
      ));
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (localColumns.length > 1) {
      setLocalColumns(localColumns.filter(col => col.id !== columnId));
    } else {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one column.",
        variant: "destructive",
      });
    }
  };

  const handleChangeColor = (columnId: string, color: string) => {
    setLocalColumns(localColumns.map(col => 
      col.id === columnId 
        ? { ...col, color }
        : col
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Columns
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Customize your workflow by adding, editing, or removing columns. Drag tasks between columns to update their status.
          </div>

          <div className="space-y-3">
            {localColumns.map((column, _index) => (
              <Card key={column.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    
                    <div className={`w-4 h-4 rounded ${column.color}`} />
                    
                    {editingId === column.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          onBlur={handleSaveEdit}
                          className="flex-1"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="font-medium flex-1">{column.title}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Color Picker */}
                    <div className="flex gap-1">
                      {availableColors.slice(0, 6).map((color) => (
                        <button
                          key={color}
                          onClick={() => handleChangeColor(column.id, color)}
                          className={`w-6 h-6 rounded border-2 ${color} ${
                            column.color === color ? 'border-foreground' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditColumn(column)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    {localColumns.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteColumn(column.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleAddColumn}
            variant="outline" 
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}