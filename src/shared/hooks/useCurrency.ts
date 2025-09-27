import { useMemo } from 'react';
import { useLookups } from '@/shared/contexts/LookupsContext';

export function useCurrency() {
  const { currencies } = useLookups();

  const current = useMemo(() => {
    const cur = currencies.find(c => c.isDefault);
    return cur ? { code: cur.description || 'TND', name: cur.name } : { code: 'TND', name: 'Tunisian Dinar' };
  }, [currencies]);

  const format = (amount?: number) => {
    if (amount === undefined || amount === null) return '';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: current.code,
        minimumFractionDigits: 2,
      }).format(amount);
  } catch {
      return String(amount);
    }
  };

  return { current, format };
}
