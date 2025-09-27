export const getStatusColor = (status: string) => {
  switch (status) {
    case 'won':
      return 'status-success';
    case 'new_offer':
      return 'status-info';
    case 'redefined':
      return 'status-warning';
    case 'lost':
      return 'status-destructive';
    default:
      return 'status-info';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-destructive text-destructive-foreground';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-warning text-warning-foreground';
    case 'low':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const formatDate = (date: string | Date) => new Date(date).toLocaleDateString();
