import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import offerStatuses from '@/data/mock/offer-statuses.json';

export type OfferStatus = "pending" | "negotiation" | "won" | "lost";

export interface NewOfferInput {
  title: string;
  amount: number;
  status: OfferStatus;
}

interface AddOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (offer: NewOfferInput) => void;
}

export default function AddOfferModal({ open, onOpenChange, onAdd }: AddOfferModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<OfferStatus>("pending");

  const reset = () => {
    setTitle("");
    setAmount("");
    setStatus("pending");
  };

  const handleSubmit = () => {
    const amt = Number(amount);
    if (!title.trim() || isNaN(amt) || amt <= 0) return;
    onAdd({ title: title.trim(), amount: amt, status });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Offer (TND)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer-title">Title</Label>
            <Input id="offer-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Enterprise Package" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-amount">Amount (TND)</Label>
            <Input id="offer-amount" type="number" min="0" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 150000" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: OfferStatus) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {offerStatuses.map(s => (
                  <SelectItem key={s.id} value={s.id as OfferStatus}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Offer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
