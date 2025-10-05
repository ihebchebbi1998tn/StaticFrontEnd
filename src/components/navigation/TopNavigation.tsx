import { 
  Users, 
  CheckSquare, 
  Home,
  Settings,
  Building,
  ArrowLeft,
  Package,
  Calendar,
  TrendingUp,
  Menu,
  Wrench,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Boxes,
  Database,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  HelpCircle,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Languages,
  Clock,
  Folder
} from "lucide-react";
import techBackground from "@/assets/tech-background.jpg";
import lightTechBackground from "/files-uploads/acbdf037-abea-46d8-b7e4-78b3c6dec4ca.png";
import { useLayoutModeContext } from '@/hooks/useLayoutMode';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { preloadDashboard, preloadSupport } from "@/shared/prefetch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { QuickCreateModal } from "@/components/ui/QuickCreateModal";
import { loadSidebarConfig, seedSidebarDefaultsIfEmpty } from '@/modules/dashboard/services/sidebar.service';
import { ICON_REGISTRY, IconName } from '@/modules/dashboard/components/sidebarIcons';

export function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isSystemOpen, setIsSystemOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickCreateModalOpen, setIsQuickCreateModalOpen] = useState(false);
  const [configuredItems, setConfiguredItems] = useState<import('@/modules/dashboard/services/sidebar.service').SidebarItemConfig[]>([]);
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Load sidebar items from service
  useEffect(() => {
    // Clear cache and force reload of all items to pick up updated titles
    localStorage.removeItem('app-sidebar-config');
    seedSidebarDefaultsIfEmpty(); // This will now seed all unified items with updated titles
    const items = loadSidebarConfig() || [];
    setConfiguredItems(items);
  }, []);

  // Load company logo from localStorage
  useEffect(() => {
    const loadLogo = () => {
      const savedLogo = localStorage.getItem('company-logo');
      setCompanyLogo(savedLogo);
    };
    
    const handleLogoUpdate = (event: CustomEvent) => {
      setCompanyLogo(event.detail);
    };
    
    loadLogo();
    
    // Listen for custom logo update event
    window.addEventListener('logo-updated', handleLogoUpdate as EventListener);
    // Listen for storage changes to update logo in real-time
    window.addEventListener('storage', loadLogo);
    
    return () => {
      window.removeEventListener('logo-updated', handleLogoUpdate as EventListener);
      window.removeEventListener('storage', loadLogo);
    };
  }, []);

  const resolveTitle = (key: string) => {
    if (!key) return key;

    // Handle specific titles with proper formatting
    if (key === 'service orders' || key === 'service-orders') return 'Services';
    if (key === 'sales' || key === 'sales-offers') return 'Sales';
    if (key === 'todo') return 'Todo';
    if (key === 'time-expenses') return 'Time & Expenses';

    const isLikelyRaw = (val: any) => {
      if (typeof val !== 'string') return false;
      const v = val.trim();
      return v === key || v === `${key}.title`;
    };

    const direct = t(key);
    if (typeof direct === 'string' && direct.trim() !== '' && !isLikelyRaw(direct)) return direct;
    if (typeof direct === 'object' && direct && 'title' in direct) {
      // @ts-ignore
      const maybe = direct.title;
      if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
    }

    if (key.endsWith('.title')) {
      const base = key.replace(/\.title$/, '');
      const nested = t(`${base}.title`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
      const alt = t(base);
      if (typeof alt === 'string' && alt.trim() !== '' && !isLikelyRaw(alt)) return alt;
      if (typeof alt === 'object' && alt && 'title' in alt) {
        // @ts-ignore
        const maybe = alt.title;
        if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
      }
    }

    try {
      const nested = t(`${key}.title`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
      if (typeof nested === 'object' && nested && 'title' in nested) {
        // @ts-ignore
        const maybe = nested.title;
        if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
      }
    } catch (_) {}

    // Capitalize first letter for display
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

  const resolveDescription = (key: string, fallback?: string) => {
    if (!key) return fallback ?? '';
    
    const isLikelyRaw = (val: any) => {
      if (typeof val !== 'string') return false;
      const v = val.trim();
      return v === key || v === `${key}.description` || v === `${key}.title`;
    };

    const direct = t(key);
    if (typeof direct === 'object' && direct && 'description' in direct) {
      // @ts-ignore
      const maybe = direct.description;
      if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
    }

    try {
      const nested = t(`${key}.description`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
    } catch (_) {}

    return fallback ?? '';
  };

  const { isMobile } = useLayoutModeContext();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (currentPath === path) return true;
    if (currentPath.startsWith(path + '/')) {
      const moreSpecific = configuredItems.find(item => 
        item.url !== path && 
        item.active && 
        currentPath === item.url
      );
      return !moreSpecific;
    }
    return false;
  };

  const isDropdownActive = (dropdown: Array<{ url: string }>) => {
    return dropdown.some(item => isActive(item.url));
  };
  
  const { layoutMode } = useLayoutModeContext();

  // Get workspace and system items from configured items
  const workspaceItems = configuredItems
    .filter(i => i.group === 'workspace' && i.active)
    .map(i => {
      const iconName = i.icon as IconName | undefined;
      let IconComp = iconName && (ICON_REGISTRY as any)[iconName] ? (ICON_REGISTRY as any)[iconName] : Home;
      return { 
        ...i,
        icon: IconComp,
        dropdown: i.dropdown || undefined
      };
    });

  const crmItems = configuredItems
    .filter(i => i.group === 'crm' && i.active)
    .map(i => {
      const iconName = i.icon as IconName | undefined;
      let IconComp = iconName && (ICON_REGISTRY as any)[iconName] ? (ICON_REGISTRY as any)[iconName] : TrendingUp;
      return { 
        ...i,
        icon: IconComp,
        dropdown: i.dropdown || undefined
      };
    });

  const serviceItems = configuredItems
    .filter(i => i.group === 'service' && i.active)
    .map(i => {
      const iconName = i.icon as IconName | undefined;
      let IconComp = iconName && (ICON_REGISTRY as any)[iconName] ? (ICON_REGISTRY as any)[iconName] : Wrench;
      return { 
        ...i,
        icon: IconComp,
        dropdown: i.dropdown || undefined
      };
    });

  const systemItems = configuredItems
    .filter(i => i.group === 'system' && i.active)
    .map(i => {
      const iconName = i.icon as IconName | undefined;
      let IconComp = iconName && (ICON_REGISTRY as any)[iconName] ? (ICON_REGISTRY as any)[iconName] : Settings;
      return { 
        ...i,
        icon: IconComp,
        dropdown: i.dropdown || undefined
      };
    });

  const toggleDropdown = (itemId: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderNavigationItem = (item: any) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const itemIsActive = hasDropdown ? isDropdownActive(item.dropdown) : isActive(item.url);

    if (hasDropdown) {
      return (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                itemIsActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              }`}
            >
              <div className={`p-1.5 rounded-xl flex-shrink-0 ${itemIsActive ? 'bg-primary/20' : 'bg-sidebar-accent/30'}`}>
                <item.icon className={`h-4 w-4 ${itemIsActive ? 'text-primary' : 'text-sidebar-foreground/80'}`} />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-semibold text-sm capitalize ${itemIsActive ? 'text-primary' : 'text-sidebar-foreground/80'}`}>
                  {resolveTitle(item.title)}
                </div>
                <div className={`text-xs ${itemIsActive ? 'text-primary/70' : 'text-sidebar-foreground/60'}`}>
                  {resolveDescription(item.title, item.description)}
                </div>
              </div>
              <Plus className={`h-4 w-4 ${itemIsActive ? 'text-primary' : 'text-sidebar-foreground/60'}`} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 bg-background border border-border/20 shadow-lg rounded-lg py-2 z-[100]">
            {item.dropdown.map((subItem: any) => (
              <DropdownMenuItem key={subItem.url} asChild className="p-0 focus:bg-transparent">
                <NavLink
                  to={subItem.url}
                  end={subItem.url === "/dashboard"}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm transition-colors ${isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`
                  }
                >
                  {subItem.title}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.url}
        end={item.url === "/dashboard"}
        onClick={() => setIsMobileSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            isActive
              ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
          }`
        }
      >
        <div className={`p-1.5 rounded-xl flex-shrink-0 ${isActive(item.url) ? 'bg-primary/20' : 'bg-sidebar-accent/30'}`}>
          <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/80'}`} />
        </div>
        <div className="flex-1 text-left">
          <div className={`font-semibold text-sm capitalize ${isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/80'}`}>
            {resolveTitle(item.title)}
          </div>
          <div className={`text-xs ${isActive(item.url) ? 'text-primary/70' : 'text-sidebar-foreground/60'}`}>
            {resolveDescription(item.title, item.description)}
          </div>
        </div>
      </NavLink>
    );
  };

  if (isMobile) {
    // Mobile view with sidebar opener for all pages
    return (
      <div className="bg-card border-b border-border shadow-sm">
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="h-full bg-gradient-to-b from-sidebar to-sidebar/95">
                  {/* Brand Header */}
                  <div 
                    className="px-4 py-6 border-b border-sidebar-border/50 relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${isDark ? techBackground : lightTechBackground})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute inset-0 bg-sidebar/60 dark:bg-sidebar/70" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {companyLogo ? (
                        <div className="w-32 h-16 flex items-center justify-center">
                          <img 
                            src={companyLogo} 
                            alt="Company Logo" 
                            className="max-w-full max-h-full object-contain drop-shadow-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-8 w-8 text-sidebar-foreground/70" />
                          <p className="text-sm text-sidebar-foreground/70 drop-shadow-sm font-medium">
                            Company Name
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="flex-1 px-4 py-2">
                    {/* Workspace Section */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50 px-2">
                          Workspace
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                          className="h-5 w-5 p-0"
                        >
                          {isWorkspaceOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </Button>
                      </div>
                      {isWorkspaceOpen && (
                        <div className="space-y-1">
                          {workspaceItems.map(renderNavigationItem)}
                        </div>
                      )}
                    </div>

                    {/* System Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50 px-2">
                          System
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsSystemOpen(!isSystemOpen)}
                          className="h-5 w-5 p-0"
                        >
                          {isSystemOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </Button>
                      </div>
                      {isSystemOpen && (
                        <div className="space-y-1">
                          {systemItems.map(renderNavigationItem)}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center justify-between flex-1">
              {/* Empty space for left side */}
              <div></div>
              
              {/* Support, Notifications and User Section - Moved to right */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-primary/10 relative"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl z-[100]">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No new notifications
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl p-2 z-[100]">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <GlobalSearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
        
        <QuickCreateModal 
          open={isQuickCreateModalOpen} 
          onOpenChange={setIsQuickCreateModalOpen} 
        />
      </div>
    );
  }

  // Desktop header navigation
  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 min-w-0">
          <nav className="flex items-center gap-0 overflow-x-auto">{/* Reduced gap from gap-1 to gap-0 */}
            {[...workspaceItems, ...crmItems, ...serviceItems, ...systemItems].map((item: any) => {
              const active = item.dropdown ? isDropdownActive(item.dropdown) : isActive(item.url);
              if (item.dropdown && item.dropdown.length > 0) {
                return (
                  <DropdownMenu key={item.title}>
                    <DropdownMenuTrigger asChild>
                      <div className={`relative flex items-center gap-2 px-4 py-3 cursor-pointer transition-all ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <span className="text-sm font-medium">{resolveTitle(item.title)}</span>
                        <ChevronDown className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48 py-2 bg-background border border-border">
                      {item.dropdown.map((sub: any, index: number) => (
                        <DropdownMenuItem key={sub.url} asChild>
                          <NavLink
                            to={sub.url}
                            end={sub.url === "/dashboard"}
                            className={({ isActive }) => 
                              `block px-4 py-2.5 text-sm font-medium transition-colors ${
                                isActive 
                                  ? 'text-primary' 
                                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                              }`
                            }
                          >
                            {sub.title}
                          </NavLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <div key={item.title} className={`relative transition-all ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <NavLink to={item.url} end={item.url === "/dashboard"} className="flex items-center px-4 py-3">
                    <span className="text-sm font-medium">{resolveTitle(item.title)}</span>
                  </NavLink>
                  {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}