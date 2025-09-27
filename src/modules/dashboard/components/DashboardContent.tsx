import { Routes, Route } from "react-router-dom";
import DashboardOverview from "./DashboardOverview";

// CRM Modules
import { ContactsModule } from "@/modules/contacts/ContactsModule";
import { SalesModule } from "@/modules/sales";
import { DocumentsModule } from "@/modules/documents";
import { WorkflowModule } from "@/modules/workflow/WorkflowModule";
import { OffersModule } from "@/modules/offers";
import { ArticlesModule } from "@/modules/articles/ArticlesModule";
import { InventoryServicesModule } from "@/modules/inventory-services/InventoryServicesModule";
import { DealsModule } from "@/modules/deals/DealsModule";
import { CommunicationModule } from "@/modules/communication/CommunicationModule";
import TasksModule from "@/modules/tasks/TasksModule";
import { AutomationModule } from "@/modules/automation/AutomationModule";
import { AnalyticsModule } from "@/modules/analytics/AnalyticsModule";
import { SettingsModule } from "@/modules/settings/SettingsModule";
import { NotificationsModule } from "@/modules/notifications/NotificationsModule";
import { CalendarModule } from "@/modules/calendar/CalendarModule";
import { FieldModule } from "@/modules/field/FieldModule";
import LookupsPage from "@/modules/lookups/pages/LookupsPage";
import HelpModule from "./HelpModule";

export function DashboardContent() {
  console.log("DashboardContent rendering, current path:", window.location.pathname);
  return (
    <div>
      <Routes>
  <Route index element={<DashboardOverview />} />
        <Route path="contacts/*" element={<ContactsModule />} />
        <Route path="offers/*" element={<OffersModule />} />
        <Route path="sales/*" element={<SalesModule />} />
        <Route path="documents/*" element={<DocumentsModule />} />
        <Route path="workflow/*" element={<WorkflowModule />} />
        <Route path="articles/*" element={<ArticlesModule />} />
        <Route path="inventory-services/*" element={<InventoryServicesModule />} />
        <Route path="deals/*" element={<DealsModule />} />
        <Route path="communication/*" element={<CommunicationModule />} />
        <Route path="tasks/*" element={<TasksModule />} />
        <Route path="automation/*" element={<AutomationModule />} />
        <Route path="analytics/*" element={<AnalyticsModule />} />
        <Route path="calendar/*" element={<CalendarModule />} />
        <Route path="field/*" element={<FieldModule />} />
        <Route path="notifications" element={<NotificationsModule />} />
        <Route path="lookups/*" element={<LookupsPage />} />
  <Route path="settings/*" element={<SettingsModule />} />
  {/* Help/Support route */}
  <Route path="help/*" element={<HelpModule />} />
      </Routes>
    </div>
  );
}