import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  taskStatusesApi, 
  eventTypesApi, 
  serviceCategoriesApi, 
  currenciesApi, 
  prioritiesApi,
  articleCategoriesApi,
  type LookupItem, 
  type Currency,
  type CreateLookupRequest,
  type UpdateLookupRequest,
  handleApiError 
} from '@/services/lookupsApi';

export interface UseLookupHookReturn {
  items: LookupItem[];
  isLoading: boolean;
  error: string | null;
  createItem: (data: CreateLookupRequest) => Promise<void>;
  updateItem: (id: string, data: UpdateLookupRequest) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refetch: () => void;
}

export interface UseCurrencyHookReturn {
  currencies: Currency[];
  isLoading: boolean;
  error: string | null;
  createCurrency: (data: any) => Promise<void>;
  updateCurrency: (id: string, data: any) => Promise<void>;
  deleteCurrency: (id: string) => Promise<void>;
  setDefaultCurrency: (id: string) => Promise<void>;
  refetch: () => void;
}

// Generic lookup hook
function createLookupHook(
  queryKey: string, 
  api: { 
    getAll: () => Promise<any>, 
    create: (data: CreateLookupRequest) => Promise<any>,
    update: (id: string, data: UpdateLookupRequest) => Promise<any>,
    delete: (id: string) => Promise<void>
  }
): () => UseLookupHookReturn {
  return function useLookupHook() {
    const queryClient = useQueryClient();
    
    const { data: response, isLoading, error, refetch } = useQuery({
      queryKey: [queryKey],
      queryFn: api.getAll,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const createMutation = useMutation({
      mutationFn: api.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success('Item created successfully');
      },
      onError: (error: any) => {
        toast.error(handleApiError(error));
      }
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateLookupRequest }) => 
        api.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success('Item updated successfully');
      },
      onError: (error: any) => {
        toast.error(handleApiError(error));
      }
    });

    const deleteMutation = useMutation({
      mutationFn: api.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success('Item deleted successfully');
      },
      onError: (error: any) => {
        toast.error(handleApiError(error));
      }
    });

    return {
      items: response?.items || [],
      isLoading,
      error: error ? handleApiError(error) : null,
      createItem: createMutation.mutateAsync,
      updateItem: (id: string, data: UpdateLookupRequest) => 
        updateMutation.mutateAsync({ id, data }),
      deleteItem: deleteMutation.mutateAsync,
      refetch,
    };
  };
}

// Specific hooks for each lookup type
export const useTaskStatuses = createLookupHook('taskStatuses', taskStatusesApi);
export const useEventTypes = createLookupHook('eventTypes', eventTypesApi);
export const useServiceCategories = createLookupHook('serviceCategories', serviceCategoriesApi);
export const usePriorities = createLookupHook('priorities', prioritiesApi);
export const useArticleCategories = createLookupHook('articleCategories', articleCategoriesApi);

// Currency hook (special case)
export function useCurrencies(): UseCurrencyHookReturn {
  const queryClient = useQueryClient();
  
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: currenciesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success('Currency created successfully');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      currenciesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success('Currency updated successfully');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: currenciesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success('Currency deleted successfully');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: currenciesApi.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success('Default currency updated');
    },
    onError: (error: any) => {
      toast.error(handleApiError(error));
    }
  });

  return {
    currencies: response?.currencies || [],
    isLoading,
    error: error ? handleApiError(error) : null,
  createCurrency: async (data: any) => { 
    await createMutation.mutateAsync(data); 
  },
  updateCurrency: async (id: string, data: any) => { 
    await updateMutation.mutateAsync({ id, data }); 
  },
  deleteCurrency: async (id: string) => { 
    await deleteMutation.mutateAsync(id); 
  },
  setDefaultCurrency: async (id: string) => { 
    await setDefaultMutation.mutateAsync(id); 
  },
    refetch,
  };
}