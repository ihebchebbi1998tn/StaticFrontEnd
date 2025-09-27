
import { useState, useCallback } from 'react';
import '../styles/workflow.css';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { 
  Plus, Play, Zap, Bot, Settings, GitBranch, Users, DollarSign, 
  ShoppingCart, Truck, Mail, Send, Sparkles, Brain, Webhook, 
  Calendar, Database, FileText, Clipboard, ChevronLeft, ChevronRight,
  Menu, RotateCcw, Split, Shield, Download, Upload
} from "lucide-react";
import { WorkflowNode } from '../small-components/WorkflowNode';
import { WorkflowToolbar } from '../small-components/WorkflowToolbar';
import EdgeToolbar from '../small-components/EdgeToolbar';
import { WorkflowManager } from './WorkflowManager';
import { NodeConfigurationModal } from './NodeConfigurationModal';
import { ConditionalConfigModal } from './conditional/ConditionalConfigModal';
import { SavedWorkflow } from '../hooks/useWorkflowStorage';
import { IfElseNode } from './conditional/IfElseNode';
import { SwitchNode } from './conditional/SwitchNode';
import { LoopNode } from './conditional/LoopNode';
import { ParallelNode } from './conditional/ParallelNode';
import { TryCatchNode } from './conditional/TryCatchNode';
import { ExportDialog } from './export-import/ExportDialog';
import { ImportDialog } from './export-import/ImportDialog';
// InfoTip removed from builder header to avoid duplicate header display
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const createNodeTypes = (
  onNodeClick: (nodeId: string, nodeData: any) => void,
  onRemove: (nodeId: string) => void
) => ({
  workflowNode: (props: any) => <WorkflowNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
  ifElseNode: (props: any) => <IfElseNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
  switchNode: (props: any) => <SwitchNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
  loopNode: (props: any) => <LoopNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
  parallelNode: (props: any) => <ParallelNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
  tryCatchNode: (props: any) => <TryCatchNode {...props} onNodeClick={onNodeClick} onRemove={onRemove} />,
});

const getEmptyWorkflow = (): { nodes: Node[]; edges: Edge[] } => ({
  nodes: [],
  edges: []
});

export function WorkflowBuilder() {
  const { t } = useTranslation();
  const { nodes: emptyNodes, edges: emptyEdges } = getEmptyWorkflow();
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedEdgePos, setSelectedEdgePos] = useState<{ x: number; y: number } | null>(null);
  const [configModal, setConfigModal] = useState<{
    isOpen: boolean;
    nodeData?: any;
  }>({ isOpen: false });
  const [exportModal, setExportModal] = useState(false);
  const [importModal, setImportModal] = useState(false);

  const handleNodeClick = useCallback((nodeId: string, nodeData: any) => {
    setConfigModal({
      isOpen: true,
      nodeData: { ...nodeData, id: nodeId }
    });
  }, []);

  const handleRemoveNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    toast.success(t('nodeRemoved') || 'Node removed');
  }, [setNodes, setEdges, t]);

  const nodeTypes = createNodeTypes(handleNodeClick, handleRemoveNode);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: 'smoothstep', animated: true },
          eds
        )
      ),
    [setEdges]
  );

  const handleEdgeClick = useCallback((edgeId: string) => {
    setSelectedEdgeId(edgeId);
  }, []);

  const changeEdgeType = useCallback((edgeId: string, type: string) => {
    setEdges(eds => eds.map(e => e.id === edgeId ? { ...e, type } : e));
  }, [setEdges]);

  const toggleEdgeAnimated = useCallback((edgeId: string) => {
    setEdges(eds => eds.map(e => e.id === edgeId ? { ...e, animated: !e.animated } : e));
  }, [setEdges]);

  const reverseEdge = useCallback((edgeId: string) => {
    setEdges(eds => {
      const existing = eds.find(e => e.id === edgeId);
      if (!existing) return eds;

      // create a new edge object with swapped source/target and a fresh id
      const newId = `${existing.id}-rev-${Date.now()}`;
      const newEdge = {
        ...existing,
        id: newId,
        source: existing.target,
        target: existing.source,
      } as Edge;

      // replace the old edge with the new one
      const updated = eds.map(e => e.id === edgeId ? newEdge : e);
      // set the selected edge to the new id
      setSelectedEdgeId(newId);
      return updated;
    });
  }, [setEdges]);

  const createBusinessTemplate = useCallback(() => {
    const templateNodes: Node[] = [
      {
        id: 'contact-1',
        type: 'workflowNode',
        position: { x: 150, y: 200 },
  data: { label: t('node.contact.label'), type: 'contact', icon: Users, description: t('node.contact.desc') }
      },
      {
        id: 'offer-1',
        type: 'workflowNode',
        position: { x: 400, y: 200 },
  data: { label: t('node.offer.label'), type: 'offer', icon: FileText, description: t('node.offer.desc') }
      },
      {
        id: 'email-offer-1',
        type: 'workflowNode',
        position: { x: 400, y: 350 },
  data: { label: t('node.email-llm.label'), type: 'email-llm', icon: Sparkles, description: t('node.email-llm.desc') }
      },
      {
        id: 'sale-1',
        type: 'workflowNode',
        position: { x: 650, y: 200 },
  data: { label: t('node.sale.label'), type: 'sale', icon: DollarSign, description: t('node.sale.desc') }
      },
      {
        id: 'service-1',
        type: 'workflowNode',
        position: { x: 900, y: 200 },
  data: { label: t('node.service-order.label'), type: 'service-order', icon: ShoppingCart, description: t('node.service-order.desc') }
      },
      {
        id: 'dispatch-1',
        type: 'workflowNode',
        position: { x: 1150, y: 200 },
  data: { label: t('node.dispatch.label'), type: 'dispatch', icon: Truck, description: t('node.dispatch.desc') }
      }
    ];

    const templateEdges: Edge[] = [
      { id: 'e1-2', source: 'contact-1', target: 'offer-1', type: 'smoothstep', animated: true },
      { id: 'e2-3', source: 'offer-1', target: 'email-offer-1', type: 'smoothstep' },
      { id: 'e2-4', source: 'offer-1', target: 'sale-1', type: 'smoothstep', animated: true },
      { id: 'e4-5', source: 'sale-1', target: 'service-1', type: 'smoothstep', animated: true },
      { id: 'e5-6', source: 'service-1', target: 'dispatch-1', type: 'smoothstep', animated: true }
    ];

  // Ensure labels/descriptions respect current locale and user's custom name if present
  setNodes(templateNodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      label: (n.data as any)?.config?.name || (n.data as any)?.label || getNodeLabel((n.data as any)?.type),
      description: (n.data as any)?.description || getNodeDescription((n.data as any)?.type),
    }
  })));
  setEdges(templateEdges);
  toast.success(t('templateCreated'));
  }, [setNodes, setEdges]);

  const addNode = useCallback((type: string) => {
    if (type === 'template-business') {
      createBusinessTemplate();
      return;
    }

    const nodeType = getNodeType(type);
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 500 + 200, y: Math.random() * 400 + 150 },
      data: {
        label: getNodeLabel(type),
        type,
        icon: getNodeIcon(type),
        description: getNodeDescription(type)
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, createBusinessTemplate]);

  const getNodeType = (type: string) => {
    switch (type) {
      case 'if-else': return 'ifElseNode';
      case 'switch': return 'switchNode';
      case 'loop': return 'loopNode';
      case 'parallel': return 'parallelNode';
      case 'try-catch': return 'tryCatchNode';
      default: return 'workflowNode';
    }
  };

  const getNodeLabel = (type: string) => {
    switch (type) {
      // Business Process
  case 'contact': return t('node.contact.label');
  case 'offer': return t('node.offer.label');
  case 'sale': return t('node.sale.label');
  case 'service-order': return t('node.service-order.label');
  case 'dispatch': return t('node.dispatch.label');
      
      // Communication
  case 'email': return t('node.email.label');
  case 'email-template': return t('node.email-template.label');
  case 'email-llm': return t('node.email-llm.label');
      
      // AI/LLM
  case 'llm-writer': return t('node.llm-writer.label');
  case 'llm-analyzer': return t('node.llm-analyzer.label');
  case 'llm-personalizer': return t('node.llm-personalizer.label');
      
      // Triggers
  case 'trigger': return t('node.trigger.label');
  case 'webhook': return t('node.webhook.label');
  case 'scheduled': return t('node.scheduled.label');
      
      // Logic
  case 'condition': return t('node.condition.label');
  case 'filter': return t('node.filter.label');
      
      // Advanced Flow Control
  case 'if-else': return t('node.if-else.label');
  case 'switch': return t('node.switch.label');
  case 'loop': return t('node.loop.label');
  case 'parallel': return t('node.parallel.label');
  case 'try-catch': return t('node.try-catch.label');
      
      // Generic Actions
  case 'action': return t('node.action.label');
  case 'database': return t('node.database.label');
  case 'api': return t('node.api.label');
      
  default: return t('node.default.desc') || 'Node';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      // Business Process
      case 'contact': return Users;
      case 'offer': return FileText;
      case 'sale': return DollarSign;
      case 'service-order': return ShoppingCart;
      case 'dispatch': return Truck;
      
      // Communication
      case 'email': return Mail;
      case 'email-template': return Send;
      case 'email-llm': return Sparkles;
      
      // AI/LLM
      case 'llm-writer': return Brain;
      case 'llm-analyzer': return Bot;
      case 'llm-personalizer': return Sparkles;
      
      // Triggers
      case 'trigger': return Play;
      case 'webhook': return Webhook;
      case 'scheduled': return Calendar;
      
      // Logic
      case 'condition': return GitBranch;
      case 'filter': return Settings;
      
      // Advanced Flow Control
      case 'if-else': return GitBranch;
      case 'switch': return Menu;
      case 'loop': return RotateCcw;
      case 'parallel': return Split;
      case 'try-catch': return Shield;
      
      // Generic Actions
      case 'action': return Zap;
      case 'database': return Database;
      case 'api': return Settings;
      
      default: return Plus;
    }
  };

  const getNodeDescription = (type: string) => {
    switch (type) {
      // Business Process
  case 'contact': return t('node.contact.desc');
  case 'offer': return t('node.offer.desc');
  case 'sale': return t('node.sale.desc');
  case 'service-order': return t('node.service-order.desc');
  case 'dispatch': return t('node.dispatch.desc');
      
      // Communication
  case 'email': return t('node.email.desc');
  case 'email-template': return t('node.email-template.desc');
  case 'email-llm': return t('node.email-llm.desc');
      
      // AI/LLM
  case 'llm-writer': return t('node.llm-writer.desc');
  case 'llm-analyzer': return t('node.llm-analyzer.desc');
  case 'llm-personalizer': return t('node.llm-personalizer.desc');
      
      // Triggers
  case 'trigger': return t('node.trigger.desc');
  case 'webhook': return t('node.webhook.desc');
  case 'scheduled': return t('node.scheduled.desc');
      
      // Logic
  case 'condition': return t('node.condition.desc');
  case 'filter': return t('node.filter.desc');
      
      // Advanced Flow Control
  case 'if-else': return t('node.if-else.desc');
  case 'switch': return t('node.switch.desc');
  case 'loop': return t('node.loop.desc');
  case 'parallel': return t('node.parallel.desc');
  case 'try-catch': return t('node.try-catch.desc');
      
      // Generic Actions
  case 'action': return t('node.action.desc');
  case 'database': return t('node.database.desc');
  case 'api': return t('node.api.desc');
      
  default: return t('node.default.desc') || 'Custom node';
    }
  };

  const handleRunWorkflow = () => {
    if (nodes.length === 0) {
      toast.error(t('errors.noNodesToRun'));
      return;
    }
    
    // Import and use validator
    import('../utils/workflowValidator').then(({ WorkflowValidator }) => {
      const validation = WorkflowValidator.validateWorkflow(nodes, edges);
      
      if (!validation.isValid) {
  toast.error(t('errors.validationErrors', { errors: validation.errors.join(', ') }));
        return;
      }
      
      if (validation.warnings.length > 0) {
        console.warn('Workflow warnings:', validation.warnings);
        validation.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }
      
  setIsRunning(true);
  toast.success(t('executionInProgress'));
      
      // Simulate workflow execution with realistic timing
      setTimeout(() => {
  setIsRunning(false);
  toast.success(t('executionSuccess'));
      }, 3000);
    });
  };

  const handleLoadWorkflow = (workflow: SavedWorkflow) => {
  const normalize = (node: Node) => ({
    ...node,
    data: {
      ...node.data,
      label: (node.data as any)?.config?.name || (node.data as any)?.label || getNodeLabel((node.data as any)?.type),
      description: (node.data as any)?.description || getNodeDescription((node.data as any)?.type),
    }
  });

  setNodes(workflow.nodes.map(normalize));
  setEdges(workflow.edges);
  toast.success(t('workflowLoaded', { name: workflow.name }));
  };

  const handleNewWorkflow = () => {
  const { nodes: emptyNodes, edges: emptyEdges } = getEmptyWorkflow();
  setNodes(emptyNodes);
  setEdges(emptyEdges);
  toast.success(t('newWorkflowCreated'));
  };


  const handleConfigSave = useCallback((config: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === configModal.nodeData?.id
          ? {
              ...node,
              data: {
                ...node.data,
                config,
                label: config.name || node.data.label
              }
            }
          : node
      )
    );
  toast.success(t('configSaved'));
  }, [configModal.nodeData?.id, setNodes]);

  const handleImportWorkflow = useCallback((importedNodes: Node[], importedEdges: Edge[], name?: string) => {
  const normalize = (node: Node) => ({
    ...node,
    data: {
      ...node.data,
      label: (node.data as any)?.config?.name || (node.data as any)?.label || getNodeLabel((node.data as any)?.type),
      description: (node.data as any)?.description || getNodeDescription((node.data as any)?.type),
    }
  });

  setNodes(importedNodes.map(normalize));
  setEdges(importedEdges);
  setImportModal(false);
  toast.success(t('importedWorkflowLoaded', { name: name || t('importedDefaultName') }));
  }, [setNodes, setEdges]);

  return (
    <div className="workflow-module h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div>
          {/* Title and InfoTip removed to avoid duplicate top header */}
        </div>
        
  <div className="flex items-center gap-2">
    {/* import/export InfoTip removed per request */}
          <Button
            variant="outline"
            onClick={() => setImportModal(true)}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setExportModal(true)}
            disabled={nodes.length === 0}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <WorkflowManager
            nodes={nodes}
            edges={edges}
            onLoadWorkflow={handleLoadWorkflow}
            onNewWorkflow={handleNewWorkflow}
          />
          
            <Button 
            onClick={handleRunWorkflow}
            disabled={isRunning || nodes.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex items-center gap-2"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? t('running') : t('runAction')}
          </Button>
          
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
  {/* Collapsible Toolbar */}
  <div className={`${isToolbarCollapsed ? 'w-12' : 'w-80'} border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 relative`}>
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className="absolute top-4 right-2 z-10 h-8 w-8 p-0"
          >
            {isToolbarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          
          {!isToolbarCollapsed && (
            <div className="p-4">
              <WorkflowToolbar onAddNode={addNode} />
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-gradient-to-br from-background to-muted/20">
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 p-4 rounded-full bg-primary/10 w-fit mx-auto">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2 justify-center">
                  {t('gettingStartedTitle')}
                </h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  {t('gettingStartedDescription')}
                </p>
                <Button variant="outline" onClick={() => addNode('trigger')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('emptyAddTrigger')}
                </Button>
              </div>
            </div>
          ) : null}
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={(evt, edge) => { evt?.preventDefault(); if (edge?.id) { handleEdgeClick(edge.id); setSelectedEdgePos({ x: evt.clientX, y: evt.clientY }); } }}
            nodeTypes={nodeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
            fitViewOptions={{
              padding: 0.2,
              minZoom: 0.4,
              maxZoom: 1.2
            }}
            minZoom={0.2}
            maxZoom={2}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            className="bg-transparent"
            attributionPosition="bottom-left"
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: {
                strokeWidth: 2,
              }
            }}
          >
            <Controls 
              className="bg-background/90 backdrop-blur border border-border shadow-lg rounded-lg [&>button]:bg-card [&>button]:text-foreground [&>button]:border-border hover:[&>button]:bg-accent hover:[&>button]:text-accent-foreground"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={25} 
              size={2}
              color="hsl(var(--muted-foreground) / 0.15)"
            />
          </ReactFlow>
          {/* Edge toolbar */}
          <EdgeToolbar
            edge={edges.find(e => e.id === selectedEdgeId) || null}
            nodes={nodes}
            onChangeType={changeEdgeType}
            onToggleAnimated={toggleEdgeAnimated}
            onReverse={reverseEdge}
            // @ts-ignore
            position={selectedEdgePos}
          />
        </div>
      </div>

      {/* Configuration Modal */}
      {configModal.nodeData?.type && ['if-else', 'switch', 'loop', 'parallel', 'try-catch'].includes(configModal.nodeData.type) ? (
        <ConditionalConfigModal
          isOpen={configModal.isOpen}
          onClose={() => setConfigModal({ isOpen: false })}
          nodeData={configModal.nodeData}
          onSave={handleConfigSave}
        />
      ) : (
        <NodeConfigurationModal
          isOpen={configModal.isOpen}
          onClose={() => setConfigModal({ isOpen: false })}
          nodeData={configModal.nodeData}
          onSave={handleConfigSave}
        />
      )}

      {/* Export Modal */}
      <ExportDialog
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        nodes={nodes}
        edges={edges}
        workflowName={t('templateTitle')}
      />

      {/* Import Modal */}
      <ImportDialog
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        onImport={handleImportWorkflow}
      />
    </div>
  );
}
