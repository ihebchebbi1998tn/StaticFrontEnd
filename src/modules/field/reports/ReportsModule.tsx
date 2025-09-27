import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay, addMonths, subMonths } from "date-fns";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useCurrency } from "@/shared/hooks/useCurrency";

const mockTechnicianPerformance = [
  { name: 'John Smith', completedJobs: 45, avgTime: 2.3, firstTimeFix: 92, rating: 4.8 },
  { name: 'Sarah Johnson', completedJobs: 38, avgTime: 2.1, firstTimeFix: 88, rating: 4.6 },
  { name: 'Mike Wilson', completedJobs: 52, avgTime: 2.7, firstTimeFix: 90, rating: 4.7 },
  { name: 'Lisa Chen', completedJobs: 41, avgTime: 2.0, firstTimeFix: 95, rating: 4.9 },
  { name: 'David Brown', completedJobs: 36, avgTime: 2.5, firstTimeFix: 85, rating: 4.5 }
];

const mockJobCompletionData = [
  { name: 'Week 1', avgHours: 3.2, targetHours: 3.5, completed: 28 },
  { name: 'Week 2', avgHours: 2.9, targetHours: 3.5, completed: 32 },
  { name: 'Week 3', avgHours: 3.1, targetHours: 3.5, completed: 35 },
  { name: 'Week 4', avgHours: 2.8, targetHours: 3.5, completed: 38 }
];

const mockRevenueData = [
  { name: 'Jan', revenue: 45000, costs: 18000, profit: 27000 },
  { name: 'Feb', revenue: 48000, costs: 19200, profit: 28800 },
  { name: 'Mar', revenue: 52000, costs: 20800, profit: 31200 },
  { name: 'Apr', revenue: 49000, costs: 19600, profit: 29400 }
];

export default function Reports() {
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrency();
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dispatches: true,
    absences: false,
    holidays: false
  });
  const currentDate = new Date();
  const tomorrow = addDays(currentDate, 1);
  
  // Generate calendar days for displayed month
  const monthStart = startOfMonth(displayedMonth);
  const monthEnd = endOfMonth(displayedMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add padding days for complete weeks
  const startDay = getDay(monthStart);
  const paddingStart = Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDay - i));
    return date;
  });

  const endDay = getDay(monthEnd);
  const paddingEnd = Array.from({ length: 6 - endDay }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const allCalendarDays = [...paddingStart, ...monthDays, ...paddingEnd];

  const getDispatchesForDay = (date: Date) => {
    // Generate consistent dispatch count based on day (no random)
    const day = date.getDate();
    if (day % 7 === 0) return 0; // No dispatches on some days
    return (day % 4) + 1; // 1-4 dispatches consistently
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === displayedMonth.getMonth() && date.getFullYear() === displayedMonth.getFullYear();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setDisplayedMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const displayedMonthName = format(displayedMonth, 'MMMM yyyy');
  
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="gradient-card shadow-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              First-Time Fix Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="text-xl font-bold text-foreground">90%</div>
            <p className="text-xs text-muted-foreground">+5% vs last month</p>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="text-xl font-bold text-foreground">2.5h</div>
            <p className="text-xs text-muted-foreground">-0.3h improvement</p>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="text-xl font-bold text-foreground">$52K</div>
            <p className="text-xs text-muted-foreground">+8% growth</p>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="text-xl font-bold text-foreground">4.7/5</div>
            <p className="text-xs text-muted-foreground">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="calendar">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">Dispatch Calendar</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          <TabsTrigger value="completion" className="text-xs sm:text-sm">Completion Times</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue & Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{displayedMonthName}</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                            Next
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowFilters(prev => !prev)}
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    
                    {/* Filter Controls */}
                    {showFilters && (
                      <div className="p-4 border rounded-lg bg-muted/20">
                        <h5 className="font-medium text-foreground mb-3">Filter Calendar Display</h5>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.dispatches}
                              onChange={(e) => setFilters(prev => ({ ...prev, dispatches: e.target.checked }))}
                              className="rounded border-muted-foreground"
                            />
                            <span className="text-sm">Planned Dispatches</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.absences}
                              onChange={(e) => setFilters(prev => ({ ...prev, absences: e.target.checked }))}
                              className="rounded border-muted-foreground"
                            />
                            <span className="text-sm">Technician Absences</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.holidays}
                              onChange={(e) => setFilters(prev => ({ ...prev, holidays: e.target.checked }))}
                              className="rounded border-muted-foreground"
                            />
                            <span className="text-sm">Holidays</span>
                          </label>
                        </div>
                      </div>
                    )}
                     
                     {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 border rounded-lg p-4 min-h-[500px]">
                      {/* Week headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground border-b">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar days with dispatch counts */}
                      {allCalendarDays.map((date, index) => {
                        const dayNumber = date.getDate();
                        const isInCurrentMonth = isCurrentMonth(date);
                        const dispatchCount = isInCurrentMonth ? getDispatchesForDay(date) : 0;
                        const isToday = isSameDay(date, currentDate);
                        
                        return (
                          <div key={index} className={`min-h-[60px] p-2 border rounded-sm cursor-pointer transition-colors
                            ${isInCurrentMonth ? 'bg-card hover:bg-muted/50' : 'bg-muted/20 text-muted-foreground'}
                            ${isToday ? 'ring-2 ring-primary bg-primary/5' : ''}
                          `}>
                            <div className="flex flex-col h-full">
                              <span className={`text-xs font-medium ${isToday ? 'text-primary font-bold' : ''}`}>
                                {isInCurrentMonth ? dayNumber : ''}
                              </span>
                              {dispatchCount > 0 && (
                                <div className="flex-1 mt-1">
                                  <div className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">
                                    {dispatchCount} dispatches
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                       </div>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="text-base">{format(displayedMonth, 'MMMM')} Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Dispatches</span>
                        <span className="font-semibold">87</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="font-semibold text-success">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">In Progress</span>
                        <span className="font-semibold text-warning">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Scheduled</span>
                        <span className="font-semibold text-primary">30</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="text-base">Upcoming Tomorrow</CardTitle>
                      <p className="text-xs text-muted-foreground">{format(tomorrow, 'EEEE, MMMM d')}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="p-2 border rounded">
                          <p className="text-sm font-medium">Installation - Tech A</p>
                          <p className="text-xs text-muted-foreground">9:00 AM - ABC Corp</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="text-sm font-medium">Repair - Tech B</p>
                          <p className="text-xs text-muted-foreground">2:00 PM - XYZ Industries</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="text-sm font-medium">Maintenance - Tech C</p>
                          <p className="text-xs text-muted-foreground">10:00 AM - Tech Solutions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Technician Performance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Individual technician metrics and comparisons</p>
            </CardHeader>
            <CardContent>
              <AnalyticsChart 
                data={mockTechnicianPerformance}
                height={300}
                series={[
                  { key: 'completedJobs', name: 'Completed Jobs', color: 'hsl(var(--primary))' },
                  { key: 'firstTimeFix', name: 'First-Time Fix %', color: 'hsl(var(--success))' }
                ]}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Individual Performance Metrics</CardTitle>
                  <p className="text-sm text-muted-foreground">Detailed breakdown by technician</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTechnicianPerformance.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{tech.name}</p>
                            <p className="text-sm text-muted-foreground">{tech.completedJobs} jobs completed</p>
                          </div>
                        </div>
                        <div className="flex gap-6 text-right">
                          <div>
                            <p className="text-sm font-medium text-foreground">{tech.avgTime}h</p>
                            <p className="text-xs text-muted-foreground">Avg Time</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-success">{tech.firstTimeFix}%</p>
                            <p className="text-xs text-muted-foreground">Fix Rate</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-accent">{tech.rating}/5</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">Team Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Technicians</span>
                    <span className="font-semibold text-foreground">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Completion Time</span>
                    <span className="font-semibold text-foreground">2.3h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Team Fix Rate</span>
                    <span className="font-semibold text-success">90%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                    <span className="font-semibold text-accent">4.7/5</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <p className="text-sm font-medium text-success">Best Fix Rate</p>
                    <p className="text-xs text-muted-foreground">Lisa Chen - 95% first-time fix</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <p className="text-sm font-medium text-warning">Needs Training</p>
                    <p className="text-xs text-muted-foreground">David Brown - 85% fix rate</p>
                  </div>
                  <div className="p-3 bg-info/10 rounded-lg">
                    <p className="text-sm font-medium text-info">Team Average</p>
                    <p className="text-xs text-muted-foreground">90% first-time fix rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Job Completion Times Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Weekly performance against targets</p>
            </CardHeader>
            <CardContent>
              <AnalyticsChart 
                data={mockJobCompletionData}
                height={300}
                series={[
                  { key: 'avgHours', name: 'Average Hours', color: 'hsl(var(--primary))' },
                  { key: 'targetHours', name: 'Target Hours', color: 'hsl(var(--muted-foreground))' },
                  { key: 'completed', name: 'Jobs Completed', color: 'hsl(var(--success))' }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Revenue & Cost Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Financial performance and profitability metrics</p>
            </CardHeader>
            <CardContent>
              <AnalyticsChart 
                data={mockRevenueData}
                height={300}
                series={[
                  { key: 'revenue', name: 'Revenue', color: 'hsl(var(--success))' },
                  { key: 'costs', name: 'Costs', color: 'hsl(var(--destructive))' },
                  { key: 'profit', name: 'Profit', color: 'hsl(var(--primary))' }
                ]}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">$198K</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-destructive">$77.6K</p>
                  <p className="text-sm text-muted-foreground">Total Costs</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">$120.4K</p>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}