import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export function OfferDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux devis
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Devis {id}</h1>
            <p className="text-muted-foreground">Détails du devis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">En attente</Badge>
            <Button variant="outline" size="sm">
              Copier le lien
            </Button>
            <Button variant="outline" size="sm">
              Télécharger PDF
            </Button>
            <Button>
              Envoyer
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du devis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Implémentation à venir - Détails du devis {id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}