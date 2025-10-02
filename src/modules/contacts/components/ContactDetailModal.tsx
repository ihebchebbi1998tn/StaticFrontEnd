import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2, User, Mail, Phone, MapPin, Calendar, Star,
  Edit, Trash2, DollarSign, CheckSquare,
  FileText, PlusCircle
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  type: string;
  tags: string[];
  address: string;
  lastContact: string;
  notes: string;
  avatar: string | null;
  favorite: boolean;
  keyUsers?: string[];
}

interface ContactDetailModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDetailModal({ contact, isOpen, onClose }: ContactDetailModalProps) {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  const { toast } = useToast();
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(`contact_notes_${contact.id}`) || contact.notes || "";
    } catch {
      return contact.notes || "";
    }
  });

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(`contact_notes_${contact.id}`, notes);
    } catch {
      // ignore storage errors
    }
    toast({ title: "Notes saved", description: "Your note has been saved." });
  };

  if (!contact) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Customer': return 'status-success';
      case 'Lead': return 'status-warning';
      case 'Prospect': return 'status-info';
      default: return 'status-info';
    }
  };

  // Mock data for related information
  const mockTodos = [
    { id: 1, title: "Follow up on contract proposal", status: "pending", dueDate: "2024-02-15", priority: "high" },
    { id: 2, title: "Schedule product demo", status: "completed", dueDate: "2024-01-20", priority: "medium" },
    { id: 3, title: "Send pricing information", status: "pending", dueDate: "2024-02-10", priority: "low" },
  ];

  const mockSalesOffers = [
    { id: 1, title: "Enterprise Package Q1 2024", amount: "150,000 TND", status: "negotiating" },
    { id: 2, title: "Professional Plan Upgrade", amount: "25,000 TND", status: "pending" },
    { id: 3, title: "Custom Integration Service", amount: "45,000 TND", status: "won" },
  ];


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {contact.type === 'company' ? <Building2 className="h-8 w-8" /> : getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {contact.name}
                  {contact.favorite && <Star className="h-5 w-5 text-warning fill-warning" />}
                </DialogTitle>
                <DialogDescription className="text-lg mt-1">
                  {contact.position} at {contact.company}
                </DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getStatusColor(contact.status)}`}>{contact.status}</Badge>
                  <Badge variant="outline">{contact.type}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="todos">Tasks</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="documents">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{contact.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last contact: {contact.lastContact}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Details */}
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Company Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                        <p className="text-sm font-semibold mt-1">{contact.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Position</label>
                        <p className="text-sm font-semibold mt-1">{contact.position}</p>
                      </div>
                      {contact.type === 'company' && contact.keyUsers && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Key Users</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contact.keyUsers.map((user, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {user}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Tags & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {contact.tags?.map((tag: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {typeof tag === 'string' ? tag : tag.name}
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add Tag
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{notes}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="todos" className="mt-6">
                <Card className="shadow-card border-0">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      Related Tasks
                    </CardTitle>
                    <Button size="sm" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add Task
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockTodos.map((todo) => (
                        <div key={todo.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{todo.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-muted-foreground">Due: {todo.dueDate}</span>
                              <Badge 
                                variant={todo.status === 'completed' ? 'default' : 'outline'} 
                                className="text-xs"
                              >
                                {todo.status}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${todo.priority === 'high' ? 'text-destructive' : todo.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'}`}
                              >
                                {todo.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales" className="mt-6">
                <Card className="shadow-card border-0">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Sales Opportunities
                    </CardTitle>
                    <Button size="sm" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      New Offer
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockSalesOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{offer.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm font-semibold text-primary">{offer.amount}</span>
                              <Badge 
                                variant={offer.status === 'won' ? 'default' : 'outline'} 
                                className="text-xs"
                              >
                                {offer.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground"></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card className="shadow-card border-0">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Notes
                    </CardTitle>
                    <Button size="sm" className="gap-2" onClick={handleSaveNotes}>
                      Save
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write notes about this contact..."
                      className="min-h-[160px]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card className="shadow-card border-0">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Documents & Files
                    </CardTitle>
                    <Button size="sm" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Upload File
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload contracts, proposals, or other related files
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}