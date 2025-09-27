import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin } from "lucide-react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanBoard } from "../small-components/KanbanBoard";
import { DraggableDispatchCard } from "../small-components/DraggableDispatchCard";
import { WorkflowDispatch, KanbanColumn } from "../types";

export function DispatchBoard() {
  const { t } = useTranslation();
  const [dispatches, setDispatches] = useState<WorkflowDispatch[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const columns: KanbanColumn[] = [
    { id: 'scheduled', title: t('dispatch.scheduled') || 'Scheduled', key: 'scheduled', color: 'blue' },
    { id: 'en_route', title: t('dispatch.enRoute') || 'En route', key: 'en_route', color: 'orange' },
    { id: 'in_progress', title: t('dispatch.inProgress') || 'In progress', key: 'in_progress', color: 'purple' },
  { id: 'completed', title: t('nodeUi.finished'), key: 'completed', color: 'green' },
    { id: 'cancelled', title: t('dispatch.cancelled') || 'Cancelled', key: 'cancelled', color: 'red' }
  ];

  const getDispatchesByColumn = (columnId: string) => {
    return dispatches.filter(dispatch => dispatch.status === columnId);
  };

  const itemsByColumn = columns.reduce((acc, column) => {
    acc[column.id] = getDispatchesByColumn(column.id);
    return acc;
  }, {} as Record<string, WorkflowDispatch[]>);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Update dispatch status
    setDispatches(prev => prev.map(dispatch => 
      dispatch.id === activeId 
        ? { ...dispatch, status: overId as WorkflowDispatch['status'] }
        : dispatch
    ));

    setActiveId(null);
  };

  const activeDispatch = activeId ? dispatches.find(d => d.id === activeId) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('dispatch.title')}</h1>
          <p className="text-muted-foreground">{t('dispatch.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {t('dispatch.calendarView')}
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            {t('dispatch.mapView')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('dispatch.newDispatch')}
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard
          columns={columns}
          itemsByColumn={itemsByColumn}
          onMove={(itemId, fromColumn, toColumn) => {
            console.log(`Move ${itemId} from ${fromColumn} to ${toColumn}`);
          }}
          renderItem={(item) => (
            <DraggableDispatchCard
              key={item.id}
              dispatch={item as WorkflowDispatch}
              onEdit={(id) => console.log('Edit dispatch', id)}
              onAssign={(id) => console.log('Assign dispatch', id)}
            />
          )}
        />

        <DragOverlay>
          {activeDispatch && (
            <DraggableDispatchCard
              dispatch={activeDispatch}
              onEdit={() => {}}
              onAssign={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}