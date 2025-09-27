import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Sidebar, LayoutGrid, User, Settings as SettingsIcon, Sun, Moon, Monitor, HelpCircle } from "lucide-react";
import { GlobalSearch } from "@/components/ui/global-search";
import { useTranslation } from 'react-i18next';
import QuickCreateModal from '@/components/ui/QuickCreateModal';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { useLayoutModeContext } from "@/hooks/useLayoutMode";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { notifications as notificationsData } from "@/data/notifications";
import { useAuth } from "@/contexts/AuthContext";
export function DashboardHeader() {
  const [createOpen, setCreateOpen] = useState(false);
  const {
    t
  } = useTranslation();
  const {
    layoutMode,
    setLayoutMode,
    isMobile
  } = useLayoutModeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const unreadCount = notificationsData.filter(n => !n.read).length;
  
  // Get user initials from first and last name
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };
  
  // Check if we're on the planner interface page
  const isPlannerInterface = location.pathname === '/dashboard/field/dispatcher/interface';

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAllAsRead = () => {
    // Placeholder action; integrate with backend later
    toast({ title: 'All caught up', description: 'All notifications marked as read.' });
  };

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === 'sidebar' ? 'topbar' : 'sidebar');
  };
  function ThemeOptions() {
    const { setTheme } = useTheme();
    const { t } = useTranslation();

    return (
      <>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t('lightMode') || 'Light'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t('darkMode') || 'Dark'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </>
    );
  }
  return <header className="h-16 border-b border-border bg-white dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* App Logo */}
{layoutMode === 'topbar' && (
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/c403237c-2c76-4f0c-8c9f-882975ce290f.png" 
                alt="FlowSolution dark mode logo" 
                className="h-8 dark:block hidden"
              />
              <img 
                src="/lovable-uploads/54cf69f6-1a17-4c11-bf6f-0fef42eb25bb.png" 
                alt="FlowSolution light mode logo" 
                className="h-8 dark:hidden block"
              />
            </div>
          )}
          
          {layoutMode === 'sidebar' && !isMobile && !isPlannerInterface && <SidebarTrigger className="h-8 w-8" />}
        </div>
        
        {/* Global Search - Centered and responsive */}
        <div className="flex-1 flex justify-center px-4 md:px-8">
          <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl relative">
            <GlobalSearch />
            {/* Create quick action button on the right side of the search */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 hidden md:block">
              <Button onClick={() => setCreateOpen(true)} className="h-10 px-3 dark:text-white" variant="default">
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Create</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <QuickCreateModal open={createOpen} onOpenChange={setCreateOpen} />

          {/* Notifications first */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('notifications') ?? 'Notifications'} title={t('notifications') ?? 'Notifications'}>
                <div className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] leading-none px-1">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Notifications</div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </Button>
                </div>
              </div>
              <ScrollArea className="max-h-80">
                <ul className="divide-y divide-border">
                  {notificationsData.slice(0, 5).map((n) => (
                    <li key={n.id} className="p-3 hover:bg-accent/40 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-muted-foreground/40' : 'bg-primary'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <span className="text-xs text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <div className="p-2 border-t border-border">
                <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard/notifications')}>
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help / Support button */}
          {!isMobile && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/dashboard/help')} title={t('help') || 'Help'}>
              <HelpCircle className="h-4 w-4" />
            </Button>
          )}

          {/* Layout toggle */}
          {!isMobile && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLayoutMode} title={layoutMode === 'sidebar' ? 'Switch to Top Navigation' : 'Switch to Sidebar'}>
              {layoutMode === 'sidebar' ? <LayoutGrid className="h-4 w-4" /> : <Sidebar className="h-4 w-4" />}
            </Button>}

          {/* User avatar last */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted-foreground/5 hover:bg-muted-foreground/10">
                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-sm font-semibold text-foreground">
                  {getUserInitials(user?.firstName, user?.lastName)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuLabel className="px-3 pt-2 text-xs text-muted-foreground">Theme</DropdownMenuLabel>
              <ThemeOptions />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
}