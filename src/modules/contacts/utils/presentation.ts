export const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Customer': return 'status-success';
    case 'Lead': return 'status-warning';
    case 'Prospect': return 'status-info';
    default: return 'status-info';
  }
};

export const formatTND = (amount: number) => new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(amount);
