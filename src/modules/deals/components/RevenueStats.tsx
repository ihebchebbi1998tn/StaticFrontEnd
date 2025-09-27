import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

export function RevenueStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="shadow-card border-0 hover-lift gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-chart-3/10">
              <DollarSign className="h-6 w-6 text-chart-3" />
            </div>
            <Badge className="status-success">Total</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Pipeline</p>
            <p className="text-3xl font-bold text-foreground">234,500 TND</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-card border-0 hover-lift gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <DollarSign className="h-6 w-6 text-chart-1" />
            </div>
            <Badge className="status-success">+23%</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">This Month</p>
            <p className="text-3xl font-bold text-foreground">45,678 TND</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-card border-0 hover-lift gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-chart-2/10">
              <DollarSign className="h-6 w-6 text-chart-2" />
            </div>
            <Badge className="status-info">+8%</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Avg Deal Size</p>
            <p className="text-3xl font-bold text-foreground">15,234 TND</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-card border-0 hover-lift gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-chart-4/10">
              <DollarSign className="h-6 w-6 text-chart-4" />
            </div>
            <Badge className="status-success">+5%</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-foreground">72%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
