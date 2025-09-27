import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus } from "lucide-react";

export function DealsHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-4">
          <div className="p-3 rounded-xl bg-chart-2/10 shadow-soft">
            <GitBranch className="h-10 w-10 text-chart-2" />
          </div>
          {t('deals')}
        </h1>
        <p className="text-muted-foreground mt-3 text-xl">
          Track your sales pipeline and revenue opportunities
        </p>
      </div>
      <Button className="gradient-primary text-white shadow-medium hover-lift px-6 py-3 text-base">
        <Plus className="mr-2 h-5 w-5" />
        Add Deal
      </Button>
    </div>
  );
}
