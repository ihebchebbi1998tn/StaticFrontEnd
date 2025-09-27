import { Routes, Route, Navigate } from "react-router-dom";
import ServiceOrdersList from "./pages/ServiceOrdersList";
import ServiceOrderDetail from "./pages/ServiceOrderDetail";
import CreateServiceOrder from "./pages/CreateServiceOrder";
import JobDetail from "./pages/JobDetail";

export default function ServiceOrdersModule() {
  console.log("ServiceOrdersModule rendering, current path:", window.location.pathname);
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<ServiceOrdersList />} />
      <Route path="create" element={<CreateServiceOrder />} />
      <Route path=":id" element={<ServiceOrderDetail />} />
      <Route path=":serviceOrderId/jobs/create" element={<JobDetail />} />
      <Route path=":serviceOrderId/jobs/:jobId" element={<JobDetail />} />
    </Routes>
  );
}
