import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Offer } from "../../types";
import { toast } from "sonner";

interface NotesTabProps {
  offer: Offer;
}

// Mock notes data - in real app this would come from API
const mockNotes = [
  {
    id: "note-1",
    content: "Customer is very interested in the solar panel installation. They mentioned they want to start as soon as possible.",
    createdAt: new Date("2024-01-15T10:30:00"),
    createdBy: "user-1",
    createdByName: "John Smith",
    priority: "normal" as const,
    isInternal: false
  },
  {
    id: "note-2", 
    content: "Internal note: Check availability of installation team for next month. Customer prefers morning installations.",
    createdAt: new Date("2024-01-16T14:20:00"),
    createdBy: "user-2",
    createdByName: "Sarah Johnson",
    priority: "high" as const,
    isInternal: true
  },
  {
    id: "note-3",
    content: "Follow-up call scheduled for Thursday. Customer wants to discuss financing options.",
    createdAt: new Date("2024-01-17T09:15:00"),
    createdBy: "user-1", 
    createdByName: "John Smith",
    priority: "normal" as const,
    isInternal: false
  }
];

export function NotesTab({ offer }: NotesTabProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteInternal, setNewNoteInternal] = useState(false);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error("Please enter note content");
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      createdAt: new Date(),
      createdBy: "current-user",
      createdByName: "Current User",
      priority: "normal" as const,
      isInternal: newNoteInternal
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteContent("");
    setNewNoteInternal(false);
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success("Note deleted");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes ({notes.length})
          </CardTitle>
          <Button 
            onClick={() => setIsAddingNote(true)}
            className="gap-2"
            disabled={isAddingNote}
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        {isAddingNote && (
          <Card className="border-dashed border-primary/30">
            <CardContent className="pt-4 space-y-4">
              <Textarea
                placeholder="Enter your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newNoteInternal}
                    onChange={(e) => setNewNoteInternal(e.target.checked)}
                    className="rounded"
                  />
                  Internal note (not visible to customer)
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNoteContent("");
                      setNewNoteInternal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddNote}>
                    Save Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notes added yet</p>
            <p className="text-sm">Add your first note to track important information about this offer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className={`transition-all duration-200 ${note.isInternal ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20' : 'hover:shadow-md'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {note.createdByName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm">
                            {note.createdByName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(note.createdAt, 'MMM d, yyyy • HH:mm')}
                          </span>
                          {note.isInternal && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                              Internal
                            </Badge>
                          )}
                          <Badge className={`${getPriorityColor(note.priority)} text-xs border`}>
                            {note.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}