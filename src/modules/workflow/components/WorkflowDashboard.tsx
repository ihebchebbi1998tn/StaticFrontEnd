import { useState } from "react";
import { useTranslation } from 'react-i18next';
import '../styles/workflow.css';
import { Button } from "@/components/ui/button";
import { Workflow, Plus } from "lucide-react";
import { QuickCreateWorkflow } from "./QuickCreateWorkflow";
import { WorkflowBuilder } from "./WorkflowBuilder";
import { NotificationsCenter } from "../small-components/NotificationsCenter";
import { useWorkflowNotifications } from "../hooks/useWorkflowData";

export function WorkflowDashboard() {
  const { t } = useTranslation();
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const { notifications } = useWorkflowNotifications();
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="workflow-module h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Workflow className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('builderTitle')}</h1>
            <p className="text-[11px] text-muted-foreground">{t('builderSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsCenter 
            notifications={notifications.slice(0, 5)}
            unreadCount={unreadNotifications.length}
          />
          
          <Button 
            variant="outline"
            onClick={() => setShowQuickCreate(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('new')}
          </Button>
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="flex-1">
        <WorkflowBuilder />
      </div>

      {/* Quick Create Dialog */}
      {showQuickCreate && (
        <QuickCreateWorkflow
          open={showQuickCreate}
          onOpenChange={setShowQuickCreate}
          contactId="default"
          onComplete={() => setShowQuickCreate(false)}
        />
      )}
    </div>
  );
}