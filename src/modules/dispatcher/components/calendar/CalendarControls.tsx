import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Settings2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ZoomLevel } from "./types";

interface CalendarControlsProps {
  zoomLevel: ZoomLevel;
  setZoomLevel: (level: ZoomLevel) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  dateOffset: number;
  setDateOffset: (offset: number) => void;
  settings: { dayCount: number };
  datesLength: number;
  onNavigateDays: (direction: 'prev' | 'next') => void;
}

export function CalendarControls({
  zoomLevel,
  setZoomLevel,
  showSettings,
  setShowSettings,
  dateOffset,
  setDateOffset,
  settings,
  datesLength,
  onNavigateDays
}: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Navigation Controls (week view only) */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateDays('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateOffset(0)}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateDays('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const levels: ZoomLevel[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
              const currentIndex = levels.indexOf(zoomLevel);
              if (currentIndex < levels.length - 1) {
                setZoomLevel(levels[currentIndex + 1]);
              }
            }}
            disabled={zoomLevel === 'xxl'}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const levels: ZoomLevel[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
              const currentIndex = levels.indexOf(zoomLevel);
              if (currentIndex > 0) {
                setZoomLevel(levels[currentIndex - 1]);
              }
            }}
            disabled={zoomLevel === 'xs'}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}