import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface TryCatchNodeProps {
  data: {
    label: string;
    type: string;
    icon: React.ComponentType<any>;
    description?: string;
    config?: {
      retryCount?: number;
      retryDelay?: number;
      logErrors?: boolean;
    };
  };
  id: string;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  onRemove?: (nodeId: string) => void;
}

export const TryCatchNode = memo(({ data, id, onNodeClick, onRemove }: TryCatchNodeProps) => {
  const { t } = useTranslation();
  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(id, data);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(id);
  };

  const retryCount = data.config?.retryCount || 0;
  const hasRetry = retryCount > 0;

  return (
    <div 
      className="relative px-4 py-3 rounded-lg border-2 shadow-sm cursor-pointer 
                 transition-all duration-200 ease-in-out min-w-[200px] max-w-[240px]
                 bg-orange-50 border-orange-200 hover:border-orange-300 hover:bg-orange-100"
      onClick={handleClick}
    >
      <button
        onClick={handleRemove}
        aria-label="Remove node"
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 border border-border flex items-center justify-center text-xs text-foreground hover:bg-red-50"
      >
        ×
      </button>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
  className="w-3 h-3 bg-white border-2 border-orange-400"
  isConnectable={true}
      />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-white/80 text-orange-600">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {data.label}
          </div>
        </div>
      </div>

      {/* Configuration Display */}
      <div className="text-xs text-gray-600 mb-3 px-2 py-1 bg-white/60 rounded">
        {hasRetry ? (
          <div>
            <div>{t('nodeUi.attempts')}: <strong>{retryCount}</strong></div>
            {data.config?.retryDelay && (
              <div>{t('nodeUi.delay')}: <strong>{data.config.retryDelay}s</strong></div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">{t('nodeUi.clickToConfigure')}</span>
        )}
      </div>

      {/* Try Block */}
      <div className="bg-green-50 border border-green-200 rounded p-2 mb-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1 text-green-700 mb-1">
          <CheckCircle className="h-3 w-3" />
          {t('nodeUi.try')}
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="try"
          style={{ top: '60%' }}
          className="w-3 h-3 bg-green-500 border-2 border-green-600"
          isConnectable={true}
        />
      </div>

      {/* Catch Block */}
      <div className="bg-red-50 border border-red-200 rounded p-2 mb-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1 text-red-700 mb-1">
          <AlertTriangle className="h-3 w-3" />
          {t('nodeUi.onError')}
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="catch"
          style={{ top: '80%' }}
          className="w-3 h-3 bg-red-500 border-2 border-red-600"
          isConnectable={true}
        />
      </div>

      {/* Success Output */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
  {t('nodeUi.finished')}
        <Handle
          type="source"
          position={Position.Bottom}
          id="finally"
          className="w-3 h-3 bg-gray-500 border-2 border-gray-600"
          isConnectable={true}
        />
      </div>
    </div>
  );
});