import { useState, useEffect } from "react";
import { Search, User, Building2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import fieldCustomers from '@/data/mock/fieldCustomers.json';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  type: string;
  tags?: string[];
}

interface Props {
  onSelect: (customer: Customer) => void;
  selectedCustomer?: Customer | null;
}

export default function CustomerSearch({ onSelect, selectedCustomer }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const customers = fieldCustomers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCustomers(customers);
  }, [searchTerm]);

  // Show all customers initially
  useEffect(() => {
    setFilteredCustomers(fieldCustomers);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Customer': 'bg-success/10 text-success border-success/20',
      'Lead': 'bg-warning/10 text-warning border-warning/20',
      'Prospect': 'bg-primary/10 text-primary border-primary/20'
    };
    return colors[status] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <div className="space-y-4">
      {selectedCustomer && (
        <div className="p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(selectedCustomer.status)}>
                  {selectedCustomer.status}
                </Badge>
                {selectedCustomer.type === 'company' && (
                  <Badge variant="outline">Company</Badge>
                )}
              </div>
              <h4 className="font-medium">{selectedCustomer.name}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {selectedCustomer.company}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {selectedCustomer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selectedCustomer.phone}
                </span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => onSelect(selectedCustomer)}
            >
              Change
            </Button>
          </div>
        </div>
      )}

      {!selectedCustomer && (
        <>
          <div className="space-y-2">
            <Label>Search Existing Customers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No customers found matching your search.
              </p>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(customer)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{customer.name}</span>
                        <Badge variant="outline" className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        {customer.type === 'company' && (
                          <Badge variant="outline" className="text-xs">
                            Company
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {customer.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                      </div>
                      {customer.tags && customer.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {customer.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {customer.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{customer.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}