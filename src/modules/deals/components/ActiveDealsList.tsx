import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User } from "lucide-react";

export type Deal = {
  id: number;
  title: string;
  value: string;
  stage: string;
  closeDate: string;
  contact: string;
  company: string;
};

export function ActiveDealsList({ deals }: { deals: Deal[] }) {
  return (
    <Card className="shadow-card border-0 gradient-card">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Active Deals</CardTitle>
        <CardDescription className="text-base">
          Your current sales opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="flex items-center justify-between p-6 rounded-lg shadow-card hover-lift card-interactive transition-smooth bg-background/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-chart-2/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-7 w-7 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{deal.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {deal.contact}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {deal.closeDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-foreground text-lg">{deal.value}</p>
                </div>
                <Badge className={deal.stage === 'Negotiation' ? 'status-warning' : 'status-info'}>
                  {deal.stage}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
