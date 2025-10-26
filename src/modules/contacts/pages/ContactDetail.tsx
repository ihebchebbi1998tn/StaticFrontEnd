import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import services
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddNoteModal from "../components/AddNoteModal";
import { NewOfferInput } from "../components/AddOfferModal";
import AddTagModal from "../components/AddTagModal";
import { ContactProjectsManager } from "../components/ContactProjectsManager";
import { ContactTasksManager } from "../components/ContactTasksManager";
import { ContactSales } from "../components/ContactSales";
import { TrendingUp, FileText, PlusCircle } from "lucide-react";
import { ContactDetailHeader } from "../components/detail/ContactDetailHeader";
import { ContactOverviewCards } from "../components/detail/ContactOverviewCards";
import { ContactNotesSection } from "../components/detail/ContactNotesSection";
import { useContactDetail } from "../hooks/useContactDetail";
import { getInitials, getStatusColor } from "../utils/presentation";
import { contactsApi, contactNotesApi } from '@/services/contactsApi';
import { useToast } from '@/hooks/use-toast';


export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t: _t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // IMPORTANT: call hooks unconditionally at top of component to preserve hook order
  // Move useContactDetail here so it's invoked on every render (even while loading)
  const { 
  notes, setNotes, isAddNoteOpen, setIsAddNoteOpen, handleAddNote,
  tags, setTags, isAddTagOpen, setIsAddTagOpen, handleAddTag,
  offers: _offers, setOffers, isAddOfferOpen, setIsAddOfferOpen,
  isEditStatusOpen, setIsEditStatusOpen, editingOffer, setEditingOffer,
  openEditStatus, handleUpdateOfferStatus,
  } = useContactDetail(contact, String(id));

  // Load contact data from API
  useEffect(() => {
    if (!id) return;
    
    const loadContact = async () => {
      try {
        // pass id through as string - mock API handles string or numeric ids
        const contactData = await contactsApi.getContactById(id as unknown as number | string);
        setContact(contactData);
      } catch (error) {
        toast({
          title: "Failed to load contact",
          description: "Could not load contact details. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard/contacts');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id, navigate, toast]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contact...</p>
        </div>
      </div>
    );
  }

  // Show error if no contact
  if (!contact) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Contact not found</p>
          <Button onClick={() => navigate('/dashboard/contacts')}>Back to Contacts</Button>
        </div>
      </div>
    );
  }

  

  const _setNotes = setNotes; const _setTags = setTags; const _isAddOfferOpen = isAddOfferOpen; const _setIsAddOfferOpen = setIsAddOfferOpen; const _isEditStatusOpen = isEditStatusOpen; const _setIsEditStatusOpen = setIsEditStatusOpen; const _editingOffer = editingOffer; const _setEditingOffer = setEditingOffer; const _openEditStatus = openEditStatus; const _handleUpdateOfferStatus = handleUpdateOfferStatus;

  const _handleAddOffer = (input: NewOfferInput) => {
    const newOffer = {
      id: String(Date.now()),
      title: input.title,
      amount: input.amount,
      status: input.status,
      createdAt: new Date().toISOString(),
    };
    setOffers((prev: any) => [newOffer, ...prev]);
  };
 
 // Mock data for related information
 const _mockTodos = [
   { id: 1, title: "Follow up on contract proposal", status: "pending", dueDate: "2024-02-15", priority: "high" },
   { id: 2, title: "Schedule product demo", status: "completed", dueDate: "2024-01-20", priority: "medium" },
   { id: 3, title: "Send pricing information", status: "pending", dueDate: "2024-02-10", priority: "low" },
 ];


  return (
    <div className="min-h-screen bg-background">
      <ContactDetailHeader
        contact={contact}
        onBack={() => navigate('/dashboard/contacts')}
        getInitials={getInitials}
        getStatusColor={getStatusColor}
      />

      {/* Content */}
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Responsive Tabs - Scrollable on mobile, grid on desktop */}
          <div className="border-b border-border mb-6">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent md:grid md:grid-cols-3 lg:grid-cols-6 md:w-full">
              <TabsTrigger value="overview" className="whitespace-nowrap px-3 py-2 text-sm">Overview</TabsTrigger>
              <TabsTrigger value="projects" className="whitespace-nowrap px-3 py-2 text-sm">Projects</TabsTrigger>
              <TabsTrigger value="todos" className="whitespace-nowrap px-3 py-2 text-sm">Tasks</TabsTrigger>
              <TabsTrigger value="sales" className="whitespace-nowrap px-3 py-2 text-sm">Sales</TabsTrigger>
              <TabsTrigger value="notes" className="whitespace-nowrap px-3 py-2 text-sm">Notes</TabsTrigger>
              <TabsTrigger value="documents" className="whitespace-nowrap px-3 py-2 text-sm">Files</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-4 sm:space-y-6">
            <ContactOverviewCards contact={contact} tags={tags} onAddTag={() => setIsAddTagOpen(true)} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ContactNotesSection notes={notes} />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <ContactProjectsManager 
              contactId={id!} 
              contactName={contact.name}
            />
          </TabsContent>

          <TabsContent value="todos" className="mt-0">
            <ContactTasksManager 
              contactId={id!} 
              contactName={contact.name}
            />
          </TabsContent>

          <TabsContent value="sales" className="mt-0">
            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Sales Pipeline
                </CardTitle>
                <Button size="sm" className="gap-2 w-full sm:w-auto" onClick={() => navigate(`/dashboard/sales/add?contactId=${id}`)}>
                  <PlusCircle className="h-4 w-4" />
                  Create Sale
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <ContactSales contactId={id!} contactName={contact.name} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes
                </CardTitle>
                <Button size="sm" className="gap-2 w-full sm:w-auto" onClick={() => setIsAddNoteOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                  Add Note
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {notes.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">No notes yet. Click "Add Note" to get started.</p>
                    </div>
                  )}
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <AddNoteModal open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen} onAdd={handleAddNote} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents & Files
                </CardTitle>
                <Button size="sm" className="gap-2 w-full sm:w-auto">
                  <PlusCircle className="h-4 w-4" />
                  Upload File
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
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
        <AddTagModal
          open={isAddTagOpen}
          onOpenChange={setIsAddTagOpen}
          onAdd={handleAddTag}
        />
      </div>
    </div>
  );
}