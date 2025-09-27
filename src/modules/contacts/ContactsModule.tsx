import { Routes, Route } from "react-router-dom";
import { ContactsList } from "./components/ContactsList";
import ContactDetail from "./pages/ContactDetail";
import AddContact from "./pages/AddContact";
import ImportContacts from "./pages/ImportContacts";

export function ContactsModule() {
  return (
    <Routes>
      <Route index element={<ContactsList />} />
      <Route path="add" element={<AddContact />} />
      <Route path="import" element={<ImportContacts />} />
      <Route path=":id" element={<ContactDetail />} />
    </Routes>
  );
}