import type { Column } from "../types";

export const buildStatusColumns = (taskStatuses: any[]): Column[] => {
  return taskStatuses.map((status: any, index: number) => ({
    id: status.id,
    title: status.name,
    color: status.color ? `bg-[${status.color}]` : 'bg-slate-500',
    position: index,
    isDefault: !!status.isDefault,
    createdAt: new Date()
  }));
};

export const defaultTechnicianColumns: Column[] = [
  { id: 'sarah', title: 'Sarah Wilson', color: 'bg-primary', position: 0, isDefault: false, createdAt: new Date() },
  { id: 'mike', title: 'Mike Chen', color: 'bg-accent', position: 1, isDefault: false, createdAt: new Date() },
  { id: 'lisa', title: 'Lisa Johnson', color: 'bg-success', position: 2, isDefault: false, createdAt: new Date() },
  { id: 'david', title: 'David Park', color: 'bg-warning', position: 3, isDefault: false, createdAt: new Date() },
];
