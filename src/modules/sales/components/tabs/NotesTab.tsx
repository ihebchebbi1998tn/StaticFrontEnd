import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Sale } from "../../types";
import { toast } from "sonner";

interface NotesTabProps {
  sale: Sale;
}

// Mock notes data - in real app this would come from API
interface Note {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  priority: "low" | "normal" | "high";
  isInternal: boolean;
}

const mockNotes: Note[] = [
  {
    id: "note-1",
    content: "Customer is very satisfied with the completed project. They expressed interest in future upgrades.",
    createdAt: new Date("2024-01-15T10:30:00"),
    createdBy: "user-1",
    createdByName: "John Smith",
    priority: "normal",
    isInternal: false
  },
  {
    id: "note-2", 
    content: "Internal note: All deliverables completed on time. Customer paid invoice promptly. Excellent client for future projects.",
    createdAt: new Date("2024-01-16T14:20:00"),
    createdBy: "user-2",
    createdByName: "Sarah Johnson",
    priority: "high",
    isInternal: true
  },
  {
    id: "note-3",
    content: "Follow-up call completed. Customer requested maintenance schedule and support documentation.",
    createdAt: new Date("2024-01-17T09:15:00"),
    createdBy: "user-1", 
    createdByName: "John Smith",
    priority: "normal",
    isInternal: false
  }
];

export function NotesTab({ sale }: NotesTabProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date(),
      createdBy: "current-user",
      createdByName: "Current User",
      priority,
      isInternal
    };

    setNotes([note, ...notes]);
    setNewNote("");
    toast.success("Note added successfully");
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setEditContent(note.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, content: editContent }
        : note
    ));
    setEditingNote(null);
    setEditContent("");
    toast.success("Note updated successfully");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast.success("Note deleted successfully");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isInternal"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border border-input"
              />
              <label htmlFor="isInternal" className="text-sm font-medium">
                Internal Note
              </label>
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "normal" | "high")}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
            </select>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes & Comments ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedNotes.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notes added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border ${
                    note.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {note.createdByName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{note.createdByName}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(note.createdAt), 'MMM dd, yyyy at HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      {note.isInternal && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Internal
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {note.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}