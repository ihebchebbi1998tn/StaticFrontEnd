
import { Routes, Route } from "react-router-dom";
import { SettingsLayout } from "./components/SettingsLayout";
import DatabaseFullView from "./pages/DatabaseFullView";

export function SettingsModule() {
  return (
    <Routes>
      <Route index element={<SettingsLayout />} />
      <Route path="database-full-view" element={<DatabaseFullView />} />
    </Routes>
  );
}
