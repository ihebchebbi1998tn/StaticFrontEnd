import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  FolderOpen, 
  Plus, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Play,
  Calendar,
  Edit3
} from "lucide-react";
import { Node, Edge } from '@xyflow/react';
import { useWorkflowStorage, SavedWorkflow } from '../hooks/useWorkflowStorage';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowManagerProps {
  nodes: Node[];
  edges: Edge[];
  onLoadWorkflow: (workflow: SavedWorkflow) => void;
  onNewWorkflow: () => void;
}

export function WorkflowManager({ nodes, edges, onLoadWorkflow, onNewWorkflow }: WorkflowManagerProps) {
  const { t } = useTranslation();
  const { workflows, currentWorkflow, saveWorkflow, deleteWorkflow, duplicateWorkflow, createNewWorkflow } = useWorkflowStorage();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState(currentWorkflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(currentWorkflow?.description || '');

  const handleSave = () => {
    if (!workflowName.trim()) return;
    
    saveWorkflow(workflowName.trim(), workflowDescription.trim(), nodes, edges);
    setSaveDialogOpen(false);
    setWorkflowName('');
    setWorkflowDescription('');
  };

  const handleLoad = (workflow: SavedWorkflow) => {
    onLoadWorkflow(workflow);
    setLoadDialogOpen(false);
  };

  const handleNew = () => {
    createNewWorkflow();
    onNewWorkflow();
  };

  const handleDuplicate = (workflowId: string) => {
    const duplicate = duplicateWorkflow(workflowId);
    if (duplicate) {
      onLoadWorkflow(duplicate);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Current Workflow Info */}
      {currentWorkflow && (
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md">
          <Edit3 className="h-3 w-3 text-primary" />
          <span className="text-sm font-medium text-primary">{currentWorkflow.name}</span>
        </div>
      )}

      {/* Save Button */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            {t('save')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentWorkflow ? t('editWorkflow') : t('saveWorkflow')}
            </DialogTitle>
            <DialogDescription>
              {t('saveDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('workflowNameLabel')}</label>
              <Input
                placeholder="Mon workflow génial"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">{t('workflowDescriptionLabel')}</label>
              <Textarea
                placeholder={t('workflowDescriptionPlaceholder')}
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={!workflowName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load/Manage Workflows */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderOpen className="h-4 w-4 mr-2" />
            {t('myWorkflows')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('myWorkflows')}</DialogTitle>
            <DialogDescription>
              {t('manageYourWorkflows')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('workflowsCount', { count: workflows.length })}
              </span>
              <Button onClick={handleNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('new')}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                    {workflows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('noSavedWorkflows')}</p>
                    <p className="text-sm">{t('createFirstWorkflow')}</p>
                  </div>
                ) : (
                  workflows.map((workflow) => (
                    <Card key={workflow.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{workflow.name}</h3>
                              {currentWorkflow?.id === workflow.id && (
                                <Badge variant="secondary" className="text-xs">
                                  Actuel
                                </Badge>
                              )}
                            </div>
                            
                            {workflow.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {workflow.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(workflow.updatedAt, { 
                                  addSuffix: true
                                })}
                              </div>
                              <span>{t('nodesCount', { count: workflow.nodes.length })}</span>
                              <span>{t('edgesCount', { count: workflow.edges.length })}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLoad(workflow)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleLoad(workflow)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Ouvrir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicate(workflow.id)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Dupliquer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => deleteWorkflow(workflow.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}