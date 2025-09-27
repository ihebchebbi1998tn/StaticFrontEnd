
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

interface WorkflowNodeProps {
  data: {
    label: string;
    type: string;
    icon: React.ComponentType<any>;
    description?: string;
    config?: any;
  };
  id: string;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  onRemove?: (nodeId: string) => void;
}

const getNodeStyle = (type: string) => {
  switch (type) {
    // Business Process - Green theme
    case 'contact':
    case 'offer':
    case 'sale':
    case 'service-order':
    case 'dispatch':
  return 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 dark:bg-green-900 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-800';
    
    // Communication - Blue theme
    case 'email':
    case 'email-template':
    case 'email-llm':
  return 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100 dark:bg-sky-900 dark:border-sky-700 dark:hover:border-sky-600 dark:hover:bg-sky-800';
    
    // AI/LLM - Purple theme
    case 'llm-writer':
    case 'llm-analyzer':
    case 'llm-personalizer':
  return 'bg-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100 dark:bg-violet-900 dark:border-violet-700 dark:hover:border-violet-600 dark:hover:bg-violet-800';
    
    // Triggers - Orange theme
    case 'trigger':
    case 'webhook':
    case 'scheduled':
  return 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:bg-orange-100 dark:bg-orange-900 dark:border-orange-700 dark:hover:border-orange-600 dark:hover:bg-orange-800';
    
    // Logic - Yellow theme
    case 'condition':
    case 'filter':
  return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-700 dark:hover:border-yellow-600 dark:hover:bg-yellow-800';
    
    // Generic Actions - Gray theme
    case 'action':
    case 'database':
    case 'api':
    default:
      return 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700';
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'contact':
    case 'offer':
    case 'sale':
    case 'service-order':
    case 'dispatch':
  return 'text-green-600 dark:text-green-300';
    
    case 'email':
    case 'email-template':
    case 'email-llm':
  return 'text-blue-600 dark:text-sky-300';
    
    case 'llm-writer':
    case 'llm-analyzer':
    case 'llm-personalizer':
  return 'text-purple-600 dark:text-violet-300';
    
    case 'trigger':
    case 'webhook':
    case 'scheduled':
  return 'text-orange-600 dark:text-orange-300';
    
    case 'condition':
    case 'filter':
  return 'text-yellow-700 dark:text-yellow-300';
    
    default:
      return 'text-gray-600 dark:text-gray-300';
  }
};

export const WorkflowNode = memo(({ data, id, onNodeClick, onRemove }: WorkflowNodeProps) => {
  const IconComponent = data.icon;

  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(id, data);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(id);
  };

  return (
    <div 
      className={`
        workflow-module relative px-4 py-3 rounded-lg border-2 shadow-sm cursor-pointer 
        transition-all duration-200 ease-in-out min-w-[180px] max-w-[220px]
        ${getNodeStyle(data.type)}
      `}
      onClick={handleClick}
    >
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        aria-label="Remove node"
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-border flex items-center justify-center text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800"
      >
        <span aria-hidden className="text-base font-medium">×</span>
      </button>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
  className="w-3 h-3 bg-white border-2 border-gray-300"
  isConnectable={true}
      />
      
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg bg-white/80 ${getIconColor(data.type)}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 dark:text-gray-50 truncate">
            {data.config?.name || data.label}
          </div>
            {data.description && (
              <div className="text-[11px] text-gray-600 dark:text-gray-300 truncate mt-0.5">
                {data.description}
              </div>
          )}
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
  className="w-3 h-3 bg-white border-2 border-gray-300"
  isConnectable={true}
      />
    </div>
  );
});
