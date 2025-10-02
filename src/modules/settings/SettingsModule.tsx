import { Routes, Route } from "react-router-dom";
import { SettingsLayoutNew } from "./components/SettingsLayoutNew";
import DatabaseFullView from "./pages/DatabaseFullView";

export function SettingsModule() {
  return (
    <Routes>
      <Route index element={<SettingsLayoutNew />} />
      <Route path="database-full-view" element={<DatabaseFullView />} />
    </Routes>
  );
}
