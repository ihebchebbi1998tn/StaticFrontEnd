import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, AlertCircle } from 'lucide-react';
import { LookupTable } from '../components/LookupTable';
import { 
  useTaskStatuses, 
  useEventTypes, 
  useServiceCategories, 
  usePriorities, 
  useArticleCategories,
  useCurrencies 
} from '../hooks/useLookups';

export default function LookupsPage() {
  const [activeTab, setActiveTab] = useState('task-statuses');

  // Hook calls
  const taskStatuses = useTaskStatuses();
  const eventTypes = useEventTypes();
  const serviceCategories = useServiceCategories();
  const priorities = usePriorities();
  const articleCategories = useArticleCategories();
  const currencies = useCurrencies();

  const lookupTypes = [
    {
      id: 'task-statuses',
      label: 'Task Statuses',
      description: 'Manage task workflow statuses',
      hook: taskStatuses,
      typeFields: { isCompleted: true }
    },
    {
      id: 'event-types',
      label: 'Event Types',
      description: 'Manage calendar event categories',
      hook: eventTypes,
      typeFields: { defaultDuration: true }
    },
    {
      id: 'service-categories',
      label: 'Service Categories',
      description: 'Manage service classifications',
      hook: serviceCategories,
      typeFields: {}
    },
    {
      id: 'priorities',
      label: 'Priorities',
      description: 'Manage priority levels',
      hook: priorities,
      typeFields: { level: true }
    },
    {
      id: 'article-categories',
      label: 'Article Categories',
      description: 'Manage article classifications',
      hook: articleCategories,
      typeFields: {}
    }
  ];

  const refreshAll = () => {
    lookupTypes.forEach(type => type.hook.refetch());
    currencies.refetch();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lookups Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system lookup tables and reference data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshAll} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Badge variant="outline" className="flex items-center">
            <Database className="h-3 w-3 mr-1" />
            API Connected
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {lookupTypes.map(type => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
        </TabsList>

        {lookupTypes.map(type => (
          <TabsContent key={type.id} value={type.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {type.label}
                  <Badge variant={type.hook.isLoading ? "secondary" : "default"}>
                    {type.hook.items.length} items
                  </Badge>
                </CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {type.hook.error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                    <span className="text-destructive text-sm">{type.hook.error}</span>
                  </div>
                )}
                <LookupTable
                  items={type.hook.items}
                  isLoading={type.hook.isLoading}
                  onCreate={type.hook.createItem}
                  onUpdate={type.hook.updateItem}
                  onDelete={type.hook.deleteItem}
                  showTypeFields={type.typeFields}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="currencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Currencies
                <Badge variant={currencies.isLoading ? "secondary" : "default"}>
                  {currencies.currencies.length} currencies
                </Badge>
              </CardTitle>
              <CardDescription>Manage system currencies and exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              {currencies.error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                  <span className="text-destructive text-sm">{currencies.error}</span>
                </div>
              )}
              
              {/* Currency Table - Custom implementation for currencies */}
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <Button onClick={() => console.log('TODO: Add currency creation')}>
                    Add Currency
                  </Button>
                </div>
                {currencies.isLoading ? (
                  <div className="p-8 text-center">Loading currencies...</div>
                ) : (
                  <div className="p-4">
                    <div className="grid gap-4">
                      {currencies.currencies.map(currency => (
                        <div key={currency.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{currency.name} ({currency.code})</div>
                            <div className="text-sm text-muted-foreground">{currency.symbol}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {currency.isDefault && (
                              <Badge>Default</Badge>
                            )}
                            <Badge variant={currency.isActive ? "default" : "secondary"}>
                              {currency.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => currencies.deleteCurrency(currency.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}