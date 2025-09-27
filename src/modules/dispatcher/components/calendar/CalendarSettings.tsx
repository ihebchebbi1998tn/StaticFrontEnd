import type { CalendarSettings } from "./types";

interface CalendarSettingsProps {
  settings: CalendarSettings;
  onSettingsChange: (settings: CalendarSettings) => void;
}

export function CalendarSettingsPanel({ settings, onSettingsChange }: CalendarSettingsProps) {
  return (
    <div className="p-4 border-b bg-muted/20">
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.includeWeekends}
            onChange={(e) => onSettingsChange({ ...settings, includeWeekends: e.target.checked })}
            className="rounded"
          />
          Include weekends
        </label>
      </div>
    </div>
  );
}