import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import FileUploader from './FileUploader';
import { toast } from '../../../components/ui/sonner';
import { useSupportViewModel } from '../viewmodel/supportViewModel';

const modules = ['Dashboard', 'Sales', 'Inventory', 'Field', 'Settings'];
const categories = ['Bug', 'Feature Request', 'Billing', 'Account', 'Other'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

type Props = {
  onCreated?: (id: string) => void
}

export default function CreateTicketModal({ onCreated }: Props) {
  const { createTicket } = useSupportViewModel();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [module, setModule] = useState(modules[0]);
  const [category, setCategory] = useState(categories[0]);
  const [urgency, setUrgency] = useState(urgencies[1]);
  const [errorDetails, setErrorDetails] = useState('');
  const [links, setLinks] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (files: File[]) => setAttachments(files);

  const resetForm = () => {
    setTitle('');
    setShortDesc('');
    setModule(modules[0]);
    setCategory(categories[0]);
    setUrgency(urgencies[1]);
    setErrorDetails('');
    setLinks('');
    setAttachments([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title || !shortDesc) return;
    setSubmitting(true);

    const ticket = {
      id: `TCK-${Math.floor(Math.random() * 100000)}`,
      subject: title,
      shortDesc,
      module,
      category,
      urgency,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0,10),
      updatedAt: new Date().toISOString().slice(0,10),
      messages: [ { from: 'user' as const, text: shortDesc + (errorDetails ? '\n\nDetails:\n' + errorDetails : ''), date: new Date().toISOString().slice(0,10) } ],
      attachments,
      links: links.split(',').map(l => l.trim()).filter(Boolean)
    };

    try {
  const created = await createTicket(ticket as any);
      setOpen(false);
      resetForm();
      toast.success('Ticket created — our team will review it shortly');
      if (onCreated && created && (created as any).id) onCreated((created as any).id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Create New Ticket</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Request</DialogTitle>
          <DialogDescription>Provide a short title and enough details so the support team can act faster.</DialogDescription>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-3 mt-2" onSubmit={handleSubmit}>
          <Input placeholder="Short title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Input placeholder="One-line summary" value={shortDesc} onChange={e => setShortDesc(e.target.value)} required />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select className="border rounded p-2 bg-background" value={module} onChange={e => setModule(e.target.value)}>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="border rounded p-2 bg-background" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded p-2 bg-background" value={urgency} onChange={e => setUrgency(e.target.value)}>
              {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <textarea className="border rounded p-2 min-h-[100px] bg-background text-foreground" placeholder="Error details, steps to reproduce, logs..." value={errorDetails} onChange={e => setErrorDetails(e.target.value)} />

          <Input placeholder="Related links (comma separated)" value={links} onChange={e => setLinks(e.target.value)} />

          <FileUploader files={attachments} setFiles={handleFileChange} />

          <DialogFooter>
            <Button type="submit" disabled={submitting}>Create Request</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
