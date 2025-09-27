import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import countries from '@/data/mock/countries.json';
import { CreateServiceOrderData } from "../types";
import CustomerSearch from "./CustomerSearch";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  type: string;
}

interface Props {
  formData: CreateServiceOrderData;
  updateCustomer: (field: string, value: string) => void;
  updateCustomerAddress: (field: string, value: string) => void;
}

export default function CustomerDetailsForm({ formData, updateCustomer, updateCustomerAddress }: Props) {
  const { t } = useTranslation('service_orders');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    
    // Auto-populate customer data
    updateCustomer('company', customer.company);
    updateCustomer('contactPerson', customer.name);
    updateCustomer('email', customer.email);
    updateCustomer('phone', customer.phone);
  };

  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customer_details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Search */}
        <CustomerSearch 
          onSelect={handleCustomerSelect}
          selectedCustomer={selectedCustomer}
        />
        
        {selectedCustomer && (
          <div className="text-sm text-muted-foreground">
            Customer information has been selected. Customer details are now linked to this service order.
          </div>
        )}
      </CardContent>
    </Card>
  );
}