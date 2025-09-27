import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import type { TimeEntry, CreateTimeEntryData } from "../types";

interface TimeBookingCardProps {
  timeEntries: TimeEntry[];
  dispatchId: string;
  technicianId: string;
  onCreate?: (data: CreateTimeEntryData) => void;
  onUpdate?: (id: string, data: CreateTimeEntryData) => void;
}

export function TimeBookingCard({ timeEntries, dispatchId, technicianId, onCreate, onUpdate }: TimeBookingCardProps) {
  const { t } = useTranslation("time-booking");
  const { t: tCommon } = useTranslation("common");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTimeEntryData>({
    dispatchId,
    technicianId,
    workType: "work",
    startTime: new Date(),
    description: "",
    billable: true,
  });

  const getStatusColor = (status: TimeEntry["status"]) => {
    const colors = {
      active: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getWorkTypeColor = (workType: TimeEntry["workType"]) => {
    const colors = {
      travel: "bg-orange-100 text-orange-800",
      work: "bg-blue-100 text-blue-800",
      waiting: "bg-yellow-100 text-yellow-800",
      preparation: "bg-purple-100 text-purple-800",
      break: "bg-gray-100 text-gray-800"
    };
    return colors[workType] || "bg-gray-100 text-gray-800";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && typeof onUpdate === "function") {
      onUpdate(editingId, formData);
    } else if (typeof onCreate === "function") {
      onCreate(formData);
    } else {
      console.log("Creating time entry:", formData);
    }
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      dispatchId,
      technicianId,
      workType: "work",
      startTime: new Date(),
      description: "",
      billable: true,
    });
  };


  const totalDuration = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("title")}
        </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" onClick={() => {
                  // open create dialog: reset editing state and default form
                  setEditingId(null);
                  setFormData({
                    dispatchId,
                    technicianId,
                    workType: "work",
                    startTime: new Date(),
                    description: "",
                    billable: true,
                  });
                }}>
                  <Plus className="h-4 w-4" />
                  {t("new_entry")}
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? (t("edit_entry") || t("new_entry")) : t("new_entry")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="workType">{t("work_type")}</Label>
                  <Select
                    value={formData.workType}
                    onValueChange={(value: TimeEntry["workType"]) =>
                      setFormData({ ...formData, workType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">{t("types.travel")}</SelectItem>
                      <SelectItem value="work">{t("types.work")}</SelectItem>
                      <SelectItem value="waiting">{t("types.waiting")}</SelectItem>
                      <SelectItem value="preparation">{t("types.preparation")}</SelectItem>
                      <SelectItem value="break">{t("types.break")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">{t("start_time")}</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={format(formData.startTime, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: new Date(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">{t("end_time")}</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime ? format(formData.endTime, "yyyy-MM-dd'T'HH:mm") : ""}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          endTime: e.target.value ? new Date(e.target.value) : undefined 
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t("work_description_placeholder")}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="billable"
                    checked={formData.billable}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, billable: checked as boolean })
                    }
                  />
                  <Label htmlFor="billable">{t("billable")}</Label>
                </div>

                {formData.billable && (
                  <div>
                    <Label htmlFor="hourlyRate">{t("hourly_rate")} (TND)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      value={formData.hourlyRate || ""}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          hourlyRate: e.target.value ? parseFloat(e.target.value) : undefined 
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? (t("save_changes") || t("book_time")) : t("book_time")}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {tCommon("cancel")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {timeEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {t("no_time_entries")}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              {t("duration")}: <span className="font-medium text-foreground">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </span>
            </div>
            
            <div className="space-y-3">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getWorkTypeColor(entry.workType)}>
                        {t(`types.${entry.workType}`)}
                      </Badge>
                      <Badge className={getStatusColor(entry.status)}>
                        {t(`statuses.${entry.status}`)}
                      </Badge>
                      {entry.billable && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {t("billable")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => {
                        // open edit dialog pre-filled
                        setEditingId(entry.id);
                        setFormData({
                          dispatchId: entry.dispatchId,
                          technicianId: entry.technicianId,
                          workType: entry.workType,
                          startTime: entry.startTime,
                          endTime: entry.endTime,
                          description: entry.description,
                          billable: entry.billable,
                          hourlyRate: entry.hourlyRate,
                        });
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("start_time")}:</span>
                      <p className="font-medium">{format(entry.startTime, "dd/MM/yyyy HH:mm")}</p>
                    </div>
                    {entry.endTime && (
                      <div>
                        <span className="text-muted-foreground">{t("end_time")}:</span>
                        <p className="font-medium">{format(entry.endTime, "dd/MM/yyyy HH:mm")}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">{t("duration")}:</span>
                      <p className="font-medium">{Math.floor(entry.duration / 60)}h {entry.duration % 60}m</p>
                    </div>
                    {entry.totalCost && (
                      <div>
                        <span className="text-muted-foreground">{t("total_cost")}:</span>
                        <p className="font-medium">{entry.totalCost.toFixed(2)} TND</p>
                      </div>
                    )}
                  </div>

                  {entry.description && (
                    <div>
                      <span className="text-muted-foreground text-sm">{t("description")}:</span>
                      <p className="text-sm">{entry.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}