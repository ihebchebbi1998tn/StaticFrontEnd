import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { skillsApi, Skill, CreateSkillRequest, UpdateSkillRequest } from "@/services/skillsApi";

interface AddEditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill | null;
  onSave: () => void;  // Changed to just trigger refresh
}

const skillCategories = [
  "Infrastructure", 
  "Networking", 
  "Security", 
  "Hardware", 
  "Development", 
  "Data Management",
  "General"
];

const skillLevels = [
  "beginner",
  "intermediate", 
  "advanced",
  "expert"
];

export function AddEditSkillModal({
  isOpen,
  onClose,
  skill,
  onSave,
}: AddEditSkillModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when modal opens/closes or skill changes
  useEffect(() => {
    if (isOpen) {
      setName(skill?.name || "");
      setDescription(skill?.description || "");
      setCategory(skill?.category || "");
      setLevel(skill?.level || "");
      setIsActive(skill?.isActive ?? true);
    } else {
      // Reset form when closing
      setName("");
      setDescription("");
      setCategory("");
      setLevel("");
      setIsActive(true);
    }
  }, [isOpen, skill]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Error", 
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (skill) {
        // Update existing skill
        const updateData: UpdateSkillRequest = {
          name: name.trim(),
          description: description.trim() || undefined,
          category,
          level: level || undefined,
          isActive
        };
        await skillsApi.updateSkill(skill.id, updateData);
      } else {
        // Create new skill
        const createData: CreateSkillRequest = {
          name: name.trim(),
          description: description.trim() || undefined,
          category,
          level: level || undefined
        };
        await skillsApi.createSkill(createData);
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${skill ? 'update' : 'create'} skill`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {skill ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
          <DialogDescription>
            {skill 
              ? "Update the skill information below." 
              : "Enter the skill name and an optional description."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Server Maintenance"
              className="w-full"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level (optional)" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the skill (optional)"
              className="w-full min-h-[80px]"
              rows={3}
            />
          </div>

          {skill && (
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim() || !category || isLoading}
            className="gradient-primary text-primary-foreground"
          >
            {isLoading ? "Saving..." : (skill ? "Update" : "Add")} Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}