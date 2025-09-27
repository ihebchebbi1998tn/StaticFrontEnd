import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColumnData {
  title: string;
  count: number;
  color: string;
  description?: string;
}

interface TaskColumnProps {
  data: ColumnData;
}

const TaskColumn = memo(({ data }: TaskColumnProps) => {
  return (
    <div className="w-80">
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Card className="h-full min-h-[600px] shadow-soft border-0 bg-card/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${data.color}`}></div>
                {data.title}
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {data.count}
                </Badge>
              </CardTitle>
              {data.description && (
                <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 min-h-[500px] rounded-lg border-2 border-dashed border-border/30 p-3">
            {/* Task cards will be positioned here by React Flow */}
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
});

TaskColumn.displayName = 'TaskColumn';

export default TaskColumn;