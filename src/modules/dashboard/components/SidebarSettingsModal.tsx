import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { saveSidebarConfig, loadSidebarConfig, SidebarItemConfig, resetSidebarConfig, seedSidebarDefaultsIfEmpty } from '../services/sidebar.service';
import { Trash2, Settings, ArrowUp, ArrowDown, X } from 'lucide-react';
import { ICON_OPTIONS, ICON_REGISTRY, IconName } from './sidebarIcons';

type Props = {
  trigger?: React.ReactNode;
  defaultItems: SidebarItemConfig[];
  onSave?: (items: SidebarItemConfig[]) => void;
};

export default function SidebarSettingsModal({ trigger, defaultItems, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SidebarItemConfig[]>([]);

  useEffect(() => {
    if (open) {
      const saved = loadSidebarConfig() || defaultItems || [];
      setItems([...saved]);
    }
  }, [open, defaultItems]);

  const persist = (newItems: SidebarItemConfig[]) => {
    setItems(newItems);
    saveSidebarConfig(newItems);
    onSave?.(newItems);
  };

  const updateTitle = (index: number, title: string) => {
    const next = [...items];
    next[index].title = title;
    persist(next);
  };

  const updateUrl = (index: number, url: string) => {
    const next = [...items];
    next[index].url = url;
    persist(next);
  };

  const updateDescription = (index: number, description: string) => {
    const next = [...items];
    next[index].description = description;
    persist(next);
  };

  const updateIcon = (index: number, iconName: string) => {
    const next = [...items];
    next[index].icon = iconName;
    persist(next);
  };

  const updateGroup = (index: number, group: 'workspace' | 'system') => {
    const next = [...items];
    next[index].group = group;
    persist(next);
  };

  const toggleActive = (index: number) => {
    const next = [...items];
    next[index].active = !next[index].active;
    persist(next);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    persist(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    persist(next);
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    persist(next);
  };

  const addNewItem = () => {
    const newItem: SidebarItemConfig = {
      id: `new-${Date.now()}`,
      title: 'New Item',
      url: '/dashboard/new',
      description: 'New navigation item',
      icon: 'Home',
      active: true,
      group: 'workspace',
    };
    const next = [...items, newItem];
    persist(next);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default navigation? This will remove all your customizations.')) {
      resetSidebarConfig();
      seedSidebarDefaultsIfEmpty();
      const restored = loadSidebarConfig() || [];
      persist(restored);
    }
  };

  const renderIconPreview = (iconName?: string) => {
    if (!iconName) return <div className="w-4 h-4 bg-gray-300 rounded" />;
    const IconComponent = (ICON_REGISTRY as any)[iconName as IconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <div className="w-4 h-4 bg-gray-300 rounded" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="p-1 hover:bg-sidebar-accent/50 hidden">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Navigation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configure your sidebar navigation items, icons, and organization.
            </p>
            <div className="space-x-2">
              <Button onClick={addNewItem} size="sm">Add Item</Button>
              <Button onClick={resetToDefaults} variant="outline" size="sm">Reset to Defaults</Button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderIconPreview(item.icon)}
                    <span className="font-medium">{item.title}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.group === 'workspace' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.group}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.active ?? true}
                      onCheckedChange={() => toggleActive(index)}
                    />
                    <Button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => moveDown(index)}
                      disabled={index >= items.length - 1}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => removeItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateTitle(index, e.target.value)}
                      placeholder="Navigation title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      value={item.url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="/dashboard/example"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      placeholder="Short description"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Icon</label>
                    <select
                      value={item.icon || ''}
                      onChange={(e) => updateIcon(index, e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="">Select icon</option>
                      {ICON_OPTIONS.map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Group</label>
                    <select
                      value={item.group || 'workspace'}
                      onChange={(e) => updateGroup(index, e.target.value as 'workspace' | 'system')}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="workspace">Workspace</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}