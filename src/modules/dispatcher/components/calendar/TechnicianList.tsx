import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import type { Technician } from "../../types";
import { lookupHexColorForStatus } from '@/modules/scheduling/utils';
import { LookupsService } from '@/modules/lookups/services/lookups.service';
interface TechnicianListProps {
  technicians: Technician[];
}
export function TechnicianList({
  technicians
}: TechnicianListProps) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();

  // Show a manage scheduler entry at the top

  return <div className="w-52 border-r bg-card/50 backdrop-blur-sm flex-shrink-0">
      <ScrollArea className="h-full">
        
            {technicians.map(technician => <div key={technician.id} className="border-b h-20 p-4 flex items-center gap-3 hover:bg-accent/30 transition-all duration-200 group">
            <div className="relative">
                  {(() => {
            const lookup = LookupsService.getTechnicianStatuses().find(i => i.id === technician.status);
            const hex = lookup?.color;
            const avatarClass = technician.status === 'available' ? 'bg-green-100 text-green-700 border border-green-200' : technician.status === 'busy' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : technician.status === 'offline' ? 'bg-gray-100 text-gray-600 border border-gray-200' : technician.status === 'on_leave' ? 'bg-purple-100 text-purple-700 border border-purple-200' : technician.status === 'not_working' ? 'bg-red-100 text-red-700 border border-red-200' : technician.status === 'over_capacity' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600 border border-gray-200';
            return <>
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-md group-hover:shadow-lg transition-all ${avatarClass}`} style={hex ? {
                backgroundColor: hex
              } as any : undefined}>
                          {technician.firstName[0]}{technician.lastName[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${technician.status === 'available' ? 'bg-green-500' : technician.status === 'busy' ? 'bg-yellow-500' : technician.status === 'offline' ? 'bg-gray-400' : technician.status === 'on_leave' ? 'bg-purple-500' : technician.status === 'not_working' ? 'bg-red-500' : technician.status === 'over_capacity' ? 'bg-orange-500' : 'bg-gray-400'}`} style={hex ? {
                backgroundColor: hex
              } as any : undefined} />
                      </>;
          })()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                {technician.firstName} {technician.lastName}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {technician.workingHours?.start} - {technician.workingHours?.end}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {(() => {
              const hex = lookupHexColorForStatus(technician.status);
              return <>
                      <div className={`w-2 h-2 rounded-full ${hex ? '' : technician.status === 'available' ? 'bg-green-500' : technician.status === 'busy' ? 'bg-yellow-500' : technician.status === 'offline' ? 'bg-gray-400' : technician.status === 'on_leave' ? 'bg-purple-500' : technician.status === 'not_working' ? 'bg-red-500' : technician.status === 'over_capacity' ? 'bg-orange-500' : 'bg-gray-400'}`} style={hex ? {
                  backgroundColor: hex
                } : undefined} />
                      <div className="text-xs text-muted-foreground font-medium">
                        {t(`scheduling.status_${technician.status}`, technician.status)}
                      </div>
                    </>;
            })()}
              </div>
            </div>
          </div>)}
      </ScrollArea>
    </div>;
}