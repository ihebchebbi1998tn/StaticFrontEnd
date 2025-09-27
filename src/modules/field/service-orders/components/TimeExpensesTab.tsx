import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, DollarSign, Edit, Trash2, Upload, FileText } from "lucide-react";
import { format } from "date-fns";
import type { ServiceOrder, TimeEntry } from "../types";

interface TimeExpensesTabProps {
  serviceOrder: ServiceOrder;
  onUpdate?: () => void;
}

interface ExpenseEntry {
  id: string;
  serviceOrderId: string;
  technicianId: string;
  technicianName: string;
  type: "travel" | "meal" | "accommodation" | "materials" | "other";
  amount: number;
  currency: string;
  description: string;
  receipt?: string;
  date: Date;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export function TimeExpensesTab({ serviceOrder, onUpdate }: TimeExpensesTabProps) {
  const { t } = useTranslation('service_orders');
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Time entry form state
  const [timeFormData, setTimeFormData] = useState({
    workType: "work" as "travel" | "setup" | "work" | "cleanup" | "documentation",
    startTime: "",
    endTime: "",
    duration: 0,
    description: "",
    billable: true,
    hourlyRate: 85,
  });

  // Expense form state  
  const [expenseFormData, setExpenseFormData] = useState({
    type: "travel" as "travel" | "meal" | "accommodation" | "materials" | "other",
    amount: 0,
    currency: "TND",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });

  // Mock expenses data for demonstration
  const mockExpenses: ExpenseEntry[] = [
    {
      id: "exp-001",
      serviceOrderId: serviceOrder.id,
      technicianId: "tech-001", 
      technicianName: "John Smith",
      type: "travel",
      amount: 25.50,
      currency: "TND",
      description: "Travel to customer site",
      date: new Date("2024-01-17T09:00:00"),
      status: "approved",
      createdAt: new Date("2024-01-17T09:00:00"),
      approvedBy: "supervisor-001",
      approvedAt: new Date("2024-01-17T18:00:00")
    }
  ];

  const handleTimeSubmit = () => {
    console.log(editingTimeId ? "Updating time entry:" : "Creating time entry:", timeFormData);
    setIsTimeDialogOpen(false);
    setEditingTimeId(null);
    resetTimeForm();
    onUpdate?.();
  };

  const handleExpenseSubmit = () => {
    console.log(editingExpenseId ? "Updating expense entry:" : "Creating expense entry:", expenseFormData);
    setIsExpenseDialogOpen(false);
    setEditingExpenseId(null);
    resetExpenseForm();
    onUpdate?.();
  };

  const handleEditTime = (entry: TimeEntry) => {
    setEditingTimeId(entry.id);
    setTimeFormData({
      workType: entry.workType,
      startTime: entry.startTime ? format(entry.startTime, "yyyy-MM-dd'T'HH:mm") : "",
      endTime: entry.endTime ? format(entry.endTime, "yyyy-MM-dd'T'HH:mm") : "",
      duration: entry.duration,
      description: entry.description,
      billable: entry.billable,
      hourlyRate: entry.hourlyRate || 85,
    });
    setIsTimeDialogOpen(true);
  };

  const handleEditExpense = (expense: ExpenseEntry) => {
    setEditingExpenseId(expense.id);
    setExpenseFormData({
      type: expense.type,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      date: format(expense.date, 'yyyy-MM-dd'),
    });
    setIsExpenseDialogOpen(true);
  };

  const resetTimeForm = () => {
    setTimeFormData({
      workType: "work",
      startTime: "",
      endTime: "",
      duration: 0,
      description: "",
      billable: true,
      hourlyRate: 85,
    });
  };

  const resetExpenseForm = () => {
    setExpenseFormData({
      type: "travel",
      amount: 0,
      currency: "TND", 
      description: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    }
  };

  const getWorkTypeBadgeColor = (workType: string) => {
    switch (workType) {
      case "work":
        return "bg-primary/10 text-primary border-primary/20";
      case "travel":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Tracking Section */}
      <div>
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-lg font-semibold">
            {t('time_booking.title')}
          </h3>
          <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                variant="outline"
                className="border-border bg-background hover:bg-muted"
                onClick={() => {
                  resetTimeForm();
                  setEditingTimeId(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Time
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTimeId ? "Edit Time Entry" : "Add Time"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>{t('time_booking.work_type')}</Label>
                  <Select 
                    value={timeFormData.workType} 
                    onValueChange={(value: any) => setTimeFormData(prev => ({ ...prev, workType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">{t('time_booking.types.work')}</SelectItem>
                      <SelectItem value="travel">{t('time_booking.types.travel')}</SelectItem>
                      <SelectItem value="setup">Setup</SelectItem>
                      <SelectItem value="cleanup">Cleanup</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('time_booking.start_time')}</Label>
                    <Input 
                      type="datetime-local"
                      value={timeFormData.startTime}
                      onChange={(e) => setTimeFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>{t('time_booking.end_time')}</Label>
                    <Input 
                      type="datetime-local"
                      value={timeFormData.endTime}
                      onChange={(e) => setTimeFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('time_booking.duration')} (minutes)</Label>
                  <Input 
                    type="number"
                    value={timeFormData.duration}
                    onChange={(e) => setTimeFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={timeFormData.description}
                    onChange={(e) => setTimeFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the work performed..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsTimeDialogOpen(false);
                  setEditingTimeId(null);
                  resetTimeForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleTimeSubmit}>
                  {editingTimeId ? "Update Time" : "Add Time"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {serviceOrder.workDetails.timeTracking.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Time Entries Yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your work time by adding your first time entry</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  resetTimeForm();
                  setEditingTimeId(null);
                  setIsTimeDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Time Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {serviceOrder.workDetails.timeTracking.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={getWorkTypeBadgeColor(entry.workType)}
                      >
                        {t(`time_booking.types.${entry.workType}`)}
                      </Badge>
                    </div>
                     <div className="flex items-center gap-1">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-8 w-8 p-0"
                         onClick={() => handleEditTime(entry)}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                     <div>
                       <span className="text-muted-foreground">Start Time</span>
                       <div className="font-medium">{format(entry.startTime, 'dd/MM/yyyy HH:mm')}</div>
                     </div>
                     <div>
                       <span className="text-muted-foreground">End Time</span>
                       <div className="font-medium">
                         {entry.endTime ? format(entry.endTime, 'dd/MM/yyyy HH:mm') : '-'}
                       </div>
                     </div>
                     <div>
                       <span className="text-muted-foreground">Technician</span>
                       <div className="font-medium">John Smith</div>
                     </div>
                     <div>
                       <span className="text-muted-foreground">Duration</span>
                       <div className="font-medium">{entry.duration} min</div>
                     </div>
                   </div>
                  {entry.description && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense Tracking Section */}
      <div>
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-lg font-semibold">
            {t('expense_booking.title')}
          </h3>
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                variant="outline"
                className="border-border bg-background hover:bg-muted"
                onClick={() => {
                  resetExpenseForm();
                  setEditingExpenseId(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingExpenseId ? "Edit Expense" : "Add Expense"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>{t('expense_booking.expense_type')}</Label>
                  <Select 
                    value={expenseFormData.type} 
                    onValueChange={(value: any) => setExpenseFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">{t('expense_booking.types.travel')}</SelectItem>
                      <SelectItem value="meal">{t('expense_booking.types.meal')}</SelectItem>
                      <SelectItem value="accommodation">{t('expense_booking.types.accommodation')}</SelectItem>
                      <SelectItem value="materials">{t('expense_booking.types.materials')}</SelectItem>
                      <SelectItem value="other">{t('expense_booking.types.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('expense_booking.amount')}</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={expenseFormData.amount}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>{t('expense_booking.currency')}</Label>
                    <Select 
                      value={expenseFormData.currency}
                      onValueChange={(value) => setExpenseFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TND">TND</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>{t('expense_booking.date')}</Label>
                  <Input 
                    type="date"
                    value={expenseFormData.date}
                    onChange={(e) => setExpenseFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={expenseFormData.description}
                    onChange={(e) => setExpenseFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the expense..."
                  />
                </div>
                <div>
                  <Label>{t('expense_booking.receipt')}</Label>
                  <div className="mt-2">
                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground/60" />
                        <div className="text-sm">
                          <span className="font-medium text-primary cursor-pointer hover:underline">
                            Click to upload
                          </span>
                          <span className="text-muted-foreground"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsExpenseDialogOpen(false);
                  setEditingExpenseId(null);
                  resetExpenseForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleExpenseSubmit}>
                  {editingExpenseId ? "Update Expense" : "Add Expense"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {mockExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('expense_booking.no_expenses')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockExpenses.map((expense) => (
                <div key={expense.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {t(`expense_booking.types.${expense.type}`)}
                      </Badge>
                    </div>
                     <div className="flex items-center gap-1">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-8 w-8 p-0"
                         onClick={() => handleEditExpense(expense)}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                    <div>
                      <span className="text-muted-foreground">Amount</span>
                      <div className="font-medium text-green-600 dark:text-green-400">{expense.amount.toFixed(2)} {expense.currency}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <div className="font-medium">{format(expense.date, 'dd/MM/yyyy')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Technician</span>
                      <div className="font-medium">{expense.technicianName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Receipt</span>
                      {expense.receipt ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">Attached</span>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-primary font-medium text-sm"
                            onClick={() => window.open(`/documents/receipts/${expense.id}.pdf`, '_blank')}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm mt-1">No receipt</div>
                      )}
                    </div>
                  </div>
                  {expense.description && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}