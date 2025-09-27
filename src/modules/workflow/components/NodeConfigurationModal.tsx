import { useState } from 'react';
import '../styles/workflow.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import templates from '@/data/mock/workflow/templates.json';
import recipients from '@/data/mock/workflow/recipients.json';
import delays from '@/data/mock/workflow/delays.json';
import llmModels from '@/data/mock/workflow/llmModels.json';
import objectives from '@/data/mock/workflow/objectives.json';
import triggerTypes from '@/data/mock/workflow/triggerTypes.json';
import conditionTypes from '@/data/mock/workflow/conditionTypes.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LucideIcon, Save, X } from 'lucide-react';

interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    id: string;
    label: string;
    type: string;
    icon: LucideIcon;
    description?: string;
  };
  onSave: (config: any) => void;
}

export function NodeConfigurationModal({ isOpen, onClose, nodeData, onSave }: NodeConfigurationModalProps) {
  const [config, setConfig] = useState<any>({});
  const { t, i18n } = useTranslation();

  // Helpers: try nodeHelp.<type> keys first, then fall back to a component-level key like <type>.<key>
  const getHelpString = (key: string) => {
    if (!nodeData?.type) return '';
    const nodeHelpKey = `nodeHelp.${nodeData.type}.${key}`;
    const compKey = `${nodeData.type}.${key}`;
    if (i18n.exists(nodeHelpKey)) return t(nodeHelpKey);
    if (i18n.exists(compKey)) return (i18n.getResource(i18n.language, 'translation', compKey) as string) || '';
    return '';
  };

  const getHelpExamples = () => {
    if (!nodeData?.type) return null;
    const nodeHelpExamples = i18n.getResource(i18n.language, 'translation', `nodeHelp.${nodeData.type}.examples`);
    if (Array.isArray(nodeHelpExamples)) return nodeHelpExamples;
    const compExamples = i18n.getResource(i18n.language, 'translation', `${nodeData.type}.examples`);
    if (Array.isArray(compExamples)) return compExamples;
    return null;
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const renderBusinessProcessConfig = () => (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">{t('general')}</TabsTrigger>
        <TabsTrigger value="fields">{t('fields')}</TabsTrigger>
        <TabsTrigger value="validation">{t('validation')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('processName')}</Label>
          <Input 
            id="name" 
            value={config.name || nodeData.label} 
            onChange={(e) => setConfig({...config, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
          <Textarea 
            id="description" 
            value={config.description || ''} 
            onChange={(e) => setConfig({...config, description: e.target.value})}
            placeholder={t('processDescriptionPlaceholder')}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="fields" className="space-y-4">
        <div className="space-y-2">
          <Label>{t('requiredFields')}</Label>
          <div className="space-y-2">
            {['Name', 'Email', 'Phone', 'Company'].map((field) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm">{field}</span>
                <Switch 
                  checked={config.requiredFields?.[field] || false}
                  onCheckedChange={(checked) => setConfig({
                    ...config, 
                    requiredFields: {...config.requiredFields, [field]: checked}
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="validation" className="space-y-4">
        <div className="space-y-2">
          <Label>{t('validation')}</Label>
          <Textarea 
            placeholder={t('validation') + '...'}
            value={config.validationRules || ''}
            onChange={(e) => setConfig({...config, validationRules: e.target.value})}
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderEmailConfig = () => (
    <Tabs defaultValue="template" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="template">{t('templateTab')}</TabsTrigger>
        <TabsTrigger value="recipients">{t('recipientsTab')}</TabsTrigger>
        <TabsTrigger value="timing">{t('timingTab')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="template" className="space-y-4">
        <div className="space-y-2">
              <Label htmlFor="subject">{t('subject')}</Label>
          <Input 
            id="subject" 
            value={config.subject || ''} 
            onChange={(e) => setConfig({...config, subject: e.target.value})}
            placeholder="Sujet de l'email..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template">Template email</Label>
          <Select value={config.template || ''} onValueChange={(value) => setConfig({...config, template: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('chooseTemplate')} />
            </SelectTrigger>
            <SelectContent>
              {templates.map(tpl => (
                <SelectItem key={tpl.id} value={tpl.id}>{t(`template.${tpl.id}`, tpl.name)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Contenu</Label>
          <Textarea 
            id="content" 
            value={config.content || ''} 
            onChange={(e) => setConfig({...config, content: e.target.value})}
            placeholder="Contenu de l'email..."
            rows={6}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="recipients" className="space-y-4">
        <div className="space-y-2">
          <Label>{t('recipientType')}</Label>
          <Select value={config.recipientType || ''} onValueChange={(value) => setConfig({...config, recipientType: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('chooseTemplate')} />
            </SelectTrigger>
            <SelectContent>
              {recipients.map(r => (
                <SelectItem key={r.id} value={r.id}>{t(`recipient.${r.id}`, r.name)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value="timing" className="space-y-4">
        <div className="space-y-2">
              <Label>{t('sendDelay')}</Label>
          <Select value={config.timing || 'immediate'} onValueChange={(value) => setConfig({...config, timing: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {delays.map(d => (
                <SelectItem key={d.id} value={d.id}>{t(`delay.${d.id.replace('delay-','')}`, d.name)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderLLMConfig = () => (
    <Tabs defaultValue="model" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="model">{t('model')}</TabsTrigger>
        <TabsTrigger value="prompt">{t('prompt')}</TabsTrigger>
        <TabsTrigger value="parameters">{t('parameters')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="model" className="space-y-4">
        <div className="space-y-2">
          <Label>{t('llmModel')}</Label>
          <Select value={config.model || ''} onValueChange={(value) => setConfig({...config, model: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un modèle" />
            </SelectTrigger>
            <SelectContent>
              {llmModels.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Objectif</Label>
          <Select value={config.objective || ''} onValueChange={(value) => setConfig({...config, objective: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Objectif du modèle" />
            </SelectTrigger>
            <SelectContent>
              {objectives.map(o => (
                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value="prompt" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="systemPrompt">Prompt système</Label>
          <Textarea 
            id="systemPrompt" 
            value={config.systemPrompt || ''} 
            onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
            placeholder="Instructions pour le modèle..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userPrompt">Prompt utilisateur</Label>
          <Textarea 
            id="userPrompt" 
            value={config.userPrompt || ''} 
            onChange={(e) => setConfig({...config, userPrompt: e.target.value})}
            placeholder="Template de prompt avec variables..."
            rows={4}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="parameters" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Température: {config.temperature || 0.7}</Label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={config.temperature || 0.7}
            onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxTokens">Tokens max</Label>
          <Input 
            id="maxTokens" 
            type="number" 
            value={config.maxTokens || 1000} 
            onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderTriggerConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de déclencheur</Label>
        <Select value={config.triggerType || ''} onValueChange={(value) => setConfig({...config, triggerType: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le type" />
          </SelectTrigger>
          <SelectContent>
            {triggerTypes.map(tt => (
              <SelectItem key={tt.id} value={tt.id}>{t(tt.id) || tt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {config.triggerType === 'schedule' && (
        <div className="space-y-2">
          <Label htmlFor="schedule">{t('schedule') || 'Schedule'}</Label>
          <Input 
            id="schedule" 
            value={config.schedule || ''} 
            onChange={(e) => setConfig({...config, schedule: e.target.value})}
            placeholder={t('schedulePlaceholder') || '0 9 * * 1-5 (Mon-Fri at 9am)'}
          />
        </div>
      )}
      
      {config.triggerType === 'webhook' && (
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">{t('webhook') || 'Webhook URL'}</Label>
          <Input 
            id="webhookUrl" 
            value={config.webhookUrl || ''} 
            onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
            placeholder="https://..."
          />
        </div>
      )}
    </div>
  );

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div className="space-y-2">
          <Label>{t('conditionType') || 'Condition type'}</Label>
        <Select value={config.conditionType || ''} onValueChange={(value) => setConfig({...config, conditionType: value})}>
            <SelectTrigger>
            <SelectValue placeholder={t('chooseTemplate')} />
            </SelectTrigger>
          <SelectContent>
            {conditionTypes.map(ct => (
              <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="condition">{t('condition') || 'Condition'}</Label>
        <Textarea 
          id="condition" 
          value={config.condition || ''} 
          onChange={(e) => setConfig({...config, condition: e.target.value})}
          placeholder="Ex: contact.budget > 10000"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="trueAction">{t('trueAction') || 'Action if true'}</Label>
        <Input 
          id="trueAction" 
          value={config.trueAction || ''} 
          onChange={(e) => setConfig({...config, trueAction: e.target.value})}
          placeholder={t('trueActionPlaceholder') || 'Action to perform when condition is true...'}
        />
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="falseAction">{t('falseAction') || 'Action if false'}</Label>
        <Input 
          id="falseAction" 
          value={config.falseAction || ''} 
          onChange={(e) => setConfig({...config, falseAction: e.target.value})}
          placeholder={t('falseActionPlaceholder') || 'Action to perform when condition is false...'}
        />
      </div>
    </div>
  );

  const renderConfiguration = () => {
    if (!nodeData) return null;
    
    const { type } = nodeData;
    
    if (['contact', 'offer', 'sale', 'service-order', 'dispatch'].includes(type)) {
      return renderBusinessProcessConfig();
    }
    
    if (['email', 'email-template', 'email-llm'].includes(type)) {
      return renderEmailConfig();
    }
    
    if (['llm-writer', 'llm-analyzer', 'llm-personalizer', 'ai'].includes(type)) {
      return renderLLMConfig();
    }
    
    if (['trigger', 'webhook', 'scheduled'].includes(type)) {
      return renderTriggerConfig();
    }
    
    if (['condition', 'filter'].includes(type)) {
      return renderConditionConfig();
    }
    
    // Default configuration for other types
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('name') || 'Name'}</Label>
          <Input 
            id="name" 
            value={config.name || nodeData.label} 
            onChange={(e) => setConfig({...config, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('description')}</Label>
          <Textarea 
            id="description" 
            value={config.description || ''} 
            onChange={(e) => setConfig({...config, description: e.target.value})}
            placeholder={t('processDescriptionPlaceholder')}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="workflow-module max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {nodeData?.icon && <nodeData.icon className="h-5 w-5" />}
            {t('configuration')}: {nodeData?.label || t('node')}
          </DialogTitle>
          {/* Short configure hint (if available) */}
          {nodeData && getHelpString('configureDescription') && (
            <p className="text-[12px] text-muted-foreground mt-1">
              {getHelpString('configureDescription')}
            </p>
          )}
        </DialogHeader>
        
        <Separator />
        
        {nodeData && (
          <div className="py-4">
            {/* Prominent full description */}
            <div className="mb-4">
              <p className="text-[13px] text-muted-foreground mb-2">
                {getHelpString('fullDescription') || nodeData.description || ''}
              </p>

              {/* How it works / Examples */}
              <details className="bg-muted/5 p-3 rounded">
                <summary className="cursor-pointer font-medium">
                  {t('howItWorks') || 'How it works'}
                </summary>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  <p>{getHelpString('how') || ''}</p>
                  {(() => {
                    const examples = getHelpExamples();
                    if (Array.isArray(examples)) {
                      return (
                        <ul className="list-disc pl-5 mt-2">
                          {examples.map((ex: any, idx: number) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      );
                    }
                    return null;
                  })()}
                </div>
              </details>

            </div>

            {renderConfiguration()}
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!nodeData}>
            <Save className="h-4 w-4 mr-2" />
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}