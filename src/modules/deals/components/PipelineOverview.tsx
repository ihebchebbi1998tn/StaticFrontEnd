import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Stage = { name: string; count: number };

export function PipelineOverview({ stages }: { stages: Stage[] }) {
  return (
    <Card className="shadow-card border-0 gradient-card">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Pipeline Overview</CardTitle>
        <CardDescription className="text-base">
          Visual representation of your sales pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage, index) => (
            <div key={index} className="text-center hover-lift">
              <div className={`h-28 bg-chart-${index + 1} rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-medium transition-smooth hover:scale-105`}>
                {stage.count}
              </div>
              <p className="text-sm font-bold text-foreground mt-3">{stage.name}</p>
              <p className="text-xs text-muted-foreground font-medium">Deals</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
