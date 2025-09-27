import { useDataLoading } from '@/shared/hooks/useDataLoading';
import projectsData from '@/data/mock/projects.json';

// Simulate API call with delay
const fetchProjects = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
  
  return projectsData.map(project => ({
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : undefined,
    endDate: project.endDate ? new Date(project.endDate) : undefined,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
    columns: project.columns.map(col => ({
      ...col,
      createdAt: new Date(col.createdAt)
    }))
  }));
};

export const useProjectsData = () => {
  return useDataLoading(
    fetchProjects,
    [],
    {
      loadingMessage: 'Loading projects...',
      minLoadingTime: 600
    }
  );
};