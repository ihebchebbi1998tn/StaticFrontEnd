import { useState } from 'react';
import { useDataLoading } from '@/shared/hooks/useDataLoading';
import { contactsApi, type ContactSearchParams } from '@/services/contactsApi';

type ContactSearchRequest = ContactSearchParams & {
  searchTerm?: string;
  status?: string;
  type?: string;
  pageSize?: number;
};

// Fetch contacts from API with search parameters
const fetchContacts = async (searchParams?: ContactSearchRequest) => {
  const response = await contactsApi.getAllContacts(searchParams);
  return response.contacts;
};

export const useContactsData = (searchParams?: ContactSearchRequest) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const result = useDataLoading(
    () => fetchContacts(searchParams),
    [searchParams, refreshKey], // dependencies include search params and refresh key
    {
      loadingMessage: 'Loading contacts...',
      minLoadingTime: 800
    }
  );

  const refresh = () => setRefreshKey(prev => prev + 1);

  return {
    ...result,
    refresh
  };
};