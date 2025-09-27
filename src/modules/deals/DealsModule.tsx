import { DealsHeader } from "./components/DealsHeader";
import { PipelineOverview } from "./components/PipelineOverview";
import { RevenueStats } from "./components/RevenueStats";
import { ActiveDealsList, type Deal } from "./components/ActiveDealsList";

export function DealsModule() {
  const deals: Deal[] = [
    {
      id: 1,
      title: "Enterprise Software License",
      value: "45,000 TND",
      stage: "Proposal",
      
      closeDate: "2024-01-15",
      contact: "John Doe",
      company: "Acme Corp"
    },
    {
      id: 2,
      title: "Consulting Services",
      value: "12,500 TND",
      stage: "Negotiation",
      
      closeDate: "2024-01-10",
      contact: "Jane Smith",
      company: "Tech Startup"
    },
    {
      id: 3,
      title: "Annual Support Contract",
      value: "8,500 TND",
      stage: "Qualified",
      
      closeDate: "2024-01-20",
      contact: "Mike Johnson",
      company: "Consulting LLC"
    }
  ];

  const stages = [
    { name: "Lead", count: 15, color: "bg-gray-500" },
    { name: "Qualified", count: 8, color: "bg-blue-500" },
    { name: "Proposal", count: 12, color: "bg-yellow-500" },
    { name: "Negotiation", count: 6, color: "bg-orange-500" },
    { name: "Closed Won", count: 23, color: "bg-green-500" }
  ];

  return (
    <div className="space-y-8 p-6">
  <DealsHeader />

  <PipelineOverview stages={stages} />

  <RevenueStats />

  <ActiveDealsList deals={deals} />
    </div>
  );
}