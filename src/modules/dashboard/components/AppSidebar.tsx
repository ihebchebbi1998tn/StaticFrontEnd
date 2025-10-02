import { useEffect, useState } from "react";
import { 
  Users, 
  CheckSquare, 
  BarChart3,
  Home,
  Settings,
  Building,
  Package,
  Calendar,
  CalendarDays,
  Wrench,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Folder,
  Database,
  Plus,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import techBackground from "@/assets/tech-background.jpg";
import lightTechBackground from "/files-uploads/acbdf037-abea-46d8-b7e4-78b3c6dec4ca.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SidebarSettingsModal from './SidebarSettingsModal';
import { loadSidebarConfig, seedSidebarDefaultsIfEmpty, resetSidebarConfig } from '../services/sidebar.service';
import { useToast } from '@/hooks/use-toast';
import { ICON_REGISTRY, IconName } from './sidebarIcons';

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useTranslation();

  const resolveTitle = (key: string) => {
    if (!key) return key;
    
    // Handle specific titles with proper formatting
    if (key === 'service orders' || key === 'service-orders') return 'Services';
    if (key === 'sales' || key === 'sales-offers') return 'Sales';
    if (key === 'todo') return 'Todo';
    if (key === 'time-expenses') return 'Time & Expenses';
    
    // Simple translation lookup - return string or fallback to key
    const translation = t(key);
    if (typeof translation === 'string' && translation !== key) return translation;
    
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

    // Try direct object (namespace) first
    const direct = t(key);
    if (typeof direct === 'object' && direct && 'description' in direct) {
      // @ts-ignore
      const maybe = direct.description;
      if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
    }

    // Try key.description
    try {
      const nested = t(`${key}.description`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
    } catch (_) {}

    // Fall back to provided fallback or the literal description saved in defaults
    return fallback ?? '';
  };

  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { theme: _theme } = useTheme();
  const currentPath = location.pathname;

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const initialConfigured: import('../services/sidebar.service').SidebarItemConfig[] = loadSidebarConfig() ?? [];
  const [configuredItems, setConfiguredItems] = useState<import('../services/sidebar.service').SidebarItemConfig[]>(() => {
    // Initialize once: check if config exists, if not seed it
    const existing = loadSidebarConfig();
    if (!existing || existing.length === 0) {
      seedSidebarDefaultsIfEmpty();
      return loadSidebarConfig() ?? [];
    }
    return existing;
  });

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

  const isActive = (path: string) => {
    if (currentPath === path) return true;
    // For nested routes, only activate if current path starts with sidebar path followed by /
    // But exclude cases where there might be a more specific match available
    if (currentPath.startsWith(path + '/')) {
      // Check if there's a more specific match among configured items
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

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold shadow-sm" 
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  const getDropdownNavCls = (itemIsActive: boolean) =>
    itemIsActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-semibold shadow-sm" 
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  // per-group collapse state (persisted)
  const [workspaceOpen, setWorkspaceOpen] = useState(() => (localStorage.getItem('sidebar-group-workspace') ?? 'open') === 'open');
  const [systemOpen, setSystemOpen] = useState(() => (localStorage.getItem('sidebar-group-system') ?? 'open') === 'open');

  // dropdown states
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});

  const toggleWorkspace = () => {
    setWorkspaceOpen((v) => {
      const next = !v;
      localStorage.setItem('sidebar-group-workspace', next ? 'open' : 'closed');
      return next;
    });
  };

  const toggleSystem = () => {
    setSystemOpen((v) => {
      const next = !v;
      localStorage.setItem('sidebar-group-system', next ? 'open' : 'closed');
      return next;
    });
  };

  const toggleDropdown = (itemId: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderNavigationItem = (item: any) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;
    const isDropdownOpen = dropdownStates[item.id] || false;
    const itemIsActive = hasDropdown ? isDropdownActive(item.dropdown) : isActive(item.url);

    if (hasDropdown) {
      return (
        <Collapsible key={item.title} open={isDropdownOpen} onOpenChange={() => toggleDropdown(item.id)}>
          <SidebarMenuItem>
            <CollapsibleTrigger 
              className={`transition-all duration-300 hover:shadow-medium ${collapsed ? 'h-[2.4rem] mx-0.5 justify-center -ml-1' : 'h-[2.4rem] rounded-xl mb-1 gap-3 px-3 py-2.5'} w-full flex items-center ${itemIsActive ? 'bg-primary/10 text-primary border-r-2 border-primary font-semibold shadow-sm' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'}`}
            >
              {collapsed ? (
                <item.icon className={`h-[24px] w-[24px] transition-all duration-300 ${itemIsActive ? 'text-primary scale-110' : 'text-sidebar-foreground/80 hover:text-primary hover:scale-105'}`} />
              ) : (
                <>
                  <div className={`p-1.5 rounded-xl flex-shrink-0 ${itemIsActive ? 'bg-primary/20' : 'bg-sidebar-accent/30'}`}>
                    <item.icon className={`h-4 w-4 ${itemIsActive ? 'text-primary' : 'text-sidebar-foreground/80'}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                      <div className={`font-semibold text-sm capitalize truncate text-primary`}>
                        {resolveTitle(item.title)}
                      </div>
                      <div className={`text-xs truncate leading-tight ${itemIsActive ? 'text-primary/70' : 'text-sidebar-foreground/60'}`}>
                        {resolveDescription(item.title, item.description)}
                      </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-90' : ''} ${itemIsActive ? 'text-primary' : 'text-sidebar-foreground/60'}`} />
                </>
              )}
            </CollapsibleTrigger>
            {!collapsed && (
              <CollapsibleContent>
                <SidebarMenuSub className="ml-8 mt-1">
                  {item.dropdown.map((subItem: any) => (
                    <SidebarMenuSubItem key={subItem.url} className="mb-0.5">
                      <SidebarMenuSubButton asChild className={`h-7 px-0 py-1 transition-colors duration-200 ${isActive(subItem.url) ? 'text-primary font-medium' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground/80'}`}>
                        <NavLink to={subItem.url} end={subItem.url === "/dashboard"} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                          <span className="text-xs font-normal">{subItem.title}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className={`transition-all duration-300 hover:shadow-medium ${collapsed ? 'h-[2.4rem] mx-0.5 flex items-center justify-center' : 'h-[2.4rem] rounded-xl mb-1'}`}>
          <NavLink 
            to={item.url} 
            end={item.url === "/dashboard"}
            className={({ isActive }) => 
              `flex items-center ${isActive ? 'bg-primary/10 text-primary border-r-2 border-primary font-semibold shadow-sm' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'} ${collapsed ? 'justify-center w-full -ml-1' : 'gap-3 px-3 py-2.5'}`
            }
          >
            {collapsed ? (
              <item.icon className={`h-[24px] w-[24px] transition-all duration-300 ${isActive(item.url) ? 'text-primary scale-110' : 'text-sidebar-foreground/80 hover:text-primary hover:scale-105'}`} />
            ) : (
              <>
                <div className={`p-1.5 rounded-xl flex-shrink-0 ${isActive(item.url) ? 'bg-primary/20' : 'bg-sidebar-accent/30'}`}>
                  <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/80'}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-semibold text-sm capitalize truncate text-primary">
                    {resolveTitle(item.title)}
                  </div>
                  <div className="text-xs text-sidebar-foreground/60 truncate leading-tight">
                    {resolveDescription(item.title, item.description)}
                  </div>
                </div>
              </>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar data-[state=collapsed]:w-24" collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-sidebar to-sidebar/95 flex flex-col h-full overflow-y-auto sm:overflow-y-visible">
        {/* Brand Header */}
        <div className="relative flex-shrink-0 h-[72px] w-full">
          <div 
            className={`absolute inset-0 px-3 py-4 border-b border-sidebar-border/50 overflow-hidden ${collapsed ? 'flex justify-center' : ''}`}
            style={{
              backgroundImage: `url(${isDark ? techBackground : lightTechBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for transparency */}
            <div className="absolute inset-0 bg-sidebar/60 dark:bg-sidebar/70" />
            
            <div className="relative z-10 flex items-center justify-center h-full w-full">
              <img 
                src="/lovable-uploads/c403237c-2c76-4f0c-8c9f-882975ce290f.png" 
                alt="Logo" 
                className="h-12 dark:block hidden"
              />
              <img 
                src="/lovable-uploads/54cf69f6-1a17-4c11-bf6f-0fef42eb25bb.png" 
                alt="Logo" 
                className="h-12 dark:hidden block"
              />
            </div>
          </div>
        </div>

        {/* Main Navigation - Collapsible Groups */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-4">
          {/* Workspace Section */}
          <Collapsible open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
            {!collapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-lg hover:bg-sidebar-accent/30 text-sidebar-foreground/70 transition-colors group">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Workspace</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${workspaceOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
            )}
            
            <CollapsibleContent>
              <SidebarMenu className="-space-y-0.5">
                {workspaceItems.map(renderNavigationItem)}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>

          {/* System Section */}
          <Collapsible open={systemOpen} onOpenChange={setSystemOpen} className="mt-6">
            {!collapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-lg hover:bg-sidebar-accent/30 text-sidebar-foreground/70 transition-colors group">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">System</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${systemOpen ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
            )}
            
            <CollapsibleContent>
              <SidebarMenu className="-space-y-0.5">
                {systemItems.map(renderNavigationItem)}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* User Section - Bottom */}
        {!collapsed && (
          <div className="flex-shrink-0 border-t border-sidebar-border/50 px-3 py-3">
            <button 
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-300 group"
              onClick={() => navigate('/dashboard/settings')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-soft">
                <span className="text-primary text-sm font-bold">SA</span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary transition-colors">Super Admin</div>
                <div className="text-xs text-sidebar-foreground/60">System Administrator</div>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/40 group-hover:text-primary/60 transition-colors" />
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}