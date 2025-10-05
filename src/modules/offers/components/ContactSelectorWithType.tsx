import { useState } from "react";
import { Search, Plus, User, Building2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock contacts data
import contactsData from "@/data/mock/contacts.json";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  type?: string;
}

interface ContactSelectorWithTypeProps {
  onContactSelect: (contact: Contact) => void;
  selectedContact: Contact | null;
}

export function ContactSelectorWithType({ onContactSelect, selectedContact }: ContactSelectorWithTypeProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<'person' | 'company' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddData, setQuickAddData] = useState({
    name: "",
    phone: "",
    type: "individual" as "individual" | "company",
    email: "",
    company: ""
  });

  const filteredContacts = contactsData.filter(contact => {
    const matchesType = !selectedType || contact.type === selectedType;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSelectContact = (contact: any) => {
    onContactSelect({
      id: contact.id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.company,
      company: contact.company,
      type: contact.type
    });
  };

  const handleQuickAdd = () => {
    if (!quickAddData.name || !quickAddData.phone) return;
    
    const contact: Contact = {
      id: `quick-${Date.now()}`,
      name: quickAddData.name,
      phone: quickAddData.phone,
      type: quickAddData.type,
      email: quickAddData.email || "",
      company: quickAddData.company || ""
    };
    
    onContactSelect(contact);
    setQuickAddData({ name: "", phone: "", type: "individual", email: "", company: "" });
    setShowQuickAdd(false);
  };

  // Selected contact view
  if (selectedContact && selectedContact.name) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Selected Contact</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onContactSelect({ id: "", name: "", email: "", phone: "", address: "" });
              setSelectedType(null);
              setShowQuickAdd(false);
            }}
          >
            Change Contact
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {selectedContact.type === 'company' ? (
                  <Building2 className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedContact.name}</h3>
                {selectedContact.company && (
                  <p className="text-sm text-muted-foreground">{selectedContact.company}</p>
                )}
                {selectedContact.email && (
                  <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                )}
                {selectedContact.phone && (
                  <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quick Add view
  if (showQuickAdd) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <Label className="text-lg font-semibold">Quick Add Contact</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuickAdd(false)}
          >
            Cancel
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quick-name">Full Name *</Label>
            <Input
              id="quick-name"
              value={quickAddData.name}
              onChange={(e) => setQuickAddData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-phone">Phone Number *</Label>
            <Input
              id="quick-phone"
              value={quickAddData.phone}
              onChange={(e) => setQuickAddData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 234 567 8900"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-type">Contact Type *</Label>
            <Select 
              value={quickAddData.type} 
              onValueChange={(value: "individual" | "company") => setQuickAddData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Person</span>
                  </div>
                </SelectItem>
                <SelectItem value="company">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Company</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-email">Email (Optional)</Label>
            <Input
              id="quick-email"
              type="email"
              value={quickAddData.email}
              onChange={(e) => setQuickAddData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@company.com"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="quick-company">Company Name (Optional)</Label>
            <Input
              id="quick-company"
              value={quickAddData.company}
              onChange={(e) => setQuickAddData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Acme Corp"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <p className="text-sm text-muted-foreground">
            You can add more details later in the Contacts page
          </p>
          <Button 
            onClick={handleQuickAdd} 
            disabled={!quickAddData.name || !quickAddData.phone}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>
    );
  }

  // Type selection view
  if (!selectedType) {
    return (
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Select Contact</Label>
        
        <Button 
          variant="outline" 
          className="w-full gap-2 h-10"
          onClick={() => setShowQuickAdd(true)}
        >
          <Zap className="h-4 w-4" />
          Quick Add Contact
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or select from existing</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="cursor-pointer hover:border-primary transition-colors group"
            onClick={() => setSelectedType('person')}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Person</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-primary transition-colors group"
            onClick={() => setSelectedType('company')}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Company</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Contact list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedType === 'person' ? (
            <>
              <User className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold">Select Person</Label>
            </>
          ) : (
            <>
              <Building2 className="h-5 w-5 text-primary" />
              <Label className="text-lg font-semibold">Select Company</Label>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedType(null);
              setSearchTerm("");
            }}
          >
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuickAdd(true)}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="max-h-64 overflow-y-auto">
        <CardContent className="p-0">
          {filteredContacts.length > 0 ? (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {contact.type === 'company' ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{contact.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {contact.status}
                        </Badge>
                      </div>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                      )}
                      {contact.email && (
                        <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <div className="mb-4">
                <User className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="mb-2">No contacts found</p>
              <Button
                variant="link"
                onClick={() => setShowQuickAdd(true)}
                className="p-0 h-auto gap-2"
              >
                <Plus className="h-4 w-4" />
                Quick add instead
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
