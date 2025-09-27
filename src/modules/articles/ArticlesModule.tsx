import { Routes, Route } from "react-router-dom";
import { ArticlesList } from "./components/ArticlesList";
import ArticleDetail from "./pages/ArticleDetail";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";

export function ArticlesModule() {
  return (
    <Routes>
      <Route index element={<ArticlesList />} />
      <Route path="add" element={<AddArticle />} />
      <Route path="edit/:id" element={<EditArticle />} />
      <Route path=":id" element={<ArticleDetail />} />
    </Routes>
  );
}