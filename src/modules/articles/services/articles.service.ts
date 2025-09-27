import articlesData from "@/data/mock/articles.json";

export type InventoryArticle = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  sellPrice: number;
  status: "available" | "low_stock" | "out_of_stock" | string;
  lastUsed?: string;
  lastUsedBy?: string;
  location?: string;
  supplier?: string;
  description?: string;
};

const STORAGE_KEY = "articles-data";

function load(): InventoryArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as InventoryArticle[];
  } catch {}
  return (articlesData as InventoryArticle[]);
}

function save(list: InventoryArticle[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export const ArticlesService = {
  list(): InventoryArticle[] {
    return load();
  },
  getById(id: string): InventoryArticle | undefined {
    return load().find(a => String(a.id) === String(id));
  },
  upsert(item: InventoryArticle) {
    const all = load();
    const idx = all.findIndex(a => String(a.id) === String(item.id));
    if (idx >= 0) all[idx] = item; else all.push(item);
    save(all);
  },
  remove(id: string) {
    const all = load().filter(a => String(a.id) !== String(id));
    save(all);
  }
};
