import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, History, MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Sale } from "../../types";

interface ActivityTabProps {
  sale: Sale;
}

// Mock activity data - in real app this would come from API
const mockActivity = [
  {
    id: "act-1",
    type: "history",
    action: "Sale Completed",
    details: "Sale successfully completed and invoice sent to customer",
    timestamp: new Date("2024-01-20T16:30:00"),
    userId: "user-1",
    userName: "John Smith",
    oldValue: "accepted",
    newValue: "completed",
    category: "status"
  },
  {
    id: "act-2", 
    type: "communication",
    method: "email",
    direction: "outbound",
    fromName: "John Smith",
    toName: "TechCorp Inc.",
    subject: "Project Completion Confirmation",
    content: "Dear Customer, We're pleased to inform you that your project has been completed successfully. All deliverables have been implemented as per the agreed specifications.",
    timestamp: new Date("2024-01-20T14:45:00"),
    status: "sent"
  },
  {
    id: "act-3",
    type: "history", 
    action: "Payment Received",
    details: "Full payment received for completed project",
    timestamp: new Date("2024-01-18T11:20:00"),
    userId: "user-2",
    userName: "Sarah Johnson",
    category: "financial"
  },
  {
    id: "act-4",
    type: "communication",
    method: "phone",
    direction: "inbound", 
    fromName: "TechCorp Inc.",
    toName: "John Smith",
    subject: "Project satisfaction call",
    content: "Customer called to express satisfaction with the completed work. Requested information about maintenance services.",
    timestamp: new Date("2024-01-17T15:30:00"),
    status: "completed"
  },
  {
    id: "act-5",
    type: "history",
    action: "Sale Created",
    details: "Sale converted from accepted offer OFFER-001",
    timestamp: new Date("2024-01-15T10:30:00"),
    userId: "user-1",
    userName: "John Smith",
    category: "creation"
  }
];

export function ActivityTab({ sale }: ActivityTabProps) {
  const { t } = useTranslation();
  const [activityFilter, setActivityFilter] = useState<'all' | 'history' | 'communications'>('all');

  const getCommunicationIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (item: any) => {
    if (item.type === 'history') {
      return <History className="h-4 w-4 text-primary" />;
    } else {
      return getCommunicationIcon(item.method);
    }
  };

  const getActivityColor = (item: any) => {
    if (item.type === 'history') {
      return {
        border: 'border-primary/20',
        bg: 'bg-primary/5',
        badge: 'bg-primary/10 text-primary border-primary/20'
      };
    } else {
      return {
        border: 'border-green-500/20', 
        bg: 'bg-green-500/5',
        badge: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      };
    }
  };

  const filteredActivity = mockActivity
    .filter(item => {
      if (activityFilter === 'all') return true;
      if (activityFilter === 'history') return item.type === 'history';
      if (activityFilter === 'communications') return item.type === 'communication';
      return false;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Activity & Communications ({filteredActivity.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as 'all' | 'history' | 'communications')}
              className="px-3 py-1 border rounded-md text-sm bg-background"
            >
              <option value="all">All Activity</option>
              <option value="history">History Only</option>
              <option value="communications">Communications Only</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredActivity.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivity.map((item, index) => {
              const colors = getActivityColor(item);
              return (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  {index < filteredActivity.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-8 bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 rounded-full bg-background border shadow-sm">
                      {getActivityIcon(item)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {item.type === 'history' ? item.action : `${item.method.toUpperCase()} ${item.direction}`}
                          </h4>
                          <Badge variant="outline" className={colors.badge}>
                            {item.type === 'history' ? 'System' : 'Communication'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>

                      {item.type === 'communication' && (
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">From:</span> {item.fromName} →{' '}
                            <span className="font-medium">To:</span> {item.toName}
                          </div>
                          {item.subject && (
                            <div className="text-sm">
                              <span className="font-medium">Subject:</span> {item.subject}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-foreground">
                        {item.details || item.content}
                      </div>

                      {item.type === 'history' && item.oldValue && item.newValue && (
                        <div className="text-xs text-muted-foreground">
                          Changed from <Badge variant="outline" className="mx-1">{item.oldValue}</Badge> 
                          to <Badge variant="outline" className="mx-1">{item.newValue}</Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {item.userName?.split(' ').map(n => n[0]).join('') || 'SY'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{item.userName || 'System'}</span>
                        {item.status && (
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}