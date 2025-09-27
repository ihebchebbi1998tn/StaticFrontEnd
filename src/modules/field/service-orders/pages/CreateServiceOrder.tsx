import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateServiceOrderData } from "../types";
import LinkedRecordSearch from "../components/LinkedRecordSearch";
import CustomerDetailsForm from "../components/CustomerDetailsForm";
import RepairDetailsForm from "../components/RepairDetailsForm";
import TechnicianAssignment from "../components/TechnicianAssignment";
import InstallationAssignment from "../components/InstallationAssignment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CreateServiceOrder() {
  const { t } = useTranslation('service_orders');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateServiceOrderData>({
    customer: {
      id: "",
      company: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        longitude: 0,
        latitude: 0,
        hasLocation: 0
      }
    },
    repair: {
      description: "",
      location: "",
      urgencyLevel: "medium",
      promisedRepairDate: undefined
    },
    priority: "medium",
    assignedTechnicians: [],
    offerId: "",
    installations: [] // Added required installations field
  });

  const [promisedDate, setPromisedDate] = useState<Date>();
  const [linkedRecord, setLinkedRecord] = useState<{ 
    record: any; 
    type: 'offer' | 'sale' 
  } | null>(null);
  const [assignedInstallations, setAssignedInstallations] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the service order
    const newServiceOrder = {
      ...formData,
      repair: {
        ...formData.repair,
        promisedRepairDate: promisedDate
      },
      installations: assignedInstallations, // Use the assignedInstallations state
      linkedRecord
    };

    console.log("Creating service order:", newServiceOrder);
    
    // Navigate back to service orders list
    navigate("/dashboard/field/service-orders");
  };

  const updateAssignedTechnicians = (technicianIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      assignedTechnicians: technicianIds
    }));
  };

  const handleLinkedRecordSelect = (record: any, type: 'offer' | 'sale') => {
    setLinkedRecord({ record, type });
    
    // Auto-populate customer data from linked record
    if (record.contactName || record.contactCompany) {
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          company: record.contactCompany || prev.customer.company,
          contactPerson: record.contactName || prev.customer.contactPerson,
          email: record.contactEmail || prev.customer.email,
          phone: record.contactPhone || prev.customer.phone,
          address: record.contactAddress ? {
            street: record.contactAddress.split(',')[0]?.trim() || prev.customer.address.street,
            city: prev.customer.address.city,
            state: prev.customer.address.state,
            zipCode: prev.customer.address.zipCode,
            country: prev.customer.address.country,
            longitude: prev.customer.address.longitude,
            latitude: prev.customer.address.latitude,
            hasLocation: prev.customer.address.hasLocation
          } : prev.customer.address
        },
        offerId: type === 'offer' ? record.id : prev.offerId
      }));
    }
  };

  const updateCustomer = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };

  const updateCustomerAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        address: {
          ...prev.customer.address,
          [field]: value
        }
      }
    }));
  };

  const updateRepair = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      repair: {
        ...prev.repair,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-border bg-background/95 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard/field/service-orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">{t('create_service_order')}</h1>
            <p className="text-[11px] text-muted-foreground truncate">Create a new service order from scratch or link to an existing offer</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Link to Record */}
        <LinkedRecordSearch 
          onSelect={handleLinkedRecordSelect}
          selectedRecord={linkedRecord}
        />

        {/* Customer Information */}
        <CustomerDetailsForm 
          formData={formData}
          updateCustomer={updateCustomer}
          updateCustomerAddress={updateCustomerAddress}
        />

        {/* Repair Details */}
        <RepairDetailsForm 
          formData={formData}
          promisedDate={promisedDate}
          setPromisedDate={setPromisedDate}
          updateRepair={updateRepair}
          setFormData={setFormData}
        />

        {/* Technician Assignment */}
        <TechnicianAssignment 
          assignedTechnicians={formData.assignedTechnicians}
          onAssignedTechniciansChange={updateAssignedTechnicians}
        />

        {/* Installation Assignment */}
        <InstallationAssignment 
          assignedInstallations={assignedInstallations}
          onAssignedInstallationsChange={setAssignedInstallations}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link to="/dashboard/field/service-orders">
            <Button type="button" variant="outline">
              {t('cancel')}
            </Button>
          </Link>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Create Service Order
          </Button>
        </div>
      </form>
    </div>
  );
}