import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, Check, X, TrendingUp, DollarSign } from "lucide-react";
import { OfferStats } from "../types";

interface OffersStatsProps {
  stats: OfferStats;
}

export function OffersStats({ stats }: OffersStatsProps) {
  const { t } = useTranslation();

  const statsCards = [
    {
      title: t('total_offers'),
      value: stats.totalOffers,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('active_offers'),
      value: stats.activeOffers,
      icon: Send,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: t('accepted_offers'),
      value: stats.acceptedOffers,
      icon: Check,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('declined_offers'),
      value: stats.declinedOffers,
      icon: X,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: t('total_value'),
      value: `${stats.totalValue.toLocaleString()} TND`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: t('conversion_rate'),
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {index === 5 && (
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}