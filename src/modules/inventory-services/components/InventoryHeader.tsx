import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InventoryHeader({ onAddArticle }: { onAddArticle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Articles & Materials</h1>
          <p className="text-[11px] text-muted-foreground">Manage your inventory, stock levels, and material usage</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="bg-primary text-white hover:bg-primary/90 shadow-medium hover-lift w-full sm:w-auto" onClick={onAddArticle}>
          <Plus className="mr-2 h-4 w-4 text-white" />
          Add Article
        </Button>
      </div>
    </div>
  );
}
