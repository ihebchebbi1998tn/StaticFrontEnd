import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

export function ServiceOrderDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux services
            </Button>
            <span className="text-xl sm:text-2xl font-bold">Service Order {id}</span>
          </div>
          
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm">
              Planifier
            </Button>
            <Button onClick={() => window.location.href = `/dashboard/field/service-orders/${id}/jobs/create`}>
              Ajouter job
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Badge variant="outline">En cours</Badge>
          <p className="text-muted-foreground">Gestion des interventions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Affected Company</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">Tech Solutions Inc.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Number</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">+1 (555) 987-6543</p>
          <p className="text-xs text-muted-foreground mt-1">Tech Solutions Inc. Main Line</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progression du service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression globale</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          
          <p className="text-muted-foreground">
            Implémentation à venir - Détails du service order {id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}