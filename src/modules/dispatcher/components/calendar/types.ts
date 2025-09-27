export type ViewType = 'day' | 'week' | 'month';
export type ZoomLevel = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface CalendarSettings {
  includeWeekends: boolean;
  dayCount: number;
}

export interface ZoomDimensions {
  dateWidth: number;
  hourWidth: number;
  widthMode: string;
  showHourLabels: boolean;
  hourTextSize: string;
}