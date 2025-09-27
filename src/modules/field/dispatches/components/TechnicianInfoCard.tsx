import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";
import type { Technician } from "../types";

interface TechnicianInfoCardProps {
  technicians: Technician[];
}

export function TechnicianInfoCard({ technicians }: TechnicianInfoCardProps) {
  const { t } = useTranslation("technician");

  const getStatusColor = (status: Technician["status"]) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      busy: "bg-orange-100 text-orange-800",
      offline: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: Technician["status"]) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "busy":
        return <Clock className="h-4 w-4" />;
      case "offline":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {technicians.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("no_technicians")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {technicians.map((technician) => (
              <div key={technician.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 shadow-medium border-2 border-background">
                    <AvatarImage src={technician.avatar} alt={technician.name} />
                    <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                      {technician.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {technician.name}
                      </h3>
                      <Badge className={getStatusColor(technician.status)}>
                        {getStatusIcon(technician.status)}
                        <span className="ml-1 capitalize">{technician.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{technician.email}</span>
                      </div>
                      
                      {technician.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-foreground">{technician.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {technician.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      {t("skills")}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {technician.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="gap-2 flex-1">
                    <Phone className="h-4 w-4" />
                    {t("call")}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 flex-1">
                    <Mail className="h-4 w-4" />
                    {t("email_action")}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 flex-1">
                    <MapPin className="h-4 w-4" />
                    {t("locate")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}