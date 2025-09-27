import { Routes, Route, Navigate } from "react-router-dom";
import ServiceOrders from "./service-orders/ServiceOrdersModule";
import DispatchModule from "./dispatches/DispatchModule";


import InventoryField from "./InventoryField/InventoryFieldModule";
import Reports from "./reports/ReportsModule";
import { DocumentsModule } from "@/modules/documents/DocumentsModule";
import { DispatcherModule } from "@/modules/dispatcher/DispatcherModule";
import InstallationsModule from "./installations/InstallationsModule";
import TimeExpensesModule from "./time-expenses/TimeExpensesModule";
import { FieldDashboard } from "./components/FieldDashboard";

export function FieldModule() {
  console.log("FieldModule rendering");
  return (
    <Routes>
      <Route index element={<Navigate to="reports" replace />} />
      <Route path="dashboard" element={<FieldDashboard />} />
      <Route path="service-orders/*" element={<ServiceOrders />} />
      <Route path="dispatches/*" element={<DispatchModule />} />
      
      <Route path="dispatcher/*" element={<DispatcherModule />} />
      <Route path="installations/*" element={<InstallationsModule />} />
      
      <Route path="inventory/*" element={<InventoryField />} />
      <Route path="time-expenses/*" element={<TimeExpensesModule />} />
      <Route path="documents/*" element={<DocumentsModule />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
