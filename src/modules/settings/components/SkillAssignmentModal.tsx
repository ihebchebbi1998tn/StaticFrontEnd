import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { skillsApi, Skill } from "@/services/skillsApi";
import { Role } from "@/services/rolesApi";
import { Loader2, Zap, X } from "lucide-react";

interface SkillAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSkillAssigned: () => void;
}

export function SkillAssignmentModal({ open, onOpenChange, role, onSkillAssigned }: SkillAssignmentModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roleSkills, setRoleSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [skillsLoading, setSkillsLoading] = useState(false);

  useEffect(() => {
    if (open && role) {
      fetchSkills();
      fetchRoleSkills();
    }
  }, [open, role]);

  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const response = await skillsApi.getAllSkills();
      setSkills((response.data || []).filter(skill => skill.isActive));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive"
      });
    } finally {
      setSkillsLoading(false);
    }
  };

  const fetchRoleSkills = async () => {
    if (!role) return;
    try {
      const data = await skillsApi.getRoleSkills(role.id);
      setRoleSkills(data);
    } catch (error) {
      console.error("Failed to fetch role skills:", error);
      setRoleSkills([]);
    }
  };

  const handleAssignSkill = async () => {
    if (!selectedSkillId || !role) return;

    try {
      setLoading(true);
      await skillsApi.assignSkillToRole(role.id, parseInt(selectedSkillId));
      toast({
        title: "Success",
        description: "Skill assigned successfully"
      });
      
      setSelectedSkillId("");
      fetchRoleSkills();
      onSkillAssigned();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to assign skill",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (!role) return;

    try {
      await skillsApi.removeSkillFromRole(role.id, skillId);
      toast({
        title: "Success",
        description: "Skill removed successfully"
      });
      
      fetchRoleSkills();
      onSkillAssigned();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to remove skill",
        variant: "destructive"
      });
    }
  };

  const availableSkills = skills.filter(skill => 
    !roleSkills.some(roleSkill => roleSkill.id === skill.id)
  );

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-3" />
            Manage Skills for "{role?.name}"
          </DialogTitle>
          <DialogDescription>
            Assign and manage skills required for this role
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Skills */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Skills</Label>
            {roleSkills.length > 0 ? (
              <div className="grid gap-3">
                {roleSkills.map((skill) => (
                  <div key={skill.id} className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm leading-none">{skill.name}</h4>
                            <Badge className={`text-xs font-medium ${getLevelColor(skill.level)}`}>
                              {skill.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{skill.category}</p>
                          {skill.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm bg-muted/10 rounded-lg">
                No skills assigned to this role yet
              </div>
            )}
          </div>

          {/* Assign New Skill */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Assign New Skill</Label>
            <div className="flex gap-2">
              <Select 
                value={selectedSkillId} 
                onValueChange={setSelectedSkillId}
                disabled={skillsLoading || availableSkills.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={
                    skillsLoading ? "Loading skills..." : 
                    availableSkills.length === 0 ? "No available skills" :
                    "Select a skill"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id.toString()}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAssignSkill}
                disabled={!selectedSkillId || loading}
                className="gradient-primary"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}