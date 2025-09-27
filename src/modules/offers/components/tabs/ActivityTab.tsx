import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, History, MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Offer } from "../../types";

interface ActivityTabProps {
  offer: Offer;
}

// Mock activity data - in real app this would come from API
const mockActivity = [
  {
    id: "act-1",
    type: "history",
    action: "Status Changed",
    details: "Offer status changed from 'draft' to 'sent'",
    timestamp: new Date("2024-01-16T10:30:00"),
    userId: "user-1",
    userName: "John Smith",
    oldValue: "draft",
    newValue: "sent",
    category: "status"
  },
  {
    id: "act-2", 
    type: "communication",
    method: "email",
    direction: "outbound",
    fromName: "John Smith",
    toName: "Jane Doe",
    subject: "Solar Panel Installation Offer",
    content: "Dear Jane, Please find attached our comprehensive offer for your solar panel installation project. We're excited to work with you on this sustainable energy solution.",
    timestamp: new Date("2024-01-16T10:45:00"),
    status: "sent"
  },
  {
    id: "act-3",
    type: "history", 
    action: "Offer Created",
    details: "New offer created for Solar Panel Installation Package",
    timestamp: new Date("2024-01-15T14:20:00"),
    userId: "user-1",
    userName: "John Smith",
    category: "creation"
  },
  {
    id: "act-4",
    type: "communication",
    method: "phone",
    direction: "inbound", 
    fromName: "Jane Doe",
    toName: "John Smith",
    subject: "Follow-up call about offer",
    content: "Customer called to ask about installation timeline and financing options. Very interested in proceeding.",
    timestamp: new Date("2024-01-17T09:15:00"),
    status: "completed"
  },
  {
    id: "act-5",
    type: "history",
    action: "Amount Updated",
    details: "Offer amount updated due to additional equipment requirements",
    timestamp: new Date("2024-01-17T11:30:00"),
    userId: "user-2",
    userName: "Sarah Johnson",
    oldValue: "15000",
    newValue: "16500",
    category: "financial"
  }
];

export function ActivityTab({ offer }: ActivityTabProps) {
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
          
          <div className="relative">
            <select 
              className="border rounded px-3 py-2 pr-10 appearance-none bg-background text-foreground text-sm" 
              value={activityFilter} 
              onChange={e => setActivityFilter(e.target.value as 'all' | 'history' | 'communications')}
            >
              <option value="all">All Activity</option>
              <option value="history">History Only</option>
              <option value="communications">Communications Only</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {activityFilter === 'all' && 'No activity recorded yet'}
              {activityFilter === 'history' && 'No history entries found'}
              {activityFilter === 'communications' && 'No communications found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivity.map((item) => {
              const colors = getActivityColor(item);
              
              return (
                <Card key={item.id} className={`${colors.border} ${colors.bg} transition-all duration-200 hover:shadow-md`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0`}>
                        {getActivityIcon(item)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {item.type === 'history' ? item.action : item.subject}
                            </span>
                            <Badge className={`${colors.badge} text-xs border transition-colors`}>
                              {item.type === 'history' ? (
                                <>
                                  <History className="h-3 w-3 mr-1" />
                                  System Log
                                </>
                              ) : (
                                <>
                                  {getCommunicationIcon(item.method)}
                                  <span className="ml-1 capitalize">{item.method}</span>
                                </>
                              )}
                            </Badge>
                          </div>
                          
                          <span className="text-sm text-muted-foreground">
                            {format(item.timestamp, 'MMM d, yyyy • HH:mm')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground leading-relaxed">
                          {item.type === 'history' ? item.details : item.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {item.type === 'history' 
                              ? `by ${item.userName}` 
                              : `${item.fromName} → ${item.toName}`
                            }
                          </span>
                          
                          {item.type === 'communication' && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                item.status === 'sent' || item.status === 'completed'
                                  ? 'text-green-700 border-green-200' 
                                  : 'text-yellow-700 border-yellow-200'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {item.type === 'history' 
                            ? item.userName?.split(' ').map(n => n[0]).join('').toUpperCase()
                            : item.fromName?.split(' ').map(n => n[0]).join('').toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}